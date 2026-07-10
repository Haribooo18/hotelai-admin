"use client";

import { useState } from "react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { CONTACT_PAGE_FORM } from "@/lib/marketing/contact-page";

export function ContactSalesFormSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id={CONTACT_PAGE_FORM.sectionId}
      className="mkt-features-section"
      aria-labelledby="contact-form-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{CONTACT_PAGE_FORM.overline}</p>
          <h2 id="contact-form-heading" className={mktSectionHeadlineClass}>
            {CONTACT_PAGE_FORM.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{CONTACT_PAGE_FORM.subhead}</p>
        </header>

        <div className={mktSectionBodyClass}>
          {submitted ? (
            <div
              className="mkt-contact-form-success"
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
            <form className="mkt-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="mkt-contact-form-grid">
                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.name.id}>
                    {CONTACT_PAGE_FORM.fields.name.label}
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.name.id}
                    name="name"
                    type="text"
                    required={CONTACT_PAGE_FORM.fields.name.required}
                    autoComplete="name"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.hotel.id}>
                    {CONTACT_PAGE_FORM.fields.hotel.label}
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.hotel.id}
                    name="hotel"
                    type="text"
                    required={CONTACT_PAGE_FORM.fields.hotel.required}
                    autoComplete="organization"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.email.id}>
                    {CONTACT_PAGE_FORM.fields.email.label}
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.email.id}
                    name="email"
                    type="email"
                    required={CONTACT_PAGE_FORM.fields.email.required}
                    autoComplete="email"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={CONTACT_PAGE_FORM.fields.rooms.id}>
                    {CONTACT_PAGE_FORM.fields.rooms.label}
                  </label>
                  <input
                    id={CONTACT_PAGE_FORM.fields.rooms.id}
                    name="rooms"
                    type="text"
                    inputMode="numeric"
                    className="mkt-contact-input"
                  />
                </div>
              </div>

              <div className="mkt-contact-field">
                <label htmlFor={CONTACT_PAGE_FORM.fields.message.id}>
                  {CONTACT_PAGE_FORM.fields.message.label}
                </label>
                <textarea
                  id={CONTACT_PAGE_FORM.fields.message.id}
                  name="message"
                  required={CONTACT_PAGE_FORM.fields.message.required}
                  rows={5}
                  className="mkt-contact-textarea"
                />
              </div>

              <button type="submit" className="mkt-btn mkt-btn-primary mkt-btn-form mkt-btn-mobile-full">
                {CONTACT_PAGE_FORM.submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
