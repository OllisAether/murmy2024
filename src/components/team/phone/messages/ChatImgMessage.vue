<template>
  <div :class="['chat-img-message', {
    'chat-img-message--explicit': message.explicit
  }]" @click="showExplicit" :data-open="open">
    <img :src="game.getAsset(message.imageAssetId)?.content">

    <div class="chat-img-message__tw" v-if="message.explicit">
      Achtung: Dieses Bild enthält blutige Inhalte!
      <br>
      <br>
      Tippen um Bild anzuzeigen
    </div>

    <template
      v-for="(entry, i) in message.entries"
      :key="i"
    >
      <Collectable
        disappear
        class="chat-img-message__entry"
        v-if="entry.entryId ?? entry.entry?.id"
        :entryId="(entry.entryId ?? entry.entry?.id)!"
        :style="{
          top: `${entry.rect.x * 100}%`,
          left: `${entry.rect.y * 100}%`,
          width: `${entry.rect.width * 100}%`,
          height: `${entry.rect.height * 100}%`,
          transform: entry.rect.transform,
        }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChatImage } from '../../../../shared/phone/chat';
import { useGameManager } from '@/store/gameManager';
import Collectable from '@/components/Collectable.vue';

const props = defineProps<{
  message: ChatImage
}>()

const game = useGameManager()

const open = ref(false)
const showExplicit = () => {
  if (props.message.explicit) {
    open.value = !open.value
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.chat-img-message {
  position: relative;
  padding: 5px * $scale;

  img {
    pointer-events: none;
    display: block;
    width: 100%;
    height: 100%;
  }

  &--explicit {
    img {
      filter: blur(10px * $scale);
      clip-path: inset(0 0 0 0);

      transition: filter 0.3s, opacity 0.3s;

    }
    &[data-open=true] img {
      filter: blur(0);
    }
  }

  &__tw {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px * $scale;
    font-size: 8px * $scale;
    text-align: center;
    transition: opacity 0.3s;
    text-shadow: 0 0 (1px * $scale) #0008;

  }
  &[data-open=true] &__tw {
    opacity: 0;
  }

  &__entry {
    position: absolute;
  }
}

</style>