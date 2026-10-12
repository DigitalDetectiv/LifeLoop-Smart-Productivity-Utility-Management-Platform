/*
  Placeholder data only. Once the Express + Postgres API exists,
  everything in this file gets replaced by real fetch calls
  (see src/api/ once the backend stage begins).
*/

export const categories = [
  { id: 'lists', name: 'Todos', colorVar: '--yellow-dot', softVar: '--yellow-soft' },
  { id: 'finance', name: 'Finance', colorVar: '--peach-dot', softVar: '--peach-soft' },
  { id: 'health', name: 'Health & fitness', colorVar: '--sage-dot', softVar: '--sage-soft' },
  { id: 'ideas', name: 'Idea vault', colorVar: '--purple-dot', softVar: '--purple-soft' },
  { id: 'calendar', name: 'Calendar', colorVar: '--blue-dot', softVar: '--blue-soft' },
  { id: 'journal', name: 'Journal', colorVar: '--pink-dot', softVar: '--pink-soft' }
];

// Set this to an imported image path once you have the background photo
// ready (e.g. `import bgPhoto from '../assets/home-bg.jpg'`) and it will
// render behind the bubbles on every page. Leave null to keep the
// pastel gradient only.
export const homeBackgroundImage = null;

export const todayTasks = [
  { id: 1, title: 'Pay electricity bill', category: 'finance', tagSoftVar: '--peach-soft', time: '9:00 am', done: false },
  { id: 2, title: 'Grocery run', category: 'lists', tagSoftVar: '--yellow-soft', time: '11:30 am', done: false },
  { id: 3, title: 'Team sync notes', category: 'ideas', tagSoftVar: '--purple-soft', time: '2:00 pm', done: false }
];

export const recurringTasks = [
  { id: 'r1', title: 'Water · 5/8 cups', colorVar: '--sage-dot', softVar: '--sage-soft' },
  { id: 'r2', title: 'Morning stretch', colorVar: '--peach-dot', softVar: '--peach-soft' },
  { id: 'r3', title: 'Eat nuts by 4pm', colorVar: '--yellow-dot', softVar: '--yellow-soft' }
];

export const permanentQuotes = [
  'Small steps, repeated daily, become the whole path.',
  'Discipline is choosing between what you want now and what you want most.',
  'A calm mind gets more done than a rushed one.',
  'Progress, not perfection.'
];

export const dailyQuotes = [
  'The secret of getting ahead is getting started.',
  'You do not have to see the whole staircase, just take the first step.'
];

// Seed sub-categories for the task-oriented pages (Finance, Health & fitness,
// Lists). Each sub-category holds its own small task list; real data will
// come from the backend once it exists.
// Finance, powered by the recursive FolderSystem.
export const financeNodes = {
  'fin-budget': {
    id: 'fin-budget', parentId: null, type: 'list', name: 'Budgeting',
    tasks: [
      { id: 'f1', title: 'Review monthly budget', done: false },
      { id: 'f2', title: 'Update savings goal', done: false },
      { id: 'f3', title: 'Check subscription renewals', done: true }
    ]
  },
  'fin-grocery': {
    id: 'fin-grocery', parentId: null, type: 'list', name: 'Grocery & shopping',
    tasks: [
      { id: 'f4', title: 'Weekly grocery run', done: false },
      { id: 'f5', title: 'Restock pantry basics', done: false }
    ]
  },
  'fin-bills': {
    id: 'fin-bills', parentId: null, type: 'list', name: 'Bills',
    tasks: [
      { id: 'f6', title: 'Pay electricity bill', done: false },
      { id: 'f7', title: 'Pay internet bill', done: false }
    ]
  },
  'fin-insurance': { id: 'fin-insurance', parentId: null, type: 'folder', name: 'Insurance & FD' },
  'fin-insurance-list': {
    id: 'fin-insurance-list', parentId: 'fin-insurance', type: 'list', name: 'Due payments',
    tasks: [
      { id: 'f8', title: 'Renew health insurance', done: false },
      { id: 'f9', title: 'FD maturity follow-up', done: false }
    ]
  },
  'fin-insurance-notes': {
    id: 'fin-insurance-notes', parentId: 'fin-insurance', type: 'notepad', name: 'Policy notes', note: ''
  }
};
export const financeRootIds = ['fin-budget', 'fin-grocery', 'fin-bills', 'fin-insurance'];

// Health & fitness, powered by the recursive FolderSystem - tasks carry a
// `recurring` flag since the toggle is enabled on this page.
export const healthNodes = {
  'h-water': {
    id: 'h-water', parentId: null, type: 'list', name: 'Water counter',
    tasks: [{ id: 'h1', title: 'Glass of water (5/8 today)', done: false, recurring: true }]
  },
  'h-exercise': {
    id: 'h-exercise', parentId: null, type: 'list', name: 'Daily exercise',
    tasks: [
      { id: 'h2', title: 'Morning run', done: false, recurring: true },
      { id: 'h3', title: 'Stretch routine', done: false, recurring: true }
    ]
  },
  'h-habits': {
    id: 'h-habits', parentId: null, type: 'list', name: 'Daily habits',
    tasks: [{ id: 'h4', title: 'Eat a handful of nuts by 4pm', done: false, recurring: true }]
  }
};
export const healthRootIds = ['h-water', 'h-exercise', 'h-habits'];

export const financeToGiveReceive = {
  toGive: [{ id: 'g1', person: 'Sam', amount: 500 }],
  toReceive: [{ id: 'r1', person: 'Priya', amount: 1200 }]
};

// Idea Vault, powered by the recursive FolderSystem: nodes are
// folder | list | notepad, linked by parentId (null = top level).
export const ideaVaultNodes = {
  'iv-app': { id: 'iv-app', parentId: null, type: 'folder', name: 'App side-project' },
  'iv-app-tasks': {
    id: 'iv-app-tasks', parentId: 'iv-app', type: 'list', name: 'Tasks',
    tasks: [
      { id: 'iv1', title: 'Sketch onboarding flow', done: false },
      { id: 'iv2', title: 'Validate with 5 users', done: false }
    ]
  },
  'iv-app-notes': {
    id: 'iv-app-notes', parentId: 'iv-app', type: 'notepad', name: 'Notes',
    note: 'Landing page copy draft\nCompetitor pricing notes'
  },
  'iv-wood': { id: 'iv-wood', parentId: null, type: 'folder', name: 'Learn woodworking' },
  'iv-wood-tasks': {
    id: 'iv-wood-tasks', parentId: 'iv-wood', type: 'list', name: 'Tasks',
    tasks: [{ id: 'iv3', title: 'Buy starter tool kit', done: true }]
  },
  'iv-wood-notes': {
    id: 'iv-wood-notes', parentId: 'iv-wood', type: 'notepad', name: 'Notes',
    note: 'Beginner joints to practice\nLocal classes list'
  }
};
export const ideaVaultRootIds = ['iv-app', 'iv-wood'];

// Todos: same engine, seeded with the earlier Lists content. "General" is a
// list sitting right at the top level; "Wishlist" is a folder containing
// its own list, showing folders can nest other nodes.
export const todosNodes = {
  't-general': {
    id: 't-general', parentId: null, type: 'list', name: 'General',
    tasks: [
      { id: 'l1', title: 'Meet teacher', time: '4:00 pm', done: false },
      { id: 'l2', title: 'Talk to parents', time: '8:00 pm', done: false }
    ]
  },
  't-wishlist': { id: 't-wishlist', parentId: null, type: 'folder', name: 'Wishlist' },
  't-wishlist-items': {
    id: 't-wishlist-items', parentId: 't-wishlist', type: 'list', name: 'Wishlist items',
    tasks: [
      { id: 'l3', title: 'Books to read', done: false },
      { id: 'l4', title: 'Movies / series', done: false },
      { id: 'l5', title: 'Articles', done: false },
      { id: 'l6', title: 'Watch later', done: false },
      { id: 'l7', title: 'To buy', done: false }
    ]
  }
};
export const todosRootIds = ['t-general', 't-wishlist'];

// Per-day journal fields, seeded for today only - matches the colorful
// multi-box layout (goal, feelings, habits, mistakes, gratitude, etc).
export const journalEntries = {
  goal: 'Ship the client proposal',
  feel: 'Focused and a little rushed.',
  want: 'To wrap up early and go for a walk.',
  habits: 'Drinking water on time, short stretch breaks.',
  improve: 'Reply to emails faster instead of batching them.',
  mistakes: 'Forgot to confirm the meeting time — double-check next time.',
  joy: 'Morning coffee, a good song, finishing a task early.',
  grateful: 'Grateful for a quiet, focused morning.',
  thoughts: 'Finished the client proposal ahead of schedule.',
  tomorrowGoal: 'Start the day with the hardest task first.'
};

// Basic (non-critical) password vault entries — placeholder data
export const vaultEntries = [
  { id: 'v1', label: 'Streaming service', username: 'alex@example.com', password: 'demo-pass-1' },
  { id: 'v2', label: 'Gym membership portal', username: 'alexfit', password: 'demo-pass-2' }
];
