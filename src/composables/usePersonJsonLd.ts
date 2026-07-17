import { onBeforeUnmount, watchEffect } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'

const SCRIPT_ID = 'person-json-ld'

/**
 * Injects a schema.org/Person JSON-LD script into <head>, generated from the
 * portfolio data and kept in sync with the active language. for AI agents and crowllers
 */
export function usePersonJsonLd() {
  const store = usePortfolioStore()

  const buildJsonLd = () => {
    const { personal, summary, skills, education, experience } = store

    const knowsAbout = skills.flatMap((category) => category.skill_list).map((skill) => skill.name)

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: personal.fullName,
      jobTitle: personal.title,
      description: summary,
      email: `mailto:${personal.email}`,
      telephone: personal.phone,
      image: personal.profileImage,
      url: window.location.origin,
      sameAs: [personal.github, personal.linkedin].filter(Boolean),
      address: {
        '@type': 'PostalAddress',
        addressLocality: personal.location,
      },
      alumniOf: education.map((entry) => ({
        '@type': 'CollegeOrUniversity',
        name: entry.institution,
      })),
      worksFor: experience.jobs.map((job) => ({
        '@type': 'Organization',
        name: job.company,
      })),
      knowsAbout,
    }
  }

  watchEffect(() => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(buildJsonLd())
  })

  onBeforeUnmount(() => {
    document.getElementById(SCRIPT_ID)?.remove()
  })
}
