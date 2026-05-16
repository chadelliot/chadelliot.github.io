import { companyLandingPages } from "./companyLandingPages";
import { goFractionalCompanyLandingPages } from "./goFractionalCompanyLandingPages";
import { goFractionalWave2CompanyLandingPages } from "./goFractionalWave2CompanyLandingPages";

export const allCompanyLandingPages = {
  ...companyLandingPages,
  ...goFractionalCompanyLandingPages,
  ...goFractionalWave2CompanyLandingPages,
};
