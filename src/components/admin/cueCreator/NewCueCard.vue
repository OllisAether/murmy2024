<template>
  <VCard>
    <VToolbar>
      <VToolbarTitle>
        Neue Cue
      </VToolbarTitle>
      <VBtn icon @click="emit('close')">
        <VIcon>mdi-close</VIcon>
      </VBtn>
    </VToolbar>
    
    <VCardText>
      <VSelect
        v-model="cueType"
        label="Cue-Typ"
        :items="Object.values(CueType).map(key => ({
          title: `${cueTypeToName(key)} (${key})`,
          value: key
        }))"
        hide-details
      />

      <VSelect
        class="mt-4"
        v-model="unlockFiles"
        multiple
        chips
        closable-chips
        :items="files.map(file => file.name)"
        label="Freizuschaltende Dateien"
        hide-details
      />
      <p class="text-grey mt-2 text-body-2">
        Die Dateien werden beim Start der Cue freigeschaltet.
      </p>

      <template v-if="hasDuration">
        <VLabel class="mb-2 mt-4">
          Dauer {{ hasDuration === 'optional' ? '(optional)' : '' }}
        </VLabel>
        <div class="d-flex align-center">
          <VCheckbox v-if="hasDuration === 'optional'" v-model="setDuration" hide-details class="mr-4" />

          <DurationTextField v-model="duration" :disabled="hasDuration === 'optional' ? !setDuration : false" />
        </div>
      </template>

      <VoteCueSettings v-if="cueType === CueType.Vote" v-model="voteCueSettings" />

      <VDivider class="mt-4 mb-4" />

      <VList nav mandatory>
        <VListItem color="primary" :active="addType === 'end'" @click="addType = 'end'">
          An das Ende hinzufügen
        </VListItem>
        <VListItem color="primary" :active="addType === 'after'" @click="addType = 'after'">
          Nach aktiver Cue ({{ admin.cueIndex }}) hinzufügen
        </VListItem>
        <VListItem color="primary" :active="addType === 'afterStart'" @click="addType = 'afterStart'">
          Nach aktiver Cue ({{ admin.cueIndex }}) hinzufügen und starten
        </VListItem>
      </VList>

      <VCardActions>
        <VSpacer />
        <VBtn @click="submit" color="primary">
          Erstellen
        </VBtn>
      </VCardActions>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CueJson, CueType, cueTypeToName } from '../../../../shared/cue';
import DurationTextField from '../DurationTextField.vue';
import VoteCueSettings from './VoteCueSettings.vue';
import { files } from '@/assets/files';
import { useAdmin } from '@/store/admin';

const emit = defineEmits<{
  submit: [CueJson],
  close: []
}>();

const admin = useAdmin();

const addType = ref<'end' | 'after' | 'afterStart'>('end');

const cueType = ref(CueType.Idle);

const hasDuration = computed<boolean | 'optional'>(() => {
  switch (cueType.value) {
    case CueType.Idle:
      return 'optional'
    case CueType.Break:
    case CueType.Quiz:
    case CueType.Vote:
    case CueType.Work:
      return true
    default:
      return false
  }
});
const setDuration = ref(false);
const duration = ref<number | undefined>(30000);
const unlockFiles = ref<string[]>([]);

const voteCueSettings = ref<CueJson['vote']>({
  options: [],
  tieBreakerDuration: 10000
});

function submit () {
  
}
</script>