import moment from "moment";
import { Note } from "../../phone/notes";
import { p, textContent } from "../../textContent";

export const notes: Note[] = [
  {
    date: moment('2023-08-09T10:00:00Z'),
    content: 'Discuss project requirements and next steps.',
  },
  {
    title: 'Grocery List',
    date: moment('2023-08-10T09:00:00Z'),
    content: textContent(['- Milk\n- Bread\n- Eggs\n- Cheese\n- Vegetables', p('Don\'t forget to buy some fruits.')]),
  },
  {
    title: 'Workout Plan',
    date: moment('2023-08-11T07:30:00Z'),
    content: 'Morning routine: 30 mins running, 15 mins strength training.',
  },
  {
    title: 'Book Summary: Atomic Habits',
    date: moment('2023-08-12T14:45:00Z'),
    content: 'A brief summary of key takeaways from "Atomic Habits" by James Clear.',
  },
  {
    title: 'Vacation Ideas',
    date: moment('2023-08-13T12:00:00Z'),
    content: 'Research destinations for the upcoming vacation. Consider beaches and mountains.',
  },
];