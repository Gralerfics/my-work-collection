<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
    tag: {
        type: String,
        default: 'span',
    },
})

const slots = defineSlots()
const { locale } = useI18n()

const activeSlotName = computed(() => {
    if (locale.value === 'zh' && slots.zh) {
        return 'zh'
    }

    if (slots.en) {
        return 'en'
    }

    return 'default'
})
</script>

<template>
    <component :is="tag">
        <slot v-if="activeSlotName === 'zh'" name="zh" />
        <slot v-else-if="activeSlotName === 'en'" name="en" />
        <slot v-else />
    </component>
</template>
