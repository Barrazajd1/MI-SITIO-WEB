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
import enPricing from "../data/en/pricing.json";
import esPricing from "../data/es/pricing.json";
import frPricing from "../data/fr/pricing.json";
import ptHome from "../data/pt/home.json";
import ptNav from "../data/pt/nav.json";
import ptServices from "../data/pt/services.json";
import ptAbout from "../data/pt/about.json";
import ptContact from "../data/pt/contact.json";
import ptPricing from "../data/pt/pricing.json";
import itHome from "../data/it/home.json";
import itNav from "../data/it/nav.json";
import itServices from "../data/it/services.json";
import itAbout from "../data/it/about.json";
import itContact from "../data/it/contact.json";
import itPricing from "../data/it/pricing.json";
import deHome from "../data/de/home.json";
import deNav from "../data/de/nav.json";
import deServices from "../data/de/services.json";
import deAbout from "../data/de/about.json";
import deContact from "../data/de/contact.json";
import dePricing from "../data/de/pricing.json";
import idHome from "../data/id/home.json";
import idNav from "../data/id/nav.json";
import idServices from "../data/id/services.json";
import idAbout from "../data/id/about.json";
import idContact from "../data/id/contact.json";
import idPricing from "../data/id/pricing.json";

export const locales = ["en", "es", "fr", "pt", "it", "de", "id"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const content = {
  en: { home: enHome, nav: enNav, services: enServices, about: enAbout, contact: enContact, pricing: enPricing },
  es: { home: esHome, nav: esNav, services: esServices, about: esAbout, contact: esContact, pricing: esPricing },
  fr: { home: frHome, nav: frNav, services: frServices, about: frAbout, contact: frContact, pricing: frPricing },
  pt: { home: ptHome, nav: ptNav, services: ptServices, about: ptAbout, contact: ptContact, pricing: ptPricing },
  it: { home: itHome, nav: itNav, services: itServices, about: itAbout, contact: itContact, pricing: itPricing },
  de: { home: deHome, nav: deNav, services: deServices, about: deAbout, contact: deContact, pricing: dePricing },
  id: { home: idHome, nav: idNav, services: idServices, about: idAbout, contact: idContact, pricing: idPricing },
};

type Page = keyof typeof content.en;

export function getContent<P extends Page>(locale: Locale, page: P): typeof content.en[P] {
  return content[locale][page] as typeof content.en[P];
}
