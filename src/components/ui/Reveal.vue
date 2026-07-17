<template>
  <motion.div
    :initial="reduceMotion ? false : { opacity: 0, y }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="{ once: true, amount: 0.2 }"
    :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }"
  >
    <slot />
  </motion.div>
</template>

<script setup lang="ts">
import { motion, useReducedMotion } from 'motion-v'

withDefaults(defineProps<{ delay?: number; y?: number }>(), {
  delay: 0,
  y: 28,
})

const reduceMotion = useReducedMotion()
</script>
