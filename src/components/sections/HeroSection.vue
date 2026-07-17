<template>
  <section class="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
    <div class="bg-dot-grid absolute inset-0" aria-hidden="true"></div>

    <div class="container relative mx-auto max-w-5xl px-4 pb-28 pt-12">
      <motion.div v-bind="enter(0)" class="flex flex-wrap items-center gap-4">
        <div class="avatar">
          <div class="w-16 rounded-2xl ring-1 ring-base-300 sm:w-20">
            <img :src="personal.profileImage" :alt="`${ui.hero.photoAlt} ${personal.fullName}`" />
          </div>
        </div>
        <span
          class="badge badge-ghost gap-1.5 rounded-full border-base-300 bg-base-100/60 px-3 py-3 text-xs sm:text-sm"
        >
          <i class="bi bi-geo-alt text-primary" aria-hidden="true"></i>
          {{ personal.location }}
        </span>
      </motion.div>

      <motion.h1
        v-bind="enter(1)"
        class="mt-8 max-w-4xl text-5xl font-extrabold leading-[1.04] tracking-tight text-base-content sm:text-6xl md:text-7xl"
      >
        {{ personal.fullName }}
      </motion.h1>

      <motion.p
        v-bind="enter(2)"
        class="mt-4 w-fit bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl"
      >
        {{ personal.title }}
      </motion.p>

      <motion.div v-bind="enter(3)" class="mt-9 flex flex-wrap gap-2.5">
        <a
          v-for="contact in contacts"
          :key="contact.type"
          :href="contact.href"
          :title="contact.title"
          :target="contact.external ? '_blank' : undefined"
          rel="noopener noreferrer"
          class="btn btn-sm gap-2 rounded-full border-base-300 bg-base-100/60 font-medium transition-colors duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary sm:btn-md"
        >
          <i class="bi" :class="contact.icon" aria-hidden="true"></i>
          {{ contact.label }}
        </a>
      </motion.div>
    </div>

    <div class="absolute inset-x-0 bottom-7 flex justify-center">
      <motion.a
        v-bind="enter(6)"
        href="#summary"
        class="flex flex-col items-center gap-1.5 text-base-content/50 transition-colors hover:text-primary"
        @click.prevent="scrollToSection('summary')"
      >
        <span class="text-[0.65rem] uppercase tracking-[0.3em]">{{ ui.hero.scrollHint }}</span>
        <i class="bi bi-chevron-down animate-scroll-cue" aria-hidden="true"></i>
      </motion.a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion, useReducedMotion } from 'motion-v'
import { usePortfolioStore } from '../../stores/portfolio'
import { scrollToSection } from '../../utils/dom'
import { displayUrl } from '../../utils/url'

interface ContactLink {
  type: string
  label: string
  href: string
  title: string
  icon: string
  external?: boolean
}

const store = usePortfolioStore()
const reduceMotion = useReducedMotion()

const personal = computed(() => store.personal)
const ui = computed(() => store.ui)

const enter = (index: number) => ({
  initial: reduceMotion.value ? false : { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.09 * index },
})

const contacts = computed<ContactLink[]>(() => {
  const p = personal.value
  const labels = ui.value.hero
  const links: ContactLink[] = [
    {
      type: 'email',
      label: labels.emailLabel,
      href: `mailto:${p.email}`,
      title: p.email,
      icon: 'bi-envelope',
    },
    {
      type: 'phone',
      label: labels.phoneLabel,
      href: `tel:${p.phone}`,
      title: p.phone,
      icon: 'bi-telephone',
    },
    {
      type: 'github',
      label: labels.githubLabel,
      href: p.github,
      title: displayUrl(p.github),
      icon: 'bi-github',
      external: true,
    },
    {
      type: 'linkedin',
      label: labels.linkedinLabel,
      href: p.linkedin,
      title: displayUrl(p.linkedin),
      icon: 'bi-linkedin',
      external: true,
    },
  ]
  if (p.website) {
    links.push({
      type: 'website',
      label: labels.websiteLabel,
      href: p.website,
      title: displayUrl(p.website),
      icon: 'bi-globe2',
      external: true,
    })
  }
  return links
})
</script>
