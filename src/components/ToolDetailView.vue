<script setup>
import { useI18n } from '../i18n/useI18n'

defineProps({
    currentTool: {
        type: Object,
        required: true,
    },
})

const { t } = useI18n()
</script>

<template>
    <div class="page page-tool">
        <section class="project-hero tool-hero">
            <div class="project-hero__body">
                <p class="eyebrow">{{ (currentTool.displayGroups ?? currentTool.groups).join(' / ') }}</p>
                <h1>{{ currentTool.title }}</h1>
                <p class="project-hero__subtitle">{{ currentTool.summary }}</p>

                <div v-if="currentTool.tags.length" class="tag-row">
                    <span v-for="tag in currentTool.tags" :key="tag" class="tag">
                        {{ tag }}
                    </span>
                </div>
            </div>
        </section>

        <section class="tool-stage" :class="`tool-stage--${currentTool.layout ?? 'default'}`">
            <component v-if="currentTool.pageComponent" :is="currentTool.pageComponent" />
            <div v-else class="tool-stage__missing">
                {{ t('tools.missingPage') }}
            </div>
        </section>
    </div>
</template>
