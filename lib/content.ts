import enHome from "../data/en/home.json";
import esHome from "../data/es/home.json";
import frHome from "../data/fr/home.json";
import enNav from "../data/en/nav.json";
import esNav from "../data/es/nav.json";
import frNav from "../data/fr/nav.json";
import enServices from "../data/en/services.json";
import esServices from "../data/es/services.json";
import frServices from "../data/fr/services.json";
import enAbout from "../data/en/about.json";
import esAbout from "../data/es/about.json";
import frAbout from "../data/fr/about.json";
import enContact from "../data/en/contact.json";
import esContact from "../data/es/contact.json";
import frContact from "../data/fr/contact.json";

export const locales = ["en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const content = {
  en: { home: enHome, nav: enNav, services: enServices, about: enAbout, contact: enContact },
  es: { home: esHome, nav: esNav, services: esServices, about: esAbout, contact: esContact },
  fr: { home: frHome, nav: frNav, services: frServices, about: frAbout, contact: frContact },
};

type Page = keyof typeof content.en;

export function getContent<P extends Page>(locale: Locale, page: P): typeof content.en[P] {
  return content[locale][page] as typeof content.en[P];
}
