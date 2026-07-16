"use client";

import { CheckCircle2, Clock3, Link2 } from "lucide-react";

import { useMarketingLead } from "@/components/marketing/hooks/useMarketingLead";
import {
  mktCenteredFormBodyClass,
  mktCenteredFormClass,
  mktCenteredFormHeaderClass,
  mktCenteredFormSectionClass,
  mktFormTrustItemClass,
  mktFormTrustListClass,
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  CONTACT_PAGE_FORM,
  CONTACT_ROOM_OPTIONS,
} from "@/lib/marketing/contact-page";
import { cn } from "@/lib/utils";

const trustItems = [
  { icon: Clock3, label: "Response in 1–2 business days" },
  { icon: CheckCircle2, label: "No obligation" },
  { icon: Link2, label: "Works with your current PMS" },
] as const;

export function ContactSalesFormSection() {
  const { submit, error, isSubmitting, isSuccess } =
    useMarketingLead("contact");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit(event.currentTarget);
  }

  return (
    <section
      id={CONTACT_PAGE_FORM.sectionId}
      className={mktCenteredFormSectionClass}
      aria-labelledby="contact-form-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktCenteredFormHeaderClass}>
          <p className={mktOverlineClass}>{CONTACT_PAGE_FORM.overline}</p>

          <h2
            id="contact-form-heading"
            className={mktSectionHeadlineClass}
          >
            {CONTACT_PAGE_FORM.headline}
          </h2>

          <p
            className={mktSectionSubheadClass}
          >
            {CONTACT_PAGE_FORM.subhead}
          </p>
        </header>

        <div
          className={cn(mktSectionBodyClass, mktCenteredFormBodyClass)}
        >
          {isSuccess ? (
            <div
              className="mkt-contact-form-success text-center"
              role="status"
              aria-live="polite"
            >
              <p className="mkt-contact-form-success-title">
                {CONTACT_PAGE_FORM.successTitle}
              </p>
              <p className="mkt-contact-form-success-message">
                {CONTACT_PAGE_FORM.successMessage}
              </p>
            </div>
          ) : (
            <form
              className={cn("mkt-contact-form", mktCenteredFormClass)}
              onSubmit={handleSubmit}
            >
              <div aria-hidden="true" className="hidden">
                <label htmlFor="contact-sales-website">Website</label>
                <input
                  id="contact-sales-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="mkt-contact-form-grid">
                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.name.id}>
                    Name
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.name.id}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.hotel.id}>
                    Hotel
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.hotel.id}
                    name="hotel"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Hotel name"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.email.id}>
                    Email
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.email.id}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@hotel.com"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.rooms.id}>
                    Number of rooms
                  </label>
                  <select
                    id={CONTACT_PAGE_FORM.fields.rooms.id}
                    name="rooms"
                    defaultValue=""
                    className="mkt-contact-input appearance-none"
                  >
                    <option value="" disabled>
                      Select hotel size
                    </option>
                    {CONTACT_ROOM_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mkt-contact-field">
                <label htmlFor={CONTACT_PAGE_FORM.fields.message.id}>
                  What would you like to improve?
                </label>
                <textarea
                  id={CONTACT_PAGE_FORM.fields.message.id}
                  name="message"
                  required
                  rows={4}
                  placeholder="Guest communication, AI reception, PMS migration, revenue, or hotel operations."
                  className="mkt-contact-textarea min-h-[132px]"
                />
              </div>

              {error ? (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mkt-btn mkt-btn-primary mkt-btn-form mkt-btn-mobile-full"
              >
                {isSubmitting ? "Sending..." : CONTACT_PAGE_FORM.submitLabel}
              </button>

              <ul
                className={mktFormTrustListClass}
                style={{ "--mkt-form-trust-columns": 3 } as React.CSSProperties}
              >
                {trustItems.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className={mktFormTrustItemClass}
                  >
                    <Icon
                      strokeWidth={1.65}
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
