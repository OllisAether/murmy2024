<template>
  <VForm
    ref="form"
    @submit.prevent="submit"
  >
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-account-group</VIcon>
          {{ props.team ? 'Team bearbeiten' : 'Team hinzufügen' }}
        </VToolbarTitle>
        <VBtn @click="emit('close')" icon>
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText>
        <template v-if="team">
          Team-ID: {{ id }}
        </template>
        <VTextField
          v-else
          v-model="id"
          label="ID"
          required
          variant="outlined"
          :rules="[
            (v: string) => !!v || 'ID darf nicht leer sein',
          ]"
        />

        <VTextField
          class="mb-4 mt-4"
          v-model="name"
          label="Name"
          variant="outlined"
          :rules="[
            (v: string) => !!v || 'Name darf nicht leer sein',
          ]"
        />
        <VTextField
          v-model="code"
          @update:focused="setCode"
          label="Code"
          variant="outlined"
          :rules="[
            (v: string) => validateCode(v).message ?? true
          ]"
        >
          <template #append-inner>
            <VBtn icon size="small" variant="text" @click="generate">
              <VIcon>mdi-refresh</VIcon>
            </VBtn>
          </template>
        </VTextField>

        <p class="text-error">
          {{ error }}
        </p>

        <VCheckbox
          v-model="active"
          label="Aktiv"
        />

        <VTextarea
          v-model="metaTextarea"
          @blur="computedMeta = metaTextarea"
          label="Meta"
          variant="outlined"
          hint="JSON-Objekt"
        />

        <p class="text-error">
          {{ metaError }}
        </p>
      </VCardText>
      <VCardActions>
        <VBtn
          v-if="props.team"
          color="error"
        >
          Löschen

          <VDialog
            activator="parent"
            v-model="removeDialog"
            max-width="500"
          >
            <VCard>
              <VToolbar color="transparent">
                <VToolbarTitle>
                  Team löschen
                </VToolbarTitle>
                <VBtn icon @click="removeDialog = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>

              <VCardText>
                Bist du sicher, dass du das Team löschen möchtest?
              </VCardText>

              <VCardActions>
                <VSpacer />
                <VBtn
                  @click="removeDialog = false"
                >
                  Abbrechen
                </VBtn>
                <VBtn
                  color="error"
                  @click="emit('remove')"
                >
                  Löschen
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VBtn>
        <VBtn color="primary" type="submit" :loading="loading">
          {{ props.team ? 'Speichern' : 'Hinzufügen' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { generateCode, validateCode } from '../../../shared/teamcode';
import { idGen } from '../../../shared/random';
import { VIcon } from 'vuetify/components';
import { JsonMap } from '../../../shared/json';

const props = defineProps<{
  team?: {
    id: string
    name: string
    code: string
    active: boolean
    meta: JsonMap
  },
  submitFn: (team: {
    id: string
    name: string
    code: string
    active: boolean
    meta: JsonMap
  }) => Promise<{
    success: boolean
    message?: string
  }>
}>()

const emit = defineEmits<{
  'close': []
  'remove': []
}>()

const removeDialog = ref(false)

const id = ref(props.team?.id ?? idGen())
const name = ref(props.team?.name ?? '')
const code = ref(props.team?.code ?? generateCode())
const active = ref(props.team?.active ?? true)
const meta = ref(props.team?.meta ?? {})

const metaError = ref('')
const metaTextarea = ref(JSON.stringify(meta.value, null, 2))
const computedMeta = computed({
  get: () => JSON.stringify(meta.value, null, 2),
  set: (v: string) => {
    if (v.trim() === '') {
      meta.value = {}
      metaError.value = ''
      setTimeout(() => {
        metaTextarea.value = JSON.stringify(meta.value, null, 2)
      })
      return
    }

    try {
      meta.value = JSON.parse(v)
      metaError.value = ''

      setTimeout(() => {
        metaTextarea.value = JSON.stringify(meta.value, null, 2)
      })
    } catch {
      metaError.value = 'Ungültiges JSON-Objekt'
    }
  }
})

function setCode () {
  code.value = code.value.trim().toUpperCase().slice(0, 6)
}

function generate () {
  code.value = generateCode()
}

const loading = ref(false)
const error = ref('')

async function submit () {
  loading.value = true

  const res = await props.submitFn({
    id: id.value,
    name: name.value,
    code: code.value,
    active: active.value,
    meta: meta.value
  })

  if (res.success) {
    emit('close')
  } else {
    error.value = res.message!
  }

  loading.value = false
}
</script>
