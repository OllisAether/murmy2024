export function getPathToElement(element: HTMLElement): HTMLElement[] {
  const path: HTMLElement[] = []

  let currentElem: HTMLElement | null = element

  while (currentElem) {
    path.push(currentElem)
    currentElem = currentElem.parentElement
  }

  return path
}