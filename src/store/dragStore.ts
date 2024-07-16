import { defineStore } from "pinia";
import { ref } from "vue";

export const useDrag = defineStore('drag', () => {
  const currentDrag = ref<{
    data: string,
    pos: {
      x: number,
      y: number
    }
  } | null>(null)
  
  function startDrag (data: string, event: PointerEvent) {
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', drop)

    currentDrag.value = {
      data,
      pos: {
        x: event.clientX,
        y: event.clientY
      }
    }

    let lastDroppable: Element | null = null
    function move (event: PointerEvent) {
      currentDrag.value = {
        data,
        pos: {
          x: event.clientX,
          y: event.clientY
        }
      }

      const elements = document.elementsFromPoint(event.clientX, event.clientY)
      const droppable = elements.find((el) => (el as unknown as HTMLOrSVGElement).dataset.droppable !== undefined)

      if (lastDroppable !== droppable) {
        if (lastDroppable) {
          lastDroppable.dispatchEvent(new CustomEvent('customdragleave', {
            detail: currentDrag.value?.data
          }))
        }

        if (droppable) {
          droppable.dispatchEvent(new CustomEvent('customdragenter', {
            detail: currentDrag.value?.data
          }))
        }

        lastDroppable = droppable ?? null
      }
    }
  
    function drop (event: PointerEvent) {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', drop)

      const elements = document.elementsFromPoint(event.clientX, event.clientY)
      const droppable = elements.find((el) => (el as unknown as HTMLOrSVGElement).dataset.droppable !== undefined)

      if (droppable) {
        droppable.dispatchEvent(new CustomEvent('customdrop', {
          detail: currentDrag.value?.data
        }))
      }

      currentDrag.value = null
    }
  }

  return {
    currentDrag,
    startDrag
  }
})