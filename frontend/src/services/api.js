// Service Layer - Finura Personal Finance API Client
// Handles data storage inside localStorage and outlines the integration path for Java Spring Boot.

import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  DEFAULT_USER,
  MOCK_AI_INSIGHTS,
  MOCK_CHAT_RESPONSES,
  DEFAULT_AI_RESPONSE
} from '../data/mockData';

// Helper to initialize local storage
const initializeStorage = () => {
  if (!localStorage.getItem('finura_transactions')) {
    localStorage.setItem('finura_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
  }
  if (!localStorage.getItem('finura_budgets')) {
    localStorage.setItem('finura_budgets', JSON.stringify(INITIAL_BUDGETS));
  }
  if (!localStorage.getItem('finura_goals')) {
    localStorage.setItem('finura_goals', JSON.stringify(INITIAL_GOALS));
  }
  if (!localStorage.getItem('finura_user')) {
    localStorage.setItem('finura_user', JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem('finura_auth_session')) {
    localStorage.setItem('finura_auth_session', JSON.stringify({ isLoggedIn: true, user: DEFAULT_USER }));
  }
};

initializeStorage();

// Get items from storage
const getStored = (key) => JSON.parse(localStorage.getItem(key));
const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ==========================================
// 1. AUTHENTICATION SERVICES
// ==========================================

export const authService = {
  // TODO: Replace with Spring Boot REST Endpoint: POST /api/auth/login
  // Request: { email, password }
  // Response: JWT Token + User object
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStored('finura_registered_users') || [DEFAULT_USER];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && password.length >= 6) { // Mock login logic
          const session = { isLoggedIn: true, user };
          setStored('finura_auth_session', session);
          resolve(user);
        } else {
          reject(new Error('Invalid email or password (min 6 characters required)'));
        }
      }, 500);
    });
  },

  // TODO: Replace with Spring Boot REST Endpoint: POST /api/auth/register
  // Request: { name, email, password }
  // Response: User object
  register: async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStored('finura_registered_users') || [DEFAULT_USER];
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error('Email already registered'));
          return;
        }

        const newUser = {
          name,
          email,
          currency: 'INR',
          theme: 'dark',
          profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'
        };

        users.push(newUser);
        setStored('finura_registered_users', users);
        
        const session = { isLoggedIn: true, user: newUser };
        setStored('finura_auth_session', session);
        resolve(newUser);
      }, 500);
    });
  },

  // TODO: Local cleanup, in production delete JWT Cookie/Token
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setStored('finura_auth_session', { isLoggedIn: false, user: null });
        resolve(true);
      }, 200);
    });
  },

  getCurrentUser: () => {
    const session = getStored('finura_auth_session');
    return session && session.isLoggedIn ? session.user : null;
  }
};

// ==========================================
// 2. TRANSACTION SERVICES
// ==========================================

export const transactionService = {
  // TODO: Replace with Spring Boot REST Endpoint: GET /api/transactions
  // Query parameters: page, size, sortBy, type, category, startDate, endDate, search
  getTransactions: async () => {
  const response = await fetch("http://localhost:9090/api/transactions");

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return await response.json();
},

  // TODO: Replace with Spring Boot REST Endpoint: POST /api/transactions
  // Request: Transaction Entity
  addTransaction: async (transaction) => {

if (transaction.type === "income") {

const payload = {
  user: {
    id: 1
  },
  amount: transaction.amount,
  source: transaction.category,
  incomeDate: transaction.date,
  description: transaction.description
};

const response = await fetch(
  "http://localhost:9090/api/income",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

if (!response.ok) {
  throw new Error("Failed to create income");
}

return await response.json();

}

if (transaction.type === "expense") {

const payload = {
  user: {
    id: 1
  },
  category: {
    categoryId: 1
  },
  amount: transaction.amount,
  expenseDate: transaction.date,
  notes: transaction.description
};

const response = await fetch(
  "http://localhost:9090/api/expenses",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

if (!response.ok) {
  throw new Error("Failed to create expense");
}

return await response.json();


}

throw new Error("Invalid transaction type");
},


  // TODO: Replace with Spring Boot REST Endpoint: PUT /api/transactions/{id}
  // Request: Transaction Entity
  updateTransaction: async (id, transaction) => {

if (transaction.type === "income") {


const payload = {
  user: {
    id: 1
  },
  amount: transaction.amount,
  source: transaction.category,
  incomeDate: transaction.date,
  description: transaction.description
};

const response = await fetch(
  `http://localhost:9090/api/income/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

if (!response.ok) {
  throw new Error("Failed to update income");
}

return await response.json();


}

if (transaction.type === "expense") {

const payload = {
  user: {
    id: 1
  },
  category: {
    categoryId: 1
  },
  amount: transaction.amount,
  expenseDate: transaction.date,
  notes: transaction.description
};

const response = await fetch(
  `http://localhost:9090/api/expenses/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

if (!response.ok) {
  throw new Error("Failed to update expense");
}

return await response.json();

}

throw new Error("Invalid transaction type");
},


  // TODO: Replace with Spring Boot REST Endpoint: DELETE /api/transactions/{id}
  
  deleteTransaction: async (id, type) => {

let url = "";

if (type === "income") {
url = `http://localhost:9090/api/income/${id}`;
} else if (type === "expense") {
url = `http://localhost:9090/api/expenses/${id}`;
} else {
throw new Error("Invalid transaction type");
}

const response = await fetch(url, {
method: "DELETE"
});

if (!response.ok) {
throw new Error("Failed to delete transaction");
}

return true;
},
};

// ==========================================
// 3. BUDGET SERVICES
// ==========================================

export const budgetService = {
  getBudgets: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStored('finura_budgets'));
      }, 200);
    });
  },

  updateBudget: async (id, limit) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const budgets = getStored('finura_budgets');
        const index = budgets.findIndex(b => b.id === id);

        if (index !== -1) {
          budgets[index].limit = parseFloat(limit);
          setStored('finura_budgets', budgets);
          resolve(budgets[index]);
        } else {
          reject(new Error('Budget not found'));
        }
      }, 300);
    });
  }
};

// ==========================================
// 4. SAVINGS GOAL SERVICES
// ==========================================

export const goalService = {
  // TODO: Replace with Spring Boot REST Endpoint: GET /api/goals
  getGoals: async () => {
  const response = await fetch("http://localhost:9090/api/goals");

  if (!response.ok) {
    throw new Error("Failed to fetch goals");
  }

  const goals = await response.json();

  return goals.map(goal => ({
    id: goal.goalId,
    name: goal.goalName,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    deadline: goal.deadline,
    status: goal.status
  }));
},

  // TODO: Replace with Spring Boot REST Endpoint: POST /api/goals
  addGoal: async (goal) => {
  const payload = {
    user: {
      id: 1
    },
    goalName: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    deadline: goal.deadline,
    status: "IN_PROGRESS"
  };

  const response = await fetch(
    "http://localhost:9090/api/goals",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create goal");
  }

  return await response.json();
},

  // TODO: Replace with Spring Boot REST Endpoint: PUT /api/goals/{id}
  updateGoal: async (id, goal) => {
const payload = {
user: {
id: 1
},
goalName: goal.name,
targetAmount: goal.targetAmount,
currentAmount: goal.currentAmount,
deadline: goal.deadline,
status: goal.status || "IN_PROGRESS"
};

const response = await fetch(
`http://localhost:9090/api/goals/${id}`,
{
method: "PUT",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
}
);

if (!response.ok) {
throw new Error("Failed to update goal");
}

return await response.json();
},


  // TODO: Replace with Spring Boot REST Endpoint: DELETE /api/goals/{id}
  deleteGoal: async (id) => {
const response = await fetch(
`http://localhost:9090/api/goals/${id}`,
{
method: "DELETE"
}
);

if (!response.ok) {
throw new Error("Failed to delete goal");
}

return true;
}
};

// ==========================================
// 5. PROFILE & PREFERENCES
// ==========================================

export const profileService = {
  getProfile: async () => {
    return new Promise((resolve) => {
      const u = getStored('finura_user') || DEFAULT_USER;
      resolve(u);
    });
  },

  updateProfile: async (updatedProfile) => {
    return new Promise((resolve) => {
      setStored('finura_user', updatedProfile);
      // Synchronize in-memory auth session
      const session = getStored('finura_auth_session');
      if (session && session.isLoggedIn) {
        session.user = updatedProfile;
        setStored('finura_auth_session', session);
      }
      resolve(updatedProfile);
    });
  }
};

// ==========================================
// 6. AI ADVISOR & CHAT SERVICES
// ==========================================

export const aiService = {
  // TODO: Replace with Spring Boot REST Endpoint: GET /api/ai/insights
  // Generates real-time tips by running heuristic patterns over the user's data
  getAiInsights: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_AI_INSIGHTS);
      }, 200);
    });
  },

  // TODO: Replace with Spring Boot REST Endpoint: POST /api/ai/chat
  // Request: { message: string }
  // Response: { response: string }
  // In production, this service maps to Spring AI with an LLM (like Gemini or OpenAI)
  sendAiChatMessage: async (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanedMsg = userMessage.toLowerCase();
        
        // Find matching response in Mock responses
        const matched = MOCK_CHAT_RESPONSES.find(item => 
          item.keywords.some(keyword => cleanedMsg.includes(keyword))
        );

        const responseText = matched ? matched.response : DEFAULT_AI_RESPONSE;
        resolve({
          id: `ai-${Date.now()}`,
          text: responseText,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 1000); // Simulate network lag + LLM typing response
    });
  }
};
