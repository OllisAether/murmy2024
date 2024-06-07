<template>
  <button
    :class="[
      'app-nav-btn',
      'app-nav-btn--' + type, {
        'app-nav-btn--active': active
      }]"
  >
    <div class="app-nav-btn__icon-bg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64">
        <path class="outline" stroke-width="2" opacity="0.6" d="M1 14.414 14.414 1H63v48.586L49.586 63H1V14.414Z"/>
        <path class="background" d="M4 16.25 16.25 4H60v43.75L47.75 60H4V16.25Z"/>

        <defs>
          <linearGradient id="socialBg" x1="0" x2="64" y1="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#fdbe2a"/>
            <stop offset=".50" stop-color="#f22b1d"/>
            <stop offset="1" stop-color="#b91df2"/>
          </linearGradient>
          <linearGradient id="searchBg" x1="0" x2="0" y1="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#024eff"/>
            <stop offset="1" stop-color="#cc00ff"/>
          </linearGradient>
          <linearGradient id="chatBg" x1="0" x2="0" y1="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#177241"/>
            <stop offset="1" stop-color="#8FDD22"/>
          </linearGradient>
          <linearGradient id="mailBg" x1="0" x2="0" y1="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#90105b"/>
            <stop offset="1" stop-color="#ff0000"/>
          </linearGradient>
          <linearGradient id="filesBg" x1="0" x2="0" y1="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#974a0f"/>
            <stop offset="1" stop-color="#ffc800"/>
          </linearGradient>
          <linearGradient id="toolsBg" x1="0" x2="0" y1="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#49324d"/>
            <stop offset="1" stop-color="#6C7E83"/>
          </linearGradient>
        </defs>
      </svg>

      <VIcon class="app-nav-btn__icon">{{ icon }}</VIcon>
    </div>
    <span class="app-nav-btn__name">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type: string
  active: boolean
  icon: string
}>()
</script>

<style lang="scss" scoped>
.app-nav-btn {
  z-index: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  gap: 0.5rem;

  &--active {
    .app-nav-btn__name {
      transform: translateY(.2rem);
    }

    .app-nav-btn__icon-bg {
      transform: scale(1.2);

      &::before {
        opacity: 1;
      }

      &::after {
        height: 50%;
        top: 25%;
        opacity: 1;

        @media screen and (max-width: 768px) {
          height: .2rem;
          top: unset;
          width: 50%;
          left: 25%;
        }
      }
    }
  }

  &__icon {
    font-size: 2.5rem;
    color: white;
    text-shadow: 0 0.1rem 0.15rem #3c01315b;

    @media screen and (max-width: 768px) {
      font-size: 1.7rem;
    }
  }

  &__icon-bg {
    @function makePolygon ($offset, $edge) {
      @return #{
        $offset ($offset + $edge),
        ($offset + $edge) $offset,
        calc(100% - $offset) $offset,
        calc(100% - $offset) calc(100% - $edge - $offset),
        calc(100% - $edge - $offset) calc(100% - $offset),
        $offset calc(100% - $offset),
        $offset ($offset + $edge)
      }
    }

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;

    will-change: transform;
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);

    svg {
      position: absolute;
      inset: 0;
    }

    @media screen and (max-width: 768px) {
      width: 2.5rem;
      height: 2.5rem;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: currentColor;
      border-radius: inherit;
      z-index: -1;
      filter: blur(2rem);
      opacity: 0.2;
      will-change: opacity;
      transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &::after {
      content: '';
      position: absolute;
      width: .2rem;
      height: 0;
      top: 50%;
      left: calc(100% + .3rem);
      background: currentColor;
      border-radius: inherit;
      z-index: -1;
      opacity: 0;

      will-change: height, top, opacity, width, left;

      transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1);

      @media screen and (max-width: 768px) {
        width: 0;
        height: .2rem;
        bottom: calc(100% + .3rem);
        left: 50%;
      }
    }
  }
  
  &__name {
    font-size: 0.75rem;
    color: white;
    
    will-change: transform;
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &--files {
    color: #ffc800;

    svg .outline {
      stroke: url(#filesBg);
    }

    svg .background {
      fill: url(#filesBg);
    }
  }

  &--chat {
    color: #8fdd22;

    svg .outline {
      stroke: url(#chatBg);
    }

    svg .background {
      fill: url(#chatBg);
    }
  }

  &--social {
    color: #f21dc7;

    svg .outline {
      stroke: url(#socialBg);
    }

    svg .background {
      fill: url(#socialBg);
    }
  }

  &--search {
    color: #cc00ff;

    svg .outline {
      stroke: url(#searchBg);
    }

    svg .background {
      fill: url(#searchBg);
    }
  }

  &--mail {
    color: #ff0000;

    svg .outline {
      stroke: url(#mailBg);
    }

    svg .background {
      fill: url(#mailBg);
    }
  }

  &--tools {
    color: #6c7e83;

    svg .outline {
      stroke: url(#toolsBg);
    }

    svg .background {
      fill: url(#toolsBg);
    }
  }
}
</style>