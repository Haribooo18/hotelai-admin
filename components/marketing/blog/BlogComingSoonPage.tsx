"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BLOG_PAGE_CONTENT } from "@/lib/marketing/blog-page";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { cn } from "@/lib/utils";

export function BlogComingSoonPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mkt-blog-page">
      <div className="mkt-container-wide">
        <div className="mkt-blog-layout">
          <div className="mkt-blog-copy">
            <p className={mktOverlineClass}>{BLOG_PAGE_CONTENT.comingSoonLabel}</p>
            <h1 className={cn(mktSectionHeadlineClass, "mt-0")}>
              {BLOG_PAGE_CONTENT.title}
            </h1>
            <p className={mktSectionSubheadClass}>{BLOG_PAGE_CONTENT.subtitle}</p>

            {submitted ? (
              <p className="mkt-blog-success">
                Thank you — we will notify you when new articles are published.
              </p>
            ) : (
              <form className="mkt-blog-form" onSubmit={handleSubmit}>
                <label htmlFor="blog-email" className="mkt-blog-form-label">
                  {BLOG_PAGE_CONTENT.newsletterLabel}
                </label>
                <div className="mkt-blog-form-row">
                  <Input
                    id="blog-email"
                    name="email"
                    type="email"
                    required
                    placeholder={BLOG_PAGE_CONTENT.newsletterPlaceholder}
                    className="mkt-blog-input"
                  />
                  <Button type="submit" className="mkt-btn mkt-btn-primary mkt-btn-section">
                    {BLOG_PAGE_CONTENT.newsletterButton}
                  </Button>
                </div>
                <p className="mkt-blog-form-note">{BLOG_PAGE_CONTENT.newsletterNote}</p>
              </form>
            )}
          </div>

          <div className="mkt-blog-visual" aria-hidden>
            <svg
              viewBox="0 0 480 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mkt-blog-illustration"
            >
              <rect width="480" height="400" rx="20" fill="#12151b" />
              <rect x="0.5" y="0.5" width="479" height="399" rx="19.5" stroke="#ffffff" strokeOpacity="0.08" />
              <rect x="40" y="48" width="400" height="56" rx="12" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
              <text x="64" y="82" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="14" fontWeight="600">Hotel Operations</text>
              <rect x="40" y="124" width="188" height="96" rx="12" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
              <text x="56" y="152" fill="#6b7280" fontFamily="system-ui,sans-serif" fontSize="10">AI &amp; Automation</text>
              <text x="56" y="180" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500">How AI reception</text>
              <text x="56" y="198" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500">reduces front desk load</text>
              <rect x="252" y="124" width="188" height="96" rx="12" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
              <text x="268" y="152" fill="#6b7280" fontFamily="system-ui,sans-serif" fontSize="10">Revenue</text>
              <text x="268" y="180" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500">Dynamic pricing</text>
              <text x="268" y="198" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500">for independent hotels</text>
              <rect x="40" y="236" width="400" height="96" rx="12" fill="#171b22" stroke="#ffffff" strokeOpacity="0.08" />
              <text x="56" y="264" fill="#6b7280" fontFamily="system-ui,sans-serif" fontSize="10">Operations</text>
              <text x="56" y="292" fill="#e5e7eb" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="500">Running a 40-room property on one workspace</text>
              <rect x="40" y="352" width="120" height="24" rx="12" fill="#10b98122" />
              <text x="56" y="368" fill="#10b981" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="600">Coming Soon</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
