import React, { useState, useEffect } from 'react';
import { transactionService, profileService } from '../services/api';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txs = await transactionService.getTransactions();
        const prof = await profileService.getProfile();
        setTransactions(txs);
        setCurrency(prof.currency || 'USD');
      } catch (err) {
        console.error('Error fetching reports data:', err);
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

  // Group transactions for calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netSavings = totalIncome - totalExpense;

  // Expenses grouped by Category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const sortedCategories = Object.keys(expenseByCategory).map(cat => ({
    category: cat,
    amount: expenseByCategory[cat],
    percent: totalExpense > 0 ? Math.round((expenseByCategory[cat] / totalExpense) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  // CSV Exporter for all Transactions
  const exportAllToCSV = () => {
    const headers = ['ID,Type,Date,Description,Category,Amount\n'];
    const rows = transactions.map(t => 
      `"${t.id}","${t.type}","${t.date}","${t.description.replace(/"/g, '""')}","${t.category}",${t.amount}`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Finura_Full_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF simulation using Window Print Layouts
  const handlePrintPDF = () => {
    window.print();
  };

  // Category Color Palette Map
  const categoryColors = {
    'Food': '#6366f1', // Indigo
    'Transport': '#06b6d4', // Cyan
    'Shopping': '#10b981', // Emerald
    'Bills': '#ef4444', // Rose
    'Education': '#f59e0b', // Amber
    'Entertainment': '#3b82f6', // Blue
    'Healthcare': '#a855f7', // Purple
    'Other': '#64748b' // Slate
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3 no-print">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Financial Reports & Analytics</h2>
          <p className="text-muted m-0">Detailed breakdown of cash flow trends and category usage.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={exportAllToCSV} className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
          </button>
          <button onClick={handlePrintPDF} className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-printer"></i> Print PDF Report
          </button>
        </div>
      </div>

      {/* Print View Header (Only shows during print layout) */}
      <div className="d-none d-print-block mb-4 text-center">
        <h2>Finura Financial Status Report</h2>
        <p className="text-muted">Generated on {new Date().toLocaleDateString()}</p>
        <hr />
      </div>

      {/* Stats Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card glass-card p-3 border-0 bg-success bg-opacity-5">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Total Earnings (Inflow)</span>
            <h3 className="fw-bold m-0 text-success">{symbol}{totalIncome.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card glass-card p-3 border-0 bg-danger bg-opacity-5">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Total Spending (Outflow)</span>
            <h3 className="fw-bold m-0 text-danger">{symbol}{totalExpense.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card glass-card p-3 border-0 bg-info bg-opacity-5">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Net Savings</span>
            <h3 className="fw-bold m-0 text-info">{symbol}{netSavings.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        
        {/* CHART 1: Monthly Spending Trends (Area Chart) */}
        <div className="col-12 col-md-6">
          <div className="card glass-card p-4 h-100 border-0">
            <h5 className="fw-bold mb-3">Monthly Spending Trends</h5>
            <div className="p-2" style={{ height: '240px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {/* Custom SVG Area Chart */}
              <svg viewBox="0 0 500 240" className="w-100 h-100" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Y Axis Gridlines */}
                <line x1="50" y1="40" x2="450" y2="40" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="90" x2="450" y2="90" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="450" y2="140" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="190" x2="450" y2="190" stroke="var(--text-muted)" strokeWidth="0.8" />
                
                {/* Area path */}
                <path 
                  d="M 50 190 L 130 150 L 210 170 L 290 110 L 370 140 L 450 70 L 450 190 Z" 
                  fill="url(#areaGrad)" 
                />
                {/* Line path */}
                <path 
                  d="M 50 190 L 130 150 L 210 170 L 290 110 L 370 140 L 450 70" 
                  fill="transparent" 
                  stroke="var(--accent-primary)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Point Dots */}
                <circle cx="50" cy="190" r="4" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
                <circle cx="130" cy="150" r="4" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
                <circle cx="210" cy="170" r="4" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
                <circle cx="290" cy="110" r="4" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
                <circle cx="370" cy="140" r="4" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
                <circle cx="450" cy="70" r="4" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />

                {/* Labels */}
                <text x="50" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Dec</text>
                <text x="130" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Jan</text>
                <text x="210" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Feb</text>
                <text x="290" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Mar</text>
                <text x="370" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Apr</text>
                <text x="450" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">May</text>

                {/* Values overlay */}
                <text x="290" y="95" fill="var(--text-primary)" fontSize="9" textAnchor="middle" fontWeight="bold">{symbol}1450</text>
                <text x="450" y="55" fill="var(--text-primary)" fontSize="9" textAnchor="middle" fontWeight="bold">{symbol}{totalExpense.toFixed(0)}</text>
              </svg>
            </div>
          </div>
        </div>

        {/* CHART 2: Income vs Expense comparison (Bar Chart) */}
        <div className="col-12 col-md-6">
          <div className="card glass-card p-4 h-100 border-0">
            <h5 className="fw-bold mb-3">Income vs Expense Comparison</h5>
            <div className="p-2" style={{ height: '240px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {/* Custom SVG Bar Chart */}
              <svg viewBox="0 0 500 240" className="w-100 h-100" style={{ overflow: 'visible' }}>
                {/* Y Axis Gridlines */}
                <line x1="50" y1="40" x2="450" y2="40" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="90" x2="450" y2="90" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="450" y2="140" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="190" x2="450" y2="190" stroke="var(--text-muted)" strokeWidth="0.8" />

                {/* Bars - March */}
                <rect x="100" y="80" width="20" height="110" rx="3" fill="#10b981" />
                <rect x="125" y="110" width="20" height="80" rx="3" fill="#f43f5e" />

                {/* Bars - April */}
                <rect x="210" y="90" width="20" height="100" rx="3" fill="#10b981" />
                <rect x="235" y="125" width="20" height="65" rx="3" fill="#f43f5e" />

                {/* Bars - May */}
                <rect x="320" y={190 - Math.min(150, (totalIncome / 6000) * 150)} width="20" height={Math.min(150, (totalIncome / 6000) * 150)} rx="3" fill="#10b981" />
                <rect x="345" y={190 - Math.min(150, (totalExpense / 6000) * 150)} width="20" height={Math.min(150, (totalExpense / 6000) * 150)} rx="3" fill="#f43f5e" />

                {/* Axis Labels */}
                <text x="122" y="210" fill="var(--text-muted)" fontSize="10" textAnchor="middle">March</text>
                <text x="232" y="210" fill="var(--text-muted)" fontSize="10" textAnchor="middle">April</text>
                <text x="342" y="210" fill="var(--text-muted)" fontSize="10" textAnchor="middle">May (Current)</text>

                {/* Legend */}
                <rect x="400" y="10" width="10" height="10" fill="#10b981" />
                <text x="415" y="19" fill="var(--text-secondary)" fontSize="9">Income</text>
                <rect x="400" y="25" width="10" height="10" fill="#f43f5e" />
                <text x="415" y="34" fill="var(--text-secondary)" fontSize="9">Expense</text>
              </svg>
            </div>
          </div>
        </div>

        {/* CHART 3: Category-wise Expense distribution (Concentric Rings) */}
        <div className="col-12 col-md-6">
          <div className="card glass-card p-4 h-100 border-0">
            <h5 className="fw-bold mb-3">Concentric Category Breakdown</h5>
            <div className="row align-items-center">
              <div className="col-12 col-sm-6 text-center">
                {/* SVG Concentric Target rings representing percentages */}
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Outer Ring 1: Bills */}
                  <circle cx="80" cy="80" r="60" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
                  <circle cx="80" cy="80" r="60" stroke={categoryColors['Bills']} strokeWidth="6" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 60} 
                    strokeDashoffset={2 * Math.PI * 60 * (1 - (sortedCategories[0]?.percent || 0) / 100)} 
                    strokeLinecap="round"
                  />

                  {/* Ring 2: Food */}
                  <circle cx="80" cy="80" r="48" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
                  <circle cx="80" cy="80" r="48" stroke={categoryColors['Food'] || '#6366f1'} strokeWidth="6" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 48} 
                    strokeDashoffset={2 * Math.PI * 48 * (1 - (sortedCategories[1]?.percent || 0) / 100)} 
                    strokeLinecap="round"
                  />

                  {/* Ring 3: Shopping */}
                  <circle cx="80" cy="80" r="36" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
                  <circle cx="80" cy="80" r="36" stroke={categoryColors['Shopping'] || '#10b981'} strokeWidth="6" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 36} 
                    strokeDashoffset={2 * Math.PI * 36 * (1 - (sortedCategories[2]?.percent || 0) / 100)} 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-flex flex-column gap-2 mt-3 mt-sm-0">
                  {sortedCategories.slice(0, 4).map(sc => (
                    <div key={sc.category} className="d-flex align-items-center justify-content-between" style={{ fontSize: '0.82rem' }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: categoryColors[sc.category] || '#64748b' }}></span>
                        <span className="fw-semibold text-secondary">{sc.category}</span>
                      </div>
                      <span className="fw-bold">{symbol}{sc.amount.toFixed(0)} ({sc.percent}%)</span>
                    </div>
                  ))}
                  {sortedCategories.length === 0 && (
                    <p className="text-muted m-0 text-center" style={{ fontSize: '0.8rem' }}>No expense records available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 4: Savings growth trends (Line Chart) */}
        <div className="col-12 col-md-6">
          <div className="card glass-card p-4 h-100 border-0">
            <h5 className="fw-bold mb-3">Savings Growth Trends</h5>
            <div className="p-2" style={{ height: '240px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {/* Custom SVG Line Chart */}
              <svg viewBox="0 0 500 240" className="w-100 h-100" style={{ overflow: 'visible' }}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Y Axis Gridlines */}
                <line x1="50" y1="40" x2="450" y2="40" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="90" x2="450" y2="90" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="450" y2="140" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="50" y1="190" x2="450" y2="190" stroke="var(--text-muted)" strokeWidth="0.8" />

                {/* Line Path */}
                <path 
                  d="M 50 180 L 130 160 L 210 130 L 290 120 L 370 100 L 450 60" 
                  fill="transparent" 
                  stroke="var(--accent-secondary)" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Label Points */}
                <circle cx="50" cy="180" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2.5" />
                <circle cx="130" cy="160" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2.5" />
                <circle cx="210" cy="130" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2.5" />
                <circle cx="290" cy="120" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2.5" />
                <circle cx="370" cy="100" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2.5" />
                <circle cx="450" cy="60" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2.5" />

                {/* Axis Labels */}
                <text x="50" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Jan</text>
                <text x="130" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Feb</text>
                <text x="210" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Mar</text>
                <text x="290" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Apr</text>
                <text x="370" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">May</text>
                <text x="450" y="210" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Projected</text>

                {/* Values overlay */}
                <text x="450" y="45" fill="var(--accent-secondary)" fontSize="9" textAnchor="middle" fontWeight="bold">{symbol}{netSavings > 0 ? (netSavings * 1.25).toFixed(0) : '3500'}</text>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
