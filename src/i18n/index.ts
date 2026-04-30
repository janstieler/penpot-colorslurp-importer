import de from "./de";
import en from "./en";
export type { Translations } from "./types";

const translations = { de, en } as const;
type Lang = keyof typeof translations;

function detectLang(): Lang {
  for (const l of navigator.languages ?? [navigator.language]) {
    if (l.startsWith("de")) return "de";
    if (l.startsWith("en")) return "en";
  }
  return "en";
}

export function getTranslations(penpotLocale?: string): { lang: Lang; t: typeof en } {
  const lang = penpotLocale
    ? ((penpotLocale.split("-")[0].toLowerCase() as Lang) in translations
        ? (penpotLocale.split("-")[0].toLowerCase() as Lang)
        : detectLang())
    : detectLang();
  return { lang, t: translations[lang] };
}
