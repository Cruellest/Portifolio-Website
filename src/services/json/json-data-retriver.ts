import { defineStore } from 'pinia'
import { watch } from 'vue'
import jsonData from '../../data/data.json'

/**
 * Pinia store for managing portfolio JSON data
 * Handles data state, persistence to localStorage, and watchers for reactive updates
 * 
 * @store useJsonData
 * @example
 * const jsonStore = useJsonData()
 * const allData = jsonStore.getData
 * jsonStore.updateSection('projects', newProjectsData)
 */
export const useJsonData = defineStore('jsonData', {
  /**
   * Reactive state containing portfolio data
   * @returns {Object} Initial state with imported JSON data
   */
  state: () => ({
    data: jsonData
  }),
  
  /**
   * Computed properties for accessing store state
   */
  getters: {
    /**
     * Returns all portfolio data
     * @returns {typeof jsonData} The complete portfolio data object
     */
    getData: (state) => state.data
  },
  
  /**
   * Mutation and action methods for updating store
   */
  actions: {
    /**
     * Deep merge new data into existing portfolio data
     * @param {typeof jsonData} newData - New data to merge
     * @example
     * updateData({ projects: [...] })
     */
    updateData(newData: typeof jsonData) {
      this.data = { ...this.data, ...newData }
    },

    /**
     * Update a specific section of the portfolio data
     * @param {string} sectionName - Name of the section to update (e.g., 'projects', 'skills')
     * @param {any} sectionData - New data for the section
     * @example
     * updateSection('about', { title: 'About Me', description: '...' })
     */
    updateSection(sectionName: string, sectionData: any) {
      this.data[sectionName as keyof typeof jsonData] = sectionData
    },
    
    /**
     * Initialize watchers for automatic localStorage persistence
     * Watches deep changes in data and saves to localStorage on every change
     * Call this method in your app setup
     * @example
     * const store = useJsonData()
     * store.initializeWatchers()
     */
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
    
    /**
     * Load portfolio data from localStorage if available
     * Call this method during app initialization to restore persisted data
     * @example
     * const store = useJsonData()
     * store.loadFromStorage()
     */
    loadFromStorage() {
      const stored = localStorage.getItem('portfolioData')
      if (stored) {
        this.data = JSON.parse(stored)
      }
    }
  }
})