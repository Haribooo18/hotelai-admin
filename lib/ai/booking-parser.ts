/**
 * Booking turn parser for the AI Receptionist (n8n HotelAI workflow).
 *
 * IMPORTANT — source-of-truth relationship with n8n:
 * This module is the canonical, tested version of the logic that lives
 * inside the n8n workflow's "Parse AI JSON" Code node. n8n Code nodes run
 * in their own sandbox and cannot import from this repository, so the n8n
 * node contains a synced copy of this same logic (minus types, wrapped for
 * n8n's `$input` / array-return convention).
 *
 * If you change the booking/date/guard logic here, you MUST copy the
 * equivalent change into the n8n workflow's "Parse AI JSON" node, and vice
 * versa. `tests/unit/ai/booking-parser.test.ts` covers the logic itself;
 * it does not (and cannot) verify the n8n copy stayed in sync — that is a
 * manual step until the two are unified behind a single HTTP endpoint.
 */

export type BookingDraft = {
  guest_name: string;
  phone: string;
  email: string;
  room_type: string;
  guests: number;
  comment: string;
  check_in: string;
  check_out: string;
};

export type SavedBookingSession = Partial<BookingDraft> & {
  current_step?: string;
};

export type RawAssistantOutput = {
  reply?: string;
  should_create_lead?: boolean;
  current_step?: string;
  lead?: Partial<BookingDraft>;
} | string | null | undefined;

export type ParsedBookingTurn = {
  reply: string;
  should_create_lead: boolean;
  current_step: string;
  lead: BookingDraft;
};

export type ParseBookingTurnInput = {
  /** Raw output from the LLM agent — either an object or a JSON string (possibly wrapped in prose). */
  rawOutput: RawAssistantOutput;
  /** Previously persisted booking_sessions row for this guest session (empty object if none yet). */
  saved: SavedBookingSession;
  /** The guest's latest message, verbatim. */
  userMessage: string;
  /** Injectable clock, defaults to `new Date()`. Exists so tests can pin "today". */
  now?: Date;
};

function cleanString(value: unknown): string {
  if (value === null || value === undefined) return "";
  const v = String(value).trim();
  if (!v || ["null", "[null]", "undefined", "empty"].includes(v.toLowerCase())) return "";
  return v;
}

function cleanNumber(value: unknown): number {
  const v = cleanString(value);
  if (!v) return 0;
  const parsed = parseInt(v.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizePhone(value: unknown): string {
  const v = cleanString(value);
  if (!v) return "";
  const digits = v.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "";
  return v.trim().startsWith("+") ? `+${digits}` : digits;
}

function validEmail(value: unknown): string {
  const v = cleanString(value);
  if (!v) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : "";
}

function validDate(value: unknown): string {
  const v = cleanString(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

function normalizeRoomType(value: unknown): string {
  const v = cleanString(value);
  if (!v) return "";
  const x = v.toLowerCase();
  if (/(family|семейн|семейный|для семьи)/i.test(x)) return "Family";
  if (/(standard|стандарт|стандартный)/i.test(x)) return "Standard";
  if (/(deluxe|делюкс)/i.test(x)) return "Deluxe";
  if (/(suite|люкс)/i.test(x)) return "Suite";
  return v;
}

function toIsoDate(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const monthMap: Record<string, number> = {
  января: 1, январь: 1,
  февраля: 2, февраль: 2,
  марта: 3, март: 3,
  апреля: 4, апрель: 4,
  мая: 5, май: 5,
  июня: 6, июнь: 6,
  июля: 7, июль: 7,
  августа: 8, август: 8,
  сентября: 9, сентябрь: 9,
  октября: 10, октябрь: 10,
  ноября: 11, ноябрь: 11,
  декабря: 12, декабрь: 12,
};
const monthWords = Object.keys(monthMap).join("|");

function splitCommentLines(value: unknown): string[] {
  const v = cleanString(value);
  if (!v) return [];
  return v.split(/\n+|;+/).map((s) => s.trim()).filter(Boolean);
}

function appendUniqueComment(base: unknown, extra: unknown): string {
  const lines = splitCommentLines(base);
  const incoming = splitCommentLines(extra);
  const seen = new Set(lines.map((s) => s.toLowerCase()));
  for (const line of incoming) {
    const key = line.toLowerCase();
    if (!seen.has(key)) {
      lines.push(line);
      seen.add(key);
    }
  }
  return lines.join("\n");
}

function mergeComments(savedValue: unknown, aiValue: unknown): string {
  return appendUniqueComment(savedValue, aiValue);
}

function extractPreference(text: unknown): string {
  const original = cleanString(text);
  const raw = original.toLowerCase();
  if (!raw) return "";
  const prefs: string[] = [];
  const add = (label: string) => {
    if (!prefs.includes(label)) prefs.push(label);
  };

  if (/(поздн\w*\s+заезд|late\s+check.?in|заед\w*\s+поздно|приед\w*\s+поздно)/i.test(raw)) add("Поздний заезд.");
  if (/(ранн\w*\s+заезд|early\s+check.?in|заед\w*\s+рано|приед\w*\s+рано)/i.test(raw)) add("Ранний заезд.");
  if (/(высок\w*\s+этаж|верхн\w*\s+этаж|high\s+floor)/i.test(raw)) add("Высокий этаж.");
  if (/(тих\w*\s+номер|тихое\s+место|не\s+шумн|quiet\s+room)/i.test(raw)) add("Тихий номер.");
  if (/(детск\w*\s+кроват|кроватк\w*\s+для\s+реб|baby\s+crib|cot\b)/i.test(raw)) add("Нужна детская кроватка.");
  if (/(трансфер|transfer|встретить\s+в\s+аэропорт|аэропорт)/i.test(raw)) add("Нужен трансфер.");
  if (/(аллерг|allerg)/i.test(raw)) add(`Аллергия/особые условия: ${original}.`);
  if (/(две\s+отдельн\w*\s+кроват|раздельн\w*\s+кроват|twin\s+beds|separate\s+beds)/i.test(raw)) add("Нужны две отдельные кровати.");
  if (/(дополнительн\w*\s+подуш|extra\s+pillow)/i.test(raw)) add("Нужна дополнительная подушка.");
  if (/(день\s+рожд|birthday)/i.test(raw)) add("Особый повод: день рождения.");
  if (/(годовщин|юбиле|anniversary)/i.test(raw)) add("Особый повод: годовщина/юбилей.");
  if (/(вид\s+на\s+море|sea\s+view)/i.test(raw)) add("Желателен вид на море.");
  if (/(с\s+собак|с\s+кот|с\s+кошк|с\s+животн|с\s+питомц|pet\b|dog\b|cat\b)/i.test(raw) && !/(можно|разреш|есть\s+ли|можно\s+ли)/i.test(raw))
    add("Гость будет с питомцем.");
  if (/(парковочн\w*\s+мест|нужн\w*\s+парков|нужна\s+стоянк|parking\s+spot)/i.test(raw)) add("Нужно парковочное место.");

  return prefs.join("\n");
}

function extractGuests(text: unknown): number {
  const raw = cleanString(text).toLowerCase();
  if (!raw) return 0;
  const m = raw.match(/(?:^|[^0-9])(\d{1,2})\s*(?:гост|человек|чел|персон|взросл|реб[её]н|мест)/i);
  if (m) {
    const n = Number(m[1]);
    return n > 0 && n <= 30 ? n : 0;
  }
  if (/^\d{1,2}$/.test(raw)) {
    const n = Number(raw);
    return n > 0 && n <= 30 ? n : 0;
  }
  return 0;
}

function nextMissingStep(lead: BookingDraft): string {
  if (!lead.room_type) return "room_type";
  if (!lead.check_in) return "check_in";
  if (!lead.check_out) return "check_out";
  if (!lead.guests) return "guests";
  if (!lead.guest_name) return "guest_name";
  if (!lead.phone && !lead.email) return "contact";
  return "confirm";
}

function replyForStep(step: string): string {
  const replies: Record<string, string> = {
    room_type: "Какой тип номера вас интересует?",
    check_in: "Какую дату заезда вы планируете?",
    check_out: "Какую дату выезда вы планируете?",
    guests: "Сколько гостей будет?",
    guest_name: "На какое имя оформить заявку?",
    contact: "Оставьте, пожалуйста, телефон или email для связи.",
    confirm: "Отлично 😊 Подтвердить заявку?",
  };
  return replies[step] || "Не совсем понял. Можете уточнить?";
}

function isBookingIntent(text: unknown): boolean {
  const raw = cleanString(text).toLowerCase();
  if (!raw) return false;
  return /(заброни|брон|booking|reservation|book a room|хочу номер|нужен номер|снять номер|заселиться|поселиться|номер на|room for)/i.test(raw);
}

function parseRaw(value: RawAssistantOutput): { reply?: string; should_create_lead?: boolean; current_step?: string; lead?: Partial<BookingDraft> } {
  if (value && typeof value === "object") return value;
  const text = cleanString(value);
  if (!text) return { reply: "Не совсем понял. Можете уточнить?", should_create_lead: false, current_step: "", lead: {} };
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        /* fall through */
      }
    }
  }
  return { reply: text, should_create_lead: false, current_step: "", lead: {} };
}

/**
 * Parses one turn of the AI Receptionist booking conversation: merges the
 * LLM's raw JSON guess with the previously saved session state and the
 * guest's latest message, applying deterministic guards (cancel, pause,
 * decline, polite close, done-session lock) and date sanity checks that do
 * not rely on the LLM getting the year right on its own.
 */
export function parseBookingTurn(input: ParseBookingTurnInput): ParsedBookingTurn {
  const { rawOutput, saved, userMessage: userMessageRaw } = input;
  const now = input.now ?? new Date();
  const CURRENT_YEAR = now.getUTCFullYear();
  const CURRENT_MONTH = now.getUTCMonth() + 1;
  const CURRENT_DAY = now.getUTCDate();

  function resolveYear(month: number, day: number): number {
    if (month < CURRENT_MONTH || (month === CURRENT_MONTH && day < CURRENT_DAY)) {
      return CURRENT_YEAR + 1;
    }
    return CURRENT_YEAR;
  }

  function bumpPastDateToFuture(dateStr: string): string {
    if (!validDate(dateStr)) return dateStr;
    const [y, m, d] = dateStr.split("-").map(Number);
    const todayStr = toIsoDate(CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY);
    if (dateStr >= todayStr) return dateStr;
    let year = y;
    let bumped = dateStr;
    while (bumped < todayStr && year < y + 5) {
      year += 1;
      bumped = toIsoDate(year, m, d);
    }
    return bumped;
  }

  function parseDateFromMessage(text: unknown): string {
    const raw = cleanString(text).toLowerCase();
    if (!raw) return "";

    let m = raw.match(/(20\d{2})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;

    m = raw.match(new RegExp(`(^|[^0-9а-яёa-z])(\\d{1,2})\\s+(${monthWords})([^а-яёa-z]|$)`, "i"));
    if (m) {
      const day = Number(m[2]);
      const month = monthMap[m[3].toLowerCase()];
      if (day >= 1 && day <= 31 && month) return toIsoDate(resolveYear(month, day), month, day);
    }

    m = raw.match(/(^|[^0-9])(\d{1,2})[.\/](\d{1,2})(?:[.\/](20\d{2}))?([^0-9]|$)/);
    if (m) {
      const day = Number(m[2]);
      const month = Number(m[3]);
      const year = m[4] ? Number(m[4]) : resolveYear(month, day);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) return toIsoDate(year, month, day);
    }

    return "";
  }

  function extractRangeDates(text: unknown): { check_in: string; check_out: string } {
    const raw = cleanString(text).toLowerCase();
    if (!raw) return { check_in: "", check_out: "" };

    let m = raw.match(new RegExp(`(?:^|[^0-9а-яёa-z])(?:с\\s*)?(\\d{1,2})\\s*(?:по|-|—)\\s*(\\d{1,2})\\s+(${monthWords})(?:[^а-яёa-z]|$)`, "i"));
    if (m) {
      return {
        check_in: parseDateFromMessage(`${m[1]} ${m[3]}`),
        check_out: parseDateFromMessage(`${m[2]} ${m[3]}`),
      };
    }

    m = raw.match(/(?:^|[^0-9])(?:с\s*)?(\d{1,2})[.\/](\d{1,2})(?:[.\/](20\d{2}))?\s*(?:по|-|—)\s*(\d{1,2})[.\/](\d{1,2})(?:[.\/](20\d{2}))?(?:[^0-9]|$)/i);
    if (m) {
      const inDay = Number(m[1]);
      const inMonth = Number(m[2]);
      const outDay = Number(m[4]);
      const outMonth = Number(m[5]);
      const y1 = m[3] ? Number(m[3]) : resolveYear(inMonth, inDay);
      const y2 = m[6] ? Number(m[6]) : outMonth < inMonth ? y1 + 1 : y1;
      return {
        check_in: toIsoDate(y1, inMonth, inDay),
        check_out: toIsoDate(y2, outMonth, outDay),
      };
    }

    return { check_in: "", check_out: "" };
  }

  function isLikelyNameReal(text: unknown): boolean {
    const v = cleanString(text);
    if (!v) return false;
    if (v.length < 2 || v.length > 60) return false;
    if (validEmail(v) || normalizePhone(v) || parseDateFromMessage(v) || normalizeRoomType(v) !== v) return false;
    if (/^\d+$/.test(v)) return false;
    if (/^(да|нет|ок|окей|отмена|cancel|yes|no|confirm)$/i.test(v)) return false;
    return /^[\p{L}\s'’-]+$/u.test(v);
  }

  function pick(aiValue: unknown, savedValue: unknown, cleaner: (v: unknown) => string): string {
    const rawAi = cleanString(aiValue);
    if (rawAi) {
      const a = cleaner(aiValue);
      if (a) return a;
    }
    return cleaner(savedValue);
  }

  const data = parseRaw(rawOutput);
  const leadIn = data.lead || {};
  const userMessage = cleanString(userMessageRaw);
  const msg = userMessage.toLowerCase();
  const isCancel = /^(отмена|отменить|начать сначала|сбросить|cancel|reset)$/i.test(msg);
  const isConfirm = /^(да|ок|окей|подтверждаю|хорошо|yes|confirm)$/i.test(msg);
  const isDeclineConfirm = /^(нет|не подтверждаю|no|not yet)$/i.test(msg);
  const isBookingAbort = /(передумал|передумала|передумали|не надо|не нужно|не хочу|больше не нужно|не актуально|отбой|отменить брон|отмена брони|нет спасибо|no thanks|cancel booking)/i.test(msg);
  const isSoftPause = /(позже|не сейчас|я подумаю|подумаю|вернусь позже|давайте позже)/i.test(msg);
  const isPoliteClose = /^(спасибо|благодарю|спс|спасибо большое|ок спасибо|понял спасибо|поняла спасибо|пока|до свидания|хорошего дня)$/i.test(msg);
  const isCorrection = /(нет|не |поменя|измени|лучше|будет|давай|хочу другой|другой|вместо)/i.test(msg);
  const savedStep = cleanString(saved.current_step);

  const preferenceNote = extractPreference(userMessage);

  const lead: BookingDraft = isCancel
    ? { guest_name: "", phone: "", email: "", room_type: "", guests: 0, comment: "", check_in: "", check_out: "" }
    : {
        guest_name: pick(leadIn.guest_name, saved.guest_name, cleanString),
        phone: pick(leadIn.phone, saved.phone, normalizePhone),
        email: pick(leadIn.email, saved.email, validEmail),
        room_type: pick(leadIn.room_type, saved.room_type, normalizeRoomType),
        guests: Number(pick(leadIn.guests, saved.guests, (v) => String(cleanNumber(v)))),
        comment: mergeComments(saved.comment, leadIn.comment),
        check_in: pick(leadIn.check_in, saved.check_in, validDate),
        check_out: pick(leadIn.check_out, saved.check_out, validDate),
      };

  if (
    preferenceNote &&
    (savedStep || lead.room_type || lead.check_in || lead.check_out || lead.guests || lead.guest_name || lead.phone || lead.email ||
      /(заброни|брон|booking|reservation|book a room|хочу номер|нужен номер|снять номер|заселиться|поселиться|номер на|room for)/i.test(msg))
  ) {
    lead.comment = appendUniqueComment(lead.comment, preferenceNote);
  }

  if (String(saved.current_step || "").toLowerCase() === "done" && !/^(начать сначала|сбросить|отмена|отменить|cancel|reset)$/i.test(msg)) {
    return {
      reply: 'Заявка уже создана. Если нужно изменить даты, номер или контакт — напишите "начать сначала", и я оформлю новую заявку. Также администратор может внести изменения вручную.',
      should_create_lead: false,
      current_step: "done",
      lead,
    };
  }

  if (savedStep && savedStep !== "done" && isBookingAbort) {
    return {
      reply: "Хорошо, заявку не создаю. Если захотите вернуться к бронированию — просто напишите.",
      should_create_lead: false,
      current_step: "done",
      lead,
    };
  }

  if (savedStep && savedStep !== "done" && isSoftPause) {
    return {
      reply: "Хорошо. Если решите продолжить бронирование — просто напишите мне.",
      should_create_lead: false,
      current_step: savedStep,
      lead,
    };
  }

  if (savedStep && savedStep !== "done" && isPoliteClose) {
    return {
      reply: "Пожалуйста! Если понадобится помощь с бронированием — обращайтесь.",
      should_create_lead: false,
      current_step: "done",
      lead,
    };
  }

  if (String(saved.current_step || "").toLowerCase() === "confirm" && isDeclineConfirm) {
    return {
      reply: "Хорошо. Что хотите изменить: даты, тип номера, количество гостей или контакт?",
      should_create_lead: false,
      current_step: "confirm",
      lead,
    };
  }

  if (!isCancel && userMessage) {
    const range = extractRangeDates(userMessage);
    const msgRoom = normalizeRoomType(userMessage);
    const msgDate = parseDateFromMessage(userMessage);
    const msgGuests = extractGuests(userMessage);
    const msgPhone = normalizePhone(userMessage);
    const msgEmail = validEmail(userMessage);

    if (
      msgRoom &&
      msgRoom !== userMessage &&
      (!lead.room_type || isCorrection || /номер|room|семейн|стандарт|делюкс|люкс|family|standard|deluxe|suite/i.test(msg))
    ) {
      if (lead.room_type !== msgRoom) {
        lead.room_type = msgRoom;
      }
    }

    if (range.check_in && range.check_out) {
      lead.check_in = range.check_in;
      lead.check_out = range.check_out;
    } else if (msgDate) {
      if (/заезд|check.?in|с\s/i.test(msg)) {
        lead.check_in = msgDate;
      } else if (/выезд|check.?out|по\s/i.test(msg)) {
        lead.check_out = msgDate;
      } else if (!lead.check_in) {
        lead.check_in = msgDate;
      } else if (!lead.check_out) {
        lead.check_out = msgDate;
      } else if (savedStep === "check_in") {
        lead.check_in = msgDate;
      } else if (savedStep === "check_out" || isCorrection) {
        lead.check_out = msgDate;
      }
    }

    if (msgGuests > 0 && (savedStep === "guests" || !lead.guests || isCorrection || /гост|человек|чел|персон/i.test(msg))) {
      lead.guests = msgGuests;
    }

    if (msgPhone) lead.phone = msgPhone;
    if (msgEmail) lead.email = msgEmail;

    if (!lead.guest_name && lead.room_type && lead.check_in && lead.check_out && lead.guests > 0 && isLikelyNameReal(userMessage)) {
      lead.guest_name = userMessage;
    }
  }

  const hasBookingData = Boolean(lead.room_type || lead.check_in || lead.check_out || lead.guests || lead.guest_name || lead.phone || lead.email);
  const safeAiReply = cleanString(data.reply) || cleanString(typeof rawOutput === "string" ? rawOutput : "") || "Не совсем понял. Можете уточнить?";
  const bookingActive = Boolean(isCancel || isConfirm || savedStep || hasBookingData || isBookingIntent(userMessage));

  if (!bookingActive && isPoliteClose) {
    return {
      reply: "Пожалуйста! Если понадобится помощь с бронированием — обращайтесь.",
      should_create_lead: false,
      current_step: "",
      lead,
    };
  }

  if (!bookingActive) {
    const aiStartedBookingByMistake = /какой\s+тип\s+номера|тип\s+номера\s+вас\s+интересует|какую\s+дату\s+заезда/i.test(safeAiReply);
    const fallbackReply = aiStartedBookingByMistake
      ? "Я могу помочь с бронированием и вопросами по отелю. По этому вопросу у меня нет точной информации."
      : safeAiReply;
    return {
      reply: fallbackReply,
      should_create_lead: false,
      current_step: "",
      lead,
    };
  }

  // Final safety net: no matter which code path set these dates (the LLM's
  // own JSON guess, a saved value, or the regex parser), never let a
  // booking date sit in the past — that's always an unresolved/omitted
  // year, never a guest's real intent. This MUST run before the
  // check_out-after-check_in guard below, otherwise two dates that the LLM
  // guessed with inconsistent years (e.g. check_in already past this year,
  // check_out still upcoming this year) can silently end up inverted after
  // independent bumping instead of being caught and re-asked.
  if (lead.check_in) lead.check_in = bumpPastDateToFuture(lead.check_in);
  if (lead.check_out) lead.check_out = bumpPastDateToFuture(lead.check_out);

  let current_step = nextMissingStep(lead);
  let reply = replyForStep(current_step);
  let should_create_lead = data.should_create_lead === true;

  if (isCancel) {
    current_step = "room_type";
    should_create_lead = false;
    reply = "Хорошо, начнём заново. Какой тип номера вас интересует?";
  } else {
    // Tracks whether a specific, explanatory reply was already set above
    // (e.g. "checkout must be after checkin") so the generic step-prompt
    // recompute further down doesn't silently discard it — a real bug
    // found by tests: the guest used to get asked the plain "which
    // check-out date?" question again with zero indication of *why*,
    // which could loop them on the same mistake indefinitely.
    let specificReplyAlreadySet = false;

    if (lead.check_in && lead.check_out && lead.check_out <= lead.check_in) {
      lead.check_out = "";
      current_step = "check_out";
      should_create_lead = false;
      reply = "Дата выезда должна быть позже даты заезда. Укажите, пожалуйста, дату выезда.";
      specificReplyAlreadySet = true;
    }

    const complete = Boolean(lead.room_type && lead.check_in && lead.check_out && lead.guests > 0 && lead.guest_name && (lead.phone || lead.email));

    if (isConfirm && complete && (savedStep === "confirm" || data.current_step === "confirm" || nextMissingStep(lead) === "confirm")) {
      should_create_lead = true;
      current_step = "done";
      reply = "Готово 😊 Заявка создана. Администратор свяжется с вами для подтверждения.";
      specificReplyAlreadySet = true;
    }

    if (should_create_lead && !complete) should_create_lead = false;

    if (!should_create_lead && current_step !== "done") {
      current_step = nextMissingStep(lead);
      if (!specificReplyAlreadySet) {
        reply = replyForStep(current_step);
      }
    }
  }

  if (current_step) {
    reply = reply
      .replace(/^Здравствуйте!?\s*😊?\s*/i, "")
      .replace(/^Добрый день!?\s*😊?\s*/i, "")
      .replace(/^Добрый вечер!?\s*😊?\s*/i, "")
      .trim();
  }

  if (!reply) reply = "Не совсем понял. Можете уточнить?";

  return { reply, should_create_lead, current_step, lead };
}
