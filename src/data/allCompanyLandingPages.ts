import { companyLandingPages } from "./companyLandingPages";
import { goFractionalCompanyLandingPages } from "./goFractionalCompanyLandingPages";
import { goFractionalWave2CompanyLandingPages } from "./goFractionalWave2CompanyLandingPages";
import { goFractionalWave3CompanyLandingPages } from "./goFractionalWave3CompanyLandingPages";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const parseMoney = (amount: string) => Number(amount.replace(/[$,\s]/g, ""));

const normalizeInvestment = (investment?: string) => {
  if (!investment) return investment;
  if (/annual|salary|full-time/i.test(investment)) return investment;

  const rangeMatch = investment.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*(?:-|–|—|to)\s*\$?\s*([\d,]+(?:\.\d+)?)/i);
  if (!rangeMatch) return investment;

  const low = parseMoney(rangeMatch[1]);
  const high = parseMoney(rangeMatch[2]);
  if (!Number.isFinite(low) || !Number.isFinite(high)) return investment;

  const max = Math.max(low, high);
  const isHourly = /hour|hourly|\shr\b|\/hr/i.test(investment);
  const isMonthly = /month|monthly|retainer/i.test(investment);
  const unit = isHourly ? "/hour" : isMonthly ? "/month" : "";

  return `${currencyFormatter.format(max)}${unit}`;
};

const normalizePage = (page) => ({
  ...page,
  proposal: page.proposal
    ? {
        ...page.proposal,
        investment: normalizeInvestment(page.proposal.investment),
      }
    : page.proposal,
});

export const allCompanyLandingPages = Object.fromEntries(
  Object.entries({
    ...companyLandingPages,
    ...goFractionalCompanyLandingPages,
    ...goFractionalWave2CompanyLandingPages,
    ...goFractionalWave3CompanyLandingPages,
  }).map(([slug, page]) => [slug, normalizePage(page)]),
);
