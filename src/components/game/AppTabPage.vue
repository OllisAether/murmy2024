<template>
  <VThemeProvider :theme="black ? 'dark' : 'light'" >
    <VLayout class="app-tab-page app-layout">
      <VToolbar
        :color="black ? 'black' : 'white'"
        class="app-tab-page__toolbar"
        :height="pages[page].noToolbar ? 0 : undefined"
      >
        <div class="app-tab-page__title pa-4">
          {{ pages[page].noToolbar ? pages[lastPage].title : pages[page].title }}
        </div>
      </VToolbar>

      <TransitionGroup :name="`app-tab-page__content-${transitionDirection}`">
        <template
          v-for="(_, i) in pages"
          :key="i"
        >
          <VMain
            v-if="page === i"
            class="app-tab-page__content"
          >
            <component :is="pages[i].component" />
          </VMain>
        </template>
      </TransitionGroup>

      <VBottomNavigation
        v-model="page"
        :height="16 * 6"
        :bg-color="black ? 'black' : 'grey-lighten-4'"
        class="app-tab-page__bottom-nav pb-5"
        grow
        elevation="0"
        mandatory
      >
        <VBtn
          v-for="(p, i) in pages"
          :key="i"
          :value="i"
          :color="accent"
          variant="plain"
        >
          <VAvatar v-if="p.avatar" size="24" color="grey-darken-4">
            <VImg v-if="p.avatarUrl" :src="p.avatarUrl" />
            <VIcon v-else size="16" color="white">mdi-account</VIcon>
          </VAvatar>
          <VIcon v-else size="24">
            {{ p.icon }}
          </VIcon>
          {{ p.navTitle || p.title }}
        </VBtn>
      </VBottomNavigation>
    </VLayout>
  </VThemeProvider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  black?: boolean
  accent?: string
  pages: Record<string, {
    title: string;
    noToolbar?: boolean;
    component: any;
    icon?: string;
    navTitle?: string;
    avatar?: boolean;
    avatarUrl?: string;
  }>;
  defaultPage?: string;
}>(), {
  accent: 'green-darken-1',
});

const page = ref<string>(props.defaultPage || Object.keys(props.pages)[0]);
const lastPage = ref<string>(props.defaultPage || Object.keys(props.pages)[0]);
const transitionDirection = computed(() => {
  return Object.keys(props.pages).indexOf(page.value) < Object.keys(props.pages).indexOf(lastPage.value) ? 'left' : 'right';
})

watch(page, (_, oldPage) => {
  lastPage.value = oldPage;
});
</script>

<style lang="scss" scoped>
.app-tab-page {
  &__content {
    &-left-enter-active,
    &-right-enter-active,
    &-left-leave-active,
    &-right-leave-active {
      transition: transform .2s;
    }
    
    &-left-enter-from,
    &-right-leave-to {
      transform: translateX(-100%);
    }

    &-left-enter-to,
    &-right-leave-from {
      transform: translateX(0);
    }

    &-right-enter-from,
    &-left-leave-to {
      transform: translateX(100%);
    }

    &-right-enter-to,
    &-left-leave-from {
      transform: translateX(0);
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }

  &__bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>
