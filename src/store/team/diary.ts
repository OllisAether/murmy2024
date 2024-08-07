import { defineStore } from "pinia";
import { ref } from "vue";

export const useDiary = defineStore('diary', () => {
  const locked = ref(false)
  const page = ref(0)
  const pin = import.meta.env.VITE_PIN as string

  function unlock(_pin: string) {
    console.log('unlocking', _pin)
    if (!locked.value) {
      return false
    }

    if (pin === _pin) {
      locked.value = false
      return true
    }

    return false
  }

  // #region Save
  function save() {
    localStorage.setItem('diary', JSON.stringify({
      page: page.value,
    }))
  }

  function load() {
    const data = localStorage.getItem('diary')
    if (data) {
      const parsed = JSON.parse(data)
      page.value = parsed.page
    }
  }

  load()
  useDiary().$subscribe(save)
  // #endregion

  return {
    locked,
    unlock,
    page
  }
})