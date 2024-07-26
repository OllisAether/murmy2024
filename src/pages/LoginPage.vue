<template>
  <VCard class="login-card" color="transparent" max-width="350" width="100%" style="overflow: visible;">
    <SkewBox
      style="
        position: absolute;
        inset: -1rem -1.5rem;
      "
      :skew="5"
      :rounded-corners="8"
    />

    <VToolbar color="transparent">
      <VToolbarTitle>
        <VIcon class="mr-2">mdi-account-group</VIcon>
        Team Login
      </VToolbarTitle>
    </VToolbar>

    <VCardText style="position: relative;">
      <p class="mb-6">
        Auf eurem <b class="text-primary">Einführungsbogen</b> findet ihr einen 6-stelligen Code, den ihr hier eingeben könnt.
      </p>

      <VOtpInput
        :disabled="auth.loginLoading"
        @update:model-value="setCode"
        :model-value="code"
        :length="codeLength"
        :error="auth.loginError !== null"
        @finish="login"
        autofocus
        type="text"
      />

      <p class="text-error mb-2">
        {{ auth.loginError }}
      </p>

      <p class="text-small text-grey text-right">
        <em>
          Client-ID: {{ auth.clientId }}
        </em>
      </p>

      <VProgressLinear
        v-if="auth.loginLoading"
        indeterminate
      />
    </VCardText>
  </VCard>

  <!-- <Transition name="full-immersion">
    <VCard
      rounded="lg"
      class="full-immersion"
      v-if="(!game.canFullscreen && !game.isPwa) && !dismissedImmersion"
    >
      <VCardTitle class="d-flex">
        Mehr Immersion?
        <VSpacer />
        <VIcon>mdi-arrow-up-right</VIcon>
      </VCardTitle>

      <VCardText>
        <p class="mb-2">
          Du kannst die volle Immersion nutzen, indem du die Seite auf deinem Startbildschirm speicherst und von dort aus startest.
        </p>

        <p class="mb-7">
          Du kannst du App nach dem Event wieder löschen.
        </p>
        <p class="mb-4">
          So geht's:
        </p>

        <ol class="pl-6">
          <li class="my-2">
            Öffne das Teilen-Menü von Safari
          </li>
          <li class="my-2">
            Wähle "<VIcon>mdi-plus-box-ou tline</VIcon> Zum Startbildschirm hinzufügen"<br>
          </li>
          <li class="my-2">
            Starte die Seite von deinem Startbildschirm aus
          </li>
        </ol>

        <button
          class="mt-2"
          style="text-decoration: underline;"
          @click="dismissedImmersion = true"
        >
          Nein, danke.
        </button>
      </VCardText>
    </VCard> -->
  <!-- </Transition> -->
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuthManager } from '../store/authManager'
import { codeLength, codeRegex } from '../../shared/teamcode';
import { useRoute } from 'vue-router';
import { useGameManager } from '../store/gameManager';
import SkewBox from '@/components/SkewBox.vue';

const route = useRoute()
const auth = useAuthManager()
// const game = useGameManager()

const dismissedImmersion = ref(true)
onMounted(() => {
  setTimeout(() => {
    dismissedImmersion.value = false
  }, 500)
})

const code = ref('')
function setCode (value: string) {
  const _code = value.trim().toUpperCase().slice(0, codeLength)

  if (_code.length === 0) {
    code.value = ''
    return
  }

  const valid = codeRegex.test(_code)

  if (valid) {
    code.value = _code
  }
}

async function login () {
  const success = await auth.loginTeam(code.value)

  if (success) {
    useGameManager().toggleFullscreen()
  } else {
    code.value = ''
  }
}

onMounted(() => {
  const routeCode = route.params.code as string | undefined

  if (routeCode) {
    setCode(routeCode)
    login()
  }
})
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.full-immersion {
  position: absolute;
  top: 0;
  right: 6rem;
  max-width: 350px;
  transform-origin: top right;

  &-enter-active, &-leave-active {
    transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &-enter-from, &-leave-to {
    transform: translateY(-1rem)scale(0.3);
    opacity: 0;
  }

  border: #0cffc2 solid 1px;
  box-shadow: 0 2rem 10rem #0cffc243, 0 0 2rem #0cffc243;
}
</style>
