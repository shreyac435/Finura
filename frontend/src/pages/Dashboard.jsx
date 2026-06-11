import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService, budgetService, goalService, aiService, profileService } from '../services/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txs = await transactionService.getTransactions();
        const bdgts = await budgetService.getBudgets();
        const gls = await goalService.getGoals();
        const ins = await aiService.getAiInsights();
        const prof = await profileService.getProfile();
        
        setTransactions(txs);
        setBudgets(bdgts);
        setGoals(gls);
        setInsights(ins);
        setCurrency(prof.currency || 'USD');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCurrencySymbol = (code) => {
    switch (code) {
      case 'EUR': return '€';
      case 'INR': return '₹';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  // Math metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Budget calculations
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + parseFloat(b.limit), 0);
  const budgetUsagePercent = totalBudgetLimit > 0 ? Math.min(Math.round((totalExpense / totalBudgetLimit) * 100), 100) : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Financial Dashboard</h2>
          <p className="text-muted m-0">Your overview of income, expenses, and savings goal progress.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/income" className="btn btn-success d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i> Log Income
          </Link>
          <Link to="/expenses" className="btn btn-danger d-flex align-items-center gap-2">
            <i className="bi bi-dash-circle"></i> Log Expense
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Balance Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card glass-card metric-card balance h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Current Balance</span>
              <div className="bg-info bg-opacity-10 text-info p-2 rounded-3">
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
            <h3 className={`fw-bold m-0 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {balance >= 0 ? '' : '-'}{symbol}{Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <small className="text-muted mt-2">Overall net funds</small>
          </div>
        </div>

        {/* Income Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card glass-card metric-card income h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Total Income</span>
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                <i className="bi bi-arrow-up-right-circle-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold m-0 text-success">
              {symbol}{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <small className="text-muted mt-2">Cumulative earnings logged</small>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card glass-card metric-card expense h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Total Expenses</span>
              <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-3">
                <i className="bi bi-arrow-down-left-circle-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold m-0 text-danger">
              {symbol}{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <small className="text-muted mt-2">Cumulative spending logged</small>
          </div>
        </div>

        {/* Budget Usage Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card glass-card metric-card savings h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Budget Utilization</span>
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                <i className="bi bi-pie-chart-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold m-0">
              {budgetUsagePercent}%
            </h3>
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div 
                className={`progress-bar ${budgetUsagePercent > 85 ? 'bg-danger' : budgetUsagePercent > 60 ? 'bg-warning' : 'bg-primary'}`} 
                role="progressbar" 
                style={{ width: `${budgetUsagePercent}%` }} 
                aria-valuenow={budgetUsagePercent} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <small className="text-muted mt-2">Spent {symbol}{totalExpense.toFixed(0)} of {symbol}{totalBudgetLimit.toFixed(0)} limit</small>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="row g-4 mb-4">
        {/* Left Column: Recent Transactions & Goal Quick Progress */}
        <div className="col-12 col-xl-8">
          {/* Recent Transactions Card */}
          <div className="card glass-card p-4 border-0 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 fw-bold">Recent Activity</h5>
              <Link to="/expenses" className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.85rem' }}>
                View All Log
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table custom-table align-middle m-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontSize: '0.85rem' }}>{t.date}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi bi-${t.type === 'income' ? 'arrow-up-right text-success' : 'arrow-down-left text-danger'} fw-bold`}></i>
                          <span className="fw-semibold">{t.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-category ${t.type === 'income' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                          {t.category}
                        </span>
                      </td>
                      <td className={`text-end fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {t.type === 'income' ? '+' : '-'}{symbol}{parseFloat(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">No recent activities. Click add above to log.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Mini Comparison chart (Custom SVG) */}
          <div className="card glass-card p-4 border-0">
            <h5 className="fw-bold mb-3">Monthly Cash Flow</h5>
            <div className="d-flex justify-content-center p-3" style={{ height: '220px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {/* Responsive SVG Chart comparing Income & Expenses */}
              <svg viewBox="0 0 400 150" className="w-100 h-100" style={{ overflow: 'visible' }}>
                {/* Gridlines */}
                <line x1="40" y1="20" x2="360" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="360" y2="60" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="360" y2="100" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="120" x2="360" y2="120" stroke="var(--text-muted)" strokeWidth="0.8" />
                
                {/* Income Bar (Green) */}
                <rect 
                  x="100" 
                  y={120 - Math.min(100, (totalIncome / Math.max(totalIncome, totalExpense)) * 100)} 
                  width="50" 
                  height={Math.min(100, (totalIncome / Math.max(totalIncome, totalExpense)) * 100)} 
                  rx="6" 
                  fill="url(#incomeGrad)" 
                  style={{ animation: 'growBar 1s ease-out' }}
                />
                
                {/* Expense Bar (Red) */}
                <rect 
                  x="230" 
                  y={120 - Math.min(100, (totalExpense / Math.max(totalIncome, totalExpense)) * 100)} 
                  width="50" 
                  height={Math.min(100, (totalExpense / Math.max(totalIncome, totalExpense)) * 100)} 
                  rx="6" 
                  fill="url(#expenseGrad)" 
                  style={{ animation: 'growBar 1.2s ease-out' }}
                />

                {/* Labels */}
                <text x="125" y="140" fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontWeight="bold">INCOME</text>
                <text x="255" y="140" fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontWeight="bold">EXPENSE</text>

                <text x="125" y={110 - Math.min(100, (totalIncome / Math.max(totalIncome, totalExpense)) * 100)} fill="var(--accent-success)" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {symbol}{totalIncome.toFixed(0)}
                </text>
                <text x="255" y={110 - Math.min(100, (totalExpense / Math.max(totalIncome, totalExpense)) * 100)} fill="var(--accent-danger)" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {symbol}{totalExpense.toFixed(0)}
                </text>

                {/* Gradients */}
                <defs>
                  <linearGradient id="incomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Insights & Savings Goals Quick Widget */}
        <div className="col-12 col-xl-4">
          
          {/* AI Insights Panel */}
          <div className="card glass-card p-4 border-0 mb-4 pulse-glow">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-cpu-fill text-info fs-4"></i>
              <h5 className="m-0 fw-bold">AI Financial Insights</h5>
              <span className="badge rounded-pill bg-info text-dark ms-auto" style={{ fontSize: '0.65rem' }}>Active</span>
            </div>
            
            <div className="d-flex flex-column gap-3">
              {insights.map((ins) => (
                <div 
                  key={ins.id} 
                  className={`p-3 rounded-3 border-start border-4 ${
                    ins.type === 'warning' ? 'bg-warning-subtle border-warning' : 
                    ins.type === 'success' ? 'bg-success-subtle border-success' : 'bg-info-subtle border-info'
                  }`}
                  style={{ 
                    fontSize: '0.85rem',
                    backgroundColor: 
                      ins.type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : 
                      ins.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)'
                  }}
                >
                  <p className="m-0 text-secondary" dangerouslySetInnerHTML={{ __html: ins.message }}></p>
                </div>
              ))}
            </div>

            <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
              <Link to="/ai-advisor" className="btn btn-sm btn-link text-decoration-none text-info w-100 fw-semibold" style={{ fontSize: '0.85rem' }}>
                Consult AI Assistant <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Quick Savings Goals Widget */}
          <div className="card glass-card p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 fw-bold">Goal Targets</h5>
              <Link to="/goals" className="btn btn-sm btn-link text-decoration-none text-primary p-0" style={{ fontSize: '0.85rem' }}>
                Manage
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {goals.slice(0, 3).map((g) => {
                const percent = Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
                return (
                  <div key={g.id}>
                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.85rem' }}>
                      <span className="fw-semibold text-secondary">{g.name}</span>
                      <span className="fw-bold">{percent}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className={`progress-bar bg-success`} 
                        role="progressbar" 
                        style={{ width: `${percent}%` }} 
                        aria-valuenow={percent} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1 text-muted" style={{ fontSize: '0.75rem' }}>
                      <span>Saved: {symbol}{g.currentAmount.toFixed(0)}</span>
                      <span>Target: {symbol}{g.targetAmount.toFixed(0)}</span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <p className="text-muted text-center py-3 m-0" style={{ fontSize: '0.85rem' }}>No goals created yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
