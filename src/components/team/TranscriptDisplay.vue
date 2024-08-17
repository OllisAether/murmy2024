<template>
  <HoldIndicator class="transcript-display__hold-indicator">
    <div class="transcript-display">
      <TranscriptLine
        v-for="(l, i) in lines"
        :key="i"
        :line="l.line"
        :secondLine="l.secondLine"
        :transcript="transcript"
      />
    </div>
  </HoldIndicator>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Transcript, TranscriptLine as TranscriptLineType } from '../../../shared/transcript';
import HoldIndicator from './HoldIndicator.vue';
import TranscriptLine from './TranscriptLine.vue';

const props = defineProps<{
  transcript: Transcript
}>()

const lines = computed(() => {
  const lines: {
    line: TranscriptLineType,
    secondLine?: TranscriptLineType
  }[] = [];

  for (let i = 0; i < props.transcript.content.length; i++) {
    const line = props.transcript.content[i]

    let secondLine = false
    let next = props.transcript.content[i + 1] as TranscriptLineType | undefined

    if (next && typeof next[0] !== 'string') {
      if (next[0]?.withLastSpeaker) {
        secondLine = true
        i++
      }
    }

    lines.push({
      line,
      secondLine: secondLine ? next : undefined
    })
  }

  return lines
})
</script>

<style scoped lang="scss">
.transcript-display {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  mask-image: linear-gradient(transparent, black 2rem, black calc(100% - 2rem), transparent);

  padding: 2rem 0;

  &__hold-indicator {
    height: 100%;
    width: 100%;
  }
}
</style>