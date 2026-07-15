import type { ReactNode } from "react";

import { MonavelHorizontal, MonavelLockup, MonavelMark, MonavelWordmark } from "@/components/brand";
import { BRAND_ASSETS } from "@/lib/brand";
import {
  BRAND_BOOK,
  BRAND_BOOK_APPLICATIONS,
  BRAND_BOOK_CHECKLIST,
  BRAND_BOOK_COLORS,
  BRAND_BOOK_COLOR_USAGE,
  BRAND_BOOK_COMPONENTS,
  BRAND_BOOK_DESIGN_PRINCIPLE,
  BRAND_BOOK_ICONOGRAPHY,
  BRAND_BOOK_ILLUSTRATION,
  BRAND_BOOK_LOGO,
  BRAND_BOOK_MOTION,
  BRAND_BOOK_NAV,
  BRAND_BOOK_PERSONALITY,
  BRAND_BOOK_PHILOSOPHY,
  BRAND_BOOK_PHOTOGRAPHY,
  BRAND_BOOK_PRINCIPLES,
  BRAND_BOOK_PRODUCT_LANGUAGE,
  BRAND_BOOK_SPACING,
  BRAND_BOOK_SPACING_NOTES,
  BRAND_BOOK_TYPE,
  BRAND_BOOK_TYPE_NOTES,
  BRAND_BOOK_VOICE,
} from "@/lib/marketing/brand-book";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mkt-brand-book-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="mkt-brand-book-h2">
        {title}
      </h2>
      <div className="mkt-brand-book-section-body">{children}</div>
    </section>
  );
}

function DualList({
  positiveTitle,
  positive,
  negativeTitle,
  negative,
}: {
  positiveTitle: string;
  positive: readonly string[];
  negativeTitle: string;
  negative: readonly string[];
}) {
  return (
    <div className="mkt-brand-book-dual">
      <div>
        <h3 className="mkt-brand-book-h3">{positiveTitle}</h3>
        <ul className="mkt-brand-book-list">
          {positive.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mkt-brand-book-h3">{negativeTitle}</h3>
        <ul className="mkt-brand-book-list mkt-brand-book-list--mute">
          {negative.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BrandBookPage() {
  return (
    <div className="mkt-brand-book" data-brand-book="v1">
      <div className="mkt-brand-book-shell">
        <aside className="mkt-brand-book-toc" aria-label="Brand Book contents">
          <p className="mkt-brand-book-toc-kicker">{BRAND_BOOK.status}</p>
          <p className="mkt-brand-book-toc-title">{BRAND_BOOK.title}</p>
          <nav>
            <ol className="mkt-brand-book-toc-list">
              {BRAND_BOOK_NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="mkt-brand-book-main">
          <header className="mkt-brand-book-hero">
            <p className="mkt-brand-book-kicker">Internal specification</p>
            <h1 className="mkt-brand-book-title">{BRAND_BOOK.title}</h1>
            <p className="mkt-brand-book-subtitle">{BRAND_BOOK.subtitle}</p>
            <p className="mkt-brand-book-lead">{BRAND_BOOK.description}</p>
            <p className="mkt-brand-book-meta">Version {BRAND_BOOK.version}</p>
          </header>

          <Section id="philosophy" title="1. Brand Philosophy">
            <div className="mkt-brand-book-stack">
              <div>
                <h3 className="mkt-brand-book-h3">
                  {BRAND_BOOK_PHILOSOPHY.mission.title}
                </h3>
                <p>{BRAND_BOOK_PHILOSOPHY.mission.body}</p>
              </div>
              <div>
                <h3 className="mkt-brand-book-h3">
                  {BRAND_BOOK_PHILOSOPHY.vision.title}
                </h3>
                <p>{BRAND_BOOK_PHILOSOPHY.vision.body}</p>
              </div>
              <div>
                <h3 className="mkt-brand-book-h3">
                  {BRAND_BOOK_PHILOSOPHY.positioning.title}
                </h3>
                <p className="mkt-brand-book-statement">
                  {BRAND_BOOK_PHILOSOPHY.positioning.body}
                </p>
              </div>
              <div>
                <h3 className="mkt-brand-book-h3">Monavel is not</h3>
                <ul className="mkt-brand-book-list mkt-brand-book-list--mute">
                  {BRAND_BOOK_PHILOSOPHY.notList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{BRAND_BOOK_PHILOSOPHY.clarification}</p>
              </div>
            </div>
          </Section>

          <Section id="personality" title="2. Brand Personality">
            <DualList
              positiveTitle="Monavel is"
              positive={BRAND_BOOK_PERSONALITY.is}
              negativeTitle="Never"
              negative={BRAND_BOOK_PERSONALITY.never}
            />
          </Section>

          <Section id="principles" title="3. Brand Principles">
            <div className="mkt-brand-book-principle-grid">
              {BRAND_BOOK_PRINCIPLES.map((principle) => (
                <div key={principle.id} className="mkt-brand-book-principle">
                  <h3 className="mkt-brand-book-h3">{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="logo" title="4. Logo">
            <p className="mkt-brand-book-note">
              Official SVG sources: <code>{BRAND_ASSETS.mark}</code>,{" "}
              <code>{BRAND_ASSETS.horizontal}</code>,{" "}
              <code>{BRAND_ASSETS.lockup}</code>, and{" "}
              <code>{BRAND_ASSETS.wordmark}</code>.
            </p>
            <div className="mkt-brand-book-logo-grid">
              {BRAND_BOOK_LOGO.assets.map((asset) => (
                <figure key={asset.id} className="mkt-brand-book-logo-card">
                  <div className="mkt-brand-book-logo-frame">
                    {asset.id === "monogram" || asset.id === "app-icon" ? (
                      <MonavelMark decorative className="mkt-logo-mark--brand-book" />
                    ) : asset.id === "wordmark" ? (
                      <MonavelWordmark
                        decorative
                        className="mkt-logo-wordmark--brand-book"
                      />
                    ) : asset.id === "horizontal-lockup" ? (
                      <MonavelHorizontal
                        decorative
                        className="mkt-logo-horizontal--brand-book"
                      />
                    ) : (
                      <MonavelLockup
                        decorative
                        className="mkt-logo-lockup--brand-book"
                      />
                    )}
                  </div>
                  <figcaption>
                    <strong>{asset.title}</strong>
                    <span>{asset.note}</span>
                    <code>{asset.path}</code>
                  </figcaption>
                </figure>
              ))}
            </div>
            <h3 className="mkt-brand-book-h3">Usage rules</h3>
            <ul className="mkt-brand-book-list">
              {BRAND_BOOK_LOGO.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <h3 className="mkt-brand-book-h3">Incorrect usage</h3>
            <ul className="mkt-brand-book-list mkt-brand-book-list--mute">
              {BRAND_BOOK_LOGO.incorrect.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section id="color-system" title="5. Color System">
            <div className="mkt-brand-book-swatch-grid">
              {BRAND_BOOK_COLORS.map((color) => (
                <figure key={color.id} className="mkt-brand-book-swatch">
                  <div
                    className="mkt-brand-book-swatch-preview"
                    style={{ background: `var(${color.cssVar})` }}
                    aria-hidden
                  />
                  <figcaption>
                    <strong>{color.name}</strong>
                    <code>{color.hex}</code>
                    <code>{color.cssVar}</code>
                    <span>{color.usage}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>

          <Section id="color-usage" title="6. Color Usage">
            <div className="mkt-brand-book-stack">
              {BRAND_BOOK_COLOR_USAGE.map((group) => (
                <div key={group.id} className="mkt-brand-book-usage-block">
                  <h3 className="mkt-brand-book-h3">{group.title}</h3>
                  {"note" in group && group.note ? (
                    <p className="mkt-brand-book-note">{group.note}</p>
                  ) : null}
                  <DualList
                    positiveTitle="Only"
                    positive={group.only}
                    negativeTitle="Never"
                    negative={group.never}
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section id="typography" title="7. Typography">
            <p>{BRAND_BOOK_TYPE_NOTES.hierarchy}</p>
            <div className="mkt-brand-book-type-list">
              {BRAND_BOOK_TYPE.map((specimen) => (
                <figure key={specimen.id} className="mkt-brand-book-type-row">
                  <div className="mkt-brand-book-type-meta">
                    <strong>{specimen.name}</strong>
                    <code>{specimen.token}</code>
                    <span>{specimen.role}</span>
                  </div>
                  <p
                    className={`mkt-brand-book-type-sample mkt-brand-book-type-sample--${specimen.id}`}
                  >
                    {specimen.sample}
                  </p>
                </figure>
              ))}
            </div>
            <div className="mkt-brand-book-stack">
              <p>
                <strong>Reading width.</strong> {BRAND_BOOK_TYPE_NOTES.readingWidth}
              </p>
              <p>
                <strong>Text rhythm.</strong> {BRAND_BOOK_TYPE_NOTES.rhythm}
              </p>
            </div>
          </Section>

          <Section id="spacing" title="8. Spacing">
            <div className="mkt-brand-book-space-list">
              {BRAND_BOOK_SPACING.map((space) => (
                <div key={space.token} className="mkt-brand-book-space-row">
                  <div
                    className="mkt-brand-book-space-bar"
                    style={{ width: space.rem }}
                    aria-hidden
                  />
                  <code>{space.token}</code>
                  <span>
                    {space.px}px · {space.rem}
                  </span>
                </div>
              ))}
            </div>
            <ul className="mkt-brand-book-list">
              <li>
                <strong>Section spacing.</strong> {BRAND_BOOK_SPACING_NOTES.section}
              </li>
              <li>
                <strong>Card padding.</strong> {BRAND_BOOK_SPACING_NOTES.card}
              </li>
              <li>
                <strong>Stack spacing.</strong> {BRAND_BOOK_SPACING_NOTES.stack}
              </li>
              <li>
                <strong>Gap system.</strong> {BRAND_BOOK_SPACING_NOTES.gap}
              </li>
            </ul>
          </Section>

          <Section id="components" title="9. Components">
            <div className="mkt-brand-book-principle-grid">
              {BRAND_BOOK_COMPONENTS.map((component) => (
                <div key={component.id} className="mkt-brand-book-principle">
                  <h3 className="mkt-brand-book-h3">{component.title}</h3>
                  <p>{component.body}</p>
                </div>
              ))}
            </div>
            <div className="mkt-brand-book-specimen-row" aria-label="Component specimens">
              <div className="mkt-brand-book-specimen-card">
                <span className="mkt-brand-book-specimen-label">Card</span>
                <p>Quiet container. Border before shadow.</p>
              </div>
              <div className="mkt-brand-book-specimen-actions">
                <span className="mkt-brand-book-btn mkt-brand-book-btn--primary">
                  Start free trial
                </span>
                <span className="mkt-brand-book-btn mkt-brand-book-btn--secondary">
                  Book a demo
                </span>
              </div>
              <div className="mkt-brand-book-specimen-status">
                <span>
                  <i className="mkt-brand-book-dot" /> Online
                </span>
                <span>
                  <i className="mkt-brand-book-dot" /> Synced
                </span>
                <span className="mkt-brand-book-badge">Confirmed</span>
              </div>
              <div className="mkt-brand-book-specimen-kpi">
                <span className="mkt-brand-book-kpi-label">Revenue</span>
                <span className="mkt-brand-book-kpi-value">$9.2k</span>
              </div>
              <div className="mkt-brand-book-chat">
                <div className="mkt-brand-book-chat-bubble mkt-brand-book-chat-bubble--guest">
                  Need an airport transfer?
                </div>
                <div className="mkt-brand-book-chat-bubble mkt-brand-book-chat-bubble--ai">
                  Transfer booked.
                </div>
              </div>
            </div>
          </Section>

          <Section id="motion" title="10. Motion">
            <p>{BRAND_BOOK_MOTION.range}</p>
            <p>
              Shared ease: <code>{BRAND_BOOK_MOTION.ease}</code>
            </p>
            <ul className="mkt-brand-book-list">
              {BRAND_BOOK_MOTION.durations.map((item) => (
                <li key={item.name}>
                  {item.name}: {item.ms}ms
                </li>
              ))}
            </ul>
            <DualList
              positiveTitle="Allowed"
              positive={BRAND_BOOK_MOTION.allowed}
              negativeTitle="Forbidden"
              negative={BRAND_BOOK_MOTION.forbidden}
            />
            <p>
              <strong>Reduced motion.</strong> {BRAND_BOOK_MOTION.reducedMotion}
            </p>
          </Section>

          <Section id="photography" title="11. Photography">
            <DualList
              positiveTitle="Preferred"
              positive={BRAND_BOOK_PHOTOGRAPHY.preferred}
              negativeTitle="Avoid"
              negative={BRAND_BOOK_PHOTOGRAPHY.avoid}
            />
          </Section>

          <Section id="illustration" title="12. Illustration">
            <DualList
              positiveTitle="Should feel"
              positive={BRAND_BOOK_ILLUSTRATION.feel}
              negativeTitle="Never"
              negative={BRAND_BOOK_ILLUSTRATION.never}
            />
          </Section>

          <Section id="iconography" title="13. Iconography">
            <ul className="mkt-brand-book-list">
              {BRAND_BOOK_ICONOGRAPHY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section id="voice" title="14. Voice & Tone">
            <p>{BRAND_BOOK_VOICE.rule}</p>
            <DualList
              positiveTitle="Good"
              positive={BRAND_BOOK_VOICE.good}
              negativeTitle="Bad"
              negative={BRAND_BOOK_VOICE.bad}
            />
          </Section>

          <Section id="product-language" title="15. Product Language">
            <p>{BRAND_BOOK_PRODUCT_LANGUAGE.rule}</p>
            <h3 className="mkt-brand-book-h3">Status</h3>
            <div className="mkt-brand-book-chip-row">
              {BRAND_BOOK_PRODUCT_LANGUAGE.statuses.map((status) => (
                <span key={status} className="mkt-brand-book-chip">
                  {status}
                </span>
              ))}
            </div>
            <h3 className="mkt-brand-book-h3">KPIs</h3>
            <div className="mkt-brand-book-chip-row">
              {BRAND_BOOK_PRODUCT_LANGUAGE.kpis.map((kpi) => (
                <span key={kpi} className="mkt-brand-book-chip">
                  {kpi}
                </span>
              ))}
            </div>
            <h3 className="mkt-brand-book-h3">CTAs</h3>
            <div className="mkt-brand-book-chip-row">
              {BRAND_BOOK_PRODUCT_LANGUAGE.ctas.map((cta) => (
                <span key={cta} className="mkt-brand-book-chip">
                  {cta}
                </span>
              ))}
            </div>
          </Section>

          <Section id="applications" title="16. Brand Applications">
            <ul className="mkt-brand-book-app-grid">
              {BRAND_BOOK_APPLICATIONS.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </Section>

          <Section id="design-principles" title="17. Design Principles">
            <blockquote className="mkt-brand-book-quote">
              <p>{BRAND_BOOK_DESIGN_PRINCIPLE.ask}</p>
              <p className="mkt-brand-book-quote-not">
                Not: {BRAND_BOOK_DESIGN_PRINCIPLE.not}
              </p>
              <p>{BRAND_BOOK_DESIGN_PRINCIPLE.answer}</p>
            </blockquote>
          </Section>

          <Section id="checklist" title="18. Release Checklist">
            <p>
              Every future feature should pass this checklist before shipping.
            </p>
            <ul className="mkt-brand-book-checklist">
              {BRAND_BOOK_CHECKLIST.map((item) => (
                <li key={item}>
                  <span aria-hidden>□</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </article>
      </div>
    </div>
  );
}
