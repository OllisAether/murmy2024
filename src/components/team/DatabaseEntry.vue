<template>
  <div class="database-entry" ref="root">
    <div class="database-entry__header">
      <div class="database-entry__header__title">
        {{ entry.title }}
      </div>
      <div class="database-entry__header__matter-id">
        {{ entry.matterId }}
      </div>
    </div>
    <div class="database-entry__content">
      <div class="database-entry__content__text">
        {{ entry }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Entry } from '../../../shared/suspectDatabase/entry'
// import { useCollectables } from '@/store/collectables';

defineProps<{
  entry: Entry
}>()

const root = ref<HTMLDivElement | null>(null)

// const collectable = useCollectables()

// onMounted(() => {
//   if (!root.value) return

//   collectable.setCollectedEntry({
//     entry: props.entry,
//     element: root.value
//   })
// })

// onBeforeUnmount(() => {
//   collectable.removeCollectedEntry(props.entry.matterId)
// })
</script>

<style lang="scss" scoped>
.database-entry {
  border: 1px solid #000;
  padding: 1rem;
  margin: 1rem;
}
</style>