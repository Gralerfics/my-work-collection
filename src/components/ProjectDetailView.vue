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
const lightboxImage = ref(null)
const dragState = ref({
    active: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
})

function openLightbox(src, alt = '') {
    lightbox.value = { src, alt, scale: 1, offsetX: 0, offsetY: 0 }
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

function handleLightboxWheel(event) {
    if (!lightbox.value || !lightboxImage.value) {
        return
    }

    event.preventDefault()

    const rect = lightboxImage.value.getBoundingClientRect()
    const delta = event.deltaY < 0 ? 0.16 : -0.16
    const prevScale = lightbox.value.scale
    const nextScale = Math.min(4, Math.max(1, Number((lightbox.value.scale + delta).toFixed(2))))
    const pointerX = event.clientX - rect.left - rect.width / 2
    const pointerY = event.clientY - rect.top - rect.height / 2
    const scaleRatio = nextScale / prevScale

    lightbox.value = {
        ...lightbox.value,
        scale: nextScale,
        offsetX: nextScale === 1 ? 0 : lightbox.value.offsetX - pointerX * (scaleRatio - 1),
        offsetY: nextScale === 1 ? 0 : lightbox.value.offsetY - pointerY * (scaleRatio - 1),
    }
}

function handleLightboxPointerDown(event) {
    if (!lightboxImage.value) {
        return
    }

    if (!event.target.closest('.image-lightbox__image')) {
        closeLightbox()
        return
    }

    if (lightbox.value?.scale <= 1) {
        return
    }

    dragState.value = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: lightbox.value.offsetX,
        offsetY: lightbox.value.offsetY,
    }
}

function handleLightboxPointerMove(event) {
    if (!dragState.value.active || !lightbox.value) {
        return
    }

    event.preventDefault()

    const deltaX = event.clientX - dragState.value.startX
    const deltaY = event.clientY - dragState.value.startY

    lightbox.value = {
        ...lightbox.value,
        offsetX: dragState.value.offsetX + deltaX,
        offsetY: dragState.value.offsetY + deltaY,
    }
}

function endLightboxDrag() {
    dragState.value.active = false
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
                @wheel="handleLightboxWheel"
                @pointerdown="handleLightboxPointerDown"
                @pointermove="handleLightboxPointerMove"
                @pointerup="endLightboxDrag"
                @pointerleave="endLightboxDrag"
                @pointercancel="endLightboxDrag"
            >
                <button type="button" class="image-lightbox__close" @click="closeLightbox">
                    Close
                </button>
                <div class="image-lightbox__viewport">
                    <img
                        ref="lightboxImage"
                        class="image-lightbox__image"
                        :src="lightbox.src"
                        :alt="lightbox.alt"
                        draggable="false"
                        @dragstart.prevent
                        :style="{
                            transform: `translate(${lightbox.offsetX}px, ${lightbox.offsetY}px) scale(${lightbox.scale})`,
                        }"
                    />
                </div>
            </div>
        </teleport>
    </div>
</template>
