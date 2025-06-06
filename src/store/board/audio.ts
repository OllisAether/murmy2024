import { computed } from "@vue/reactivity";
import { defineStore } from "pinia";
import { ref, watch, WatchStopHandle } from "vue";
import { useGameManager } from "../gameManager";

export const useAudio = defineStore('audio', () => {
  const masterVolume = ref(1)
  const voteVolume = ref(1)
  const mediaVolume = ref(1)
  const musicVolume = ref(1)

  const controlVolumeListeners = ref<{ off: WatchStopHandle, audio: HTMLMediaElement }[]>([])
  function controlVolume(audio: HTMLMediaElement, type: 'vote' | 'media' | 'music', multiplier = 1) {
    let volumeType

    switch (type) {
      case 'vote':
        volumeType = voteVolume
        break
      case 'media':
        volumeType = mediaVolume
        break
      case 'music':
        volumeType = musicVolume
        break
    }

    const off = watch([volumeType, masterVolume], () => {
      audio.volume = volumeType.value * masterVolume.value * multiplier
    }, { immediate: true, deep: true })

    controlVolumeListeners.value.push({ off, audio })

    return off
  }

  function offControlVolume(audio: HTMLMediaElement) {
    const listener = controlVolumeListeners.value.find(listener => listener.audio === audio)

    if (listener) {
      listener.off()
      controlVolumeListeners.value.splice(controlVolumeListeners.value.indexOf(listener), 1)
    }
  }

  function fade (audio: HTMLMediaElement, duration: number, easing: (t: number) => number = t => t) {
    return new Promise<void>((resolve) => {
      offControlVolume(audio)

      const start = audio.volume
      const startTime = Date.now()

      function step () {
        const elapsed = Date.now() - startTime

        const progress = elapsed / duration
        const volume = start * (1 - easing(progress))

        audio.volume = Math.max(0, volume)

        if (audio.volume > 0) {
          requestAnimationFrame(step)
        } else {
          audio.pause()
          resolve()
        }
      }

      step()
    })
  }

  const backgroundPlaylist = [
    'music/HalloweenBg.mp3',
    'music/murmytheme.mp3',
    'music/HalloweenBg2.mp3',
  ]
  const trackIndex = ref(0)
  const currentTrack = ref<HTMLAudioElement | null>(null)

  function startBackgroundMusic () {
    if (currentTrack.value) {
      currentTrack.value.pause()
    }

    const audio = new Audio(useGameManager().getAsset(backgroundPlaylist[trackIndex.value])?.content)
    controlVolume(audio, 'music')

    audio.play()

    audio.addEventListener('ended', nextTrack)

    currentTrack.value = audio
  }

  function nextTrack () {
    trackIndex.value = (trackIndex.value + 1) % backgroundPlaylist.length
    currentTrack.value?.removeEventListener('ended', nextTrack)

    if (currentTrack.value) {
      fade(currentTrack.value, 1000)
      currentTrack.value = null
    }
    startBackgroundMusic()
  }

  async function stopBackgroundMusic () {
    currentTrack.value?.removeEventListener('ended', nextTrack)

    if (currentTrack.value) {
      fade(currentTrack.value, 1000)
      currentTrack.value = null
      trackIndex.value = (trackIndex.value + 1) % backgroundPlaylist.length
    }
  }

  // #region Save/Load

  function save() {
    localStorage.setItem('audio', JSON.stringify({
      masterVolume: masterVolume.value,
      voteVolume: voteVolume.value,
      mediaVolume: mediaVolume.value,
      musicVolume: musicVolume.value,
      trackIndex: trackIndex.value,
    }))
  }
  watch([masterVolume, voteVolume, mediaVolume, musicVolume], save, { deep: true })

  function load() {
    const audio = localStorage.getItem('audio')

    if (audio) {
      try {
      const parsed = JSON.parse(audio)

      if (typeof parsed === 'object') {
        if ('masterVolume' in parsed && typeof parsed.masterVolume === 'number') {
          masterVolume.value = parsed.masterVolume
        }
        if ('voteVolume' in parsed && typeof parsed.voteVolume === 'number') {
          voteVolume.value = parsed.voteVolume
        }
        if ('mediaVolume' in parsed && typeof parsed.mediaVolume === 'number') {
          mediaVolume.value = parsed.mediaVolume
        }
        if ('musicVolume' in parsed && typeof parsed.musicVolume === 'number') {
          musicVolume.value = parsed.musicVolume
        }

        if ('trackIndex' in parsed && typeof parsed.trackIndex === 'number') {
          trackIndex.value = parsed.trackIndex
        }
      } else {
        throw new Error('Invalid audio data format')
      }
      } catch (error) {
      console.error('Error parsing audio data:', error)
      }
    }
  }
  load()
  // #endregion

  return {
    masterVolume,

    voteVolume: computed(() => voteVolume.value * masterVolume.value),
    mediaVolume: computed(() => mediaVolume.value * masterVolume.value),
    musicVolume: computed(() => musicVolume.value * masterVolume.value),

    rawVoteVolume: voteVolume,
    rawMediaVolume: mediaVolume,
    rawMusicVolume: musicVolume,

    controlVolume,
    offControlVolume,
    fade,

    startBackgroundMusic,
    stopBackgroundMusic,
    nextTrack,
    currentTrack,
  }
})