"use client";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_FORM } from "@/lib/marketing/demo-page";
import { useMarketingLead } from "@/components/marketing/hooks/useMarketingLead";

export function DemoBookingFormSection() {
  const { submit, error, isSubmitting, isSuccess } =
    useMarketingLead("demo");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit(event.currentTarget);
  }

  return (
    <section
      id={DEMO_PAGE_FORM.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="demo-booking-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{DEMO_PAGE_FORM.overline}</p>
          <h2 id="demo-booking-heading" className={mktSectionHeadlineClass}>
            {DEMO_PAGE_FORM.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{DEMO_PAGE_FORM.subhead}</p>
        </header>

        <div className={mktSectionBodyClass}>
          {isSuccess ? (
            <div
              className="mkt-contact-form-success"
              role="status"
              aria-live="polite"
            >
              <p className="mkt-contact-form-success-title">
                {DEMO_PAGE_FORM.successTitle}
              </p>
              <p className="mkt-contact-form-success-message">
                {DEMO_PAGE_FORM.successMessage}
              </p>
            </div>
          ) : (
            <form className="mkt-contact-form" onSubmit={handleSubmit}>
              <div aria-hidden="true" className="hidden">
                <label htmlFor="demo-website">Website</label>
                <input
                  id="demo-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="mkt-contact-form-grid">
                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.name.id}>
                    {DEMO_PAGE_FORM.fields.name.label}
                  </label>
                  <input
                    id={DEMO_PAGE_FORM.fields.name.id}
                    name="name"
                    type="text"
                    required={DEMO_PAGE_FORM.fields.name.required}
                    autoComplete="name"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.hotel.id}>
                    {DEMO_PAGE_FORM.fields.hotel.label}
                  </label>
                  <input
                    id={DEMO_PAGE_FORM.fields.hotel.id}
                    name="hotel"
                    type="text"
                    required={DEMO_PAGE_FORM.fields.hotel.required}
                    autoComplete="organization"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.email.id}>
                    {DEMO_PAGE_FORM.fields.email.label}
                  </label>
                  <input
                    id={DEMO_PAGE_FORM.fields.email.id}
                    name="email"
                    type="email"
                    required={DEMO_PAGE_FORM.fields.email.required}
                    autoComplete="email"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.country.id}>
                    {DEMO_PAGE_FORM.fields.country.label}
                  </label>
                  <input
                    id={DEMO_PAGE_FORM.fields.country.id}
                    name="country"
                    type="text"
                    required={DEMO_PAGE_FORM.fields.country.required}
                    autoComplete="country-name"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.rooms.id}>
                    {DEMO_PAGE_FORM.fields.rooms.label}
                  </label>
                  <input
                    id={DEMO_PAGE_FORM.fields.rooms.id}
                    name="rooms"
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.date.id}>
                    {DEMO_PAGE_FORM.fields.date.label}
                  </label>
                  <input
                    id={DEMO_PAGE_FORM.fields.date.id}
                    name="preferred-date"
                    type="text"
                    placeholder="DD.MM.YYYY"
                    inputMode="numeric"
                    className="mkt-contact-input"
                  />
                </div>
              </div>

              <div className="mkt-contact-field">
                <label htmlFor={DEMO_PAGE_FORM.fields.message.id}>
                  {DEMO_PAGE_FORM.fields.message.label}
                </label>
                <textarea
                  id={DEMO_PAGE_FORM.fields.message.id}
                  name="message"
                  rows={5}
                  className="mkt-contact-textarea"
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
                {isSubmitting ? "Sending..." : DEMO_PAGE_FORM.submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
