<script setup>
import demoGif from './assets/demo.gif'
import devicesPic from './assets/devices.jpg'
import dashboardPic from './assets/dashboard.png'
</script>

<template>
    <div class="project-article iotagv-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project attempts to build a distributed inter-vehicle communication interface based on UWB communication and localization. Furthermore, to build a distributed multi-vehicle motion planning and avoidance system.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> UWB communication, localization, STM32, UART, potential field approach, Vue3-based web dashboard.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Demonstration</h2>
            <p>
                The demonstration and task design of this project are relatively simple, with the main work focusing on building a distributed communication module based on UWB.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="demoGif" alt="IoTAGV demonstration GIF" />
                <figcaption>A demonstration of three-vehicle motion planning and avoidance.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Distributed communication and localization</h2>
            <p>
                The communication module aims to cooperate with nearby base stations to achieve relative positioning and to receive or send information to nearby terminals, thereby realizing distributed communication functions. This includes issues such as handshake recognition, collision handling, and relaying to achieve ranging.
            </p>
            <p>
                Specifically, distance measuring is based on time-of-flying (ToF) double-sided two-way ranging (DS-TWR) method, localization is simple triangular localization.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="devicesPic" alt="IoTAGV hardware devices" />
                <figcaption>The hardware setup used in the project.</figcaption>
            </figure>
            <p>
                The vehicles are relatively complete omnidirectional bases, and we rewrote the controller code. Each communication module consists of an STM32 microcontroller and a UWB communication module.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Potential field approach</h2>
            <p>
                For local motion behavior, the project uses a potential field approach. That keeps the controller implementation compact and interpretable, while still being expressive enough for obstacle avoidance and goal-seeking behavior in demonstration scenarios.
            </p>
            <p>
                In this project, the value of the method is mainly engineering practicality: it is straightforward to tune, easy to visualize, and naturally fits a system that prioritizes real-time response and integrated demonstration.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Web dashboard</h2>
            <p>
                We implemented a web application to easily inspect system state, observe localization results, and real-time interaction.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="dashboardPic" alt="Web dashboard screenshot" />
                <figcaption>A screenshot of the remote control web application.</figcaption>
            </figure>
        </section>
    </div>
</template>
