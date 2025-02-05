import { Entry } from "../../suspectDatabase/entry";
import { italic, textContent } from "../../textContent";
import { cassandra, ivy, justin, phineas, phoebe } from "../suspects";

export const diaryEntries: Entry[] = [
  {
    id: 'burn-the-diary',
    suspectId: phineas.id,
    imageAssetId: 'thumbnails/burn-the-diary-postit.webp',
    
    title: italic('„VERBRENNT ES!“'),
    description: textContent([
      'Ein Post-It auf dem steht: ',
      italic('„Wenn das jemand findet nachdem ich tot bin, VERBRENNT ES!“'),
      '.\n\nKönnte das ein Hinweis auf ein Geheimnis sein, das Phineas mit ins Grab nehmen wollte?',
    ])
  }, // in Phone
  {
    id: 'diary-dvd',
    suspectId: phineas.id,

    title: 'Verkauf von selbstgebrannten DVDs',
    description: 'Phineas verkauft selbstgebrannte DVDs von Filmen.\n\nVerkauft er illegale Kopien?'
  }, // in Phone
  {
    id: 'diary-cassy-verfolgt',
    suspectId: cassandra.id,
    title: 'Verfolgt Phineas',
    description: 'Cassandra verfolgt Phineas.\n\nWas will sie von ihm?'
  }, // in Phone
  {
    id: 'diary-phoebe-ignoriert',
    suspectId: phoebe.id,
    title: 'Ignoriert Phineas in der Schule',
    description: 'Phoebe ignoriert Phineas in der Schule.\n\nWarum nur in der Schule?'
  },
  {
    id: 'diary-cassy-rituale',
    suspectId: cassandra.id,
    title: 'Phineas als Opfer in Ritualen',
    description: 'Cassandra schreibt Phineas Nachrichten, in denen sie ihn in Ritualen opfern will.\n\nWas will sie von ihm?'
  }, // in Phone
  {
    id: 'diary-cassy-gore',
    suspectId: cassandra.id,
    title: 'Zeigt Phineas Gore-Bilder',
    description: 'Cassandra zeigt Phineas Gore-Bilder.\n\nEkelt sie ihn damit ab?'
  }, // in Phone
  {
    id: 'diary-kriminelle-tips',
    suspectId: phineas.id,
    title: 'Kriminelle Tipps',
    description: 'Phineas hat vor Hr. Montague nach Tipps für kriminelle Aktivitäten zu fragen.\n\nWas hat er vor?'
  },
  {
    id: 'diary-justin-mobbing',
    suspectId: justin.id,
    title: 'Nervt Phineas',
    description: 'Justin nervt Phineas mit Mobbing. Phineas spürt große Aggressionen gegenüber Justin.\n\nIst Phineas gewalttätig?'
  }, // in Phone
  {
    id: 'diary-phoebe-sagt',
    suspectId: phineas.id,
    title: 'Weisheiten von Phoebe',
    description: 'Phineas schreibt oft über Phoebe und ihre Weisheiten.\n\nWas hat sie ihm gesagt?'
  }, // in Phone
  {
    id: 'phineas-nummer-phoebe',
    suspectId: phineas.id,
    title: 'Nur Phoebe hat Phineas Nummer',
    description: 'Phineas hat nur Phoebe seine Nummer gegeben.\n\nWarum nur ihr?'
  }, // in Phone
  {
    id: 'diary-ivy-nachrichten',
    suspectId: ivy.id,
    title: 'Schickt Phineas Liebesnachrichten',
    description: 'Ivy schickt Phineas Liebesnachrichten.\n\nWas will sie von ihm?'
  }, // in Phone
  {
    id: 'diary-phoebe-reden',
    suspectId: phineas.id,
    title: 'Will mit Phoebe reden',
    description: 'Phineas möchte unbedingt mit Phoebe reden.\n\nWas hat er ihr zu sagen?'
  }, // in Phone
  {
    id: 'diary-wohnung',
    suspectId: cassandra.id,
    title: 'Bilder von Phineas\' Wohnung',
    description: 'Cassandra hat Bilder von Phineas\' Wohnung gemacht.\n\nStalkt sie ihn?'
  }, // in Phone
  {
    id: 'diary-hugo-distanter',
    suspectId: phineas.id,
    title: 'Hr. Montague ist distanzierter',
    description: 'Hr. Montague wirkt distanziert als sonst.'
  },
  {
    id: 'diary-justin-dvd',
    suspectId: justin.id,
    title: 'Phineas bietet Justin DVDs an',
    description: 'Phineas bietet Justin DVDs an, damit er aufhört ihn zu nerven.'
  }, // in Phone
  {
    id: 'diary-schaedel',
    suspectId: cassandra.id,
    title: 'Schädel vor Phineas\' Haustür',
    description: 'Cassandra hat einen Schädel vor Phineas\' Haustür gelegt.\n\nWas will sie ihm damit sagen?'
  }, // in Phone
  {
    id: 'diary-phoebe-verraeter',
    suspectId: phineas.id,
    title: 'Phoebe ist ein Verräter',
    description: 'Phineas schreibt, dass Phoebe ein Verräter ist.'
  } // in Phone
];