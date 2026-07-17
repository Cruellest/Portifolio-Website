/**
 * Schema for the per-language portfolio data files (src/data/data.json and
 * src/data/translated_data/*.json). Every language file must satisfy
 * `PortfolioData` — the typecheck fails if a translation misses a key.
 */

export interface PersonalData {
  fullName: string
  title: string
  profileImage: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  website?: string
}

export interface SectionTitles {
  summary: string
  skills: string
  experience: string
  education: string
  projects: string
}

/** `level` is 'primary' (core tool) or 'secondary' (supporting tool). */
export interface SkillItem {
  name: string
  level: string
}

export interface SkillCategory {
  category: string
  skill_list: SkillItem[]
}

export interface Job {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  highlights: string[]
}

export interface Project {
  name: string
  description: string
  link: string
}

export interface Experience {
  jobs: Job[]
  projects: Project[]
}

export interface EducationEntry {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
}

export interface UiStrings {
  hero: {
    photoAlt: string
    phoneLabel: string
    emailLabel: string
    githubLabel: string
    linkedinLabel: string
    websiteLabel: string
    scrollHint: string
  }
  skills: {
    tagline: string
    categorySubtitlePrimary: string
    categorySubtitleSupporting: string
    badgePrimaryTooltip: string
    badgeSecondaryTooltip: string
    emptyState: string
  }
  experience: {
    companiesLabel: string
    projectsLabel: string
    mobileSwipeHint: string
    prevJobsAria: string
    nextJobsAria: string
    dateLabel: string
  }
  projects: {
    emptyState: string
    visitButton: string
  }
  search: {
    placeholder: string
    close: string
    toggle: string
    occurrences: string
  }
  common: {
    prev: string
    next: string
    loading: string
    returnToMenu: string
  }
  education: {
    entryLabel: string
    entriesLabel: string
    emptyState: string
  }
  print: {
    preparing: string
    profilePictureAlt: string
    phoneLabel: string
    emailLabel: string
  }
  theme: {
    title: string
    auto: string
    light: string
    dark: string
  }
  menu: {
    sections: string
    actions: string
    downloadResume: string
    downloadResumeTitle: string
    downloadResumeAts: string
    downloadResumeAtsTitle: string
  }
}

export interface PortfolioData {
  personal: PersonalData
  section_titles: SectionTitles
  summary: string
  skills: SkillCategory[]
  experience: Experience
  education: EducationEntry[]
  ui: UiStrings
}

export interface LanguageMeta {
  code: string
  label: string
  nativeName: string
}
