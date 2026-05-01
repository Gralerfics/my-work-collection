<script setup>
import braiseReady from './assets/11dcca46cec61d4e3124f71c6b34b5ab.jpg'
import resultA from './assets/06f80d1d74547e9c2e32243f2bdf796c.jpg'
import resultB from './assets/1e2eb1868e14bd08e050d090dedacfcc.jpg'
import resultC from './assets/1ff989542d8147bd3e85f001d2a26e40.jpg'
import resultD from './assets/720b0f2a236c145413d8994cd1e95846.jpg'
import resultE from './assets/cf3bb298401b9a66dc5806d73bc721b1.jpg'
</script>

<template>
    <section class="editorial-section">
            <div class="section-label">
                <p class="eyebrow">Ingredients</p>
                <h2>食材</h2>
            </div>
            <div class="section-body section-body--boxed recipe-ingredients-panel">
                <ul class="list-clean bullet-list">
                    <li>白菜</li>
                    <li>鸡蛋</li>
                    <li>肉片、肉末或其他顺手的肉，基本什么都可以</li>
                    <li>盐、糖、蚝油和食用油等</li>
                </ul>
            </div>
    </section>

    <section class="editorial-section">
            <div class="section-label">
                <p class="eyebrow">Summary</p>
                <h2>概要</h2>
            </div>
            <div class="section-body project-article">
                <section class="project-article__section recipe-summary-panel">
                    <h3>简要步骤</h3>
                    <ol class="recipe-steps">
                        <li>煎几个荷包蛋。</li>
                        <li>肉切片或切条，随便腌制炒一下，调味不要太重，炒香后盛出备用。</li>
                        <li>白菜下锅大火炒出汁水，加盐、少量糖和蚝油调味；蒸鱼豉油什么的也行，整点鲜味。</li>
                        <li>加入炒好的肉，铺上荷包蛋，转中小火焖到白菜梗软硬合适，出锅。</li>
                    </ol>
                </section>
            </div>
    </section>

    <section class="editorial-section">
            <div class="section-label">
                <p class="eyebrow">Details</p>
                <h2>细节</h2>
            </div>
            <div class="section-body project-article">
                <section class="project-article__section">
                    <h2>备注</h2>
                    <ul class="recipe-tips">
                        <li>下饭菜考虑软烂入味不是脆爽，白菜要炒出水。</li>
                        <li>白菜梗切小一点、叶切大一点；焖的时候梗尽量铺在下面，方便受热也不容易糊锅底。</li>
                        <li>炒白菜、炒肉也可以加点蒜末什么的。</li>
                        <li>隔夜感觉更入味一点其实。</li>
                    </ul>
                </section>

                <section class="project-article__section">
                    <h2>效果</h2>
                    乱七八糟随便做了很多次，用什么肉的都有。
                    <div class="project-media-grid project-media-grid--three recipe-result-grid">
                        <figure class="project-media">
                            <img :src="resultA" alt="成品图一" />
                            <figcaption>成品记录一</figcaption>
                        </figure>
                        <figure class="project-media">
                            <img :src="resultB" alt="成品图二" />
                            <figcaption>成品记录二</figcaption>
                        </figure>
                        <figure class="project-media">
                            <img :src="resultC" alt="成品图三" />
                            <figcaption>成品记录三</figcaption>
                        </figure>
                        <figure class="project-media">
                            <img :src="resultD" alt="成品图四" />
                            <figcaption>成品记录四</figcaption>
                        </figure>
                        <figure class="project-media">
                            <img :src="resultE" alt="成品图五" />
                            <figcaption>成品记录五</figcaption>
                        </figure>
                    </div>
                </section>
            </div>
    </section>
</template>
