<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
    currentProject: {
        type: Object,
        required: true,
    },
    projects: {
        type: Array,
        required: true,
    },
    relatedProjectsCount: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['select-project'])

const relatedProjects = computed(() =>
    props.projects
        .filter((project) => project.slug !== props.currentProject.slug)
        .slice(0, props.relatedProjectsCount),
)

const lightbox = ref(null)

function openLightbox(src, alt = '') {
    lightbox.value = { src, alt }
    document.body.style.overflow = 'hidden'
}

function closeLightbox() {
    lightbox.value = null
    document.body.style.overflow = ''
}

function handleImageClick(event) {
    const image = event.target.closest('img')
    if (!image || !event.currentTarget.contains(image)) {
        return
    }

    openLightbox(image.currentSrc || image.src, image.alt || '')
}

function handleKeydown(event) {
    if (event.key === 'Escape' && lightbox.value) {
        closeLightbox()
    }
}

watch(
    () => props.currentProject.slug,
    () => {
        closeLightbox()
    },
)

onBeforeUnmount(() => {
    document.body.style.overflow = ''
})

if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
}
</script>

<template>
    <div class="page page-project">
        <section v-if="currentProject.cover" class="project-cover" @click="handleImageClick">
            <img
                class="project-cover__image"
                :src="currentProject.cover"
                :alt="currentProject.title"
            />
        </section>

        <section class="project-hero">
            <div class="project-hero__body">
                <p class="eyebrow">{{ currentProject.groups.join(' / ') }}</p>
                <h1>{{ currentProject.title }}</h1>
                <p class="project-hero__subtitle">{{ currentProject.subtitle }}</p>

                <div class="tag-row">
          <span v-for="tag in currentProject.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
                </div>

                <p class="project-hero__summary">{{ currentProject.intro }}</p>

        <div class="project-hero__actions">
          <a
            v-if="currentProject.repo"
            class="button button--primary"
            :href="currentProject.repo"
                        target="_blank"
                        rel="noreferrer"
          >
            Open Repository
          </a>
          <span v-if="currentProject.time" class="status-pill">{{ currentProject.time }}</span>
          <span v-if="currentProject.status" class="status-pill">{{ currentProject.status }}</span>
          <span v-if="currentProject.collaboration" class="status-pill">{{ currentProject.collaboration }}</span>
        </div>
      </div>
    </section>

        <section class="editorial-section">
            <div class="section-label">
                <p class="eyebrow">Project</p>
                <h2>Details</h2>
            </div>
            <div class="section-body" @click="handleImageClick">
                <component :is="currentProject.pageComponent" />
            </div>
        </section>

        <section class="editorial-section editorial-section--related">
            <div class="section-label">
                <p class="eyebrow">Browse</p>
                <h2>Other projects</h2>
            </div>
            <div class="section-body">
                <div class="project-list">
                    <button
                        v-for="project in relatedProjects"
                        :key="project.slug"
                        type="button"
                        class="project-list__item"
                        @click="emit('select-project', project.slug)"
                    >
                        <div>
                            <p class="project-list__meta">{{ project.groups.join(' / ') }}</p>
                            <h3>{{ project.title }}</h3>
                        </div>
                        <p>{{ project.subtitle }}</p>
                    </button>
                </div>
            </div>
        </section>

        <teleport to="body">
            <div
                v-if="lightbox"
                class="image-lightbox"
                role="dialog"
                aria-modal="true"
                @click.self="closeLightbox"
            >
                <button type="button" class="image-lightbox__close" @click="closeLightbox">
                    Close
                </button>
                <img class="image-lightbox__image" :src="lightbox.src" :alt="lightbox.alt" />
            </div>
        </teleport>
    </div>
</template>
