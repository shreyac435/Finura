import React, { useState, useEffect, useRef } from 'react';
import { aiService, transactionService, budgetService, goalService } from '../services/api';
import { CHAT_SUGGESTIONS, DEFAULT_AI_RESPONSE } from '../data/mockData';

const AiAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      id: 'ai-init',
      text: DEFAULT_AI_RESPONSE,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Heuristic assessment metrics
  const [financialScore, setFinancialScore] = useState(80);
  const [recommendations, setRecommendations] = useState([]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    runFinancialAssessment();
  }, []);

  useEffect(() => {
    // Scroll chat to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const runFinancialAssessment = async () => {
    try {
      const txs = await transactionService.getTransactions();
      const bdgts = await budgetService.getBudgets();
      const gls = await goalService.getGoals();

      const incomes = txs.filter(t => t.type === 'income');
      const expenses = txs.filter(t => t.type === 'expense');

      const totalInc = incomes.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalExp = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);

      let score = 50; // base score
      const recs = [];

      // 1. Savings Rate Metric (Max 25 pts)
      if (totalInc > 0) {
        const savingsRate = ((totalInc - totalExp) / totalInc) * 100;
        if (savingsRate >= 40) {
          score += 25;
        } else if (savingsRate >= 20) {
          score += 15;
        } else if (savingsRate > 0) {
          score += 5;
          recs.push('Your savings rate is below the recommended 20% mark. Try auditing shopping logs.');
        } else {
          score -= 10;
          recs.push('ALERT: Cash outflow exceeds inflow this month! You are accumulating deficit.');
        }
      }

      // 2. Budget Compliance (Max 15 pts)
      let overBudgetCount = 0;
      bdgts.forEach(b => {
        const spent = expenses
          .filter(e => e.category === b.category)
          .reduce((sum, e) => sum + parseFloat(e.amount), 0);
        if (spent > b.limit) {
          overBudgetCount++;
        }
      });

      if (overBudgetCount === 0) {
        score += 15;
      } else {
        score -= overBudgetCount * 5;
        recs.push(`You have exceeded monthly budgets on ${overBudgetCount} spending categories.`);
      }

      // 3. Goal Progress (Max 10 pts)
      if (gls.length > 0) {
        const completed = gls.filter(g => g.currentAmount >= g.targetAmount).length;
        const progressCount = gls.filter(g => g.currentAmount / g.targetAmount >= 0.5 && g.currentAmount < g.targetAmount).length;
        
        score += completed * 5 + progressCount * 2;

        if (completed > 0) {
          recs.push(`Great job! You achieved your savings goal of reaching targets.`);
        }
      } else {
        recs.push('You do not have any active savings goals. Create a goal to automate savings.');
      }

      // Cap score
      const finalScore = Math.max(0, Math.min(score, 100));
      setFinancialScore(finalScore);

      // Default recommendations if none triggered
      if (recs.length === 0) {
        recs.push('All parameters healthy! Continue standard budget compliance.');
      }
      setRecommendations(recs);

    } catch (err) {
      console.error('Error running financial score heuristic:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Send chat message to mock backend
      const response = await aiService.sendAiChatMessage(textToSend);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: 'Sorry, I encountered an issue connecting to my advisor engine. Please try again.',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Finura AI Advisor</h2>
          <p className="text-muted m-0">Intelligent analytics, budgeting recommendations, and financial helper.</p>
        </div>
      </div>

      {/* Main Grid: Left Health Score, Right Chat Assistant */}
      <div className="row g-4 mb-4">
        {/* Left Side: Score Card & Recommendations */}
        <div className="col-12 col-lg-5 col-xl-4">
          
          {/* Health Score Gauge */}
          <div className="card glass-card p-4 border-0 mb-4 text-center">
            <h5 className="fw-bold mb-3">Financial Health Score</h5>
            
            <div className="d-inline-flex flex-column align-items-center justify-content-center position-relative my-3" style={{ width: '160px', height: '160px' }}>
              <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" stroke="var(--border-color)" strokeWidth="10" fill="transparent" />
                <circle cx="60" cy="60" r="50" 
                  stroke={financialScore > 80 ? 'var(--accent-success)' : financialScore > 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'}
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - financialScore / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="position-absolute text-center">
                <span className="h1 fw-bold m-0 d-block" style={{ fontSize: '2.5rem' }}>{financialScore}</span>
                <span className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>/ 100 INDEX</span>
              </div>
            </div>

            <span className={`badge px-3 py-2 rounded-pill mt-2 ${
              financialScore > 80 ? 'bg-success-subtle text-success' : 
              financialScore > 50 ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'
            }`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {financialScore > 80 ? 'Excellent Status' : financialScore > 50 ? 'Needs Attention' : 'Vulnerable Status'}
            </span>
          </div>

          {/* AI Advisor Recommendations list */}
          <div className="card glass-card p-4 border-0">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-lightbulb-fill text-warning"></i>
              <span>Smart Directives</span>
            </h5>
            <div className="d-flex flex-column gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="d-flex align-items-start gap-2 bg-secondary bg-opacity-5 p-2.5 rounded-3" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-arrow-right-circle text-primary mt-0.5"></i>
                  <span className="text-secondary">{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Chatbot Frame */}
        <div className="col-12 col-lg-7 col-xl-8">
          <div className="card glass-card p-4 h-100 border-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-info bg-opacity-10 text-info p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-cpu-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold m-0">Chat Assistant</h5>
                    <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}><span className="spinner-grow spinner-grow-sm text-success" style={{ width: '8px', height: '8px' }}></span> Online</small>
                  </div>
                </div>
              </div>

              {/* Message scroll container */}
              <div className="chat-container">
                {messages.map((m) => (
                  <div key={m.id} className={`chat-message ${m.sender === 'user' ? 'user' : 'ai'}`}>
                    <div className="chat-bubble shadow-sm" style={{ whiteSpace: 'pre-line' }}>
                      {m.text}
                      <small className="d-block text-end mt-1 text-muted" style={{ fontSize: '0.65rem' }}>
                        {m.timestamp}
                      </small>
                    </div>
                  </div>
                ))}
                
                {/* Simulated streaming AI typing loader */}
                {isTyping && (
                  <div className="chat-message ai">
                    <div className="chat-bubble shadow-sm text-center py-2" style={{ minWidth: '80px' }}>
                      <span className="spinner-grow spinner-grow-sm text-muted me-1" style={{ width: '6px', height: '6px' }}></span>
                      <span className="spinner-grow spinner-grow-sm text-muted me-1" style={{ width: '6px', height: '6px' }}></span>
                      <span className="spinner-grow spinner-grow-sm text-muted" style={{ width: '6px', height: '6px' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* suggestion chips */}
            <div className="mt-3">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => handleSuggestionClick(s)} 
                    className="btn btn-sm btn-outline-info text-decoration-none rounded-pill" 
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                    disabled={isTyping}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat Input form bar */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="d-flex gap-2"
              >
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ask advisor about transactions, budgets, templates..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                />
                <button type="submit" className="btn btn-primary px-3" disabled={isTyping || !inputText.trim()}>
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
              
              <div className="text-center mt-2">
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {/* TODO: Connect Spring AI / OpenAI Chat Completion Endpoint: POST /api/ai/chat */}
                  Connected to Local Heuristic Advisor engine.
                </small>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAdvisor;
