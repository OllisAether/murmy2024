import { defineStore } from "pinia";
import { ref } from "vue";
import { useGameManager } from "./gameManager";
import { getPathToElement } from "@/utils/getPathToElement";

export interface Collectable {
  entryId: string
  element: HTMLDivElement
}

export const useCollectables = defineStore('collectables', () => {
  const collectables = ref<Record<string, Collectable>>({})

  function setCollectable (id: string, collectable: Collectable) {
    collectables.value[id] = collectable
  }

  function removeCollectable (id: string) {
    delete collectables.value[id]
  }

  function getCollectableAt (x: number, y: number): Collectable | 'alreadyCollected' | void {
    const game = useGameManager()

    const element = document.elementFromPoint(x, y)
    const path = getPathToElement(element as HTMLElement)

    const collectable = path.reduce((collectable: Collectable | undefined, element) => {
      if (collectable) return collectable

      return Object.values(collectables.value)
        .find(collectable => collectable.element === element)
    }, undefined)

    if (!collectable) return

    if (game.database.entries
      .includes(collectable.entryId)) {
      return 'alreadyCollected'
    }

    return collectable
  }

  function markCollectableAt (x: number, y: number) {
    const game = useGameManager()
    let collectable = getCollectableAt(x, y)

    if (collectable === 'alreadyCollected') {
      return 'alreadyCollected'
    }

    if (collectable) {
      game.addDatabaseEntry(collectable.entryId)
    }

    return !!collectable
  }

  return {
    collectables,
    setCollectable,
    removeCollectable,
    getCollectableAt,
    markCollectableAt,

    // collectedEntries,
    // setCollectedEntry,
    // removeCollectedEntry,
    // getCollectedEntry,
    // waitForCollectedEntry,
  }
})