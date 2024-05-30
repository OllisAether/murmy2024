<template>
  <VLayout class="workspace">
    <VNavigationDrawer
      width="400"
    >
      <VToolbar color="transparent" border="b">
        <VToolbarTitle>
          00:00 {{ auth.team?.name }}
        </VToolbarTitle>
      </VToolbar>

      <VList nav>
        <VListItem>
          <template #prepend>
            <VImg
              cover
              width="128"
              :aspect-ratio="3/4"
              rounded="lg"
              class="mr-4"
              color="grey-darken-2"
            >
              <div class="d-flex h-100 align-center justify-center">
                <VIcon size="48">mdi-help</VIcon>
              </div>
            </VImg>
          </template>
          John Doe
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain>

    </VMain>
  </VLayout>
</template>

<script setup lang="ts">
import { useAuthManager } from '../../store/authManager';

const auth = useAuthManager()
</script>

<style lang="scss" scoped>
.workspace {
  // display: flex;
  // height: 100vh;

  // &__database {
  //   width: 25rem;
  //   background-color: #111;
  // }

  // &__area {
  //   flex: 1;
  //   background-color: #000000;
  // }
}
</style>
