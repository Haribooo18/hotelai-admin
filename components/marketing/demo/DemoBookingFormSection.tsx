"use client";

import { CheckCircle2, Clock3 } from "lucide-react";

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
  DEMO_HOTEL_SIZE_OPTIONS,
  DEMO_PAGE_FORM,
} from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

const trustItems = [
  { icon: Clock3, label: "30–45 minute walkthrough" },
  { icon: CheckCircle2, label: "No obligation" },
] as const;

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
      className={mktCenteredFormSectionClass}
      aria-labelledby="demo-booking-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktCenteredFormHeaderClass}>
          <p className={mktOverlineClass}>{DEMO_PAGE_FORM.overline}</p>
          <h2
            id="demo-booking-heading"
            className={mktSectionHeadlineClass}
          >
            {DEMO_PAGE_FORM.headline}
          </h2>
          <p
            className={mktSectionSubheadClass}
          >
            {DEMO_PAGE_FORM.subhead}
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
                {DEMO_PAGE_FORM.successTitle}
              </p>
              <p className="mkt-contact-form-success-message">
                {DEMO_PAGE_FORM.successMessage}
              </p>
            </div>
          ) : (
            <form
              className={cn("mkt-contact-form", mktCenteredFormClass)}
              onSubmit={handleSubmit}
            >
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
                    required
                    autoComplete="name"
                    placeholder="Your name"
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
                    required
                    autoComplete="organization"
                    placeholder="Hotel name"
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
                    required
                    autoComplete="email"
                    placeholder="you@hotel.com"
                    className="mkt-contact-input"
                  />
                </div>

                <div className="mkt-contact-field">
                  <label htmlFor={DEMO_PAGE_FORM.fields.rooms.id}>
                    {DEMO_PAGE_FORM.fields.rooms.label}
                  </label>
                  <select
                    id={DEMO_PAGE_FORM.fields.rooms.id}
                    name="rooms"
                    defaultValue=""
                    className="mkt-contact-input appearance-none"
                  >
                    <option value="" disabled>
                      Select hotel size
                    </option>
                    {DEMO_HOTEL_SIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mkt-contact-field">
                <label htmlFor={DEMO_PAGE_FORM.fields.message.id}>
                  {DEMO_PAGE_FORM.fields.message.label}
                </label>
                <textarea
                  id={DEMO_PAGE_FORM.fields.message.id}
                  name="message"
                  rows={4}
                  placeholder="Tell us about your goals, current PMS, or anything you would like us to focus on during the demo."
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
                {isSubmitting ? "Sending..." : DEMO_PAGE_FORM.submitLabel}
              </button>

              <ul
                className={mktFormTrustListClass}
                style={{ "--mkt-form-trust-columns": 2 } as React.CSSProperties}
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
