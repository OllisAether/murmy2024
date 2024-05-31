<template>
  <VThemeProvider theme="light">
    <div class="chat-page">
      <VToolbar class="chat-page__toolbar">
        <VToolbarTitle>
          <VIcon class="chat-page__icon mr-2">mdi-whatsapp</VIcon>

          <b>ChatsApp</b>
        </VToolbarTitle>
        <VBtn icon>
          <VIcon>mdi-magnify</VIcon>
        </VBtn>
        <VBtn icon>
          <VIcon>mdi-dots-vertical</VIcon>
        </VBtn>
      </VToolbar>

      <div class="chat-page__content">
        <VList class="my-2">
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
          <VListItem class="my-2">
            <template #prepend>
              <VAvatar>
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>John Doe</VListItemTitle>
            <VListItemSubtitle>Hey, how are you?</VListItemSubtitle>
          </VListItem>
        </VList>
      </div>
    </div>
  </VThemeProvider>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.chat-page {
  height: 100%;

  &__icon {
    vertical-align: -.1em;
  }

  &__toolbar {
    z-index: 1;
    position: absolute;
    top: 0;
    padding-top: 6cqh;
  }

  &__content {
    padding-top: 6cqh;
    height: 100%;
    overflow: auto;
  }
}
</style>
