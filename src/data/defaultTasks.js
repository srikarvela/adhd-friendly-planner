// Dark-mode category colours
export const CATEGORIES = {
  routine:    { label: 'Routine',    color: '#FF8C55', bg: 'rgba(255,107,53,0.15)',  border: 'rgba(255,107,53,0.25)'  },
  prayer:     { label: 'Prayer',     color: '#FFD60A', bg: 'rgba(255,214,10,0.12)',  border: 'rgba(255,214,10,0.22)'  },
  health:     { label: 'Meds',       color: '#32ADE6', bg: 'rgba(50,173,230,0.12)',  border: 'rgba(50,173,230,0.22)'  },
  school:     { label: 'School',     color: '#409CFF', bg: 'rgba(10,132,255,0.13)',  border: 'rgba(10,132,255,0.23)'  },
  chores:     { label: 'Chores',     color: '#30D158', bg: 'rgba(48,209,88,0.12)',   border: 'rgba(48,209,88,0.22)'   },
  personal:   { label: 'Personal',   color: '#BF5AF2', bg: 'rgba(191,90,242,0.13)', border: 'rgba(191,90,242,0.23)'  },
  fitness:    { label: 'Fitness',    color: '#FF375F', bg: 'rgba(255,55,95,0.13)',   border: 'rgba(255,55,95,0.23)'   },
  obligation: { label: 'Obligation', color: '#FFD60A', bg: 'rgba(255,214,10,0.10)', border: 'rgba(255,214,10,0.20)'  },
}

export const BLOCKS = [
  { id: 'morning',   label: 'Morning',   icon: '☀️',  accent: '#FF9F0A', time: '6am – 12pm' },
  { id: 'afternoon', label: 'Afternoon', icon: '🌤️', accent: '#409CFF', time: '12pm – 5pm'  },
  { id: 'evening',   label: 'Evening',   icon: '🌆',  accent: '#BF5AF2', time: '5pm – 9pm'  },
  { id: 'night',     label: 'Night',     icon: '🌙',  accent: '#5E5CE6', time: '9pm – 12am' },
]

export const MORNING_TASKS = [
  { id: 'wake-up',     title: 'Wake Up',      category: 'routine', subtasks: [] },
  { id: 'fold-sheets', title: 'Fold Sheets',  category: 'chores',  subtasks: [] },
  { id: 'brush',       title: 'Brush',        category: 'routine', subtasks: [] },
  { id: 'mouthwash',   title: 'Mouthwash',    category: 'routine', subtasks: [] },
  { id: 'bath',        title: 'Bath',         category: 'routine', subtasks: [] },
  { id: 'skincare',    title: 'Skincare',     category: 'routine', subtasks: ['Cleanser', 'Toner', 'Moisturizer', 'SPF'] },
  { id: 'haircare',    title: 'Haircare',     category: 'routine', subtasks: [] },
  { id: 'fold-towels', title: 'Fold Towels',  category: 'chores',  subtasks: [] },
]

export const PRAYER_TASKS = [
  { id: 'sandhya',      title: 'Sandhya',                category: 'prayer', subtasks: [] },
  { id: 'twamasmin',    title: 'Twamasmin',              category: 'prayer', subtasks: [] },
  { id: 'mrutyu-japa',  title: 'Mrutyu Mahamantra Japa', category: 'prayer', subtasks: [] },
  { id: 'raja-matanga', title: 'Raja Matanga Mantra',    category: 'prayer', subtasks: [] },
]

export const MEDS_TASKS = [
  { id: 'vitamin-d',       title: 'Vitamin D',       category: 'health', subtasks: [] },
  { id: 'zinc',            title: 'Zinc',            category: 'health', subtasks: [] },
  { id: 'shilajit',        title: 'Shilajit',        category: 'health', subtasks: [] },
  { id: 'mushroom-coffee', title: 'Mushroom Coffee', category: 'health', subtasks: [] },
]

export const SCHOOL_CLASSES = [
  { id: 'eng101', name: 'ENG 101' },
  { id: 'iap341', name: 'IAP 341' },
]

export const PERSONAL_BACKLOG = [
  { id: 'ee-blog',        title: 'EE Blog',                         note: 'Every Tuesday',   category: 'personal' },
  { id: 'tiktok',         title: 'TikTok Content Page',             note: '',                 category: 'personal' },
  { id: 'resume-github',  title: 'Resume Builder / GitHub Projects',note: '',                 category: 'personal' },
  { id: 'ee-framework',   title: 'EE Framework (own plugin)',        note: '',                 category: 'personal' },
  { id: 'portfolio',      title: 'Portfolio Website',                note: '',                 category: 'personal' },
  { id: 'internship-app', title: 'Internship Fall Applications',     note: '',                 category: 'personal' },
  { id: 'research-app',   title: 'Research Applications',            note: '',                 category: 'personal' },
  { id: 'power-mgmt',     title: 'Power Management Material',        note: 'For internships',  category: 'personal' },
  { id: 'udemy-ai',       title: 'Udemy AI Courses',                 note: '',                 category: 'personal' },
]

export const OBLIGATIONS = [
  { id: 'trash',        title: 'Trash',         recur: 'Thu', time: '',        category: 'chores',     subtasks: [] },
  { id: 'laundry',      title: 'Laundry',       recur: 'Thu', time: '',        category: 'chores',     subtasks: ['Wash', 'Dry', 'Fold & put away'] },
  { id: 'puja',         title: 'Puja',          recur: 'Fri', time: '9:00 AM', category: 'prayer',     subtasks: [] },
  { id: 'rudrabhishek', title: 'Rudrabhishekam',recur: 'Mon', time: '5:45 AM', category: 'prayer',     subtasks: [] },
  { id: 'satsang',      title: 'Satsang',       recur: 'Sat', time: '9:30 AM', category: 'obligation', subtasks: [] },
]

export const NIGHT_TASKS = [
  { id: 'night-skincare', title: 'Night Skincare',        category: 'routine', subtasks: ['Double cleanse', 'Toner', 'Serum', 'Moisturizer'] },
  { id: 'night-brush',    title: 'Brush & Floss',         category: 'routine', subtasks: ['Brush', 'Floss'] },
  { id: 'night-meds',     title: 'Night Meds / Supps',    category: 'health',  subtasks: [] },
  { id: 'set-alarm',      title: 'Set Alarm & Wind Down', category: 'routine', subtasks: [] },
]

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
export function tomorrowStr() {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}
export function dayName(dateStr) {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(dateStr + 'T00:00:00').getDay()]
}

function makeTask(template, dateStr, section) {
  return {
    ...template,
    id: `${template.id}-${dateStr}`,
    templateId: template.id,
    section,
    done: false,
    subtaskProgress: (template.subtasks || []).map(() => false),
    addedByAI: false,
    note: '',
  }
}

export function buildDayTasks(dateStr) {
  const day = dayName(dateStr)
  const tasks = [
    ...MORNING_TASKS.map(t => makeTask(t, dateStr, 'morning')),
    ...PRAYER_TASKS.map(t => makeTask(t, dateStr, 'prayer')),
    ...MEDS_TASKS.map(t => makeTask(t, dateStr, 'meds')),
    ...NIGHT_TASKS.map(t => makeTask(t, dateStr, 'night')),
  ]
  OBLIGATIONS.forEach(ob => {
    if (ob.recur === day) {
      tasks.push({
        ...ob,
        id: `${ob.id}-${dateStr}`,
        templateId: ob.id,
        section: 'obligation',
        done: false,
        subtaskProgress: (ob.subtasks || []).map(() => false),
        addedByAI: false,
        note: '',
      })
    }
  })
  return tasks
}

export function buildSchoolData() {
  return SCHOOL_CLASSES.reduce((a, c) => ({ ...a, [c.id]: [] }), {})
}
