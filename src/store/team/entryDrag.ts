import { getPathToElement } from "@/utils/getPathToElement";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface DropZone {
  el: HTMLElement
  onDrop: (entryId: string) => void
}

export const useEntryDrag = defineStore('entryDrag', () => {
  const isDragging = ref(false)
  const draggedEntry = ref<string | null>(null)
  const dragPos = ref({ x: 0, y: 0 })

  const dropZones = ref<DropZone[]>([])
  const hoveringDropZone = ref<DropZone | null>(null)

  function startDrag (entryId: string) {
    isDragging.value = true
    draggedEntry.value = entryId
  }

  function moveDrag (pos: { x: number, y: number }) {
    dragPos.value = pos

    const element = document.elementFromPoint(pos.x, pos.y)
    const path = getPathToElement(element as HTMLElement)

    const zone = path.reduce((zone: DropZone | null, element) => {
      if (zone) return zone

      return dropZones.value.find(dropZone => dropZone.el === element) ?? null
    }, null)

    hoveringDropZone.value = zone
  }

  function endDrag () {
    const element = document.elementFromPoint(dragPos.value.x, dragPos.value.y)
    const path = getPathToElement(element as HTMLElement)

    const zone = path.reduce((zone: { el: HTMLElement, onDrop: (entryId: string) => void } | null, element) => {
      if (zone) return zone

      return dropZones.value.find(dropZone => dropZone.el === element) ?? null
    }, null)

    if (zone) {
      zone.onDrop(draggedEntry.value!)
    }

    isDragging.value = false
    hoveringDropZone.value = null
    draggedEntry.value = null
  }

  function registerDropZone (el: HTMLElement, onDrop: (entryId: string) => void) {
    dropZones.value.push({ el, onDrop })
  }

  function unregisterDropZone (el: HTMLElement) {
    const index = dropZones.value.findIndex(zone => zone.el === el)
    if (index !== -1) {
      dropZones.value.splice(index, 1)
    }
  }

  return {
    isDragging,
    draggedEntry,
    dragPos,
    startDrag,
    moveDrag,
    endDrag,
    dropZones,
    hoveringDropZone,
    registerDropZone,
    unregisterDropZone
  }
})