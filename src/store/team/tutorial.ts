import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useGameManager } from "../gameManager";
import { TutorialState } from "../../../shared/tutorial";

export interface TutorialHighlightElement {
  element: HTMLElement,
  margin?: number | [number, number] | [number, number, number, number],
  borderRadius?: number,
}

export const useTutorial = defineStore('tutorial', () => {
  const state = computed<TutorialState>(() => {
    const game = useGameManager()

    return game.phase.meta.tutorial ?? {}
  })

  const isTutorial = computed(() => {
    const game = useGameManager()

    return game.phase.meta.tutorial !== undefined
  })

  const highlightElements = ref<Record<string, TutorialHighlightElement>>({})

  function registerHighlightElement(key: string, element: TutorialHighlightElement) {
    highlightElements.value[key] = element
  }

  function unregisterHighlightElement(key: string) {
    delete highlightElements.value[key]
  }

  const highlightedElementPos = ref<{ x: number, y: number, width: number, height: number, borderRadius?: number } | null>(null)

  let elementWatchInterval: number
  function startElementWatch () {
    function update () {
      if (state.value.highlight) {
        highlightedElementPos.value = getElementPos(state.value.highlight) ?? null
      } else {
        stopElementWatch()
      }
    }

    update()
    elementWatchInterval = setInterval(update, 100) as any
  }

  function stopElementWatch () {
    clearInterval(elementWatchInterval)
    highlightedElementPos.value = null
  }

  watch(() => state.value.highlight, () => {
    if (state.value.highlight) {
      startElementWatch()
    } else {
      stopElementWatch()
    }
  }, { immediate: true })

  function getElementPos (el: string) {
    const element = highlightElements.value[el]

    if (element) {
      const rect = element.element.getBoundingClientRect()

      const margin = Array.isArray(element.margin)
        ? (element.margin.length === 2
          ? [element.margin[0], element.margin[1], element.margin[0], element.margin[1]]
          : element.margin
        )
        : [element.margin ?? 0, element.margin ?? 0, element.margin ?? 0, element.margin ?? 0]

      return {
        x: rect.left - margin[3],
        y: rect.top - margin[0],
        width: rect.width + margin[1] + margin[3],
        height: rect.height +  margin[0] + margin[2],
        borderRadius: element.borderRadius,
      }
    }
  }

  return {
    state,
    isTutorial,

    highlightElements,
    registerHighlightElement,
    unregisterHighlightElement,
    highlightedElementPos,
    getElementPos,
  }
})