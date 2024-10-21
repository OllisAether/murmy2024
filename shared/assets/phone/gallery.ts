import moment from "moment";
import { Gallery } from "../../phone/gallery";

export const gallery: Gallery = [
  {
    assetId: "phone/gallery/image-1.webp",
    date: moment("2013-01-04 08:25"),
  },
  {
    assetId: "phone/gallery/image-2.webp",
    date: moment("2013-01-04 07:39"),
  },

  {
    assetId: "phone/gallery/CD4.webp",
    date: moment("2012-12-21 06:16"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entry: {
          id: "phineas-dvd-fotos",
          title: "Phineas' selbstgebrannte DVDs",
          imageAssetId: "phone/gallery/CD1.webp",
          suspectId: "phineas",
          description:
            "Phineas hat einige Fotos von selbstgebrannten DVDs von Filmen mit einem Preis beschriftet.\n\nVerkauft er illegale Kopien?",
        },
      },
    ],
  },
  {
    assetId: "phone/gallery/CD5.webp",
    date: moment("2012-12-21 06:16"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entryId: "phineas-dvd-fotos",
      },
    ],
  },
  {
    assetId: "phone/gallery/CD6.webp",
    date: moment("2012-12-21 06:17"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entryId: "phineas-dvd-fotos",
      },
    ],
  },
  {
    assetId: "phone/gallery/CD7.webp",
    date: moment("2012-12-21 06:15"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entryId: "phineas-dvd-fotos",
      },
    ],
  },
  {
    assetId: "phone/gallery/CD3.webp",
    date: moment("2012-12-21 06:15"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entryId: "phineas-dvd-fotos",
      },
    ],
  },
  {
    assetId: "phone/gallery/CD2.webp",
    date: moment("2012-12-21 06:13"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entryId: "phineas-dvd-fotos",
      },
    ],
  },
  {
    assetId: "phone/gallery/CD1.webp",
    date: moment("2012-12-21 06:12"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entryId: "phineas-dvd-fotos",
      },
    ],
  },

  {
    assetId: "phone/gallery/image-5.webp",
    date: moment("2012-12-02 17:49"),
  },
  {
    assetId: "phone/gallery/image-4.webp",
    date: moment("2013-12-02 14:32"),
  },
  {
    assetId: "phone/gallery/image-10.webp",
    date: moment("2012-12-02 10:21"),
  },
  {
    assetId: "phone/gallery/image-6.webp",
    date: moment("2012-11-25 14:23"),
  },
  {
    assetId: "phone/gallery/image-7.webp",
    date: moment("2012-11-15 19:46"),
  },
  {
    assetId: "phone/background.webp",
    date: moment("2012-11-11 17:30"),
  },
  {
    assetId: "phone/gallery/image-3.webp",
    date: moment("2013-11-10 14:49"),
  },
  {
    assetId: "phone/gallery/image-8.webp",
    date: moment("2012-11-10 10:12"),
  },
  {
    assetId: "phone/gallery/image-9.webp",
    date: moment("2012-11-08 18:42"),
  },
  {
    assetId: "Kindheitsfoto.webp",
    date: moment("2012-11-08 15:20"),
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entry: {
          id: 'phineas-kindheitsfoto',
          title: 'Kindheitsfoto von Phineas und Phoebe',
          imageAssetId: 'Kindheitsfoto.webp',
          suspectId: 'phineas',
          description: 'Ein Kindheitsfoto von Phineas. Er scheint ein glückliches Kind gewesen zu sein.'
        }
      }
    ]
  },
];
