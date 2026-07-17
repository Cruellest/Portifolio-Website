import { defineStore } from 'pinia'
import type { LanguageMeta, PortfolioData } from '../types/portfolio'
import enData from '../data/data.json'
import languagesData from '../data/languages.json'

const LANGUAGE_STORAGE_KEY = 'site-language'
const DEFAULT_LANGUAGE = 'en'

// Assigning the JSON imports to typed constants is what enforces the schema:
// if a language file misses a key, `vue-tsc` fails the build.
const english: PortfolioData = enData
const languages: LanguageMeta[] = languagesData.languages

const loadEnglish = async () => english

const loaders: Record<string, () => Promise<PortfolioData>> = {
  en: loadEnglish,
  pt: async () => (await import('../data/translated_data/data-portuguese.json')).default,
}

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    data: english,
    languageCode: DEFAULT_LANGUAGE,
    languages,
  }),

  getters: {
    personal: (state) => state.data.personal,
    sectionTitles: (state) => state.data.section_titles,
    summary: (state) => state.data.summary,
    skills: (state) => state.data.skills,
    experience: (state) => state.data.experience,
    education: (state) => state.data.education,
    ui: (state) => state.data.ui,
  },

  actions: {
    async setLanguage(code: string) {
      const loader = loaders[code] ?? loadEnglish
      const resolvedCode = loaders[code] ? code : DEFAULT_LANGUAGE
      try {
        this.data = await loader()
        this.languageCode = resolvedCode
      } catch (err) {
        console.warn('Failed to load language data, keeping current language:', err)
        return
      }
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedCode)
      } catch (err) {
        console.warn('Failed to persist language preference:', err)
      }
    },

    async initLanguageFromStorage() {
      let code = DEFAULT_LANGUAGE
      try {
        code = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE
      } catch (err) {
        console.warn('Failed to read language preference:', err)
      }
      if (code !== this.languageCode) {
        await this.setLanguage(code)
      }
    },
  },
})
