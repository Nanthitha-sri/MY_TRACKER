import { Category, SettingsState } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'home',
    name: 'Home',
    subtitle: 'Comfort & warmth for your space',
    budget: 10000,
    spent: 4000,
    icon: '🏠',
    color: '#38bdf8',
    tag: 'Sanctuary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfQdJlidAH8SM8up2ttWuVeaivLxHD5MgyQkr984aCvfHOoGYy-hnsnfoeFE6wvyN9AXdfsrujIG95ktizTjlVkc7gzicLkL_V_x9rsk8lAwLieUmGgiaRjqOs1GvnTZ5cuHPj9Q4i3WAfcKn62j4Qk7J5gCUv1aC4YdQjpSrgMnh152P830mJgbi5XJ7QI8fJhcQFPNwTLGzh6qo5eJelhUo9-6s3kyvWU8Dec1tWaA4ezsitLEOF2RPy9u07kDSm6Q',
    quote: 'A peaceful sanctuary is the best investment ♡',
    transactions: [
      { id: 'h1', date: 'Sep 13', note: 'Expense', mode: 'UPI', amount: 4000 }
    ]
  },
  {
    id: 'pg',
    name: 'PG',
    subtitle: 'Shelter, sanctuary & peace',
    budget: 8500,
    spent: 4250,
    icon: '🏢',
    color: '#6366f1',
    tag: 'Fixed Rent',
    quote: 'A safe roof over your head is peace of mind ♡',
    transactions: [
      { id: 'p1', date: 'Sep 13', note: 'PG Advance & Maintenance', mode: 'UPI', amount: 4250 }
    ]
  },
  {
    id: 'self-care',
    name: 'Self Care',
    subtitle: 'Take care of you 💙',
    budget: 1000,
    spent: 400,
    icon: '🐚',
    color: '#fb923c',
    tag: 'Wellness',
    quote: 'A happier you is always a good investment ♡',
    badgeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_NjvO5UqYab0XypFbNz6cKlEl55u4xtR_gbNxU9dyAkdr88AC-sRQRWlnz7877i_NnGc-GH348gudK7UOzIEKK5Ub_2hp3YS7t-ykZYvmwABzGWJT5yKC251IlU_G4J1jlV7moE_0ppdNe9eSRn8p2UVXvuc2_FRLJ8ZVK7vnzun7gHutP57tKBoYc-A2MRy357cP6s7TcRseTXq31fruOCdHbuIMSxspZe4IecCnla7XI8yWYjZ9O9NJ66oXK0Tn7w',
    creatureImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKvzjd8LgKgfXrPDe4XJvKuOwx-AidPn-W5rYgjyAJ98v4KkWv8tvBhbVdxkeK7CkKc47L0tdD-Jk5MraJ3ebJ59qYmB5zyQmVTm3e7TqxNQxfCnBa9EfnqcXkZqFMVMdTjqIz8Qzmr7r_qvtyKd-Gjd_q39WBjYwXuj_qyvFTxsFOTaKrN92iqAg1_e8UYsTQ_VzTNnOPBeAHdzksI9ONL5QgRAMH8pthdd2LQY9EQ5uX427ifs9LV4BfscbsT4QRDw',
    transactions: [
      { id: 's1', date: 'Sep 13', note: 'Skincare & Wellness', mode: 'UPI', amount: 400 }
    ]
  },
  {
    id: 'self-expenses',
    name: 'Self Expenses',
    subtitle: 'Little joys, guilt-free 🌸',
    budget: 1000,
    spent: 350,
    icon: '🌸',
    color: '#f472b6',
    tag: 'Joys',
    quote: 'Spend on what brings you genuine joy ♡',
    transactions: [
      { id: 'se1', date: 'Sep 13', note: 'Coffee & Journal Book', mode: 'UPI', amount: 350 }
    ]
  },
  {
    id: 'recharge',
    name: 'Recharge',
    subtitle: 'Stay connected, always 🌊',
    budget: 700,
    spent: 299,
    icon: '⚡',
    color: '#2dd4bf',
    tag: 'Network',
    quote: 'Connections that matter are worth every drop ♡',
    transactions: [
      { id: 'r1', date: 'Sep 13', note: 'Mobile Unlimited Data', mode: 'UPI', amount: 299 }
    ]
  },
  {
    id: 'rem',
    name: 'REM',
    subtitle: 'Reserve ocean savings & dreams 🐚💙',
    budget: 1300,
    spent: 500,
    icon: '🐚',
    color: '#e879f9',
    tag: 'Reserve',
    quote: "A calm sea today builds tomorrow's voyage ♡",
    transactions: [
      { id: 'rem1', date: 'Sep 13', note: 'Voyage Emergency Reserve', mode: 'UPI', amount: 500 }
    ]
  }
];

export const defaultSettings: SettingsState = {
  soundHaptic: true,
  buttonSound: true,
  expenseAddedSound: true,
  budgetWarningSound: true,
  hapticFeedback: true,
};
