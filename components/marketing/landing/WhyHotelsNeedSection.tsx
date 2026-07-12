import { MonavelInActionCard } from "@/components/marketing/landing/MonavelInActionCard";
import { mktContainerWideClass } from "@/lib/marketing/design";
import {
  WHY_HOTELS_NEED_CONTENT,
  WITH_MONAVEL_ITEMS,
  WITHOUT_MONAVEL_ITEMS,
} from "@/lib/marketing/why-hotels-need";

export function WhyHotelsNeedSection() {
  return (
    <section
      id={WHY_HOTELS_NEED_CONTENT.sectionId}
      className="mkt-why-need-section"
      aria-labelledby="why-hotels-need-heading"
    >
      <div className={mktContainerWideClass}>
        <div className="mkt-why-need-grid">
          <div className="mkt-why-need-intro">
            <h2 id="why-hotels-need-heading" className="mkt-why-need-headline">
              {WHY_HOTELS_NEED_CONTENT.headline}
            </h2>
            <p className="mkt-why-need-lead">{WHY_HOTELS_NEED_CONTENT.subhead}</p>
          </div>

          <div className="mkt-why-need-column mkt-why-need-column--without">
            <h3 className="mkt-why-need-column-title">Without Monavel</h3>
            <ul className="mkt-why-need-list">
              {WITHOUT_MONAVEL_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mkt-why-need-column mkt-why-need-column--with">
            <h3 className="mkt-why-need-column-title">With Monavel</h3>
            <ul className="mkt-why-need-list">
              {WITH_MONAVEL_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mkt-why-need-visual">
            <MonavelInActionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
