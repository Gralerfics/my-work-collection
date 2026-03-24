<script setup>
import ProjectTypst from '../../components/ProjectTypst.vue'

import localBenchmarkSummary from './assets/local-benchmark-summary.png'
</script>

<template>
    <div class="project-article pdm-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project conducts a simulation experiment pipeline for a non-holonomic mobile manipulator: global planning, local controlling (MPC and MPPI) on the Ackermann base, and a door-opening stage that couples chassis motion and arm motion in a single optimization target.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> Python, PyBullet, custom RRT-family planners, custom MPC and MPPI solver, kinematic modeling, and self-built evaluation pipelines for controller benchmarking and full-task demonstrations.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Overview</h2>
            <p>
                This is a course project whose main goal is to practice and verify planning and control algorithms such as RRT and MPC by setting a self-defined task. Our task is for a non-holonomic mobile manipulator to navigate through an obstacle-filled room, with a door added along the way that requires turning a handle to open.
            </p>
            <p>
                The key to the door-opening task is that we need to coordinate the control of the chassis and the robotic arm to ensure that the robot does not collide with itself during the opening process.
            </p>
            <p>
                Specifically, we use the RRT series algorithms (RRT, RRT*, Informed-RRT*) to implement the global planner for planning navigation paths, and MPC / MPPI to implement the local controller for tracking paths, avoiding obstacles, and manipulating door handles. Then we conduct experiments and evaluate and compare the algorithm performance.
            </p>
            <p>
                This was a group project. I was mainly responsible for the simulation environment, the MPC / MPPI controllers, the door-opening part of the system, and part of the experiments, analysis, and report writing. The part of global planners is not my work, so I won't go into details.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Local controllers for path tracking</h2>
            <p>
                First, disregarding the door-opening task, the local controllers at this stage primarily control the chassis to track the path and avoid obstacles.
            </p>
            <p>
                I implemented both MPC and MPPI on the Ackermann model. The state is the base pose <code>[x, y, theta]</code>, and the control is <code>[v, delta]</code>. The chassis dynamics are written in continuous form as the bicycle model:
            </p>
            <ProjectTypst :framed="false" caption="L is the wheelbase.">
                $
                vec(dot(x), dot(y), dot(theta)) = vec(v cos(theta), v sin(theta), v / L tan(delta))
                $
            </ProjectTypst>
            <p>
                For local path tracking, I defined a shared objective function and uses it in both MPC and MPPI. The cost includes path-tracking error, control effort, a soft collision penalty, and a terminal term:
            </p>
            <ProjectTypst :framed="false">
                $
                J = sum_(k=0)^(N-1) (w_p norm(p_k - p_k^*)^2 + w_u norm(u_k)^2 + w_c c(p_k)) + w_T norm(p_N - p_N^*)^2
                $
            </ProjectTypst>
            <p>
                The benchmark metric is the RMSE-ATE between the reference trajectory and the actual tracked trajectory:
            </p>
            <ProjectTypst :framed="false">
                $
                "RMSE-ATE" = sqrt(1 / N sum_(k=1)^N norm(p_u(k delta) - p(k delta))_2^2)
                $
            </ProjectTypst>
            <p>
                Experiments were conducted to compare the performance of MPC and MPPI on random path tracing tasks under different parameter configurations. The results are shown in the figure below:
            </p>
            <figure class="project-media project-media--medium">
                <img :src="localBenchmarkSummary" alt="Benchmark summary comparing MPC and MPPI on local path tracking" />
                <figcaption>
                    Local controller benchmark for path tracking (10 random paths) using MPC and MPPI with different parameters (12 configurations). MPC improves from 40% to 80% success as the horizon grows from 10 to 20, while MPPI reaches 90% success at horizon 20 with much lower per-step compute cost.
                </figcaption>
            </figure>
            <p>
                MPC gave cleaner tracking when the horizon was short and the environment was not too adversarial, but the solve time rose quickly with horizon length. MPPI was much cheaper per step and much easier to keep stable at high success rate once the horizon was long enough, but it was more sensitive to rollout count and produced rougher tracking in some settings.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Door opening</h2>
            <p>
                The door-opening stage is where the project stops being a plain navigation assignment. Once the chassis reaches the interaction area, the problem changes to whole-body predictive control: the arm has to reach the handle with the right orientation, while the chassis still has to move so that the arm does not over-stretch or enter an awkward configuration.
            </p>
            <p>
                A unified predictive controller over the coupled chassis-arm state is developed for this task, still using MPC and MPPI. The objective penalizes end-effector position error, end-effector orientation error, control effort, and an additional XY penalty that discourages the end effector from entering the projected chassis footprint.
            </p>
            <ProjectTypst :framed="false">
                $
                J = sum_(k=0)^(N-1) (w_p norm(p_"ee" - p_"ee"^*)^2 + w_o "ToAngle"(R_"ee"^T R_"ee"^*)^2 + w_u norm(u_k)^2 + w_"xy" max(0, R^2 - norm(p_"ee,xy" - p_"xy")^2)) + w_T norm(p_N - p_N^*)^2
                $
            </ProjectTypst>
            <p>
                Finally, MPC was employed and the result is shown in the cover GIF.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Conclusion</h2>
            <p>
                This project is of great significance for consolidating the theoretical knowledge learned, such as controllers like MPC. Only after actually implementing them can one discover many intricacies in the details and the importance of the parameters, thus providing better guidance for balancing computational load and performance.
            </p>
            <p>
                Another point is that we once again thoroughly reviewed all the operations involved in robot simulation tasks from a code practice perspective. The basic environment used in this project is <code>maxspahn/gym_envs_urdf</code>. We had some bugs fixed, and then submitted two pull requests. The system integration was the main value of the project.
            </p>
        </section>
    </div>
</template>
