import Page from "../Page.vue";
import BackCover from "./BackCover.vue";
import Cover from "./Cover.vue";
import Page1 from "./Page1.vue";

const _pages = [
  Page1,
]

if (32 - _pages.length > 0) {
  _pages.push(...Array(32 - _pages.length).fill(Page))
}

export const pages = [
  Cover,
  ..._pages,
  BackCover,
]