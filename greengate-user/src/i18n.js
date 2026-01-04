import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import navbarEN from "./i18n/en/navbar.json";
import footerEN from "./i18n/en/footer.json";
import homeEN from "./i18n/en/home.json";
import valuesEN from "./i18n/en/values.json";
import opportunitiesEN from "./i18n/en/opportunities.json";
import aboutEN from "./i18n/en/about.json";
import teamEN from "./i18n/en/team.json";
import contactEN from "./i18n/en/contact.json";

import navbarAR from "./i18n/ar/navbar.json";
import footerAR from "./i18n/ar/footer.json";
import homeAR from "./i18n/ar/home.json";
import valuesAR from "./i18n/ar/values.json";
import opportunitiesAR from "./i18n/ar/opportunities.json";
import aboutAR from "./i18n/ar/about.json";
import teamAR from "./i18n/ar/team.json";
import contactAR from "./i18n/ar/contact.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: navbarEN,
        footer: footerEN,
        home: homeEN,
        values: valuesEN,
        opportunities: opportunitiesEN,
        about: aboutEN,
        team: teamEN,
        contact: contactEN,
      },
      ar: {
        navbar: navbarAR,
        footer: footerAR,
        home: homeAR,
        values: valuesAR,
        opportunities: opportunitiesAR,
        about: aboutAR,
        team: teamAR,
        contact: contactAR,
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
