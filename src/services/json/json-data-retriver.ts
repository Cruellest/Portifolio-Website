import { defineStore } from 'pinia'
import { watch } from 'vue'
import jsonData from '../../data/data.json'
import languagesData from '../../data/languages.json' // added

export const useJsonData = defineStore('jsonData', {
  state: () => ({
    data: jsonData,
    currentLanguageCode: 'en' as string,
    languages: (languagesData as any)?.languages ?? []
  }),
  
  getters: {
    getData: (state) => state.data,
    getCurrentLanguageCode: (state) => state.currentLanguageCode
  },
  
  actions: {
    updateData(newData: typeof jsonData) {
      this.data = { ...this.data, ...newData }
    },

    updateSection(sectionName: string, sectionData: any) {
      this.data[sectionName as keyof typeof jsonData] = sectionData
    },
    
    initializeWatchers() {
      watch(
        () => this.data,
        (newData) => {
          localStorage.setItem('portfolioData', JSON.stringify(newData))
          console.log('Dados atualizados:', newData)
        },
        { deep: true }
      )
    },
    
    loadFromStorage() {
      const stored = localStorage.getItem('portfolioData')
      if (stored) {
        this.data = JSON.parse(stored)
      }
    },

    // added: helpers and language loaders
    _labelToSlug(label: string) {
      return (label ?? '').toLowerCase().replace(/\s+/g, '-')
    },

    // helper: find language meta by code
    _findLanguageByCode(code: string) {
      const langs = (this.languages as any[]) || []
      return langs.find((l) => l.code === code) || null
    },

    // helper: import json module and return its default/object
    async _importJsonModule(path: string) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore dynamic json import
      const mod: any = await import(path)
      return mod?.default ?? mod
    },

    // simpler, linear load function with early returns
    async loadLanguageData(code: string) {
      try {
        // prefer built-in english file for 'en'
        if (code === 'en') {
          this.data = await this._importJsonModule('../../data/data.json')
          this.currentLanguageCode = 'en'
          return
        }

        const lang = this._findLanguageByCode(code)
        if (!lang || !lang.label) {
          // invalid code -> fallback to english
          this.data = await this._importJsonModule('../../data/data.json')
          this.currentLanguageCode = 'en'
          return
        }

        const slug = this._labelToSlug(lang.label)
        // import translated file by slug
        this.data = await this._importJsonModule(`../../data/translated_data/data-${slug}.json`)
        this.currentLanguageCode = code
      } catch (err) {
        // single fallback path on any error
        try {
          this.data = await this._importJsonModule('../../data/data.json')
        } catch {
          // if even fallback fails, keep current data
        }
        this.currentLanguageCode = 'en'
      }
    },

    async setLanguage(code: string) {
      await this.loadLanguageData(code)
      try { localStorage.setItem('site-language', code) } catch {}
    },

    async ensureLanguageFromLocalStorage() {
      let code = 'en'
      try { code = localStorage.getItem('site-language') || 'en' } catch {}
      if (code !== this.currentLanguageCode) {
        await this.loadLanguageData(code)
      }
    }
  }
})