<template>
  <div class="app-nav">
    <AppNavBtn
      @click="change('files')"
      type="files"
      :active="active === 'files'"
      icon="mdi-folder"
    >
      Dokumente
    </AppNavBtn>

    <div class="divider"></div>

    <AppNavBtn
      @click="change('search')"
      type="search"
      :active="active === 'search'"
      icon="mdi-web"
    >
      Web
    </AppNavBtn>
    <AppNavBtn
      @click="change('chat')"
      type="chat"
      :active="active === 'chat'"
      icon="mdi-chat"
    >
      ChatsApp
    </AppNavBtn>
    <AppNavBtn
      @click="change('mail')"
      type="mail"
      :active="active === 'mail'"
      icon="mdi-email"
    >
      Swiftmail
    </AppNavBtn>

    <div class="divider"></div>

    <AppNavBtn
      @click="change('tools')"
      type="tools"
      :active="active === 'tools'"
      icon="mdi-wrench"
    >
      Werkzeuge
    </AppNavBtn>
  </div>
</template>

<script setup lang="ts">
import AppNavBtn from './AppNavBtn.vue'

defineProps<{
  active: string
}>()

const emit = defineEmits<{
  change: [string]
}>()

function change (name: string) {
  emit('change', name)
}
</script>

<style lang="scss" scoped>
.app-nav {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  gap: 2rem;

  @media screen and (max-width: 768px) {
    flex-flow: row nowrap;
    right: 0;
    left: 0;
    top: unset;
    bottom: 0;
    gap: 1rem;
    justify-content: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -50%;
    bottom: 0;
    width: 100%;
    filter: blur(5rem);
    background: linear-gradient(#024eff, #cc00ff);

    @media screen and (max-width: 768px) {
      top: 90%;
      right: 0;
      bottom: unset;
      left: 0;
      height: 50%;
      width: 100%;
      background: linear-gradient(90deg, #024eff, #cc00ff);
      filter: blur(4rem);
    }
  }
  
  .divider {
    width: 3rem;
    height: 0.1rem;
    background: #fff3;

    @media screen and (max-width: 768px) {
      width: 0.1rem;
      height: 2.2rem;
      margin: 0 -.5rem 1.5rem;
    }
  }
}
</style>
