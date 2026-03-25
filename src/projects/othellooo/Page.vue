<script setup>
import menuShot from './assets/menu.png'
import savesShot from './assets/saves.png'
import hdrExShot from './assets/hdr_ex.png'
import exShot from './assets/ex.png'
</script>

<template>
    <div class="project-article othellooo-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project is a complete 3D Othello / Reversi game: player profiles, save and replay, human-vs-AI play, theme customization, and a 3D presentation layer all live in the same Java application.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> Java, Swing, LWJGL, OpenGL, fragment-shader ray tracing, HDR environment maps, PBR materials, BVH acceleration, and a separate gameplay / persistence layer for rules, profiles, and replay data.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Demonstration</h2>
            <div class="project-media-grid project-media-grid--three">
                <figure class="project-media">
                    <img :src="menuShot" alt="OthellooO main menu" />
                    <figcaption>Game menu.</figcaption>
                </figure>
                <figure class="project-media">
                    <img :src="exShot" alt="OthellooO gameplay screenshot" />
                    <figcaption>Gameplay screenshot.</figcaption>
                </figure>
                <figure class="project-media">
                    <img :src="savesShot" alt="SL menu" />
                    <figcaption>Saving and loading.</figcaption>
                </figure>
            </div>
            <figure class="project-media project-media--medium">
                <img :src="hdrExShot" alt="HDR test" />
                <figcaption>HDR background test.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Notes</h2>
            <p>
                This was an very early project, a course assignment for a first-year Java programming course in university. The final product was quite complex, including a complete game flow encompassing chess playing, replay, save management, an AI chess player (completed by a classmate), and a GPU-rendered interface based on path tracing and PBR. In total, it contained nearly ten thousand lines of code, including Java and GLSL.
            </p>
            <p>
                The content is quite varied, and much of it has been forgotten, so I won't go into detail about these past things. Looking back now, it's very rough, but at the time, putting everything together without errors greatly improved my engineering skills.
            </p>
        </section>
    </div>
</template>
