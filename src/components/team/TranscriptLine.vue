<template>
  <div
    :class="['transcript-line', {
      'transcript-line--directive': !secondLine && !speaker,
      'transcript-line--speaker': speaker,
      'transcript-line--right': !secondLine && speaker?.alignment === 'right',
      'transcript-line--second': secondLine,
    }]"
  >
    <div
      class="transcript-line__line"
      :style="{
        '--speaker-color': Color(speaker?.color ?? '#fff').string(),
        '--speaker-color-gradient-1': Color(speaker?.color ?? '#fff').hue(-20).saturate(1).alpha(0.05).string(),
        '--speaker-color-gradient-2': Color(speaker?.color ?? '#fff').alpha(.1).string(),
      }"
    >
      <template v-if="speaker">
        <div :class="['transcript-line__avatar', {
          'transcript-line__avatar--flip': speaker.flipAvatar
        }]">
          <img v-if="avatar" :src="avatar" />
          <VIcon v-else>mdi-account</VIcon>
        </div>
        <div class="transcript-line__speaker">
          {{ speaker.name }}
        </div>
      </template>
      <div class="transcript-line__text">
        <TextContentRenderer :textContent="line[1]" />
      </div>
    </div>
    <!-- <div
      v-if="secondLine"
      class="transcript-line__second-indicator"
    >
      gleichzeitig
    </div> -->
    <div
      v-if="secondLine"
      class="transcript-line__line transcript-line__line--second"
      :style="{
        '--speaker-color': Color(speaker2?.color ?? '#fff').string(),
        '--speaker-color-gradient-1': Color(speaker2?.color ?? '#fff').hue(-20).saturate(1).alpha(0.05).string(),
        '--speaker-color-gradient-2': Color(speaker2?.color ?? '#fff').alpha(.1).string(),
      }"
    >
      <template v-if="speaker2">
        <div :class="['transcript-line__avatar', {
          'transcript-line__avatar--flip': speaker2.flipAvatar
        }]">
          <img v-if="avatar2" :src="avatar2" />
          <VIcon v-else>mdi-account</VIcon>
        </div>
        <div class="transcript-line__speaker">
          {{ speaker2.name }}
        </div>
      </template>
      <div class="transcript-line__text">
        <TextContentRenderer :textContent="secondLine[1]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { Transcript, TranscriptLine, TranscriptSpeakerBase } from '../../shared/transcript';
import { computed } from 'vue';
import Color from 'color';
import TextContentRenderer from '../TextContentRenderer.vue';

const game = useGameManager();

const props = defineProps<{
  line: TranscriptLine,
  secondLine?: TranscriptLine,
  transcript: Transcript
}>();

const avatar = computed(() => game.getAsset(speaker.value?.avatarAssetId)?.content)
const speaker = computed(() => getSpeakerColor(props.line));

const avatar2 = computed(() => game.getAsset(speaker2.value?.avatarAssetId)?.content)
const speaker2 = computed(() => props.secondLine ? getSpeakerColor(props.secondLine) : undefined);

function getSpeakerColor(line: TranscriptLine) {
  let speakerObj = line[0];
  if (!speakerObj) {
    return null
  }

  let speaker: TranscriptSpeakerBase | undefined = undefined;

  if (typeof speakerObj === 'string') {
    speaker = props.transcript.speakers.find(s => s.id === speakerObj);
  } else {
    const s = props.transcript.speakers.find(s => s.id === speakerObj.speaker);
    speaker = {
      name: speakerObj.name ?? s?.name ?? 'Unbekannt',
      color: speakerObj.color ?? s?.color,
      flipAvatar: speakerObj.flipAvatar ?? s?.flipAvatar,
      alignment: speakerObj.alignment ?? s?.alignment,
      avatarAssetId: speakerObj.avatarAssetId ?? s?.avatarAssetId
    }
  }

  if (!speaker) {
    return {
      name: 'Unbekannt'
    }
  }

  return speaker;
}
</script>

<style scoped lang="scss">
@use '@/scss/vars' as *;

.transcript-line {
  position: relative;
  width: calc(100vw - 22rem - 8rem);
  margin: -2px auto;

  &__line {
    text-align: left;
    padding: 1.5rem 2rem;
    border-radius: 1.5rem;

    .transcript-line--speaker & {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1.5rem;
        box-shadow: 0 0 2rem var(--speaker-color) inset;
        pointer-events: none;
        border: 2px solid var(--speaker-color);
        background: linear-gradient(-90deg, var(--speaker-color-gradient-1) 50%, var(--speaker-color-gradient-2));
        mask-image: linear-gradient(-90deg, transparent 20%, #000);
      }
    }

    .transcript-line--right &, .transcript-line--second &--second {
      text-align: right;

      &::before {
        background: linear-gradient(90deg, var(--speaker-color-gradient-1) 50%, var(--speaker-color-gradient-2));
        mask-image: linear-gradient(90deg, transparent 20%, #000);
      }
    }

    .transcript-line--second & {
      width: calc((100vw - 22rem - 8rem) / 2);
    }

    .transcript-line--second &:not(&--second) {
      padding-right: .25rem;
    }

    .transcript-line--second &--second {
      padding-left: .25rem;
    }
  }

  &--second {
    display: flex;
  }

  &--directive {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    
    .transcript-line--directive + & {
      margin-top: -2rem;
    }

    &::before, &::after {
      content: '';
      background: #fff8;
      flex: 1;
      height: 2px;
      border-radius: 1px;
      min-width: 2rem;
    }
  }

  &__second-indicator {
    position: absolute;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    padding: 0 3rem;
    font-style: italic;
    font-family: $fontHeading;
    font-weight: 300;
    line-height: 2rem;
    z-index: 1;
    mask-image: linear-gradient(#000a, transparent);
  }

  &__avatar {
    position: absolute;
    top: .5rem;
    left: 0;
    width: 7rem;
    height: auto;

    mask-image: linear-gradient(#0008, transparent);

    font-size: 4rem;
    color: var(--speaker-color);

    &--flip {
      transform: scaleX(-1);
    }

    img {
      display: block;
      pointer-events: none;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .transcript-line--right &, .transcript-line--second .transcript-line__line--second & {
      left: auto;
      right: 0rem;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 1.5rem;
    }
  }
  
  &__speaker {
    position: relative;
    z-index: 1;
    font-size: 1.5rem;
    padding: 0 3rem;
    margin-bottom: 1rem;
    font-family: $fontDisplay;
    color: var(--speaker-color);
  }

  &__text {
    z-index: 1;
    position: relative;
    padding-right: 20%;
    font-size: 1.25rem;

    .transcript-line--right & {
      padding-right: 0;
      padding-left: 20%;
    }

    .transcript-line--directive & {
      padding: 0;

      text-align: center;
      color: #fff8;
    }

    .transcript-line--second & {
      padding-right: 0;
      padding-left: 0;
    }
  }
}
</style>