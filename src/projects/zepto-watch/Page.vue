<script setup>
import LocalizedContent from '../../components/LocalizedContent.vue'
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
            <LocalizedContent tag="p" class="detail-text">
                <template #en>
                    <strong>Features.</strong> This project implements a usable application runtime (based on an open-source Python interpreter <a href="https://github.com/pikasTech/pikaPython">PikaPython</a>) on a STM32 watch instead of a fixed-function firmware. Second, the resources on board are open to the runtime through custom drivers.
                </template>
                <template #zh>
                    <strong>项目特性 -</strong> 该项目不是在一个普通的 STM32 手表上写一个固定功能的固件，而是实现了一个应用运行时，基于开源轻量级 Python 解释器 <a href="https://github.com/pikasTech/pikaPython">PikaPython</a>，同时板上的各类硬件资源也通过自定义驱动向其开放，使该系统可以运行用户传入的应用程序。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p" class="detail-text">
                <template #en>
                    <strong>Stack.</strong> STM32F405RGT6, FreeRTOS, LVGL, FatFs, board-level peripherals (touchscreen, battery management, microphone, buttons, IMU, vibration motor, bluetooth, USB 2.0, EEPROM, RTC), and PikaPython with custom libraries.
                </template>
                <template #zh>
                    <strong>相关技术 -</strong> STM32F405RGT6、FreeRTOS、LVGL、FatFs、板级外设（触摸屏、电池管理、麦克风、按键、IMU、振动马达、蓝牙、USB 2.0、EEPROM、RTC），以及配套自定义库的 PikaPython。
                </template>
            </LocalizedContent>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Hardware development</template>
                <template #zh>硬件开发</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    It begins with prototyping, where driver circuits are manually built on a breadboard to perform initial debugging and firmware writing for peripherals such as the touchscreen and IMU.
                </template>
                <template #zh>
                    最开始是原型验证阶段，先在面包板上手工搭建驱动电路，对触摸屏、IMU 等外设进行初步调试和驱动编写。
                </template>
            </LocalizedContent>
            <figure class="project-media project-media--medium">
                <img :src="prototyping" alt="Hardware platform during prototyping" />
                <LocalizedContent tag="figcaption">
                    <template #en>The hardware platform during prototyping.</template>
                    <template #zh>原型验证阶段的硬件平台。</template>
                </LocalizedContent>
            </figure>
            <LocalizedContent tag="p">
                <template #en>
                    After completing the verification and deciding which peripherals to use, I proceeded with component selection and PCB design. Since that was my first time designing an embedded system, I made many mistakes and iterated through three versions. The final design was a magnetically attached stacked board: the upper layer was the screen module, and the lower layer contained the controller and peripherals. The layout of the lower board is shown in the figure below.
                </template>
                <template #zh>
                    在完成验证和确定各组件的选型之后开始进行 PCB 设计。由于这是我第一次完整设计嵌入式系统，中间犯了不少错误，一共迭代了三个版本。最终方案采用磁吸叠板结构，上层是屏幕模组，下层集成控制器与各类外设。下图展示的是底层电路板的布局。
                </template>
            </LocalizedContent>
            <div class="project-media-grid project-media-grid--two">
                <figure class="project-media">
                    <img :src="boardLayout0" alt="Front view of the lower board layout design" />
                    <LocalizedContent tag="figcaption">
                        <template #en>A front view of the lower board layout design.</template>
                        <template #zh>底层电路板布局的正面视图。</template>
                    </LocalizedContent>
                </figure>
                <figure class="project-media">
                    <img :src="boardLayout1" alt="Reverse view of the lower board layout design" />
                    <LocalizedContent tag="figcaption">
                        <template #en>A reverse view of the lower board layout design.</template>
                        <template #zh>底层电路板布局的背面视图。</template>
                    </LocalizedContent>
                </figure>
            </div>
            <LocalizedContent tag="p">
                <template #en>
                    The PCB was fabricated using JLC, and after purchasing and assembling all the components, it was manually soldered and assembled. The result is shown in figures below.
                </template>
                <template #zh>
                    PCB 由嘉立创打板完成，之后采购器件并手工焊接、装配，成品如下图所示。
                </template>
            </LocalizedContent>
            <div class="project-media-grid project-media-grid--two">
                <figure class="project-media">
                    <img :src="result0" alt="Assembled lower board" />
                    <LocalizedContent tag="figcaption">
                        <template #en>The assembled lower board.</template>
                        <template #zh>完成装配后的下层主板。</template>
                    </LocalizedContent>
                </figure>
                <figure class="project-media">
                    <img :src="result1" alt="Assembled upper board" />
                    <LocalizedContent tag="figcaption">
                        <template #en>The assembled upper board.</template>
                        <template #zh>完成装配后的上层屏幕板。</template>
                    </LocalizedContent>
                </figure>
            </div>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Runtime model</template>
                <template #zh>应用程序运行时</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    Because it integrates many peripheral modules, numerous functions can be implemented through software calls. However, as a so-called smart device, I didn't want its firmware to be hardcoded like other projects, requiring troublesome code updates.
                </template>
                <template #zh>
                    由于这块板子集成了很多外设，理论上可以通过软件调用实现各种功能。所谓智能设备，我不希望它把功能全部硬编码在固件里，每次改动都得重新烧写。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    Finally, I considered building a runtime environment that could read user-provided applications. The simplest and most direct approach was to integrate a lightweight Python interpreter, encapsulating the hardware interfaces as packages, allowing users to write their own Python scripts to implement different functions.
                </template>
                <template #zh>
                    所以最后我决定做一个能够读取用户应用的运行时环境。最直接的方案，就是集成一个轻量级 Python 解释器，把硬件接口封装成库，让用户自己编写 Python 脚本来实现不同功能。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    Thus, the following implementation was derived. The firmware is based on FreeRTOS and is used to manage the system UI, file system, and the built-in open-source Python interpreter PikaPython, which is responsible for executing scripts.
                </template>
                <template #zh>
                    最终形成的方案是：固件基于 FreeRTOS，用来管理 UI、文件系统，以及内置的开源 Python 解释器 PikaPython，由它负责执行脚本应用。
                </template>
            </LocalizedContent>
            <figure class="project-media project-media--medium">
                <img :src="runtimePhoto" alt="Testing script applications from onboard storage" />
                <LocalizedContent tag="figcaption">
                    <template #en>
                        A prototype for the real-time system as a test for the runtime. Scripts are loaded as applications, not as hidden test code.
                    </template>
                    <template #zh>
                        一个用于验证运行时方案的实时系统原型，脚本是以 “应用” 的形式加载的。
                    </template>
                </LocalizedContent>
            </figure>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Embedded Python API</template>
                <template #zh>嵌入式 Python API</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    The API document is rough, but it is enough to reconstruct the intended software boundary. The standard library wrapper <code>ZeptoWatchStdLib</code> provides timing, display brightness, RTC access, etc. The peripheral wrapper <code>ZeptoWatchPeriphLib</code> exposes IMU, battery, microphone, and vibrator. On the GUI side, scripts work directly with wrapped LVGL types and callbacks.
                </template>
                <template #zh>
                    标准库封装 <code>ZeptoWatchStdLib</code> 提供计时、屏幕亮度、RTC 等功能；外设封装 <code>ZeptoWatchPeriphLib</code> 则暴露 IMU、电池、麦克风和振动器等接口。在 GUI 层，脚本可以直接使用封装后的 LVGL 类型和回调。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    For example, you can call <code>ZeptoWatchStdLib.Display.setBrightness</code> to set the screen brightness, which controls the MOSFET on the LCD screen backlight constant current input by controlling the output PWM pulse width. A simple example of continuously adjusting the screen brightness and temperature measuring is shown below:
                </template>
                <template #zh>
                    例如，可以调用 <code>ZeptoWatchStdLib.Display.setBrightness</code> 来设置屏幕亮度。它本质上是通过调节输出 PWM 脉宽，去控制 LCD 背光恒流输入端上的 MOSFET。下面给出一个简单示例，持续调节屏幕亮度并读取温度：
                </template>
            </LocalizedContent>
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
            <LocalizedContent tag="p">
                <template #en>
                    You can connect the watch to the computer using Type-C connector and copy the script into the filesystem. The watch will detect the new script and recognize it as an application.
                </template>
                <template #zh>
                    通过 Type-C 接口将手表连接到电脑后，就可以把脚本复制进文件系统。手表会自动检测到新脚本，并将其识别为一个应用。
                </template>
            </LocalizedContent>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>The example scripts / applications</template>
                <template #zh>示例脚本 / 应用</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    I put some example scripts in storage, which are used to test the operation of different peripherals and subsystems:
                </template>
                <template #zh>
                    我在存储中放了一些示例脚本，用来测试不同外设和子系统的工作情况：
                </template>
            </LocalizedContent>
            <ul class="bullet-list">
                <LocalizedContent tag="li">
                    <template #en>UI and callback handling in the calculator example.</template>
                    <template #zh>计算器示例，演示基于 lvgl 的 UI 显示和事件回调。</template>
                </LocalizedContent>
                <LocalizedContent tag="li">
                    <template #en>Microphone sampling and FFT-based spectrum display in the frequency example.</template>
                    <template #zh>频谱示例，演示麦克风采样和基于 FFT 的频谱显示。</template>
                </LocalizedContent>
                <LocalizedContent tag="li">
                    <template #en>RTC interaction and settings UI.</template>
                    <template #zh>RTC 示例以及对应的设置界面。</template>
                </LocalizedContent>
                <LocalizedContent tag="li">
                    <template #en>Brightness, temperature, charging, and battery-related tests.</template>
                    <template #zh>亮度、温度与电池相关测试。</template>
                </LocalizedContent>
                <LocalizedContent tag="li">
                    <template #en>IMU-based small physics sketches using acceleration input.</template>
                    <template #zh>基于 IMU 加速度信息的的小型物理效果示例。</template>
                </LocalizedContent>
                <LocalizedContent tag="li">
                    <template #en>Vibration and image-resource access in an electronic wooden fish demo.</template>
                    <template #zh>电子木鱼示例，演示振动马达和图像资源访问。</template>
                </LocalizedContent>
            </ul>
            <LocalizedContent tag="p">
                <template #en>
                    The frequency example covers functions such as microphone, computing acceleration library and UI drawing, which is relatively comprehensive; there is also a small demo that uses IMU to detect the direction of gravity, as shown in the figure below:
                </template>
                <template #zh>
                    其中，频谱示例涵盖了麦克风、计算加速库和 UI 绘制等功能，相对更完整；另一个使用 IMU 感知重力方向的小 demo 效果如下图所示：
                </template>
            </LocalizedContent>
            <figure class="project-media project-media--medium">
                <img :src="gravityDemo" alt="Demonstration of the IMU-based physics example" />
                <LocalizedContent tag="figcaption">
                    <template #en>The demonstration of the IMU-based physics example.</template>
                    <template #zh>基于 IMU 的物理效果示例演示。</template>
                </LocalizedContent>
            </figure>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Conclusion</template>
                <template #zh>总结</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    This was my first embedded design practice, so there are still many shortcomings. The PCB layout design has many problems, such as the poor placement of the Bluetooth module and the lack of any shielding; the battery and structural design also have many unreasonable aspects. However, the peripherals and firmware are very comprehensive, making it a good introductory exercise.
                </template>
                <template #zh>
                    这是我第一次完整做嵌入式系统设计，所以还有很多不成熟的地方。PCB 布局里存在不少问题，比如蓝牙模块位置不理想、几乎没有做屏蔽；电池和结构设计也有不少欠妥之处。不过从内容丰富程度来看它是一次很不错的入门实践。
                </template>
            </LocalizedContent>
        </section>
    </div>
</template>