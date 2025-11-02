<template>
    <!-- anchors for navbar -->
    <section id="summary" class="scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
        <Summary/>
    </section>
    <section id="skills" class="scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
        <Skills/>
    </section>
    <section id="experience" class="scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
        <Experience/>
    </section>
    <section id="education" class="scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
        <Education/>
    </section>
</template>

<script setup lang="ts">
import Education from '../components/education.vue';
import Experience from '../components/experience.vue';
import Skills from '../components/skills.vue';
import Summary from '../components/summary.vue'
</script>