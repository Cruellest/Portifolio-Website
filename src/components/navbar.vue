<template>
  <div 
    class="navbar bg-transparent backdrop-blur-md bg-opacity-30 transition-all"
    :class="[sizeClasses.navbar]"
  >
    <div :class="['navbar-start gap-1 sm:gap-2', sizeClasses.gap]">
      <!-- Full name (hidden on small screens) -->
      <button 
        :class="['btn btn-secondary rounded-full font-bold text-white', sizeClasses.namebreakpoint, sizeClasses.nameBtn]"
      >
        {{ personalData.fullName }}
      </button>

      <!-- Short name (visible on small screens) -->
      <button 
        :class="['btn btn-secondary rounded-full font-bold text-white', sizeClasses.breakpoint, sizeClasses.nameBtn]"
      >
        {{ getShortName(personalData.fullName) }}
      </button>

      <!-- Search button -->
      <div class="flex form-control">
        <div v-if="isSearchOpen" class="input-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            :class="['input input-bordered rounded-full', sizeClasses.input]"
            @blur="handleSearchBlur"
            @keyup.escape="isSearchOpen = false"
            ref="searchInput"
          />
          <button :class="['btn btn-square btn-primary rounded-full', sizeClasses.searchBtn]" @click="isSearchOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button v-else :class="['btn btn-ghost btn-circle rounded-full', sizeClasses.searchBtn]" @click="openSearch">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Center: Empty for Spacing -->
    <div class="navbar-center"></div>

    <!-- Right side: Navigation shortcuts + Download button -->
    <div :class="['navbar-end gap-1 sm:gap-2', sizeClasses.gap]">
      <!-- Desktop navigation (hidden on small screens) - Dinâmico -->
      <div :class="['hidden gap-1 sm:gap-2', sizeClasses.navbreakpoint, sizeClasses.gap]">
        <a 
          v-for="(section, key) in navigationSections" 
          :key="key"
          :href="`#${key}`"
          :class="['btn btn-ghost rounded-full whitespace-nowrap', sizeClasses.navBtn]"
        >
          {{ getResponsiveName(section) }}
        </a>
      </div>
      
      <!-- Download button -->
      <button :class="['btn btn-accent btn-circle rounded-full flex-shrink-0', sizeClasses.downloadBtn]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      <!-- Mobile menu dropdown - Dinâmico -->
      <div :class="['dropdown dropdown-end', sizeClasses.menubreakpoint]">
        <label tabindex="0" :class="['btn btn-ghost btn-circle rounded-full flex-shrink-0', sizeClasses.menuBtn]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
          <li v-for="(section, key) in navigationSections" :key="key">
            <a :href="`#${key}`" class="rounded-full">{{ section }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getPersonalData, getSectionsData } from '../controllers/json-data-controller'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

// Dados da store
const personalData = computed(() => getPersonalData())
const navigationSections = computed(() => getSectionsData())

// Função para obter nome curto (Primeiro nome + Sobrenome)
const getShortName = (fullName) => {
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[parts.length - 1]}`
  }
  return parts[0]
}

// Função para reduzir nomes responsivamente
const getResponsiveName = (sectionName) => {
  // Remove palavras comuns e abrevia
  return sectionName
}

const sizeClasses = computed(() => {
  const sizes = {
    sm: {
      navbar: 'px-1 sm:px-2 py-1 sm:py-2',
      gap: 'gap-0.5 sm:gap-1',
      nameBtn: 'btn-xs px-2 sm:px-3',
      navBtn: 'btn-xs px-2 sm:px-3',
      searchBtn: 'btn-xs',
      downloadBtn: 'btn-xs',
      menuBtn: 'btn-xs',
      input: 'input-xs w-32',
      breakpoint: 'md:hidden',
      namebreakpoint: 'md:flex hidden',
      navbreakpoint: 'md:flex',
      menubreakpoint: 'md:hidden'
    },
    md: {
      navbar: 'px-2 sm:px-4 py-2 sm:py-3',
      gap: 'gap-1 sm:gap-2',
      nameBtn: 'btn-sm px-4 sm:px-6',
      navBtn: 'btn-sm px-3 sm:px-4',
      searchBtn: 'btn-sm',
      downloadBtn: 'btn-sm',
      menuBtn: 'btn-sm',
      input: 'input-sm w-40',
      breakpoint: 'md:hidden',
      namebreakpoint: 'md:flex hidden',
      navbreakpoint: 'md:flex',
      menubreakpoint: 'md:hidden'
    },
    lg: {
      navbar: 'px-3 sm:px-6 py-3 sm:py-4',
      gap: 'gap-2 sm:gap-3',
      nameBtn: 'btn-md px-6 sm:px-8',
      navBtn: 'btn-md px-4 sm:px-5',
      searchBtn: 'btn-md',
      downloadBtn: 'btn-md',
      menuBtn: 'btn-md',
      input: 'input-md w-48',
      breakpoint: 'lg:hidden',
      namebreakpoint: 'lg:flex hidden',
      navbreakpoint: 'lg:flex',
      menubreakpoint: 'lg:hidden'
    },
    xl: {
      navbar: 'px-4 sm:px-8 py-4 sm:py-5',
      gap: 'gap-3 sm:gap-4',
      nameBtn: 'btn-lg px-8 sm:px-10',
      navBtn: 'btn-lg px-5 sm:px-6',
      searchBtn: 'btn-lg',
      downloadBtn: 'btn-lg',
      menuBtn: 'btn-lg',
      input: 'input-lg w-56',
      breakpoint: 'xl:hidden',
      namebreakpoint: 'xl:flex hidden',
      navbreakpoint: 'xl:flex',
      menubreakpoint: 'xl:hidden'
    }
  }
  
  return sizes[props.size] || sizes.md
})

const openSearch = () => {
  isSearchOpen.value = true
  setTimeout(() => {
    searchInput.value?.focus()
  }, 0)
}

const handleSearchBlur = () => {
  if (!searchQuery.value) {
    isSearchOpen.value = false
  }
}
</script>
