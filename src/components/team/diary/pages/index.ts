import Page from "../Page.vue";
import BackCover from "./BackCover.vue";
import BackCoverBack from "./BackCoverBack.vue";
import Cover from "./FrontCover.vue";
import FrontCoverBack from "./FrontCoverBack.vue";

import Page0 from "./Page0.vue";

import PageSketch1 from "./PageSketch1.vue";
import PageSketch2 from "./PageSketch2.vue";
import PageSketch3 from "./PageSketch3.vue";
import PageSketch4 from "./PageSketch4.vue";
import PageSketch5 from "./PageSketch5.vue";
import PageSketch6 from "./PageSketch6.vue";
import PageSketch7 from "./PageSketch7.vue";

const _pages = [
  FrontCoverBack,
  Page0,
  PageSketch1,
  PageSketch2,
  PageSketch3,
  PageSketch4,
  PageSketch5,
  PageSketch6,
  PageSketch7,
  ...Array(0).fill(Page),
  BackCoverBack
]

export const pages = [
  Cover,
  ..._pages,
  BackCover,
]