import Page from "../Page.vue";
import BackCover from "./BackCover.vue";
import BackCoverBack from "./BackCoverBack.vue";
import Cover from "./FrontCover.vue";
import FrontCoverBack from "./FrontCoverBack.vue";

import Page0 from "./Page0.vue";
import Page0201 from "./Page02-01.vue";
import Page0312 from "./Page03-12.vue";
import Page0412 from "./Page04-12.vue";
import Page0701 from "./Page07-01.vue";
import Page0702 from "./Page07-02.vue";
import Page1012 from "./Page10-12.vue";
import Page1202 from "./Page12-02.vue";
import Page1412 from "./Page14-12.vue";
import Page1612 from "./Page16-12.vue";
import Page1801 from "./Page18-01.vue";
import Page1912 from "./Page19-12.vue";
import Page2112 from "./Page21-12.vue";
import Page2312 from "./Page23-12.vue";
import Page2801 from "./Page28-01.vue";
import Page2812 from "./Page28-12.vue";
import Page2912 from "./Page29-12.vue";
import Page31 from "./Page31.vue";

import PageSketch1 from "./PageSketch1.vue";
import PageSketch2 from "./PageSketch2.vue";
import PageSketch3 from "./PageSketch3.vue";
import PageSketch4 from "./PageSketch4.vue";
import PageSketch5 from "./PageSketch5.vue";
import PageSketch6 from "./PageSketch6.vue";
import Page0401 from "./Page04-01.vue";

const _pages = [
  FrontCoverBack,
  Page0,
  Page0312,
  Page0412,
  Page1012,
  PageSketch3,
  Page1412,
  Page1612,
  Page1912,
  Page2112,
  Page2312,
  PageSketch2,
  Page2812,
  Page2912,
  Page0201,
  Page0401,
  Page0701,
  PageSketch5,
  Page1801,
  PageSketch6,
  Page2801,
  PageSketch1,
  Page0702,
  Page1202,
  PageSketch4,
  ...Array(9).fill(Page),
  Page31,
  BackCoverBack
]

export const pages = [
  Cover,
  ..._pages,
  BackCover,
]