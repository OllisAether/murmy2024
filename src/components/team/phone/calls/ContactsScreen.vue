<template>
  <ScrollView class="contacts-screen">
    <div class="contacts-screen__list">
      <div
        class="contacts-screen__list__item"
        v-for="(contact, i) in contacts"
        :key="i"
      >
        <div class="contacts-screen__list__item__avatar">
          <img
            v-if="game.getAsset(contacts.find(c => c.number === contact.number)?.avatarAssetId)?.content"
            :src="game.getAsset(contacts.find(c => c.number === contact.number)?.avatarAssetId)?.content"
            alt="avatar"
          />
          <VIcon v-else>mdi-account</VIcon>
        </div>
        <div class="contacts-screen__list__item__info">
          <div class="contacts-screen__list__item__name">
            {{ contacts.find(c => c.number === contact.number)?.name ?? contact.number }}
          </div>
          <div
            v-if="contacts.find(c => c.number === contact.number)?.name"
            class="contacts-screen__list__item__number"
          >
            {{ contact.number }}
          </div>
        </div>
        <Collectable
          v-if="contact.entry"
          :entry-id="contact.entry"
          class="contacts-screen__list__item__collectable"
        />
      </div>
    </div>
  </ScrollView>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { contacts } from '../../../../shared/assets/phone/contacts';
import ScrollView from '../ScrollView.vue';
import Collectable from '@/components/Collectable.vue';

const game = useGameManager();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.contacts-screen {
  height: 100%;

  &__list {
    display: flex;
    flex-direction: column;
    padding-bottom: 50%;

    &__item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 5px * $scale 5px * $scale 5px * $scale 10px * $scale;
      border-bottom: 1px * $scale solid #fff2;
      line-height: 1;

      &__collectable {
        position: absolute;
        inset: 0;
      }

      &__info {
        flex: 1;
      }

      &__name {
        font-size: 10px * $scale;
      }

      &__number {
        font-size: 8px * $scale;
        color: #777;
      }

      &__avatar {
        width: 20px * $scale;
        height: 20px * $scale;
        border-radius: 50%;
        background: #6a6a6a;
        overflow: hidden;
        margin-right: 5px * $scale;

        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px * $scale;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>