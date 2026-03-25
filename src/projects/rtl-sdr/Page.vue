<script setup>
import sdrSharp from './assets/sdrsharp.png'
import schematicV2 from './assets/schematic-v2.png'
import pcbV2 from './assets/pcb-v2.png'
</script>

<template>
    <div class="project-article rtl-sdr-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project is a RTL-SDR receiver board built around the classical <code>RTL2832U + R820T2</code> architecture, with board-level design, bring-up, FM reception validation, and a parallel write-up on the corresponding driver and host-side software path.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> RTL2832U, R820T2 tuner, RF front-end and power design, PCB iteration, Osmocom tools, SDRSharp / other host software, and practical debugging around USB, tuning, and receiver bring-up.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Background</h2>
            <p>
                Originally, the RTL-SDR was a mass-produced DVB-T TV stick (digital high-definition television signal demodulator), in which the RTL2832U chip was used to receive and demodulate DVB-T digital signals. After Antti Palosaari discovered that the TV stick could be used to receive raw data from FM radio signals, various parties (including Eric Fry, who developed the RTL2832U Linux driver) studied the RTL2832U chip and discovered that it allowed entering a "test mode" by setting it up, skipping the DVB-T demodulation process and directly transmitting sampled raw I/Q data to the USB interface. Ultimately, Osmocom engineers (mainly Steve Markgraf) finally implemented the RTL-SDR driver.
            </p>
            <p>
                Therefore, this is actually a readily available hardware device that can be widely purchased. This project is simply to collect information and then try to design a PCB using the same chip to verify its functionality, while also learning some communication knowledge.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Hardware</h2>
            <p>
                Referring to the original RTL-SDR schematic, my design schematic is shown in the figure below.
            </p>
            <figure class="project-media project-media--large">
                <img :src="schematicV2" alt="Schematic version 2" />
                <figcaption>The version 2 schematic.</figcaption>
            </figure>
            <p>
                In addition, there were some adjustments made to the PCB design to improve signal quality, but at the time there was no rigorous verification of whether there was any improvement.
            </p>
            <figure class="project-media project-media--large">
                <img :src="pcbV2" alt="PCB layout version 2" />
                <figcaption>The PCB layout.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Validation</h2>
            <p>
                After the hardware is soldered and assembled, the USB driver can be installed directly, and the SDRSharp software can be used for control. The image below shows the result of adjusting the tuner frequency to receive local FM radio broadcasts.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="sdrSharp" alt="Receiving an FM radio signal with SDRSharp" />
                <figcaption>A demonstration to receive an FM radio signal using SDRSharp.</figcaption>
            </figure>
        </section>
    </div>
</template>
