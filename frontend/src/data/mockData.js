// Mock Data for Finura Personal Finance Management System - Rupee (INR) Localized

export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Gifts/Bonuses',
  'Other'
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Education',
  'Entertainment',
  'Healthcare',
  'Other'
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 125000.00,
    category: 'Salary',
    date: '2026-05-01',
    description: 'Monthly Corporate Salary Credit'
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 4500.50,
    category: 'Food',
    date: '2026-05-03',
    description: 'Weekly grocery shopping at D-Mart'
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 799.00,
    category: 'Bills',
    date: '2026-05-04',
    description: 'Jio Fiber Fiber Broadband WiFi Bill'
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 3200.00,
    category: 'Entertainment',
    date: '2026-05-05',
    description: 'Dinner & Movie night at PVR'
  },
  {
    id: 'tx-5',
    type: 'income',
    amount: 18000.00,
    category: 'Freelance',
    date: '2026-05-08',
    description: 'UI Design consulting project milestone'
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 2500.00,
    category: 'Transport',
    date: '2026-05-10',
    description: 'Petrol fill up at Indian Oil'
  },
  {
    id: 'tx-7',
    type: 'expense',
    amount: 8500.00,
    category: 'Shopping',
    date: '2026-05-12',
    description: 'Ajio online shopping festival'
  },
  {
    id: 'tx-8',
    type: 'expense',
    amount: 25000.00,
    category: 'Bills',
    date: '2026-05-15',
    description: 'Flat Rent transfer'
  },
  {
    id: 'tx-9',
    type: 'expense',
    amount: 1500.00,
    category: 'Healthcare',
    date: '2026-05-17',
    description: 'Pharmacy medical prescription'
  },
  {
    id: 'tx-10',
    type: 'income',
    amount: 4500.00,
    category: 'Investments',
    date: '2026-05-20',
    description: 'Mutual Fund Dividend distribution'
  },
  {
    id: 'tx-11',
    type: 'expense',
    amount: 2100.00,
    category: 'Food',
    date: '2026-05-22',
    description: 'Swiggy Gourmet delivery order'
  },
  {
    id: 'tx-12',
    type: 'expense',
    amount: 12000.00,
    category: 'Education',
    date: '2026-05-24',
    description: 'DSA & System Design prep course subscription'
  }
];

export const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'Food', limit: 15000.00 },
  { id: 'b-2', category: 'Transport', limit: 8000.00 },
  { id: 'b-3', category: 'Shopping', limit: 20000.00 },
  { id: 'b-4', category: 'Bills', limit: 40000.00 },
  { id: 'b-5', category: 'Entertainment', limit: 10000.00 },
  { id: 'b-6', category: 'Healthcare', limit: 10000.00 },
  { id: 'b-7', category: 'Education', limit: 20000.00 },
  { id: 'b-8', category: 'Other', limit: 10000.00 }
];

export const INITIAL_GOALS = [
  {
    id: 'g-1',
    name: 'Emergency Savings Fund',
    targetAmount: 300000.00,
    currentAmount: 120000.00,
    deadline: '2026-12-31'
  },
  {
    id: 'g-2',
    name: 'New Apple iPad Pro',
    targetAmount: 85000.00,
    currentAmount: 60000.00,
    deadline: '2026-08-30'
  },
  {
    id: 'g-3',
    name: 'Goa Holiday Trip',
    targetAmount: 50000.00,
    currentAmount: 12000.00,
    deadline: '2027-06-15'
  }
];

export const DEFAULT_USER = {
  name: 'Shreya',
  email: 'shreya@finura.io',
  currency: 'INR', // Default set to INR
  theme: 'dark',
  profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
};

export const MOCK_AI_INSIGHTS = [
  {
    id: 'in-1',
    type: 'warning',
    message: 'Your **Food** category spending is at 44% of budget, but we are only 40% through the month. Try cutting down on Swiggy orders.'
  },
  {
    id: 'in-2',
    type: 'success',
    message: 'Awesome! Your **Bills** category is fully paid and sits 30% below your allocated budget limit. ₹14,201 saved!'
  },
  {
    id: 'in-3',
    type: 'info',
    message: 'AI Forecast: Based on current trends, if you save an additional ₹2,000/week, you will reach your **New Apple iPad Pro** goal 2 weeks ahead of schedule.'
  }
];

export const CHAT_SUGGESTIONS = [
  'How can I optimize my monthly budget?',
  'Analyze my spending trends for this month.',
  'What is my financial health score and how can I improve it?',
  'Am I on track to meet my Emergency Fund savings goal?'
];

export const MOCK_CHAT_RESPONSES = [
  {
    keywords: ['optimize', 'budget', 'limit', 'reduce'],
    response: `Based on your recent transactions, here are 3 ways to optimize your budget:
1. **Reduce Restaurant Food**: You spent ₹2,100 on dining out recently. Food accounts for 44% of your total Food budget. Trimming Swiggy/Zomato delivery orders will free up ₹4,000.
2. **Review Bill Subscriptions**: Your 'Bills' show recurring tech subscriptions. Reviewing and canceling unused tools can save ₹1,500/month.
3. **Automate Savings**: Move ₹10,000 immediately to your Emergency Fund on salary day to avoid casual expenditure.`
  },
  {
    keywords: ['spending', 'trends', 'pattern', 'expense', 'month'],
    response: `Here is your spending analysis for May 2026:
- **Total Expenses**: ₹54,600.00 (against ₹1,47,500.00 total income).
- **Highest Category**: Bills (₹25,799.00, due to Rent and mobile/broadband).
- **Potential Warning**: Shopping (₹8,500.00) is close to its limit. 
- **Savings Rate**: 63%, which is excellent (well above the 20% standard rule).`
  },
  {
    keywords: ['score', 'health', 'financial health'],
    response: `Your **Financial Health Score** is **82/100** (Very Good).
- **Inflow vs Outflow (10/10)**: High savings rate (63% of income saved).
- **Compliance (8/10)**: Budgets are mostly intact, though Shopping is approaching its limit.
- **Goal Progress (7/10)**: Steady progress, but your 'Goa Holiday Trip' goal target is far off and currently only 24% completed. 
- **Action Item**: Add ₹1,500/month to your Goa goal to push your score to 88/100.`
  },
  {
    keywords: ['track', 'goal', 'ipad', 'emergency', 'goa'],
    response: `Savings Goal Assessment:
1. **Emergency Savings Fund** (₹1,20,000 / ₹3,00,000): **40% complete**. On track for target deadline of Dec 31, 2026, assuming savings of ₹22,500/month.
2. **New Apple iPad Pro** (₹60,000 / ₹85,000): **70% complete**. Highly on track for August 30, 2026. You only need ₹8,333/month.
3. **Goa Holiday Trip** (₹12,000 / ₹50,000): **24% complete**. Needs attention. To hit June 15, 2027, you must save ₹3,166/month.`
  }
];

export const DEFAULT_AI_RESPONSE = `I'm your Finura AI advisor. I can analyze your income, expenses, savings goals, and monthly budgets to give you actionable financial suggestions. 

Try asking me:
- *"Analyze my spending trends"*
- *"How can I optimize my budget?"*
- *"What is my financial health score?"*`;
