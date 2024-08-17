<template>
  <template v-if="typeof textContent === 'string'">{{ textContent }}</template>
  <template v-else>
    <template v-if="textContent.style || textContent.css">
      <span
        :class="[
          'text-content-renderer',
          textContent.style?.map(style => `text-content-renderer--${style}`)
        ]"
        :style="textContent.css"
        ref="root"
      >
        <Collectable v-if="textContent.entry" :entry="textContent.entry" inline>
          <TextContentRenderer
            v-for="(content, i) in textContent.content"
            :key="i"
            :textContent="content"
          />
        </Collectable>
        <template v-else>
          <TextContentRenderer
            v-for="(content, i) in textContent.content"
            :key="i"
            :textContent="content"
          />
        </template>
      </span>
    </template>
    <template v-else>
      <Collectable v-if="textContent.entry" :entry="textContent.entry">
        <TextContentRenderer
          v-for="(content, i) in textContent.content"
          :key="i"
          :textContent="content"
          inline
        />
      </Collectable>
      <template v-else>
        <TextContentRenderer
          v-for="(content, i) in textContent.content"
          :key="i"
          :textContent="content"
        />
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { TextContent, TextStyle } from '@/../shared/textContent';
import Collectable from './Collectable.vue';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  textContent: TextContent | string
}>();

const root = ref<HTMLSpanElement | null>(null);

const letterStyles: TextStyle[] = ['wiggly', 'shaky']

onMounted(() => {
  if (!root.value) return

  if (typeof props.textContent !== 'string' && props.textContent.style?.some(style => letterStyles.includes(style))) {
    const letterSpans = splitLettersIntoSpan(root.value)
    
    const letterStyleCount = props.textContent.style?.filter(style => letterStyles.includes(style)).length
    let letterStyle: TextStyle | undefined = undefined

    if (letterStyleCount > 1) {
      console.warn('Only one letter style can be applied at a time. Ignoring all but the first one.')
    }

    letterStyle = props.textContent.style?.find(style => letterStyles.includes(style))

    const widths = letterSpans.map(span => span.offsetWidth)
    const totalWidth = widths.reduce((acc, width) => acc + width, 0)

    letterSpans.forEach((span, i) => {
      span.classList.add(`text-content-renderer--${letterStyle}`)

      if (letterStyle === 'wiggly') {
        const widthToHere = widths.slice(0, i).reduce((acc, width) => acc + width, 0)
        console.log(widthToHere)
        span.style.animationDelay = `${(totalWidth - widthToHere) / -50}s`
      } else if (letterStyle === 'shaky') {
        const strengthX = 1
        const strengthY = 2

        const randomKeyframes = Array(99)
          .fill(0)
          .map(() => ({ transform: `translate(${Math.random() * strengthX}px, ${Math.random() * strengthY}px)` }))

        span.animate([
          ...randomKeyframes,
          randomKeyframes[0]
        ], {
          duration: 10000,
          easing: 'linear',
          iterations: Infinity
        })
      }
    })
  }
})

function splitLettersIntoSpan(el: HTMLElement) {
  let spans: HTMLSpanElement[] = []

  const nodes = Array.from(el.childNodes)
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      let s: HTMLSpanElement[] = []
      const text = node.textContent

      text?.split(' ').forEach((word, i, self) => {
        const wordSpan = document.createElement('span')
        wordSpan.style.whiteSpace = 'nowrap'
        s.push(wordSpan)

        ;(self.length - 1 === i ? word : word + '\u00A0').split('').forEach((letter) => {
          const letterSpan = document.createElement('span')
          letterSpan.textContent = letter
          wordSpan.appendChild(letterSpan)
          spans.push(letterSpan)
        })
      })

      s.forEach((span) => {
        el.insertBefore(span, node)
      })

      el.removeChild(node)
    } else {
      spans.push(...splitLettersIntoSpan(node as HTMLElement))
    }
  })

  return spans
}
</script>

<style scoped lang="scss">
.text-content-renderer {
  display: inline;
  white-space: pre-wrap;

  &--bold {
    font-weight: bold;
  }

  &--italic {
    font-style: italic;
  }

  &--underline {
    text-decoration: underline;
  }

  &--strikethrough {
    text-decoration: line-through;
  }

  &--superscript {
    vertical-align: super;
    font-size: .66em;
  }

  &--subscript {
    vertical-align: sub;
    font-size: .66em;
  }

  :deep(.text-content-renderer--wiggly) {
    display: inline-block;
    animation: wiggly 1.5s infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);

    @keyframes wiggly {
      0% {
        transform: translateY(.1rem);
      }
      50% {
        transform: translateY(-.1rem);
      }
      100% {
        transform: translateY(.1rem);
      }
    }
  }

  :deep(.text-content-renderer--shaky) {
    display: inline-block;
  }
}
</style>