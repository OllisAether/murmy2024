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

  function setCollectable (id: string, collectable: Collectable) {
    collectables.value[id] = collectable
  }

  function removeCollectable (id: string) {
    delete collectables.value[id]
  }

  function getCollectableAt (x: number, y: number): Collectable | undefined {
    const game = useGameManager()

    const element = document.elementFromPoint(x, y)

    const collectable = Object.values(collectables.value).find(collectable => collectable.element === element)

    if (!collectable) return

    // Check if collectable is already collected
    if (game.database.entries
      .map(entry => entry.matterId)
      .includes(collectable.entry.matterId)) return

    return collectable

    // return Object.values(collectables.value)
    //   .filter(collectable => {
    //     const { left, top, right, bottom } = collectable.element.getBoundingClientRect()
    //     if (withPadding) {
    //       return left - padding <= x && right + padding >= x && top - padding <= y && bottom + padding >= y
    //     }

    //     return left <= x && right >= x && top <= y && bottom >= y
    //   }).filter(collectable => {
    //     return !game.database.entries
    //       .map(entry => entry.matterId)
    //       .includes(collectable.entry.matterId)
    //   })
  }

  function markCollectableAt (x: number, y: number) {
    const game = useGameManager()
    let collectable = getCollectableAt(x, y)

    // if (collectables.length === 0) {
    //   collectables = getCollectableAt(x, y, true)
    //     .filter(collectable => {
    //       return !game.database.entries
    //         .map(entry => entry.matterId)
    //         .includes(collectable.entry.matterId)
    //     })
    // }

    // collectables.forEach(collectable => {
    //   game.addDatabaseEntry(collectable.entry)
    // })

    if (collectable) {
      game.addDatabaseEntry(collectable.entry)
    }

    return !!collectable
  }

  // const collectedEntries = ref<Record<string, Collectable>>({})

  // function setCollectedEntry (entry: Collectable) {
  //   collectedEntries.value[entry.entry.matterId] = entry
  // }

  // function removeCollectedEntry (matterId: string) {
  //   delete collectedEntries.value[matterId]
  // }

  // function getCollectedEntry (matterId: string) {
  //   return collectedEntries.value[matterId]
  // }

  // function waitForCollectedEntry (matterId: string, cb: (entry: Collectable) => void): () => void {
  //   const entry = getCollectedEntry(matterId)

  //   if (entry) {
  //     cb(entry)
  //     return () => {}
  //   }

  //   const stop = watch(collectedEntries, collectedEntries => {
  //     const entry = collectedEntries[matterId]

  //     if (entry) {
  //       cb(entry)
  //       stop()
  //     }
  //   }, { immediate: true, deep: true })

  //   return stop
  // }

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