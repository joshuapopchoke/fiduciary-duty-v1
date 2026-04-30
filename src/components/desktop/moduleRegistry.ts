import { lazy } from "react";

export const MODULE_REGISTRY = {
  "phishing-trainee": lazy(() => import("../PhishingForScamsPanel").then(m => ({ default: m.PhishingForScamsPanel }))),
};
