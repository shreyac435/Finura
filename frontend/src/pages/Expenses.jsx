import React, { useState, useEffect } from 'react';
import { transactionService, budgetService, profileService } from '../services/api';
import { EXPENSE_CATEGORIES } from '../data/mockData';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [budgetWarning, setBudgetWarning] = useState('');

  useEffect(() => {
    fetchExpensesAndBudgets();
  }, []);

  // Recalculate budget warning when amount or category changes
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0 || !category) {
      setBudgetWarning('');
      return;
    }

    const val = parseFloat(amount);
    const catBudget = budgets.find(b => b.category === category);
    
    if (catBudget) {
      // Calculate how much is already spent in this category
      const currentSpent = expenses
        .filter(e => e.category === category && e.id !== currentId) // exclude current in case of editing
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

      const totalProjected = currentSpent + val;
      if (totalProjected > catBudget.limit) {
        const exceededBy = totalProjected - catBudget.limit;
        setBudgetWarning(`Warning: This expense will exceed your "${category}" budget limit of ${getCurrencySymbol(currency)}${catBudget.limit.toFixed(0)} by ${getCurrencySymbol(currency)}${exceededBy.toFixed(2)}!`);
      } else {
        setBudgetWarning('');
      }
    } else {
      setBudgetWarning('');
    }
  }, [amount, category, budgets, expenses, currentId, currency]);

  const fetchExpensesAndBudgets = async () => {
    setLoading(true);
    try {
      const txs = await transactionService.getTransactions();
      const bdgts = await budgetService.getBudgets();
      const prof = await profileService.getProfile();

      setExpenses(txs.filter(t => t.type === 'expense'));
      setBudgets(bdgts);
      setCurrency(prof.currency || 'USD');
    } catch (err) {
      console.error('Error fetching expenses/budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (code) => {
    switch (code) {
      case 'EUR': return '€';
      case 'INR': return '₹';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentId(null);
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setValidationError('');
    setBudgetWarning('');
    setShowModal(true);
  };

  const handleOpenEditModal = (expense) => {
    setModalMode('edit');
    setCurrentId(expense.id);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setNotes(expense.description); // mapped from description
    setValidationError('');
    setBudgetWarning('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await transactionService.deleteTransaction(id,"expense");
        fetchExpensesAndBudgets();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Please enter a valid amount greater than 0');
      return;
    }
    if (!notes) {
      setValidationError('Please enter a note / description');
      return;
    }

    const payload = {
      type: 'expense',
      amount: parseFloat(amount),
      category,
      date,
      description: notes
    };

    try {
      if (modalMode === 'add') {
        await transactionService.addTransaction(payload);
      } else {
        await transactionService.updateTransaction(currentId, payload);
      }
      setShowModal(false);
      fetchExpensesAndBudgets();
    } catch (err) {
      setValidationError(err.message || 'Operation failed');
    }
  };

  // Export to CSV Functionality
  const exportToCSV = () => {
    const headers = ['Date,Description,Category,Amount\n'];
    const rows = filteredExpenses.map(e => 
      `"${e.date}","${e.description.replace(/"/g, '""')}","${e.category}",${e.amount}`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Expenses_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering Logic
  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? e.category === categoryFilter : true;
    
    let matchesDateRange = true;
    if (startDate) {
      matchesDateRange = matchesDateRange && e.date >= startDate;
    }
    if (endDate) {
      matchesDateRange = matchesDateRange && e.date <= endDate;
    }

    return matchesSearch && matchesCategory && matchesDateRange;
  });

  const totalExpensesSum = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Expense Management</h2>
          <p className="text-muted m-0">Log, categorize, and control your outgoing finances.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={exportToCSV} className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-download"></i> Export CSV
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i> Add Expense
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="card glass-card p-3 border-0 mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-color" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search notes / description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <select 
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <input 
              type="date" 
              className="form-control" 
              placeholder="Start Date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <input 
              type="date" 
              className="form-control" 
              placeholder="End Date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2 d-grid">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setStartDate('');
                setEndDate('');
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Total card */}
      <div className="card glass-card p-3 border-0 mb-4 bg-danger bg-opacity-10" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold text-danger fs-5">Filtered Total Spent</span>
          <h3 className="fw-bold m-0 text-danger">
            {symbol}{totalExpensesSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Log list */}
      <div className="card glass-card p-4 border-0">
        <div className="table-responsive">
          <table className="table custom-table align-middle m-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description / Notes</th>
                <th>Category</th>
                <th className="text-end">Amount</th>
                <th className="text-center" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontSize: '0.85rem' }}>{e.date}</td>
                  <td>
                    <span className="fw-semibold">{e.description}</span>
                  </td>
                  <td>
                    <span className="badge badge-category bg-secondary bg-opacity-10 text-secondary">
                      {e.category}
                    </span>
                  </td>
                  <td className="text-end fw-bold text-danger">
                    -{symbol}{parseFloat(e.amount).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button onClick={() => handleOpenEditModal(e)} className="btn btn-sm btn-outline-primary border-0 p-1">
                        <i className="bi bi-pencil-fill fs-6"></i>
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="btn btn-sm btn-outline-danger border-0 p-1">
                        <i className="bi bi-trash-fill fs-6"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No expense records found. Add an entry to begin tracking.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Overlay React Modal */}
      {showModal && (
        <div 
          className="modal-overlay d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1050
          }}
        >
          <div className="card glass-card p-4 shadow-lg w-100 border-0" style={{ maxWidth: '480px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 fw-bold">{modalMode === 'add' ? 'Log Expense' : 'Edit Expense Entry'}</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>

            {validationError && (
              <div className="alert alert-danger p-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {validationError}
              </div>
            )}

            {budgetWarning && (
              <div className="alert alert-warning p-2" style={{ fontSize: '0.82rem', borderRadius: '8px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {budgetWarning}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              {/* Amount */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Amount ({currency})</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Category</label>
                <select 
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Transaction Date</label>
                <input 
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Notes / Description</label>
                <input 
                  type="text"
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Grocery at Whole Foods"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Log Expense' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
