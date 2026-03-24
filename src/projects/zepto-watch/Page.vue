<script setup>
import ProjectCodeBlock from '../../components/ProjectCodeBlock.vue'
import boardLayout0 from './assets/pcb-main-0.png'
import boardLayout1 from './assets/pcb-main-1.png'
import runtimePhoto from './assets/runtime.jpg'
import prototyping from './assets/prototyping.jpg'
import gravityDemo from './assets/gravity.gif'
import result0 from './assets/res-0.jpg'
import result1 from './assets/res-1.jpg'
</script>

<template>
    <div class="project-article zepto-watch-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project implements a usable application runtime (based on an open-source Python interpreter <a href="https://github.com/pikasTech/pikaPython">PikaPython</a>) on a STM32 watch instead of a fixed-function firmware. Second, the resources on board are open to the runtime through custom drivers.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> STM32F405RGT6, FreeRTOS, LVGL, FatFs, board-level peripherals (touchscreen, battery management, microphone, buttons, IMU, vibration motor, bluetooth, USB 2.0, EEPROM, RTC), and PikaPython with custom libraries.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Hardware development</h2>
            <p>
                It begins with prototyping, where driver circuits are manually built on a breadboard to perform initial debugging and firmware writing for peripherals such as the touchscreen and IMU.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="prototyping" alt="Hardware platform during prototyping" />
                <figcaption>The hardware platform during prototyping.</figcaption>
            </figure>
            <p>
                After completing the verification and deciding which peripherals to use, I proceeded with component selection and PCB design. Since that was my first time designing an embedded system, I made many mistakes and iterated through three versions. The final design was a magnetically attached stacked board: the upper layer was the screen module, and the lower layer contained the controller and peripherals. The layout of the lower board is shown in the figure below.
            </p>
            <div class="project-media-grid project-media-grid--two">
                <figure class="project-media">
                    <img :src="boardLayout0" alt="Front view of the lower board layout design" />
                    <figcaption>A front view of the lower board layout design.</figcaption>
                </figure>
                <figure class="project-media">
                    <img :src="boardLayout1" alt="Reverse view of the lower board layout design" />
                    <figcaption>A reverse view of the lower board layout design.</figcaption>
                </figure>
            </div>
            <p>
                The PCB was fabricated using JLC, and after purchasing and assembling all the components, it was manually soldered and assembled. The result is shown in figures below.
            </p>
            <div class="project-media-grid project-media-grid--two">
                <figure class="project-media">
                    <img :src="result0" alt="Assembled lower board" />
                    <figcaption>The assembled lower board.</figcaption>
                </figure>
                <figure class="project-media">
                    <img :src="result1" alt="Assembled upper board" />
                    <figcaption>The assembled upper board.</figcaption>
                </figure>
            </div>
        </section>

        <section class="project-article__section">
            <h2>Runtime model</h2>
            <p>
                Because it integrates many peripheral modules, numerous functions can be implemented through software calls. However, as a so-called smart device, I didn't want its firmware to be hardcoded like other projects, requiring troublesome code updates.
            </p>
            <p>
                Finally, I considered building a runtime environment that could read user-provided applications. The simplest and most direct approach was to integrate a lightweight Python interpreter, encapsulating the hardware interfaces as packages, allowing users to write their own Python scripts to implement different functions.
            </p>
            <p>
                Thus, the following implementation was derived. The firmware is based on FreeRTOS and is used to manage the system UI, file system, and the built-in open-source Python interpreter PikaPython, which is responsible for executing scripts.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="runtimePhoto" alt="Testing script applications from onboard storage" />
                <figcaption>A prototype for the real-time system as a test for the runtime. Scripts are loaded as applications, not as hidden test code.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Embedded Python API</h2>
            <p>
                The API document is rough, but it is enough to reconstruct the intended software boundary. The standard library wrapper <code>ZeptoWatchStdLib</code> provides timing, display brightness, RTC access, etc. The peripheral wrapper <code>ZeptoWatchPeriphLib</code> exposes IMU, battery, microphone, and vibrator. On the GUI side, scripts
                work directly with wrapped LVGL types and callbacks.
            </p>
            <p>
                For example, you can call <code>ZeptoWatchStdLib.Display.setBrightness</code> to set the screen brightness, which controls the MOSFET on the LCD screen backlight constant current input by controlling the output PWM pulse width. A simple example of continuously adjusting the screen brightness and temperature measuring is shown below:
            </p>
            <ProjectCodeBlock
                lang="python"
                :code="String.raw`
                ###ICON=scripts;NAME=LightTest;COLOR=16751415###

                import ZeptoWatchStdLib as zws
                import ZeptoWatchPeriphLib as zwp

                zwp.IMU.initialize()

                i = 5
                j = 1
                while 1 == 1:
                    zws.Display.setBrightness(i)
                    if i >= 95:
                        j = -1
                    if i <= 5:
                        j = 1
                    i = i + j

                    k = zwp.IMU.getTemperature()
                    print(k)

                    zws.System.delayMs(3)

                ###END###
                `"
            />
            <p>
                You can connect the watch to the computer using Type-C connector and copy the script into the filesystem. The watch will detect the new script and recognize it as an application.
            </p>
        </section>

        <section class="project-article__section">
            <h2>The example scripts / applications</h2>
            <p>
                I put some example scripts in storage, which are used to test the operation of different peripherals and subsystems:
            </p>
            <ul class="bullet-list">
                <li>UI and callback handling in the calculator example.</li>
                <li>Microphone sampling and FFT-based spectrum display in the frequency example.</li>
                <li>RTC interaction and settings UI.</li>
                <li>Brightness, temperature, charging, and battery-related tests.</li>
                <li>IMU-based small physics sketches using acceleration input.</li>
                <li>Vibration and image-resource access in an electronic wooden fish demo.</li>
            </ul>
            <p>
                The frequency example covers functions such as microphone, computing acceleration library and UI drawing, which is relatively comprehensive; there is also a small demo that uses IMU to detect the direction of gravity, as shown in the figure below:
            </p>
            <figure class="project-media project-media--medium">
                <img :src="gravityDemo" alt="Demonstration of the IMU-based physics example" />
                <figcaption>The demonstration of the IMU-based physics example.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Conclusion</h2>
            <p>
                This was my first embedded design practice, so there are still many shortcomings. The PCB layout design has many problems, such as the poor placement of the Bluetooth module and the lack of any shielding; the battery and structural design also have many unreasonable aspects. However, the peripherals and firmware are very comprehensive, making it a good introductory exercise.
            </p>
        </section>
    </div>
</template>
