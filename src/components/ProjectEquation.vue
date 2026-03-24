<script setup>
defineProps({
    caption: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <figure class="project-equation">
        <div class="project-equation__body">
            <slot />
        </div>
        <figcaption v-if="caption" class="project-equation__caption">
            {{ caption }}
        </figcaption>
    </figure>
</template>
