// @ts-check
"use strict";

/**
 * Maps each JSON field path to its translation content type.
 *
 * Path format uses [] for array items (same as validate-en.js).
 *
 * Types:
 *   seo_title     — Precise, keyword-rich. Preserve SEO value and industry terms.
 *   feature_term  — Consistent technical term. Prioritize recognizability.
 *   engaging_copy — Natural, compelling copy. Adapt idioms; don't translate literally.
 *   blog_content  — Engaging, culturally adapted narrative.
 *   ui_label      — Short, clear, standard UI text.
 *   skip          — Copy the EXACT original value. Do not translate.
 *
 * @type {Record<string, Record<string, string>>}
 */
module.exports = {
  "nav.json": {
    "siteName":             "ui_label",
    "cta":                  "ui_label",
    "links[].label":        "ui_label",
    "links[].href":         "skip",          // URL paths — never translate
    "footer.tagline":       "engaging_copy",
    "footer.pagesLabel":    "ui_label",
    "footer.rights":        "ui_label",
    "footer.builtWith":     "ui_label",
  },

  "home.json": {
    "hero.title":                    "seo_title",
    "hero.description":              "engaging_copy",
    "hero.buttonText":               "ui_label",
    "hero.learnMore":                "ui_label",
    "stats[].label":                 "feature_term",
    "stats[].number":                "skip",          // numeric values
    "cta.title":                     "engaging_copy",
    "cta.subtitle":                  "engaging_copy",
    "cta.button":                    "ui_label",
    "services.title":                "seo_title",
    "services.badge":                "ui_label",
    "services.viewAll":              "ui_label",
    "services.items[].title":        "feature_term",
    "services.items[].description":  "engaging_copy",
    "workflow.badge":                "ui_label",
    "workflow.title":                "seo_title",
    "workflow.subtitle":             "engaging_copy",
    "workflow.steps[].number":       "skip",          // step numbers ("01", "02"…)
    "workflow.steps[].title":        "feature_term",
    "workflow.steps[].description":  "engaging_copy",
  },

  "services.json": {
    "hero.title":          "seo_title",
    "hero.description":    "engaging_copy",
    "hero.badge":          "ui_label",
    "cta.title":           "engaging_copy",
    "cta.subtitle":        "engaging_copy",
    "cta.button":          "ui_label",
    "items[].title":       "feature_term",
    "items[].description": "engaging_copy",
    "items[].icon":        "skip",           // emoji icons — never translate
  },

  "about.json": {
    "hero.title":                "seo_title",
    "hero.description":          "engaging_copy",
    "hero.badge":                "ui_label",
    "hero.valuesBadge":          "ui_label",
    "hero.valuesSectionTitle":   "engaging_copy",
    "mission.title":             "seo_title",
    "mission.body":              "engaging_copy",
    "values[].title":            "feature_term",
    "values[].description":      "engaging_copy",
  },

  "contact.json": {
    "hero.title":              "seo_title",
    "hero.description":        "engaging_copy",
    "hero.badge":              "ui_label",
    "form.namePlaceholder":    "ui_label",
    "form.emailPlaceholder":   "ui_label",
    "form.messagePlaceholder": "ui_label",
    "form.submitButton":       "ui_label",
    "form.successMessage":     "engaging_copy",
    "form.errorMessage":       "engaging_copy",
    "info.email":              "skip",        // email address — never translate
    "info.location":           "engaging_copy",
  },

  "pricing.json": {
    "hero.title":                    "seo_title",
    "hero.description":              "engaging_copy",
    "hero.badge":                    "ui_label",
    "toggle.monthly":                "ui_label",
    "toggle.yearly":                 "ui_label",
    "toggle.saveBadge":              "ui_label",
    "mostPopular":                   "ui_label",
    "plans[].name":                  "feature_term",
    "plans[].description":           "engaging_copy",
    "plans[].monthlyPrice":          "skip",   // numeric price values
    "plans[].yearlyPrice":           "skip",
    "plans[].currency":              "skip",   // currency symbol
    "plans[].period":                "ui_label", // "/ month" → "/ mes"
    "plans[].cta":                   "ui_label",
    "plans[].highlight":             "skip",   // boolean
    "plans[].features[].text":       "feature_term",
    "plans[].features[].included":   "skip",   // boolean
    "cta.title":                     "engaging_copy",
    "cta.subtitle":                  "engaging_copy",
    "cta.button":                    "ui_label",
  },
};
