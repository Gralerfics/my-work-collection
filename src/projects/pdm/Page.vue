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
            <ProjectTypst :framed="false" caption="Ackermann chassis kinematic model, where L is the wheelbase.">
                $
                vec(dot(x), dot(y), dot(theta)) = vec(v cos(theta), v sin(theta), v / L tan(delta))
                $
            </ProjectTypst>
            <p>
                For local path tracking, the report defines a shared finite-horizon objective and uses it as the common benchmark target for both MPC and MPPI. The cost includes path-tracking error, control effort, a soft collision penalty, and a terminal term:
            </p>
            <ProjectTypst :framed="false" caption="Path-tracking objective in the report.">
$ J = sum_(k=0)^(N-1) (w_p norm(p_k - p_k^*)^2 + w_u norm(u_k)^2 + w_c c(p_k)) + w_T norm(p_N - p_N^*)^2 $
            </ProjectTypst>
            <p>
                The benchmark metric reported later is the RMSE-ATE between the reference trajectory and the actual tracked trajectory. This is the quantity used in the report tables and scatter plot when comparing controller settings:
            </p>
            <ProjectTypst :framed="false" caption="RMSE-ATE definition used in the local-planner benchmark.">
$ "RMSE-ATE" = sqrt(1 / N sum_(k=1)^N norm(p_u(k delta) - p(k delta))_2^2) $
            </ProjectTypst>
            <p>
                The point of implementing both controllers was not to claim that one dominates the other everywhere. The benchmark instead made the trade-off visible. MPC gave cleaner tracking when the horizon was short and the environment was not too adversarial, but the solve time rose quickly with horizon length. MPPI was much cheaper per step and much easier to keep stable at high success rate once the horizon was long enough, but it was more sensitive to rollout count and produced rougher tracking in some settings.
            </p>
            <figure class="project-media project-media--large">
                <img :src="localBenchmarkSummary" alt="Benchmark summary comparing MPC and MPPI on local path tracking" />
                <figcaption>
                    Local-controller benchmark. MPC improves from 40% to 80% success as the horizon grows from 10 to 20, while MPPI reaches 90% success at horizon 20 with much lower per-step compute cost.
                </figcaption>
            </figure>
            <p>
                The benchmark values in <code>summary.csv</code> are the numbers I actually used when deciding which configuration to keep in the demonstrations. MPC with <code>H=20</code> reached <code>0.8</code> success rate, but the mean computation time was already around <code>127.5 ms</code>. MPPI with <code>H=20, K=200</code> reached <code>0.9</code> success at around <code>5.2 ms</code>, and even <code>K=900</code> stayed around <code>20.5 ms</code>. The tracking RMSE was not always better for MPPI, but the compute / robustness trade-off was much more attractive for the full task.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Door opening</h2>
            <p>
                The door-opening stage is where the project stops being a plain navigation assignment. Once the base reaches the interaction area, the problem changes to whole-body predictive control: the arm has to reach the handle with the right orientation, while the base still has to move so that the arm does not over-stretch or enter an awkward configuration.
            </p>
            <p>
                In the report, this stage is written as a unified predictive controller over the coupled chassis-arm state. The objective penalizes end-effector position error, end-effector orientation error through
                <ProjectTypst inline>$ "ToAngle"(R_"ee"^T R_"ee"^*) $</ProjectTypst>
                , control effort, and an additional XY penalty that discourages the end effector from entering the projected chassis footprint.
            </p>
            <ProjectTypst :framed="false" caption="Unified predictive-control objective for the door-opening task.">
$ J = sum_(k=0)^(N-1) (w_p norm(p_"ee" - p_"ee"^*)^2 + w_o "ToAngle"(R_"ee"^T R_"ee"^*)^2 + w_u norm(u_k)^2 + w_"xy" max(0, R^2 - norm(p_"ee,xy" - p_"xy")^2)) + w_T norm(p_N - p_N^*)^2 $
            </ProjectTypst>
            <p>
                This stage is also where the non-holonomic constraint actually matters. If the controller only solves the arm pose, it is easy to drive the manipulator into an unreachable or badly conditioned posture. The predictive formulation instead lets the chassis and arm compensate for each other over the horizon, which is why the full demonstration can keep the grasp and continue the opening motion instead of stopping at first contact.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Results and takeaways</h2>
            <p>
                What I like about this project is that the report figures are backed by code that can still be inspected end to end. The same repository contains the local-planner model, the MPPI implementation, the benchmark scripts, and the full demonstration scripts. That makes the result much more useful than a one-off course demo, because I can go back to any layer and see why a particular behavior happened.
            </p>
            <p>
                The final result is not a polished robotics framework, but it is a complete working stack: a simulation environment, hand-written planners, predictive controllers, benchmarks, and a door-opening demonstration that ties them together. For me, that combination of controller implementation, experiment design, and system integration was the main value of the project.
            </p>
        </section>
    </div>
</template>
