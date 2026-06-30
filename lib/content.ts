import enGuides from "../data/en/guides.json";
import esGuides from "../data/es/guides.json";
import frGuides from "../data/fr/guides.json";
import ptGuides from "../data/pt/guides.json";
import itGuides from "../data/it/guides.json";
import deGuides from "../data/de/guides.json";
import idGuides from "../data/id/guides.json";
import enFaq from "../data/en/faq.json";
import esFaq from "../data/es/faq.json";
import frFaq from "../data/fr/faq.json";
import ptFaq from "../data/pt/faq.json";
import itFaq from "../data/it/faq.json";
import deFaq from "../data/de/faq.json";
import idFaq from "../data/id/faq.json";
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
import EnBlog from "../data/en/blog.json";
import EsBlog from "../data/es/blog.json";
import FrBlog from "../data/fr/blog.json";
import PtBlog from "../data/pt/blog.json";
import ItBlog from "../data/it/blog.json";
import DeBlog from "../data/de/blog.json";
import IdBlog from "../data/id/blog.json";

export const locales = ["en", "es", "fr", "pt", "it", "de", "id"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const content = {
  en: { home: enHome, nav: enNav, services: enServices, about: enAbout, contact: enContact, pricing: enPricing, blog: EnBlog, guides: enGuides, faq: enFaq },
  es: { home: esHome, nav: esNav, services: esServices, about: esAbout, contact: esContact, pricing: esPricing, blog: EsBlog, guides: esGuides, faq: esFaq },
  fr: { home: frHome, nav: frNav, services: frServices, about: frAbout, contact: frContact, pricing: frPricing, blog: FrBlog, guides: frGuides, faq: frFaq },
  pt: { home: ptHome, nav: ptNav, services: ptServices, about: ptAbout, contact: ptContact, pricing: ptPricing, blog: PtBlog, guides: ptGuides, faq: ptFaq },
  it: { home: itHome, nav: itNav, services: itServices, about: itAbout, contact: itContact, pricing: itPricing, blog: ItBlog, guides: itGuides, faq: itFaq },
  de: { home: deHome, nav: deNav, services: deServices, about: deAbout, contact: deContact, pricing: dePricing, blog: DeBlog, guides: deGuides, faq: deFaq },
  id: { home: idHome, nav: idNav, services: idServices, about: idAbout, contact: idContact, pricing: idPricing, blog: IdBlog, guides: idGuides, faq: idFaq },
};

type Page = keyof typeof content.en;

export function getContent<P extends Page>(locale: Locale, page: P): typeof content.en[P] {
  return (content[locale] as typeof content.en)[page];
}
