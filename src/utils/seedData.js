export const topics = [
  'Implementation',
  'Math',
  'Greedy',
  'Brute Force',
  'Binary Search',
  'DP',
  'Strings',
  'Graphs',
  'Sorting',
  'Constructive'
];

export const ratings = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

export const seedProblems = [
  {
    id: crypto.randomUUID(),
    name: 'A. Way Too Long Words',
    link: 'https://codeforces.com/problemset/problem/71/A',
    rating: 800,
    topic: 'Implementation',
    status: 'Solved',
    solvedDate: '2026-06-20',
    notes: 'Practiced basic string formatting.'
  },
  {
    id: crypto.randomUUID(),
    name: 'A. Team',
    link: 'https://codeforces.com/problemset/problem/231/A',
    rating: 800,
    topic: 'Implementation',
    status: 'Solved',
    solvedDate: '2026-06-21',
    notes: 'Simple counting problem.'
  },
  {
    id: crypto.randomUUID(),
    name: 'A. Bit++',
    link: 'https://codeforces.com/problemset/problem/282/A',
    rating: 800,
    topic: 'Implementation',
    status: 'Solved',
    solvedDate: '2026-06-22',
    notes: 'Understood increment/decrement pattern.'
  },
  {
    id: crypto.randomUUID(),
    name: 'A. Petya and Strings',
    link: 'https://codeforces.com/problemset/problem/112/A',
    rating: 800,
    topic: 'Strings',
    status: 'Solved',
    solvedDate: '2026-06-23',
    notes: 'Case-insensitive comparison.'
  },
  {
    id: crypto.randomUUID(),
    name: 'A. Helpful Maths',
    link: 'https://codeforces.com/problemset/problem/339/A',
    rating: 800,
    topic: 'Sorting',
    status: 'Solved',
    solvedDate: '2026-06-24',
    notes: 'Sorting small input.'
  },
  {
    id: crypto.randomUUID(),
    name: 'B. Queue at the School',
    link: 'https://codeforces.com/problemset/problem/266/B',
    rating: 800,
    topic: 'Simulation',
    status: 'Revision',
    solvedDate: '2026-06-25',
    notes: 'Need to revise simulation carefully.'
  },
  {
    id: crypto.randomUUID(),
    name: 'A. Word Capitalization',
    link: 'https://codeforces.com/problemset/problem/281/A',
    rating: 800,
    topic: 'Strings',
    status: 'Solved',
    solvedDate: '2026-06-26',
    notes: 'Simple string manipulation.'
  },
  {
    id: crypto.randomUUID(),
    name: 'B. Drinks',
    link: 'https://codeforces.com/problemset/problem/200/B',
    rating: 800,
    topic: 'Math',
    status: 'Solved',
    solvedDate: '2026-06-26',
    notes: 'Average percentage calculation.'
  },
  {
    id: crypto.randomUUID(),
    name: 'A. Arrival of the General',
    link: 'https://codeforces.com/problemset/problem/144/A',
    rating: 800,
    topic: 'Greedy',
    status: 'To Solve',
    solvedDate: '',
    notes: 'Practice moving max/min positions.'
  },
  {
    id: crypto.randomUUID(),
    name: 'B. Search in Easy Problem',
    link: 'https://codeforces.com/problemset/problem/1030/A',
    rating: 800,
    topic: 'Brute Force',
    status: 'To Solve',
    solvedDate: '',
    notes: 'Warm-up problem.'
  }
];

export const seedGoals = [
  {
    id: crypto.randomUUID(),
    title: 'Reach Codeforces 1200 rating',
    target: 1200,
    current: 955,
    unit: 'rating',
    deadline: '2026-09-30',
    status: 'Active'
  },
  {
    id: crypto.randomUUID(),
    title: 'Solve 100 problems',
    target: 100,
    current: 8,
    unit: 'problems',
    deadline: '2026-08-31',
    status: 'Active'
  },
  {
    id: crypto.randomUUID(),
    title: 'Finish 30 problems rated 1000+',
    target: 30,
    current: 0,
    unit: 'problems',
    deadline: '2026-07-31',
    status: 'Active'
  }
];

export const seedProfile = {
  name: 'Tithi',
  handle: 'tithi_61',
  currentRating: 955,
  targetRating: 1200,
  dailyTarget: 3,
  favoriteLanguage: 'C++',
  theme: 'dark'
};
