import { Entry } from "../../suspectDatabase/entry";
import { italic, textContent } from "../../textContent";
import { phineas } from "../suspects";

export const diaryEntries: Entry[] = [
  {
    id: 'burn-the-diary',
    title: italic('"VERBRENNT ES!"'),
    suspectId: phineas.id,
    imageAssetId: 'thumbnails/burn-the-diary-postit.webp',
    description: textContent([
      'Ein Post-It auf dem steht: ',
      italic('"Wenn das jemand findet nachdem ich tot bin, VERBRENNT ES!"'),
      '.\n\nKönnte das ein Hinweis auf ein Geheimnis sein, das Phineas mit ins Grab nehmen wollte?',
    ])
  }
];