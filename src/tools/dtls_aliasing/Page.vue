<script setup>
import { computed, ref } from 'vue'
import LocalizedContent from '../../components/LocalizedContent.vue'
import ProjectTypst from '../../components/ProjectTypst.vue'
import { useI18n } from '../../i18n/useI18n'

const { locale } = useI18n()

const A = [
    [0, 1],
    [-1, 0],
]
const K = [-0.5, 0.5]
const x0 = [1, 0]

const h = ref(0.2)
const steps = ref(12)

const chartLabels = {
    continuousLegend: 'continuous x(t)',
    sampledLegend: 'sampled x[k]',
    timeAxis: 'time',
}

function matVec(matrix, vector) {
    return [
        matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
        matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
    ]
}

function add(left, right) {
    return [left[0] + right[0], left[1] + right[1]]
}

function scale(vector, factor) {
    return [vector[0] * factor, vector[1] * factor]
}

function expA(time) {
    const c = Math.cos(time)
    const s = Math.sin(time)
    return [
        [c, s],
        [-s, c],
    ]
}

function bd(time) {
    return [1 - Math.cos(time), Math.sin(time)]
}

function discretize(sampleTime) {
    const ad = expA(sampleTime)
    const bdVector = bd(sampleTime)

    return {
        ad,
        bdVector,
        phi: [
            [ad[0][0] - bdVector[0] * K[0], ad[0][1] - bdVector[0] * K[1]],
            [ad[1][0] - bdVector[1] * K[0], ad[1][1] - bdVector[1] * K[1]],
        ],
    }
}

function eig2x2(matrix) {
    const trace = matrix[0][0] + matrix[1][1]
    const determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    const discriminant = trace * trace - 4 * determinant

    if (discriminant >= 0) {
        const root = Math.sqrt(discriminant)
        return [
            { re: (trace + root) / 2, im: 0 },
            { re: (trace - root) / 2, im: 0 },
        ]
    }

    return [
        { re: trace / 2, im: Math.sqrt(-discriminant) / 2 },
        { re: trace / 2, im: -Math.sqrt(-discriminant) / 2 },
    ]
}

function absEig(eigenvalue) {
    return Math.hypot(eigenvalue.re, eigenvalue.im)
}

function spectralRadius(sampleTime) {
    return Math.max(...eig2x2(discretize(sampleTime).phi).map(absEig))
}

function simulate(sampleTime, stepCount) {
    const { ad, bdVector, phi } = discretize(sampleTime)
    let x = [...x0]
    const sampled = [{ t: 0, x1: x[0], x2: x[1] }]
    const continuous = []

    for (let k = 0; k < stepCount; k += 1) {
        const u = -(K[0] * x[0] + K[1] * x[1])

        for (let i = 0; i < 120; i += 1) {
            const tau = (sampleTime * i) / 120
            const xt = add(matVec(expA(tau), x), scale(bd(tau), u))
            continuous.push({ t: k * sampleTime + tau, x1: xt[0], x2: xt[1] })
        }

        x = add(matVec(ad, x), scale(bdVector, u))
        sampled.push({ t: (k + 1) * sampleTime, x1: x[0], x2: x[1] })
    }

    return { sampled, continuous, phi }
}

function fmtEig(eigenvalue) {
    const re = eigenvalue.re.toFixed(3)
    const im = Math.abs(eigenvalue.im).toFixed(3)

    if (Math.abs(eigenvalue.im) < 1e-9) {
        return re
    }

    return `${re}${eigenvalue.im >= 0 ? '+' : '-'}${im}j`
}

function makeScale(domainMin, domainMax, rangeMin, rangeMax) {
    const span = domainMax - domainMin || 1
    return (value) => rangeMin + ((value - domainMin) / span) * (rangeMax - rangeMin)
}

function linePath(data, xScale, yScale, xKey = 'x', yKey = 'y') {
    return data
        .map((point, index) => `${index === 0 ? 'M' : 'L'}${xScale(point[xKey]).toFixed(2)},${yScale(point[yKey]).toFixed(2)}`)
        .join(' ')
}

const rhoData = Array.from({ length: 500 }, (_, index) => {
    const sampleTime = 0.05 + (8 - 0.05) * (index / 499)
    return { x: sampleTime, y: spectralRadius(sampleTime) }
})

const sim = computed(() => simulate(h.value, steps.value))
const eigs = computed(() => eig2x2(sim.value.phi))
const rho = computed(() => Math.max(...eigs.value.map(absEig)))
const stable = computed(() => rho.value < 1)

const stabilityChart = computed(() => {
    const width = 880
    const height = 260
    const pad = { l: 56, r: 20, t: 20, b: 42 }
    const sx = makeScale(0.05, 8, pad.l, width - pad.r)
    const sy = makeScale(0, 2.4, height - pad.b, pad.t)
    const ticks = Array.from({ length: 5 }, (_, index) => 2.4 * index / 4)

    return {
        width,
        height,
        pad,
        ticks,
        sx,
        sy,
        path: linePath(rhoData, sx, sy),
    }
})

const waveChart = computed(() => {
    const width = 880
    const height = 300
    const pad = { l: 56, r: 20, t: 20, b: 42 }
    const values = [
        ...sim.value.continuous.map((point) => point.x1),
        ...sim.value.sampled.map((point) => point.x1),
    ]
    const xMin = 0
    const xMax = sim.value.sampled[sim.value.sampled.length - 1].t
    let yMin = Math.min(...values)
    let yMax = Math.max(...values)
    const margin = (yMax - yMin || 1) * 0.16
    yMin -= margin
    yMax += margin

    const sx = makeScale(xMin, xMax, pad.l, width - pad.r)
    const sy = makeScale(yMin, yMax, height - pad.b, pad.t)
    const ticks = Array.from({ length: 5 }, (_, index) => yMin + (yMax - yMin) * index / 4)

    return {
        width,
        height,
        pad,
        ticks,
        sx,
        sy,
        continuousPath: linePath(sim.value.continuous, sx, sy, 't', 'x1'),
        sampledPath: linePath(sim.value.sampled, sx, sy, 't', 'x1'),
    }
})
</script>

<template>
    <div class="aliasing-demo">
        <section class="aliasing-panel aliasing-panel--intro">
            <div class="aliasing-panel__header">
                <div>
                    <LocalizedContent tag="h2">
                        <template #en>Sampled-data system stability</template>
                        <template #zh>采样系统稳定性</template>
                    </LocalizedContent>
                    <div class="aliasing-formula-text">
                        <LocalizedContent tag="p">
                            <template #en>The plant is</template>
                            <template #zh>被控对象为</template>
                        </LocalizedContent>
                        <ProjectTypst :framed="false" size="13pt">
                            $
                            dot(x)(t) = A x(t) + B u(t), quad
                            A = mat(0, 1; -1, 0), quad
                            B = mat(0; 1)
                            $
                        </ProjectTypst>
                        <LocalizedContent tag="p">
                            <template #en>with state-feedback control law and zero-order hold</template>
                            <template #zh>反馈控制律与零阶保持为</template>
                        </LocalizedContent>
                        <ProjectTypst :framed="false" size="13pt">
                            $
                            u[k] = -K x(k h), quad
                            K = mat(-0.5, 0.5), quad
                            u(t) = u[k] " for " k h <= t < (k + 1) h
                            $
                        </ProjectTypst>
                    </div>
                </div>
                <p class="aliasing-status" :class="{ 'is-stable': stable, 'is-unstable': !stable }">
                    <LocalizedContent tag="span">
                        <template #en>Spectral radius</template>
                        <template #zh>谱半径</template>
                    </LocalizedContent>
                    &nbsp;= {{ rho.toFixed(4) }} ·&nbsp;
                    <LocalizedContent tag="span">
                        <template #en>{{ stable ? 'stable' : 'unstable' }}</template>
                        <template #zh>{{ stable ? '稳定' : '不稳定' }}</template>
                    </LocalizedContent>
                </p>
            </div>

            <div class="aliasing-controls">
                <label class="aliasing-control">
                    <LocalizedContent tag="span">
                        <template #en>Sampling interval h</template>
                        <template #zh>采样间隔 h</template>
                    </LocalizedContent>
                    <strong>{{ h.toFixed(2) }}</strong>
                    <input v-model.number="h" type="range" min="0.05" max="8" step="0.01" />
                </label>

                <label class="aliasing-control">
                    <LocalizedContent tag="span">
                        <template #en>Sampling steps</template>
                        <template #zh>采样步数</template>
                    </LocalizedContent>
                    <strong>{{ steps }}</strong>
                    <input v-model.number="steps" type="range" min="4" max="30" step="1" />
                </label>
            </div>

            <p class="aliasing-eigenvalues">
                <LocalizedContent tag="span">
                    <template #en>Discrete eigenvalues: </template>
                    <template #zh>离散特征值：</template>
                </LocalizedContent>
                <code>{{ fmtEig(eigs[0]) }}, {{ fmtEig(eigs[1]) }}</code>
            </p>
        </section>

        <div class="aliasing-chart-grid">
            <section class="aliasing-panel">
                <LocalizedContent tag="h3">
                    <template #en>Discrete closed-loop spectral radius</template>
                    <template #zh>离散闭环谱半径</template>
                </LocalizedContent>
                <svg :viewBox="`0 0 ${stabilityChart.width} ${stabilityChart.height}`" class="aliasing-chart">
                    <rect :width="stabilityChart.width" :height="stabilityChart.height" rx="8" class="aliasing-chart__bg" />
                    <g v-for="tick in stabilityChart.ticks" :key="tick">
                        <line
                            :x1="stabilityChart.pad.l"
                            :x2="stabilityChart.width - stabilityChart.pad.r"
                            :y1="stabilityChart.sy(tick)"
                            :y2="stabilityChart.sy(tick)"
                            class="aliasing-chart__grid"
                        />
                        <text :x="stabilityChart.pad.l - 10" :y="stabilityChart.sy(tick) + 4" text-anchor="end" class="aliasing-chart__tick">
                            {{ tick.toFixed(2) }}
                        </text>
                    </g>
                    <line :x1="stabilityChart.pad.l" :x2="stabilityChart.width - stabilityChart.pad.r" :y1="stabilityChart.height - stabilityChart.pad.b" :y2="stabilityChart.height - stabilityChart.pad.b" class="aliasing-chart__axis" />
                    <line :x1="stabilityChart.pad.l" :x2="stabilityChart.pad.l" :y1="stabilityChart.pad.t" :y2="stabilityChart.height - stabilityChart.pad.b" class="aliasing-chart__axis" />
                    <path :d="stabilityChart.path" class="aliasing-chart__line aliasing-chart__line--blue" />
                    <line :x1="stabilityChart.pad.l" :x2="stabilityChart.width - stabilityChart.pad.r" :y1="stabilityChart.sy(1)" :y2="stabilityChart.sy(1)" class="aliasing-chart__threshold" />
                    <line :x1="stabilityChart.sx(h)" :x2="stabilityChart.sx(h)" :y1="stabilityChart.pad.t" :y2="stabilityChart.height - stabilityChart.pad.b" class="aliasing-chart__marker-line" />
                    <circle :cx="stabilityChart.sx(h)" :cy="stabilityChart.sy(rho)" r="5" class="aliasing-chart__marker" />
                    <text :x="stabilityChart.sx(h) + 8" :y="stabilityChart.sy(rho) - 8" class="aliasing-chart__label">
                        h={{ h.toFixed(2) }}
                    </text>
                    <text :x="stabilityChart.width / 2" :y="stabilityChart.height - 8" text-anchor="middle" class="aliasing-chart__axis-label">h</text>
                    <text x="18" :y="stabilityChart.height / 2" text-anchor="middle" :transform="`rotate(-90, 18, ${stabilityChart.height / 2})`" class="aliasing-chart__axis-label">ρ(Φ(h))</text>
                </svg>
            </section>

            <section class="aliasing-panel">
                <LocalizedContent tag="h3">
                    <template #en>Continuous waveform vs sampled points</template>
                    <template #zh>连续波形与采样点</template>
                </LocalizedContent>
                <svg :viewBox="`0 0 ${waveChart.width} ${waveChart.height}`" class="aliasing-chart">
                    <rect :width="waveChart.width" :height="waveChart.height" rx="8" class="aliasing-chart__bg" />
                    <g v-for="tick in waveChart.ticks" :key="tick">
                        <line :x1="waveChart.pad.l" :x2="waveChart.width - waveChart.pad.r" :y1="waveChart.sy(tick)" :y2="waveChart.sy(tick)" class="aliasing-chart__grid" />
                        <text :x="waveChart.pad.l - 10" :y="waveChart.sy(tick) + 4" text-anchor="end" class="aliasing-chart__tick">
                            {{ tick.toFixed(2) }}
                        </text>
                    </g>
                    <line :x1="waveChart.pad.l" :x2="waveChart.width - waveChart.pad.r" :y1="waveChart.height - waveChart.pad.b" :y2="waveChart.height - waveChart.pad.b" class="aliasing-chart__axis" />
                    <line :x1="waveChart.pad.l" :x2="waveChart.pad.l" :y1="waveChart.pad.t" :y2="waveChart.height - waveChart.pad.b" class="aliasing-chart__axis" />
                    <path :d="waveChart.continuousPath" class="aliasing-chart__line aliasing-chart__line--blue" />
                    <path :d="waveChart.sampledPath" class="aliasing-chart__line aliasing-chart__line--orange" />
                    <circle
                        v-for="point in sim.sampled"
                        :key="point.t"
                        :cx="waveChart.sx(point.t)"
                        :cy="waveChart.sy(point.x1)"
                        r="4"
                        class="aliasing-chart__sample"
                    />
                    <text :x="waveChart.width / 2" :y="waveChart.height - 8" text-anchor="middle" class="aliasing-chart__axis-label">{{ chartLabels.timeAxis }}</text>
                    <text x="18" :y="waveChart.height / 2" text-anchor="middle" :transform="`rotate(-90, 18, ${waveChart.height / 2})`" class="aliasing-chart__axis-label">x</text>
                    <g :transform="`translate(${waveChart.width - 260}, 24)`" class="aliasing-chart__legend">
                        <line x1="0" y1="0" x2="28" y2="0" class="aliasing-chart__line aliasing-chart__line--blue" />
                        <text x="36" y="4">{{ chartLabels.continuousLegend }}</text>
                        <line x1="0" y1="22" x2="28" y2="22" class="aliasing-chart__line aliasing-chart__line--orange" />
                        <circle cx="14" cy="22" r="4" class="aliasing-chart__sample" />
                        <text x="36" y="26">{{ chartLabels.sampledLegend }}</text>
                    </g>
                </svg>
            </section>
        </div>

        <section class="aliasing-panel aliasing-notes">
            <LocalizedContent tag="p">
                <template #en>
                    When
                    <ProjectTypst inline size="11pt">$ rho(Phi(h)) < 1 $</ProjectTypst>,
                    the sampled sequence is stable. When
                    <ProjectTypst inline size="11pt">$ rho(Phi(h)) > 1 $</ProjectTypst>,
                    the sampled sequence diverges. Because the state transition contains periodic terms, the discrete poles wrap around as h changes, so the system can switch between stable and unstable intervals.
                </template>
                <template #zh>
                    当
                    <ProjectTypst inline size="11pt">$ rho(Phi(h)) < 1 $</ProjectTypst>
                    时，采样序列是稳定的；当
                    <ProjectTypst inline size="11pt">$ rho(Phi(h)) > 1 $</ProjectTypst>
                    时，采样序列会发散。由于状态转移矩阵中包含周期项，离散极点会随着 h 的变化绕行，因此系统会在稳定与不稳定区间之间切换。
                </template>
            </LocalizedContent>
            <LocalizedContent tag="p">
                <template #en>
                    A large sampling interval can still make the sampled points look tame while the continuous trajectory moves significantly between samples.
                </template>
                <template #zh>
                    在较大的采样间隔下，即使采样点看起来比较温和，连续轨迹也可能在两个采样点之间发生较大波动。
                </template>
            </LocalizedContent>
        </section>
    </div>
</template>
