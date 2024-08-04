import { defineStore } from "pinia";
import { ref } from "vue";
import { Entry } from "../../shared/suspectDatabase/entry";
import { useGameManager } from "./gameManager";

export interface Collectable {
  entry: Entry
  element: HTMLDivElement
}

export const useCollectables = defineStore('collectables', () => {
  const collectables = ref<Record<string, Collectable>>({})
  const padding = 20

  function setCollectable (id: string, collectable: Collectable) {
    collectables.value[id] = collectable
  }

  function removeCollectable (id: string) {
    delete collectables.value[id]
  }

  function getCollectableAt (x: number, y: number, withPadding = false): Collectable[] {
    const game = useGameManager()

    return Object.values(collectables.value)
      .filter(collectable => {
        const { left, top, right, bottom } = collectable.element.getBoundingClientRect()
        if (withPadding) {
          return left - padding <= x && right + padding >= x && top - padding <= y && bottom + padding >= y
        }

        return left <= x && right >= x && top <= y && bottom >= y
      }).filter(collectable => {
        return !game.database.entries
          .map(entry => entry.matterId)
          .includes(collectable.entry.matterId)
      })
  }

  function markCollectableAt (x: number, y: number) {
    const game = useGameManager()
    let collectables = getCollectableAt(x, y)
      .filter(collectable => {
        return !game.database.entries
          .map(entry => entry.matterId)
          .includes(collectable.entry.matterId)
      })

    if (collectables.length === 0) {
      collectables = getCollectableAt(x, y, true)
        .filter(collectable => {
          return !game.database.entries
            .map(entry => entry.matterId)
            .includes(collectable.entry.matterId)
        })
    }

    collectables.forEach(collectable => {
      game.addDatabaseEntry(collectable.entry)
    })

    return collectables.length > 0
  }

  return {
    collectables,
    setCollectable,
    removeCollectable,
    getCollectableAt,
    markCollectableAt
  }
})