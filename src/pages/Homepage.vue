<template>
  <main>
    <HeroSection />
    <section id="summary" class="scroll-mt-20">
      <AboutSection />
    </section>
    <section id="skills" class="scroll-mt-20">
      <SkillsSection />
    </section>
    <section id="experience" class="scroll-mt-20">
      <ExperienceSection />
    </section>
    <section id="education" class="scroll-mt-20">
      <EducationSection />
    </section>

    <footer class="border-t border-base-300/60 py-10">
      <div
        class="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row"
      >
        <p class="text-sm text-base-content/60">
          © {{ currentYear }} {{ store.personal.fullName }}
        </p>
        <div class="flex gap-1">
          <a
            :href="store.personal.github"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary"
            :title="store.ui.hero.githubLabel"
          >
            <i class="bi bi-github" aria-hidden="true"></i>
          </a>
          <a
            :href="store.personal.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary"
            :title="store.ui.hero.linkedinLabel"
          >
            <i class="bi bi-linkedin" aria-hidden="true"></i>
          </a>
          <a
            :href="`mailto:${store.personal.email}`"
            class="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary"
            :title="store.ui.hero.emailLabel"
          >
            <i class="bi bi-envelope" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import AboutSection from '../components/sections/AboutSection.vue'
import EducationSection from '../components/sections/EducationSection.vue'
import ExperienceSection from '../components/sections/ExperienceSection.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import SkillsSection from '../components/sections/SkillsSection.vue'
import { usePortfolioStore } from '../stores/portfolio'

const store = usePortfolioStore()
const currentYear = new Date().getFullYear()
</script>
