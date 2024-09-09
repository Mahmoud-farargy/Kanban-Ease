<template>
    <div>
        <slot />
    </div>
</template>

<script setup>
    import { defineProps, onMounted } from "vue";

    const props = defineProps({
        title: String,
        description: String
    })
    
    const updatePageMeta = () => {
        document.title = `${props.title || ''} | Mahmoud Elfarargy`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', props.description);
        }
    };
    onMounted(() => {
        updatePageMeta();
    })
</script>

<style>

</style>