<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
    projects: {
        type: Array,
        required: true,
    },
    projectTabs: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits(['open-project'])
const { t, groupLabel } = useI18n()

const ALL_TAB = '__all__'
const activeTab = ref(ALL_TAB)
const searchQuery = ref('')

const availableTabs = computed(() => [ALL_TAB, ...props.projectTabs])

const filteredProjects = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return props.projects.filter((project) => {
        const matchesTab =
            activeTab.value === ALL_TAB || project.groups.includes(activeTab.value)
        const matchesQuery =
            !query
            || project.title.toLowerCase().includes(query)
            || project.subtitle.toLowerCase().includes(query)
            || project.intro.toLowerCase().includes(query)
            || (project.displayGroups ?? project.groups).some((group) => group.toLowerCase().includes(query))
            || project.tags.some((tag) => tag.toLowerCase().includes(query))

        return matchesTab && matchesQuery
    })
})
</script>

<template>
    <div class="page page-projects">
        <section class="projects-hero">
            <div class="hero-panel__body">
                <p class="eyebrow">{{ t('projects.eyebrow') }}</p>
                <h1>{{ t('projects.title') }}</h1>
                <p class="hero-panel__intro">
                    {{ t('projects.intro') }}
                </p>
            </div>
        </section>

        <section class="editorial-section">
            <div class="section-label">
                <p class="eyebrow">{{ t('projects.browseEyebrow') }}</p>
                <h2>{{ t('projects.filterTitle') }}</h2>
            </div>
            <div class="section-body">
                <div class="projects-toolbar">
                    <div class="project-tabs" role="tablist" :aria-label="t('projects.groupsAria')">
                        <button
                            v-for="tab in availableTabs"
                            :key="tab"
                            type="button"
                            class="project-tab"
                            :class="{ 'is-active': tab === activeTab }"
                            :aria-selected="tab === activeTab"
                            @click="activeTab = tab"
                        >
                            {{ tab === ALL_TAB ? t('common.all') : groupLabel(tab) }}
                        </button>
                    </div>

                    <label class="projects-search">
                        <span class="projects-search__label">{{ t('common.search') }}</span>
                        <input
                            v-model="searchQuery"
                            class="projects-search__input"
                            type="text"
                            :placeholder="t('common.searchProjects')"
                        />
                    </label>
                </div>

                <Transition name="projects-fade" mode="out-in">
                    <div :key="`${activeTab}:${searchQuery.trim().toLowerCase()}`" class="project-listing">
                        <button
                            v-for="project in filteredProjects"
                            :key="project.slug"
                            type="button"
                            class="project-card"
                            @click="emit('open-project', project.slug)"
                        >
                            <div class="project-card__content">
                                <img
                                    v-if="project.cover"
                                    class="project-card__thumb"
                                    :src="project.cover"
                                    :alt="project.title"
                                />
                                <div v-else class="project-card__thumb project-card__thumb--placeholder" aria-hidden="true">
                                    <span>{{ project.title }}</span>
                                </div>
                                <div class="project-card__head">
                                    <p class="project-card__meta">{{ (project.displayGroups ?? project.groups).join(' / ') }}</p>
                                    <h3>{{ project.title }}</h3>
                                    <p class="project-card__subtitle">{{ project.subtitle }}</p>
                                </div>
                                <div class="project-card__summary-wrap">
                                    <p class="project-card__summary">{{ project.intro }}</p>
                                    <span class="project-card__more">
                                        {{ t('common.moreInfo') }}
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                </Transition>
            </div>
        </section>
    </div>
</template>
