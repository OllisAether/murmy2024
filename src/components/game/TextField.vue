<template>
  <div
    :class="{
      'text-field': true,
      'text-field--disabled': props.disabled,
      'text-field--drag-over': dragOver,
    }"
    data-droppable
    @customdrop="drop"
    @customdragenter="dragenter"
    @customdragleave="dragleave"
  >
    <VTextField
      :model-value="type === 'password' ? '•'.repeat(value.length) : value"
      v-bind="$attrs"
      :label="label"
      class="text-field__field"
      ref="inputField"
      disabled
    />

    <VMenu
      location="top"
      :offset="-(inputField?.getBoundingClientRect().height || 0)"
      activator="parent"
      :close-on-content-click="false"
      :model-value="showMenu"
      @update:model-value="updateShowMenu"
      theme="dark"
      max-height="500"
    >
      <VCard class="list-card" rounded="lg">
        <VToolbar class="toolbar" height="42">
          <VToolbarTitle>
            <VIcon class="mr-2">mdi-database-arrow-down-outline</VIcon>
            {{ label }}
          </VToolbarTitle>

          <VBtn
            icon
            @click="showMenu = false"
          >
            <VIcon>mdi-check</VIcon>
          </VBtn>
        </VToolbar>

        <VCardText>
          <VList class="mx-2" bg-color="transparent" density="compact">
            <VListItem
              v-if="filteredItems.length === 0"
              class="text-grey text-center"
            >
              Keine Einträge gefunden
            </VListItem>
  
            <VListItem
              v-for="(item, i) in filteredItems"
              :key="item.entry.value"
              @click="() => {
                value = item.entry.value
                showMenu = false
              }"
              :border="i !== filteredItems.length - 1 && 'b'"
            >
              <VListItemTitle>
                {{ item.entry.value }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ game.getPerson(item.suspect.personId)?.name }}
              </VListItemSubtitle>
            </VListItem>
          </VList>
        </VCardText>

        <div class="d-flex enterManual align-center">
          <input
            class="flex-grow-1"
            ref="hiddenInput"
            v-model="value"
            placeholder="Manuelle Eingabe / Suche"
            :autocapitalize="type === 'password' ? 'none' : autocapitalize"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            :type="{
              'email': 'email',
              'phone': 'tel'
            }[entryType as string] ?? 'text'"
          />
          <VBtn
            icon
            class="ml-2"
            variant="tonal"
            @click="value = ''; hiddenInput?.focus()"
          >
            <VIcon>
              mdi-backspace
            </VIcon>
          </VBtn>
        </div>
      </VCard>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';
import { ref, useModel } from 'vue';
import { VTextField } from 'vuetify/components';

const inputField = ref<VTextField | null>(null);
const hiddenInput = ref<HTMLInputElement | null>(null);

const showMenu = ref(false);

const game = useGameManager();

function updateShowMenu(value: boolean) {
  showMenu.value = value;
}

function drop (event: CustomEvent<string>) {
  value.value = event.detail;

  dragOver.value = false;
}

const dragOver = ref(false);
function dragenter () {
  dragOver.value = true;
}

function dragleave () {
  dragOver.value = false;
}

const props = defineProps<{
  modelValue: string;
  label: string;
  disabled: boolean;
  type?: 'text' | 'password';
  autocapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  entryType?: 'email' | 'phone' | 'accounts' | 'all';
}>();

const emits = defineEmits<{
  'update:modelValue': [string];
}>();

const value = useModel(props, 'modelValue');

const items = ref(game.suspects
  .map((suspect) => {
    switch (props.entryType) {
      case 'email':
        return suspect.basic
          .filter((basic) => basic.id === 'email')
          .map(emailEntry => ({
            suspect,
            entry: emailEntry,
          }))
      case 'phone':
        return suspect.basic
          .filter((basic) => basic.id === 'phone')
          .map(phoneEntry => ({
            suspect,
            entry: phoneEntry,
          }))
      case 'accounts':
        return suspect.accounts
          .map(passwordEntry => ({
            suspect,
            entry: passwordEntry,
          }))
      default:
        return [
          ...suspect.basic
            .filter(basic => basic.id === 'email' || basic.id === 'phone')
            .map(basic => ({
              suspect,
              entry: basic,
            })),
          ...suspect.accounts.map(account => ({
            suspect,
            entry: account,
          })),
        ]
    }
  }).flat());

const filteredItems = computed(() => items.value
  .filter((item) => item?.entry.value.toLowerCase()
    .includes(value.value.toLowerCase())));
</script>

<style scoped lang="scss">
.text-field {
  position: relative;
  &__field {
    pointer-events: none;
  }

  &:not(.text-field--disabled):deep(.v-field) {
    opacity: 1;
  }

  &--disabled {
    pointer-events: none;
  }

  &--drag-over::after {
    content: '';
    position: absolute;
    inset: -0.5rem;
    border: 0.1rem dashed #f22;
    border-radius: 0.5rem;
    background: rgba(255, 0, 0, 0.1);
  }
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
}

.list-card {
  padding-bottom: 4rem;
}

.enterManual {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;

  input {
    border: none;
    background: #333;
    color: #fff;
    border-radius: .5rem;
    padding: 1rem;
    font-size: 1rem;
    font: inherit;
  }
}
</style>