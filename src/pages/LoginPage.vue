<template>
  <template v-if="pwaNotice">
    <VIcon class="pwa-notice__arrow">mdi-arrow-up</VIcon>
    <div class="pwa-notice">
      <div class="pwa-notice__blob" />
      <div class="pwa-notice__blob" />
      <div class="pwa-notice__blob" />
      <div class="pwa-notice__blob" />

      <div class="pwa-notice__content">
        <div class="pwa-notice__title">
          Erlebe volle Immersion
        </div>
        
        <div class="pwa-notice__img">
          <img src="../assets/addToHome.webp" alt="Zum Startbildschirm hinzufügen" />
        </div>

        <p>
          Füge diese Seite zu deinem Startbildschirm hinzu, um ein
          <span class="pwa-notice__unforgettable">
            <TextContentRenderer :text-content="bold(wiggly('unvergleichliches Erlebnis'))" />
          </span>
          ohne Browser-Elemente zu genießen.
        </p>

        <p>
          Du kannst die Web-App nach der Murder Mystery Night gleich wieder entfernen.
        </p>

        <button @click="dismissedNotice = true" class="pwa-notice__no-thanks-btn">
          <span>Nein, danke</span> 💔
        </button>
      </div>
    </div>
  </template>

  <VCard
    v-else
    class="login-card"
    color="transparent"
    elevation="0"
    max-width="400"
    width="100%"
    style="overflow: visible;"
  >
    <SkewBox
      style="
        position: absolute;
        inset: -1rem -1.5rem;
      "
      :skew="5"
      :rounded-corners="8"
    />

    <VToolbar color="transparent">
      <VToolbarTitle class="login-card__title">
        <!-- <VIcon class="mr-2">mdi-account-group</VIcon> -->
        Team Login
      </VToolbarTitle>
    </VToolbar>

    <VCardText style="position: relative;">
      <p class="mb-6">
        Auf eurem <b class="text-primary">Einführungsbogen</b> findet ihr einen
        <b class="text-primary">6-stelligen Code</b>, den ihr hier eingeben könnt.
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
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useAuthManager } from '../store/authManager'
import { codeLength, codeRegex } from '../../shared/teamcode';
import { useRoute } from 'vue-router';
import { useGameManager } from '../store/gameManager';
import SkewBox from '@/components/SkewBox.vue';
import TextContentRenderer from '@/components/TextContentRenderer.vue';
import { bold, wiggly } from '../../shared/textContent';

const route = useRoute()
const auth = useAuthManager()
const game = useGameManager()

const dismissedNotice = ref(false)
const pwaNotice = computed(() => !game.canFullscreen && !game.isPwa && !dismissedNotice.value)
// watch(pwaNotice, (val) => {
//   if (val) return

//   const routeCode = route.params.code as string | undefined

//   if (routeCode) {
//     setCode(routeCode)
//     login()
//   }
// }, { immediate: true })

const code = ref(route.params.code as string | undefined ?? '')
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
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '@/scss/vars' as *;

.login-card, .pwa-notice {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: $fontDisplay;
  }

  :deep(.v-card-text) {
    font-size: 1.1rem;
  }
}

@function unit($value) {
  @return calc(math.div($value, 100) * min(50vw, 70vh));
}

.pwa-notice {
  width: unit(120);
  padding: 2rem 0;

  &__blob {
    z-index: -1;
    position: absolute;
    border-radius: 50%;
    filter: blur(unit(10));
    opacity: .4;
    background-position: center;
    animation: blob 10s infinite linear;

    &:nth-child(1) {
      background-image: radial-gradient(#1dbdf7, transparent 70%);
      top: unit(-40);
      left: unit(-40);
      width: unit(160);
      height: unit(160);
    }

    &:nth-child(2) {
      background-image: radial-gradient(#626ef0, transparent 70%);
      top: unit(-40);
      right: unit(-40);
      width: unit(160);
      height: unit(160);
      animation-delay: -2s;
    }

    &:nth-child(3) {
      background-image: radial-gradient(#ca92ff, transparent 70%);
      bottom: unit(-50);
      left: unit(-60);
      width: unit(160);
      height: unit(160);
      animation-delay: -4s;
    }

    &:nth-child(4) {
      background-image: radial-gradient(#2ec0fa, transparent 70%);
      bottom: unit(-10);
      right: unit(-10);
      width: unit(100);
      height: unit(100);
      animation-delay: -6s;
    }

    @keyframes blob {
      @for $i from 0 through 10 {
        #{$i * 10}% {
          transform: translateX(calc(math.sin($i * 3.141592 * .2) * unit(10))) translateY(calc(math.cos($i * 3.141592 * .2) * unit(10)));
        }
      }
    }
  }

  &__arrow {
    position: fixed;
    top: .5rem;
    right: 5.6rem;
    font-size: 4rem;

    color: #d4eeff;
    line-height: 1;
    text-shadow:
      0 0 .5rem #2e31ff,
      0 0 1rem #2e31ff;

    animation: arrow 2s infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);

    mask-image: linear-gradient(black 30%, #0004);

    @keyframes arrow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-1rem);
      }
    }
  }

  &__title {
    font-size: unit(7);
    line-height: 1;
    mask-image: linear-gradient(black, #0004);
  }

  &__no-thanks-btn {
    float: right;
    color: #fff8;

    animation: appear 2s 5s both;

    @keyframes appear {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    
    span {
      text-decoration: underline;
    }
  }

  &__img {
    margin: unit(5) 0;
    z-index: -1;
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    border: 2px solid #fff2;
    box-shadow: 0 0 unit(20) #de73ff22;

    img {
      width: 100%;
      margin-bottom: -10%;
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      top: 72%;
      left: 27.7%;
      width: 65.5%;
      height: 17.3%;
      border-radius: unit(3);

      border: unit(.4) solid #92deff;
      box-shadow:
        0 0 unit(5) #0385ff inset,
        0 0 unit(4) #0385ff,
      ;
    }
  }

  &__unforgettable {
    :deep(span) {
      color: var(--color);
      text-shadow: 0 0 unit(3) var(--color), 0 0 unit(10) var(--color);
    }

    @for $i from 1 through 17 {
      & > :deep(.text-content-renderer > span:nth-child(3) .text-content-renderer--wiggly:nth-child(#{$i})) {
        --color: #{mix(#838dff, #71fffd, $weight: math.div($i, 17) * 100%)};
      }
    }
    @for $i from 1 through 8 {
      & > :deep(.text-content-renderer > span:nth-child(4) .text-content-renderer--wiggly:nth-child(#{$i})) {
        --color: #{mix(#d466ff, #838dff, $weight: math.div($i, 8) * 100%)};
      }
    }
  }

  p {
    font-size: unit(3.5);
    line-height: 1.5;
    margin-bottom: 2rem;
    filter: drop-shadow(0 0 unit(3) #000);
  }
}
</style>
