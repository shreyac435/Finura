import React, { useState, useEffect } from 'react';
import { budgetService, transactionService, profileService } from '../services/api';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bdgts = await budgetService.getBudgets();
      const txs = await transactionService.getTransactions();
      const prof = await profileService.getProfile();

      setBudgets(bdgts);
      setExpenses(txs.filter(t => t.type === 'expense'));
      setCurrency(prof.currency || 'USD');
    } catch (err) {
      console.error('Error fetching budgets data:', err);
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

  const handleOpenEditModal = (budget) => {
    setCurrentBudget(budget);
    setEditLimit(budget.limit.toString());
    setValidationError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!editLimit || parseFloat(editLimit) < 0) {
      setValidationError('Please enter a valid budget limit (0 or greater)');
      return;
    }

    try {
      await budgetService.updateBudget(currentBudget.id, parseFloat(editLimit));
      setShowModal(false);
      fetchData(); // reload
    } catch (err) {
      setValidationError(err.message || 'Operation failed');
    }
  };

  // Process budgets to include spending stats
  const budgetMeters = budgets.map(b => {
    const spent = expenses
      .filter(e => e.category === b.category)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
    const remaining = b.limit - spent;

    return {
      ...b,
      spent,
      percent,
      remaining
    };
  });

  const totalLimit = budgetMeters.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetMeters.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalLimit - totalSpent;
  const overallPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Budgets...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Monthly Budgets</h2>
          <p className="text-muted m-0">Allocate limits for categories to track spending behavior.</p>
        </div>
      </div>

      {/* General Budget Summary Card */}
      <div className="card glass-card p-4 border-0 mb-4 bg-primary bg-opacity-10" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-4">
            <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>OVERALL BUDGET LIMIT</h6>
            <h3 className="fw-bold m-0 text-primary">{symbol}{totalLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>TOTAL SPENT</h6>
            <h3 className="fw-bold m-0 text-danger">{symbol}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>REMAINING BALANCE</h6>
            <h3 className={`fw-bold m-0 ${totalRemaining >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalRemaining >= 0 ? '' : '-'}{symbol}{Math.abs(totalRemaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="col-12 mt-3">
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
              <span className="fw-semibold">Overall Progress</span>
              <span className="fw-bold">{overallPercent}%</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className={`progress-bar ${overallPercent > 85 ? 'bg-danger' : overallPercent > 60 ? 'bg-warning' : 'bg-primary'}`}
                role="progressbar" 
                style={{ width: `${overallPercent}%` }} 
                aria-valuenow={overallPercent} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Budget progress meters */}
      <div className="row g-4 mb-4">
        {budgetMeters.map(bm => {
          let progressBg = 'bg-primary';
          let borderThemeColor = 'var(--border-color)';
          let statusText = 'Under Budget';
          let statusBadgeClass = 'bg-success-subtle text-success';

          if (bm.percent >= 100) {
            progressBg = 'bg-danger';
            borderThemeColor = 'rgba(239, 68, 68, 0.4)';
            statusText = 'Over Budget Limit!';
            statusBadgeClass = 'bg-danger text-white';
          } else if (bm.percent >= 80) {
            progressBg = 'bg-warning text-dark';
            borderThemeColor = 'rgba(245, 158, 11, 0.4)';
            statusText = 'Approaching Limit';
            statusBadgeClass = 'bg-warning text-dark';
          }

          return (
            <div key={bm.id} className="col-12 col-md-6 col-xxl-4">
              <div className="card glass-card p-4 h-100 border-0" style={{ borderTop: `4px solid ${borderThemeColor}` }}>
                {/* Category Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold m-0">{bm.category}</h5>
                    <span className={`badge rounded-pill mt-1 ${statusBadgeClass}`} style={{ fontSize: '0.65rem' }}>
                      {statusText}
                    </span>
                  </div>
                  <button onClick={() => handleOpenEditModal(bm)} className="btn btn-sm btn-outline-secondary border-0 p-1">
                    <i className="bi bi-pencil-square fs-5 text-primary"></i>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                    <span className="text-muted">Spent Percentage</span>
                    <span className="fw-bold">{bm.percent}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${progressBg}`} 
                      role="progressbar" 
                      style={{ width: `${Math.min(bm.percent, 100)}%` }} 
                      aria-valuenow={bm.percent} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                {/* Detail figures */}
                <div className="d-flex flex-column gap-2 mb-2" style={{ fontSize: '0.85rem' }}>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Spent So Far:</span>
                    <span className="fw-semibold text-danger">{symbol}{bm.spent.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Monthly Limit:</span>
                    <span className="fw-bold">{symbol}{bm.limit.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-muted">{bm.remaining >= 0 ? 'Remaining Budget:' : 'Over Budget By:'}</span>
                    <span className={`fw-bold ${bm.remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                      {symbol}{Math.abs(bm.remaining).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Limit Modal */}
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
          <div className="card glass-card p-4 shadow-lg w-100 border-0" style={{ maxWidth: '440px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 fw-bold">Adjust Budget Limit</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>

            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Modify the maximum limit for <strong>{currentBudget?.category}</strong>. You'll see updates immediately.
            </p>

            {validationError && (
              <div className="alert alert-danger p-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {validationError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              {/* Limit Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>New Limit ({currency})</label>
                <input 
                  type="number" 
                  step="1"
                  className="form-control"
                  value={editLimit}
                  onChange={(e) => setEditLimit(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Limit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
