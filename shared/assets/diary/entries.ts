import { Entry } from "../../suspectDatabase/entry";
import { italic, textContent } from "../../textContent";

export const diaryEntries: Entry[] = [
  {
    id: 'burn-the-diary',
    title: italic('"VERBRENNT ES!"'),
    suspectId: 'general',
    description: textContent([
      'Ein Post-It auf dem steht: ',
      italic('"Wenn das jemand findet nachdem ich tot bin, VERBRENNT ES!"'),
      '.\n\nWas hat das Opfer zu verbergen?',
    ])
  }
];