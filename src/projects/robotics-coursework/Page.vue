<script setup>
import ee211Demo from './assets/ee211-demo.gif'
import ee346Demo from './assets/ee346-demo.gif'
import ee368Setup from './assets/ee368-setup.jpg'
import graspShot from './assets/grasp.png'
</script>

<template>
    <div class="project-article robotics-coursework-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> These three projects cover a coherent range: ROS mobile navigation with target stopping, ROS2 planning / control plus marker-based grasping, and camera-guided manipulator control for whiteboard following.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> ROS, AMCL, occupancy maps, lidar target detection, ROS2 Nav2, custom A* and DWA implementations, Aruco code perception, hand-eye coordination, RealSense, and PID visual servo.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Why keeping these together</h2>
            <p>
                These three projects are not difficult, but they are related and involve basic aspects of robotics experiments, such as familiarity with and use of Linux environment, ROS / ROS2 and common software packages.
            </p>
            <p>
                These courses cover both theory and experimentation, making them effective practical assignments.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Waypoint navigation and stopping near uncertain poles (EE346)</h2>
            <p>
                The Turtlebot3 project uses ROS as the communication framework, with the program running remotely and the robot executing speed commands. The task is to map and locate within a given scene, reaching four preset coordinate points in one go, while automatically detecting and stopping at three randomly placed polles for a certain period during the process.
            </p>
            <p>
                The final stopping logic uses lidar filtering and map-aware rejection of wall-adjacent returns so that poles are less likely to be confused with clutter. Once the target is detected reliably enough, the robot interrupts the current global goal, performs a local alignment / stopping maneuver, and then resumes the waypoint sequence.
            </p>
            <figure class="project-media project-media--small">
                <img :src="ee346Demo" alt="EE346 mobile robot navigation demo" />
                <figcaption>Waypoint navigation with interruption for target stopping.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>ROS2 navigation and marker-based grasping (EE211)</h2>
            <p>
                This project utilizes a Turtlebot4 chassis, a LiDAR system, and a 4-DOF robotic arm, with ROS and Nav2 as the software foundation. The mission is comprehensive, requiring the user to avoid obstacles and sequentially pass through three target points. During the process, the user must identify randomly placed objects (with an Aruco code) near the second target point, pick them up, and transfer them to the next target point to place them.
            </p>
            <p>
                Specifically, the navigation task required the manual implementation of path planning algorithms such as A*. The grasping task needed to consider how to ensure stable grasping of the object by a gripper that was only slightly larger than the object, avoiding errors. I ultimately used the method of adjusting the initial pose and pushing to ensure a high grasping success rate.
            </p>
            <p>
                There were many equipment problems during this process, and the final investigation revealed that the issues were related to the software interface and communication middleware, which were then resolved.
            </p>
            <div class="project-media-grid project-media-grid--two">
                <figure class="project-media project-media--portrait">
                    <img :src="ee211Demo" alt="EE211 ROS2 demo" />
                    <figcaption>The task extends navigation into marker-driven interaction around the target object.</figcaption>
                </figure>
                <figure class="project-media project-media--portrait">
                    <img :src="graspShot" alt="Grasping demo" />
                    <figcaption>Adjust the robotic arm pose according to the direction of the cube.</figcaption>
                </figure>
            </div>
        </section>

        <section class="project-article__section">
            <h2>Visual servo for whiteboard following (EE368)</h2>
            <p>
                This course primarily covers the theoretical aspects of robot kinematics and dynamics. The project requirements are not demanding; participants can simply use a robotic arm to complete any task. We envision a scenario where a robotic arm holds a pen and draws a specific pattern on a whiteboard covered with Aruco codes. The robotic arm must follow the movement of the whiteboard to maintain the drawing.
            </p>
            <p>
                The implementation is very simple. It consists of just a PID controller, along with some camera recognition and coordinate transformation.
            </p>
            <figure class="project-media project-media--small">
                <img :src="ee368Setup" alt="EE368 manipulator setup" />
                <figcaption>The visual-servo project uses RealSense.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Discussion</h2>
            <p>
                The main experience gained in these processes is engineering experience, such as environment configuration issues, protocol issues, and occasional hardware problems.
            </p>
        </section>
    </div>
</template>
