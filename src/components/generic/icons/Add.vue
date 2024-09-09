<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    size: {
        type: [Number, String],
        default: 19,
        required: false
    }
})
</script>

<style>

</style>