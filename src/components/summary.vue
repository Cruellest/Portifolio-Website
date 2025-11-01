<template>
  <section class="w-full">
    <!-- Header: Foto + Nome/Título -->
    <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div class="relative">
        <!-- círculo roxo decorativo atrás da foto -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-primary/15"></div>
        <div class="avatar relative">
          <div class="mask mask-circle w-36 h-36 sm:w-44 sm:h-44 ring ring-offset-2 ring-primary">
            <img :src="personalData.profileImage" :alt="`Foto de ${personalData.fullName || 'usuário'}`" />
          </div>
        </div>
      </div>
      <div class="flex-1 text-center sm:text-left min-w-0">
        <h2 class="text-2xl font-bold text-primary">{{ personalData.fullName }}</h2>
        <p v-if="personalData.title" class="text-base-content/70">{{ personalData.title }}</p>

        <!-- Botões: horizontal, entre o nome e o resumo -->
        <div class="mt-3">
          <TransitionGroup
            tag="div"
            class="flex flex-wrap gap-2 justify-center sm:justify-start"
            appear
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-200"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-95"
          >
            <a
              v-for="c in contacts"
              :key="c.type"
              :href="c.href"
              :title="c.title"
              :target="c.external ? '_blank' : undefined"
              rel="noopener noreferrer"
              class="btn btn-sm btn-outline"
              :class="c.btnClass"
            >
              {{ c.label }}
            </a>
          </TransitionGroup>
        </div>

        <!-- Resumo abaixo dos botões -->
        <div class="mt-3">
          <h3 v-if="summaryTitle" class="text-sm font-semibold uppercase tracking-wide text-primary">
            {{ summaryTitle }}
          </h3>
          <p v-if="summaryText" class="mt-2 text-sm leading-relaxed">
            {{ summaryText }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPersonalData, getSummaryData, getSectionsData } from '../controllers/json-data-controller'

type PersonalData = {
  fullName?: string
  title?: string
  profileImage?: string
  phone?: string
  email?: string
  github?: string
  linkedin?: string
  website?: string
  [k: string]: unknown
}

type ContactButton = {
  type: 'phone' | 'email' | 'github' | 'linkedin' | 'website'
  label: string
  href: string
  title: string
  external?: boolean
  btnClass: string
}

const personalData = computed<PersonalData>(() => getPersonalData() as PersonalData)
const summaryRaw = computed(() => getSummaryData() as unknown)

const sectionTitles = computed(() => getSectionsData() as any)
const summaryTitle = computed<string>(() => {
  const t = sectionTitles.value
  return (t && (t.summary || t.Summary || t.resumo)) || 'Resumo'
})

const summaryText = computed<string>(() => {
  const val = summaryRaw.value as any
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') return val.bio || val.summary || ''
  return ''
})

const normalizeUrlDisplay = (url: string) => {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const path = u.pathname.replace(/\/+$/, '')
    return path && path !== '/' ? `${host}${path}` : host
  } catch {
    return url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/[\?#].*$/, '')
      .replace(/\/+$/, '')
  }
}

const contacts = computed<ContactButton[]>(() => {
  const p = personalData.value || {}

  const accentBtn =
    'text-primary border-primary hover:bg-primary hover:text-primary-content transition-colors duration-200'

  const arr: ContactButton[] = []
  if (p.phone) {
    arr.push({ type: 'phone', label: 'Telefone', href: `tel:${p.phone}`, title: String(p.phone), btnClass: accentBtn })
  }
  if (p.email) {
    arr.push({ type: 'email', label: 'Email', href: `mailto:${p.email}`, title: String(p.email), btnClass: accentBtn })
  }
  if (p.github) {
    const url = String(p.github)
    arr.push({ type: 'github', label: 'GitHub', href: url, title: normalizeUrlDisplay(url), external: true, btnClass: accentBtn })
  }
  if (p.linkedin) {
    const url = String(p.linkedin)
    arr.push({ type: 'linkedin', label: 'LinkedIn', href: url, title: normalizeUrlDisplay(url), external: true, btnClass: accentBtn })
  }
  if (p.website) {
    const url = String(p.website)
    arr.push({ type: 'website', label: 'Website', href: url, title: normalizeUrlDisplay(url), external: true, btnClass: accentBtn })
  }
  return arr
})
</script>
