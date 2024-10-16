import { VoteOption } from "../vote";
import { getSuspectById } from "./suspects";

export const voteOptions: VoteOption[] = [
  // Hauptclues
  {
    id: "phone",
    title: "Handy",
    image: "mainClue/PhoneThumbnail.webp",
    placeImageOverBox: true,
  },
  {
    id: "diary",
    title: "Tagebuch",
    image: "mainClue/DiaryThumbnail.webp",
    placeImageOverBox: true,
  },

  // Interviews
  {
    id: "hugo1",
    title: "Interview: Hugo Montague",
    image: "suspects/Hugo1.png",
    suspectIds: ["montague"],
    color: getSuspectById("montague")?.color,
    removeSelf: true,
  },
  {
    id: "hugo2",
    title: "Interview: Hugo Montague 2",
    image: "suspects/Hugo2.png",
    suspectIds: ["montague"],
    color: getSuspectById("montague")?.color,
    removeSelf: true,
  },
  {
    id: "cassy1",
    title: "Interview: Cassandra Novak",
    image: "suspects/Cassy1.png",
    suspectIds: ["cassandra"],
    color: getSuspectById("cassandra")?.color,
    removeSelf: true,
  },
  {
    id: "cassy2",
    title: "Interview: Cassandra Nova 2",
    image: "suspects/Cassy2.png",
    suspectIds: ["cassandra"],
    color: getSuspectById("cassandra")?.color,
    removeSelf: true,
  }
]