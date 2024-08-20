<template>
  <div class="notes-screen">
    <div class="notes-screen__title">
      <img :src="game.getAsset('phone/Icon_Notes.webp')?.content" />
      Memos
    </div>

    <ScrollView class="notes-screen__content">
      <div class="notes-screen__list">
        <button
          class="notes-screen__list__item"
          v-for="(note, i) in notes"
          :key="i"
          @click="phone.pushPath(i.toString())"
        >
          <div class="notes-screen__list__item__info">
            <div class="notes-screen__list__item__title">
              {{ note.title ?? 'Memo vom ' + note.date.format('DD.MM.YYYY') }}
            </div>
            <div v-if="note.title" class="notes-screen__list__item__date">
              vom {{ note.date.format('DD.MM.YYYY') }}
            </div>
            <div class="notes-screen__list__item__preview">
              {{ getRawText(note.content) }}
            </div>
          </div>
        </button>
      </div>
    </ScrollView>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import ScrollView from '../ScrollView.vue';
import { useMainClue } from '@/store/team/mainClue';
import { getRawText } from '../../../../../shared/textContent';
import { notes } from '../../../../../shared/assets/phone/notes';
const game = useGameManager();
const phone = useMainClue();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.notes-screen {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__title {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px * $scale;
    padding-right: 22px * $scale;
    height: 40px * $scale;
    font-size: 16px * $scale;
    font-weight: bold;
    background: linear-gradient(#a6845f, #422d18);
    box-shadow: 0 0 5px * $scale 2px * $scale #000,
                0 3px * $scale 1px * $scale -1px * $scale #fff4 inset;

    img {
      width: 18px * $scale;
      height: 18px * $scale;
      margin-right: 4px * $scale;
      filter: drop-shadow(0 1px * $scale 2px * $scale #00000099);
    }
  }

  &__content {
    flex: 1;
    background: white;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 7px * $scale;
    padding: 10px * $scale;
    padding-bottom: 50%;

    &__item {
      display: flex;
      text-align: left;
      align-items: center;

      padding: 8px * $scale;
      border-radius: 4px * $scale;
      background: linear-gradient(#FFF4E8, #F0DCC4);
      color: black;
      box-shadow:
        0 1px * $scale 4px * $scale 1px * $scale #00000099,
        0 2px * $scale 1px * $scale #fff inset,
        0 0 8px * $scale #00000044 inset;

      &__info {
        flex: 1;
        width: 0;
        line-height: 1;
      }

      &__title {
        font-size: 10px * $scale;
        font-weight: bold;
      }

      &__date {
        font-size: 8px * $scale;
        color: #0008;
        padding: 2px * $scale 0;
      }

      &__preview {
        font-size: 8px * $scale;
        color: #0008;
        margin-top: 2px * $scale;
        padding: 2px * $scale 0;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>