<template>
  <button
    :class="[
      'app-nav-btn',
      'app-nav-btn--' + type, {
        'app-nav-btn--active': active
      }]"
  >
    <div class="app-nav-btn__icon-bg">
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
    font-size: 2.2rem;
    color: white;

    @media screen and (max-width: 768px) {
      font-size: 1.5rem;
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
    outline-offset: -.4rem;
    // box-shadow: inset 0 0 0 0.2rem #fff3;
    clip-path: polygon(makePolygon(0rem, .75rem));
    clip-rule: evenodd;
    background: var(--bg);
    
    will-change: transform;
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    
    @media screen and (max-width: 768px) {
      width: 2.5rem;
      height: 2.5rem;
      clip-path: polygon(makePolygon(0rem, .5rem));
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
    --bg: linear-gradient(#ffc800, #971c0f);
    color: #ffc800;
  }

  &--chat {
    --bg: linear-gradient(#25D366, #02515b);
    color: #25D366;
  }

  &--social {
    --bg: linear-gradient(#1DA1F2, #551366);
    color: #1DA1F2;
  }

  &--mail {
    --bg: linear-gradient(#ff0000, #860450);
    color: #ff0000;
  }

  &--tools {
    --bg: linear-gradient(#6c7e83, #321936);
    color: #6c7e83;
  }
}
</style>