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
  },
  {
    id: 'diary-dvd',
    suspectId: phineas.id,

    title: 'Verkauf von selbstgebrannten DVDs',
    description: 'Phineas verkauft selbstgebrannte DVDs von Filmen.\n\nVerkauft er illegale Kopien?'
  },
  {
    id: 'diary-cassy-verfolgt',
    suspectId: cassandra.id,
    title: 'Verfolgt Phineas',
    description: 'Cassandra verfolgt Phineas.\n\nWas will sie von ihm?'
  },
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
    description: 'Cassandra schreibt Phineas Nachrichten, in denen sie ihn in Ritualen opfern will und ihm Bilder von Gore zeigt.\n\nWas will sie von ihm?'
  },
  {
    id: 'diary-kriminelle-tips',
    suspectId: phineas.id,
    title: 'Kriminelle Tipps',
    description: 'Phineas hat vor Hr. Montague nach Tipps für kriminelle Aktivitäten zu fragen.\n\nWas hat er vor?'
  },
  {
    id: 'diary-justin-mobbing',
    suspectId: justin.id,
    title: 'Justin nervt Phineas',
    description: 'Justin nervt Phineas mit Mobbing. Phineas spürt große Aggressionen gegenüber Justin.\n\nIst Phineas gewalttätig?'
  },
  {
    id: 'phineas-nummer-phoebe',
    suspectId: phineas.id,
    title: 'Nur Phoebe hat Phineas Nummer',
    description: 'Phineas hat nur Phoebe seine Nummer gegeben.\n\nWarum nur ihr?'
  },
  {
    id: 'diary-ivy-nachrichten',
    suspectId: ivy.id,
    title: 'Schickt Phineas Liebesnachrichten',
    description: 'Ivy schickt Phineas Liebesnachrichten.\n\nWas will sie von ihm?'
  },
  {
    id: 'diary-phoebe-reden',
    suspectId: phineas.id,
    title: 'Phineas will mit Phoebe reden',
    description: 'Phineas möchte unbedingt mit Phoebe reden.\n\nWas hat er ihr zu sagen?'
  },
  {
    id: 'diary-wohnung',
    suspectId: cassandra.id,
    title: 'Bilder von Phineas\' Wohnung',
    description: 'Cassandra hat Bilder von Phineas\' Wohnung gemacht.\n\nStalkt sie ihn?'
  },
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
  },
  {
    id: 'diary-schaedel',
    suspectId: cassandra.id,
    title: 'Schädel vor Phineas\' Haustür',
    description: 'Cassandra hat einen Schädel vor Phineas\' Haustür gelegt.\n\nWas will sie ihm damit sagen?'
  },
  {
    id: 'diary-phoebe-verraeter',
    suspectId: phineas.id,
    title: 'Phoebe ist ein Verräter',
  }
];