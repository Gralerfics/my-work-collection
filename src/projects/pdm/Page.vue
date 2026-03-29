<script setup>
import LocalizedContent from '../../components/LocalizedContent.vue'
import ProjectTypst from '../../components/ProjectTypst.vue'

import localBenchmarkSummary from './assets/local-benchmark-summary.png'
</script>

<template>
    <div class="project-article pdm-article">
        <section class="project-article__section">
            <LocalizedContent tag="p" class="detail-text">
                <template #en>
                    <strong>Features.</strong> This project conducts a simulation experiment pipeline for a non-holonomic mobile manipulator: global planning, local controlling (MPC and MPPI) on the Ackermann base, and a door-opening stage that couples chassis motion and arm motion in a single optimization target.
                </template>
                <template #zh>
                    <strong>项目特性 -</strong> 这个项目围绕一个非完整约束移动底盘机械臂搭建了一整套仿真实验流程，包括全局规划、Ackermann 底盘的局部控制器（MPC 与 MPPI），以及将底盘运动与机械臂运动放在同一优化目标中的全身控制器（用于开门任务）。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p" class="detail-text">
                <template #en>
                    <strong>Stack.</strong> Python, PyBullet, custom RRT-family planners, custom MPC and MPPI solver, kinematic modeling, and self-built evaluation pipelines for controller benchmarking and full-task demonstrations.
                </template>
                <template #zh>
                    <strong>相关技术 -</strong> Python、PyBullet、手动实现的 RRT 系列规划器、手动实现的 MPC 与 MPPI 求解器，以及用于控制器基准测试和完整任务演示的测试验证框架。
                </template>
            </LocalizedContent>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Overview</template>
                <template #zh>概述</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    This is a course project whose main goal is to practice and verify planning and control algorithms such as RRT and MPC by setting a self-defined task. Our task is for a non-holonomic mobile manipulator to navigate through an obstacle-filled room, with a door added along the way that requires turning a handle to open.
                </template>
                <template #zh>
                    这是一个课程项目，要求是通过一个自行设定的任务，练习并验证 RRT、MPC 等规划与控制算法。我们设定的任务是让一台非完整约束移动底盘机械臂（mobile manipulator）在充满障碍物的房间中完成导航，并通过旋转门把手将途中的一扇门打开。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    The key to the door-opening task is that we need to coordinate the control of the chassis and the robotic arm to ensure that the robot does not collide with itself during the opening process.
                </template>
                <template #zh>
                    开门任务的关键在于，需要协调底盘与机械臂的控制，使机器人在开门过程中在完成抓住把手开门操作的同时不会撞到自己的底盘。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    Specifically, we use the RRT series algorithms (RRT, RRT*, Informed-RRT*) to implement the global planner for planning navigation paths, and MPC / MPPI to implement the local controller for tracking paths, avoiding obstacles, and manipulating door handles. Then we conduct experiments and evaluate and compare the algorithm performance.
                </template>
                <template #zh>
                    具体一点，我们使用 RRT 系列算法（RRT、RRT*、Informed-RRT*）实现全局规划器，用于生成导航路径；使用 MPC / MPPI 实现局部控制器，用于路径跟踪、避障以及门把手操作。之后再通过实验对这些算法的表现进行评估和比较。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    This was a group project. I was mainly responsible for the simulation environment, the MPC / MPPI controllers, the door-opening part of the system, and part of the experiments, analysis, and report writing. The part of global planners is not my work, so I won't go into details.
                </template>
                <template #zh>
                    这是一个合作项目。我主要实现了仿真环境的搭建、MPC / MPPI 控制器、系统中的开门部分，以及部分实验、分析和报告的撰写。全局规划器并不是我负责的部分，所以不多赘述。
                </template>
            </LocalizedContent>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Local controllers for path tracking</template>
                <template #zh>用于路径跟踪的局部控制器</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    First, disregarding the door-opening task, the local controllers at this stage primarily control the chassis to track the path and avoid obstacles.
                </template>
                <template #zh>
                    先只考虑导航而不考虑开门任务。在这一阶段，局部控制器主要负责控制底盘完成路径跟踪与避障，机械臂收起来即可。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    I implemented both MPC and MPPI on the Ackermann model. The state is the base pose <code>[x, y, theta]</code>, and the control is <code>[v, delta]</code>. The chassis dynamics are written in continuous form as the bicycle model:
                </template>
                <template #zh>
                    我在 Ackermann 模型上分别实现了 MPC 和 MPPI 控制器。系统状态用底盘位姿 <code>[x, y, theta]</code> 描述，表示二维平面上的位置和朝向；控制量为 <code>[v, delta]</code>，分别是后轮速度和转向角。底盘的连续时间动力学可以用自行车模型近似如下：
                </template>
            </LocalizedContent>
            <ProjectTypst :framed="false" caption="L is the wheelbase.">
                $
                vec(dot(x), dot(y), dot(theta)) = vec(v cos(theta), v sin(theta), v / L tan(delta))
                $
            </ProjectTypst>
            <LocalizedContent tag="p">
                <template #en>
                    For local path tracking, I defined a shared objective function and uses it in both MPC and MPPI. The cost includes path-tracking error, control effort, a soft collision penalty, and a terminal term:
                </template>
                <template #zh>
                    在局部路径跟踪中，我定义了一个由 MPC 和 MPPI 共享的目标函数，包括路径跟踪误差、控制代价、软碰撞惩罚以及终端项：
                </template>
            </LocalizedContent>
            <ProjectTypst :framed="false">
                $
                J = sum_(k=0)^(N-1) (w_p norm(p_k - p_k^*)^2 + w_u norm(u_k)^2 + w_c c(p_k)) + w_T norm(p_N - p_N^*)^2
                $
            </ProjectTypst>
            <LocalizedContent tag="p">
                <template #en>
                    The benchmark metric is the RMSE-ATE between the reference trajectory and the actual tracked trajectory:
                </template>
                <template #zh>
                    我们使用参考轨迹与实际跟踪轨迹之间的 RMSE-ATE 作为评价指标：
                </template>
            </LocalizedContent>
            <ProjectTypst :framed="false">
                $
                "RMSE-ATE" = sqrt(1 / N sum_(k=1)^N norm(p_u(k delta) - p(k delta))_2^2)
                $
            </ProjectTypst>
            <LocalizedContent tag="p">
                <template #en>
                    Experiments were conducted to compare the performance of MPC and MPPI on random path tracing tasks under different parameter configurations. The results are shown in the figure below:
                </template>
                <template #zh>
                    我们在不同参数配置下进行了随机路径跟踪实验，以比较 MPC 与 MPPI 的性能。结果如下图所示：
                </template>
            </LocalizedContent>
            <figure class="project-media project-media--medium">
                <img :src="localBenchmarkSummary" alt="Benchmark summary comparing MPC and MPPI on local path tracking" />
                <LocalizedContent tag="figcaption">
                    <template #en>
                        Local controller benchmark for path tracking (10 random paths) using MPC and MPPI with different parameters (12 configurations). MPC improves from 40% to 80% success as the horizon grows from 10 to 20, while MPPI reaches 90% success at horizon 20 with much lower per-step compute cost.
                    </template>
                    <template #zh>
                        局部路径跟踪控制器的基准测试结果。实验使用 MPC 与 MPPI 在不同参数下的 12 组配置，对 10 条随机路径进行测试。随着预测时域（horizon）从 10 增加到 20，MPC 的成功率从 40% 提升到 80%；而 MPPI 在预测时域为 20 时可以达到 90% 的成功率，同时计算开销明显更低。
                    </template>
                </LocalizedContent>
            </figure>
            <LocalizedContent tag="p">
                <template #en>
                    MPC gave cleaner tracking when the horizon was short and the environment was not too adversarial, but the solve time rose quickly with horizon length. MPPI was much cheaper per step and much easier to keep stable at high success rate once the horizon was long enough, but it was more sensitive to rollout count and produced rougher tracking in some settings.
                </template>
                <template #zh>
                    当预测时域较短、环境也不算太困难时，MPC 往往能给出更平滑的跟踪结果；但随着时域增长，其求解时间也会迅速上升。MPPI 的单步计算成本要低得多，在预测时域足够长时也更容易维持较高成功率，不过它对预测路径样本（rollout）数量更敏感，而且在某些设置下轨迹会更粗糙一些。
                </template>
            </LocalizedContent>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Door opening</template>
                <template #zh>开门任务</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    The door-opening stage is where the project stops being a plain navigation assignment. Once the chassis reaches the interaction area, the problem changes to whole-body predictive control: the arm has to reach the handle with the right orientation, while the chassis still has to move so that the arm does not over-stretch or enter an awkward configuration.
                </template>
                <template #zh>
                    对于路径上的门，我通过在 URDF 中添加隐藏的碰撞箱，令其需要拧动门把手之后才能打开。一旦底盘到达交互区域，问题就转变成了全身预测控制：机械臂需要以合适的姿态接触门把手，同时底盘也必须配合运动，避免机械臂过度伸展或进入错误构型。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    A unified predictive controller over the coupled chassis-arm state is developed for this task, still using MPC and MPPI. The objective penalizes end-effector position error, end-effector orientation error, control effort, and an additional XY penalty that discourages the end effector from entering the projected chassis footprint.
                </template>
                <template #zh>
                    为此我针对底盘与机械臂的耦合状态建立了统一的预测控制器，依然采用 MPC 与 MPPI。其目标函数会惩罚末端执行器的位置误差、姿态误差、控制代价，以及一个额外的 XY 惩罚项，用来避免末端进入底盘投影区域。这么做的道理是机械臂的末端执行器握住门把手时，其位置接近门的边缘，通过阻止它的投影进入底盘范围可以有效阻止门碰到底盘。
                </template>
            </LocalizedContent>
            <ProjectTypst :framed="false">
                $
                J = sum_(k=0)^(N-1) (w_p norm(p_"ee" - p_"ee"^*)^2 + w_o "ToAngle"(R_"ee"^T R_"ee"^*)^2 + w_u norm(u_k)^2 + w_"xy" max(0, R^2 - norm(p_"ee,xy" - p_"xy")^2)) + w_T norm(p_N - p_N^*)^2
                $
            </ProjectTypst>
            <LocalizedContent tag="p">
                <template #en>
                    Finally, MPC was employed and the result is shown in the cover GIF.
                </template>
                <template #zh>
                    最终我们采用了 MPC 控制器，它比 MPPI 运动轨迹更稳定，效果见封面 GIF。
                </template>
            </LocalizedContent>
        </section>

        <section class="project-article__section">
            <LocalizedContent tag="h2">
                <template #en>Conclusion</template>
                <template #zh>总结</template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    This project is of great significance for consolidating the theoretical knowledge learned, such as controllers like MPC. Only after actually implementing them can one discover many intricacies in the details and the importance of the parameters, thus providing better guidance for balancing computational load and performance.
                </template>
                <template #zh>
                    这个项目对巩固 MPC 原理等理论知识很有帮助。很多细节问题以及参数选择的重要性，只有真正自己实现一遍之后才会体会得更清楚，也更能理解如何在计算开销和控制性能之间做权衡。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    Another point is that we once again thoroughly reviewed all the operations involved in robot simulation tasks from a code practice perspective. The basic environment used in this project is <code>maxspahn/gym_envs_urdf</code>. We had some bugs fixed, and then submitted two pull requests. The system integration was the main value of the project.
                </template>
                <template #zh>
                    另外，从代码实践的角度，这个项目也让我们把机器人仿真任务中涉及的一整套流程重新完整走了一遍。项目使用的基础环境是 <code>maxspahn/gym_envs_urdf</code>，我们在过程中修复了一些 bug，并提交了两个 pull request。
                </template>
            </LocalizedContent>
        </section>
    </div>
</template>