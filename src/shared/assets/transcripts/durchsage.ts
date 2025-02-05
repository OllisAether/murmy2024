import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const durchsage: Transcript =  {
  id: 'durchsage',
  for: 'Intro.mp4',
  thumbnailAssetId: 'thumbnails/durchsage.webp',
  title: 'Schuldurchsage',
  content: [
    ['hugo', 'Liebe Schülerinnen und Schüler, hier spricht Herr Montague.\n\nGestern wurde meine Tochter Ivy auf tragische Weise aus dem Leben gerissen. Sie war eine liebevolle, unschuldige Seele, immer für andere da und trotzdem hat ihr jemand so etwas angetan. Ich bitte euch um eine Schweigeminute, um ihrer zu gedenken. Und um an das zu erinnern, was ihr wiederfahren ist. Wir müssen dafür sorgen, dass sie die Gerechtigkeit bekommt, die sie verdient.\n\nIvy, sie wurde- sie wurde ermordet'],
    [null, 'Schuldurchsage endet abrupt']
  ],
  speakers: [
    {
      id: 'hugo',
      name: getSuspectById('hugo')?.name ?? '',
      color: getSuspectById('hugo')?.color
    }
  ]
}