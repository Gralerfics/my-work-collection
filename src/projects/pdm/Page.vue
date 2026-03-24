<script setup>
import ProjectEquation from '../../components/ProjectEquation.vue'
import globalBenchmarkSummary from './assets/global-benchmark-summary.png'
import localBenchmarkSummary from './assets/local-benchmark-summary.png'
import mppiTrajectorySample from './assets/mppi-trajectory-sample.png'
</script>

<template>
    <div class="project-article pdm-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project builds a complete simulation pipeline for a non-holonomic mobile manipulator: global planning in clutter, predictive local control on the Ackermann base, and a door-opening stage that couples chassis motion and arm motion in a single optimization target.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> Python, PyBullet, custom RRT-family planners, MPC, MPPI, a kinematic Ackermann + Panda model, and a self-built evaluation pipeline for controller benchmarking and full-task demonstrations.
            </p>
        </section>

        <section class="project-article__section">
            <h2>System setup</h2>
            <p>
                The task itself is simple to describe: the robot starts in a cluttered indoor scene, navigates to a door, aligns the manipulator with the handle, and opens the door without breaking the non-holonomic constraint of the base. What made the project interesting was that the whole pipeline had to be built as one system rather than as disconnected demos.
            </p>
            <p>
                In the final setup, the global planner produced a collision-free reference path in the map, the local controller tracked that path under Ackermann kinematics, and a separate predictive controller was used when the task changed from navigation to manipulation. That separation let us benchmark the local planner properly, while still keeping a full demonstration that actually completed the task.
            </p>
            <p>
                My main part in the collaboration was the simulation environment, the MPC / MPPI implementation, the door-opening controller, and part of the experiments and report writing. That is also why the predictive-control sections below are written from the implementation side rather than as a high-level summary.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Global planning</h2>
            <p>
                The project uses a hierarchical structure, so the global planner is not responsible for exact tracking. Its role is to give the base a feasible route through the clutter and to hand a local reference segment to the controller. In the report and codebase, we benchmarked several RRT-family planners, including informed variants, but the important point here is the interface: the local controller always works on a short reference path instead of a single point target.
            </p>
            <p>
                That design made the local controller easier to tune. It also made failure modes much easier to read. If the robot drifted or oscillated, I could inspect whether the issue came from the short-horizon predictive model or from the reference path itself, instead of debugging the whole stack as one opaque planner.
            </p>
            <figure class="project-media project-media--large">
                <img :src="globalBenchmarkSummary" alt="Benchmark summary for the global planner and full pipeline" />
                <figcaption>
                    Benchmark summary used in the report to compare the planner choices inside the full pipeline.
                </figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Predictive local control</h2>
            <p>
                For navigation, I implemented both MPC and MPPI on the same Ackermann state model. The state is the base pose <code>[x, y, theta]</code>, and the control is <code>[v, delta]</code>. The discrete update in code is the usual bicycle model:
            </p>
            <ProjectEquation caption="Discrete Ackermann model used by both MPC and MPPI during path tracking.">
                <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
                    <mrow>
                        <msub><mi>x</mi><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow></msub>
                        <mo>=</mo>
                        <msub><mi>x</mi><mi>k</mi></msub>
                        <mo>+</mo>
                        <msub><mi>v</mi><mi>k</mi></msub>
                        <mi>cos</mi>
                        <mo>(</mo><msub><mi>theta</mi><mi>k</mi></msub><mo>)</mo>
                        <mi>dt</mi>
                    </mrow>
                    <mspace linebreak="newline" />
                    <mrow>
                        <msub><mi>y</mi><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow></msub>
                        <mo>=</mo>
                        <msub><mi>y</mi><mi>k</mi></msub>
                        <mo>+</mo>
                        <msub><mi>v</mi><mi>k</mi></msub>
                        <mi>sin</mi>
                        <mo>(</mo><msub><mi>theta</mi><mi>k</mi></msub><mo>)</mo>
                        <mi>dt</mi>
                    </mrow>
                    <mspace linebreak="newline" />
                    <mrow>
                        <msub><mi>theta</mi><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow></msub>
                        <mo>=</mo>
                        <msub><mi>theta</mi><mi>k</mi></msub>
                        <mo>+</mo>
                        <mfrac>
                            <msub><mi>v</mi><mi>k</mi></msub>
                            <mi>L</mi>
                        </mfrac>
                        <mi>tan</mi>
                        <mo>(</mo><msub><mi>delta</mi><mi>k</mi></msub><mo>)</mo>
                        <mi>dt</mi>
                    </mrow>
                </math>
            </ProjectEquation>
            <p>
                I kept the running cost aligned between the two controllers, so the comparison stayed meaningful. The local path-following cost in the implementation is built from the squared distance to the current path segment, a terminal penalty to the end of the local path, and a small control regularization term:
            </p>
            <ProjectEquation caption="Path-tracking objective implemented in BasePathFollowingRunningCost.">
                <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
                    <mrow>
                        <mi>J</mi>
                        <mo>=</mo>
                        <msub><mi>w</mi><mtext>path</mtext></msub>
                        <mo>&#x2062;</mo>
                        <msubsup><mo>&#x2225;</mo><mtext>proj</mtext><mn>2</mn></msubsup>
                        <mo>+</mo>
                        <msub><mi>w</mi><mtext>terminal</mtext></msub>
                        <mo>&#x2062;</mo>
                        <msubsup><mo>&#x2225;</mo><mtext>goal</mtext><mn>2</mn></msubsup>
                        <mo>+</mo>
                        <msub><mi>w</mi><mi>u</mi></msub>
                        <mo>&#x2062;</mo>
                        <msubsup><mo>&#x2225;</mo><mi>u</mi><mn>2</mn></msubsup>
                    </mrow>
                </math>
            </ProjectEquation>
            <p>
                On the MPPI side, I used the standard exponential weighting update. The sampled rollouts are evaluated under the same running cost, the minimum rollout cost is used as a baseline, and the control sequence is updated by the weighted average of rollout noise:
            </p>
            <ProjectEquation caption="Weighting and control update in the MPPI implementation.">
                <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
                    <mrow>
                        <mi>beta</mi><mo>=</mo><msub><mi>min</mi><mi>i</mi></msub><mo>(</mo><msub><mi>J</mi><mi>i</mi></msub><mo>)</mo>
                    </mrow>
                    <mspace linebreak="newline" />
                    <mrow>
                        <msub><mi>w</mi><mi>i</mi></msub>
                        <mo>=</mo>
                        <mfrac>
                            <mi>exp</mi>
                            <mo>(</mo>
                            <mo>-</mo>
                            <mfrac>
                                <mrow><msub><mi>J</mi><mi>i</mi></msub><mo>-</mo><mi>beta</mi></mrow>
                                <mi>lambda</mi>
                            </mfrac>
                            <mo>)</mo>
                            <mrow><mo>&#x2211;</mo><mi>exp</mi><mo>(</mo><mo>-</mo><mfrac><mrow><msub><mi>J</mi><mi>j</mi></msub><mo>-</mo><mi>beta</mi></mrow><mi>lambda</mi></mfrac><mo>)</mo></mrow>
                        </mfrac>
                    </mrow>
                    <mspace linebreak="newline" />
                    <mrow>
                        <mi mathvariant="bold">u</mi>
                        <mo>&larr;</mo>
                        <mi mathvariant="bold">u</mi>
                        <mo>+</mo>
                        <mrow>
                            <mo>&#x2211;</mo>
                            <msub><mi>w</mi><mi>i</mi></msub>
                            <msub><mi mathvariant="bold">epsilon</mi><mi>i</mi></msub>
                        </mrow>
                    </mrow>
                </math>
            </ProjectEquation>
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
            <figure class="project-media project-media--medium">
                <img :src="mppiTrajectorySample" alt="Sample MPPI trajectory from the benchmark data" />
                <figcaption>
                    A sample trajectory plot from the benchmark set. This is the kind of rollout behavior I used when checking whether a promising aggregate metric still looked reasonable in motion.
                </figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>Door opening</h2>
            <p>
                The door-opening stage is where the project stops being a plain navigation assignment. Once the base reaches the interaction area, the problem changes to whole-body predictive control: the arm has to reach the handle with the right orientation, while the base still has to move so that the arm does not over-stretch or enter an awkward configuration.
            </p>
            <p>
                In the implementation, I used an extended state that combines base pose and the seven Panda joints. The running cost penalizes end-effector position error, end-effector orientation error, a small input regularization term, and an additional internal XY penalty to keep the end effector from entering the chassis body region. The code reflects this structure directly rather than hiding it behind a generic controller abstraction.
            </p>
            <ProjectEquation caption="Whole-body objective implemented in EndEffectorPoseRunningCost for the door task.">
                <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
                    <mrow>
                        <mi>J</mi>
                        <mo>=</mo>
                        <msub><mi>w</mi><mtext>ee-pos</mtext></msub>
                        <mo>&#x2062;</mo>
                        <msubsup><mo>&#x2225;</mo><mrow><msub><mi>p</mi><mtext>ee</mtext></msub><mo>-</mo><msub><mi>p</mi><mtext>goal</mtext></msub></mrow><mn>2</mn></msubsup>
                        <mo>+</mo>
                        <msub><mi>w</mi><mtext>ee-ori</mtext></msub>
                        <mo>&#x2062;</mo>
                        <msubsup><mo>&#x2225;</mo><mrow><msub><mi>R</mi><mtext>err</mtext></msub></mrow><mn>2</mn></msubsup>
                    </mrow>
                    <mspace linebreak="newline" />
                    <mrow>
                        <mo>+</mo>
                        <msub><mi>w</mi><mtext>xy-int</mtext></msub>
                        <mo>&#x2062;</mo>
                        <msub><mi>c</mi><mtext>internal</mtext></msub>
                        <mo>+</mo>
                        <msub><mi>w</mi><mtext>terminal</mtext></msub>
                        <mo>&#x2062;</mo>
                        <msub><mi>c</mi><mtext>terminal</mtext></msub>
                        <mo>+</mo>
                        <msub><mi>w</mi><mi>u</mi></msub>
                        <mo>&#x2062;</mo>
                        <msubsup><mo>&#x2225;</mo><mi>u</mi><mn>2</mn></msubsup>
                    </mrow>
                </math>
            </ProjectEquation>
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
