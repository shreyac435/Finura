import React, { useState, useEffect } from 'react';
import { goalService, profileService } from '../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit' or 'contribute'
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [validationError, setValidationError] = useState('');

  // Contribution state
  const [contribution, setContribution] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const gls = await goalService.getGoals();
      const prof = await profileService.getProfile();
      setGoals(gls);
      setCurrency(prof.currency || 'USD');
    } catch (err) {
      console.error('Error fetching goals:', err);
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
    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setDeadline('');
    setValidationError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (goal) => {
    setModalMode('edit');
    setCurrentId(goal.id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setDeadline(goal.deadline);
    setValidationError('');
    setShowModal(true);
  };

  const handleOpenContributeModal = (goal) => {
    setModalMode('contribute');
    setCurrentId(goal.id);
    setName(goal.name);
    setContribution('');
    setValidationError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await goalService.deleteGoal(id);
        fetchGoals();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (modalMode === 'contribute') {
      const contrVal = parseFloat(contribution);
      if (!contribution || contrVal <= 0) {
        setValidationError('Please enter a valid contribution amount greater than 0');
        return;
      }
      const goal = goals.find(g => g.id === currentId);
      if (goal) {
        const payload = {
          ...goal,
          currentAmount: parseFloat(goal.currentAmount) + contrVal
        };
        try {
          await goalService.updateGoal(currentId, payload);
          setShowModal(false);
          fetchGoals();
        } catch (err) {
          setValidationError(err.message || 'Operation failed');
        }
      }
      return;
    }

    // Add / Edit validation
    if (!name) {
      setValidationError('Please enter a goal name');
      return;
    }
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setValidationError('Please enter a target amount greater than 0');
      return;
    }
    if (parseFloat(currentAmount) < 0) {
      setValidationError('Current savings cannot be negative');
      return;
    }
    if (!deadline) {
      setValidationError('Please select a deadline date');
      return;
    }

    const payload = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || 0),
      deadline
    };

    try {
      if (modalMode === 'add') {
        await goalService.addGoal(payload);
      } else {
        await goalService.updateGoal(currentId, payload);
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      setValidationError(err.message || 'Operation failed');
    }
  };

  // Math aggregates
  const totalTargetSum = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0);
  const totalSavedSum = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);
  const overallSavedPercent = totalTargetSum > 0 ? Math.min(Math.round((totalSavedSum / totalTargetSum) * 100), 100) : 0;

  // Days remaining calculation helper
  const getDaysRemaining = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(dateStr);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days left`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Savings Goals</h2>
          <p className="text-muted m-0">Set milestones and track progress for major expenses.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle"></i> Create Goal
        </button>
      </div>

      {/* Aggregate goals card */}
      <div className="card glass-card p-4 border-0 mb-4 bg-info bg-opacity-10" style={{ borderLeft: '4px solid var(--accent-info)' }}>
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-4">
            <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>TOTAL TARGET SAVINGS</h6>
            <h3 className="fw-bold m-0 text-info">{symbol}{totalTargetSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>TOTAL SECURED SO FAR</h6>
            <h3 className="fw-bold m-0 text-success">{symbol}{totalSavedSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>SAVINGS RATE COMPLIANCE</h6>
            <h3 className="fw-bold m-0 text-primary">{overallSavedPercent}% Saved</h3>
          </div>
          <div className="col-12 mt-3">
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-success"
                role="progressbar" 
                style={{ width: `${overallSavedPercent}%` }} 
                aria-valuenow={overallSavedPercent} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* List of Goals */}
      <div className="row g-4">
        {goals.map(g => {
          const percent = Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
          const daysLeft = getDaysRemaining(g.deadline);
          const isCompleted = percent >= 100;

          return (
            <div key={g.id} className="col-12 col-md-6 col-xxl-4">
              <div className="card glass-card p-4 h-100 border-0 d-flex flex-column justify-content-between position-relative">
                {isCompleted && (
                  <div className="position-absolute top-0 end-0 mt-3 me-3">
                    <span className="badge bg-success-subtle text-success border border-success border-opacity-20 d-flex align-items-center gap-1 p-2 rounded-3">
                      <i className="bi bi-patch-check-fill"></i> Completed
                    </span>
                  </div>
                )}
                
                {/* Goal Details */}
                <div>
                  <h5 className="fw-bold m-0 pe-5 text-truncate" title={g.name}>{g.name}</h5>
                  <small className="text-muted d-block mt-1">
                    <i className="bi bi-calendar-event me-1"></i> Deadline: {g.deadline} ({daysLeft})
                  </small>
                  
                  {/* Progress Ring / Gauge Simulation */}
                  <div className="my-4 text-center">
                    <div className="d-inline-flex flex-column align-items-center justify-content-center position-relative" style={{ width: '130px', height: '130px' }}>
                      {/* Custom SVG Circular Gauge */}
                      <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                        {/* Background track circle */}
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="50" 
                          className="stroke-muted" 
                          strokeWidth="8" 
                          fill="transparent" 
                          style={{ stroke: 'var(--border-color)' }}
                        />
                        {/* Foreground progress circle */}
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="50" 
                          stroke={isCompleted ? 'var(--accent-success)' : 'var(--accent-info)'}
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={2 * Math.PI * 50 * (1 - percent / 100)}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                        />
                      </svg>
                      {/* Percent Label Text overlay */}
                      <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
                        <span className="h4 fw-bold m-0" style={{ fontFamily: 'var(--font-heading)' }}>{percent}%</span>
                        <span className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 600 }}>SECURED</span>
                      </div>
                    </div>
                  </div>

                  {/* Saved vs Target metrics */}
                  <div className="d-flex justify-content-between text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                    <div>
                      <small className="text-muted d-block">Saved So Far</small>
                      <strong className="text-success fs-5">{symbol}{g.currentAmount.toLocaleString()}</strong>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Target Goal</small>
                      <strong className="fs-5" style={{ color: 'var(--text-primary)' }}>{symbol}{g.targetAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 border-top pt-3 mt-2" style={{ borderColor: 'var(--border-color)' }}>
                  {!isCompleted && (
                    <button onClick={() => handleOpenContributeModal(g)} className="btn btn-sm btn-outline-success flex-grow-1 d-flex align-items-center justify-content-center gap-1">
                      <i className="bi bi-wallet2"></i> Save Money
                    </button>
                  )}
                  <button onClick={() => handleOpenEditModal(g)} className="btn btn-sm btn-outline-primary border-0 p-2" title="Edit Goal Details">
                    <i className="bi bi-pencil-square fs-5"></i>
                  </button>
                  <button onClick={() => handleDelete(g.id)} className="btn btn-sm btn-outline-danger border-0 p-2" title="Delete Savings Goal">
                    <i className="bi bi-trash-fill fs-5"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-12">
            <div className="card glass-card p-5 text-center border-0 text-muted">
              <i className="bi bi-trophy-fill text-muted fs-1 mb-3"></i>
              <h5>No savings goals created yet.</h5>
              <p>Plan ahead for luxury items, vacations, or emergency funds.</p>
              <button onClick={handleOpenAddModal} className="btn btn-primary mt-2">Create New Goal</button>
            </div>
          </div>
        )}
      </div>

      {/* Goals Create / Edit / Contribution Modal */}
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
              <h5 className="m-0 fw-bold">
                {modalMode === 'add' ? 'Create Savings Goal' : modalMode === 'edit' ? 'Edit Savings Goal' : `Add Contribution to ${name}`}
              </h5>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>

            {validationError && (
              <div className="alert alert-danger p-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {validationError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              {modalMode === 'contribute' ? (
                /* Contribution amount fields */
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Amount to Contribute ({currency})</label>
                  <input 
                    type="number" 
                    step="1"
                    className="form-control"
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    placeholder="0.00"
                    required
                    autoFocus
                  />
                  <small className="text-muted mt-2 d-block">This amount will be added to your current savings for this goal.</small>
                </div>
              ) : (
                /* Add / Edit standard fields */
                <>
                  {/* Goal Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Goal Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Emergency Savings Fund"
                      required
                    />
                  </div>

                  {/* Target Amount */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Target Amount ({currency})</label>
                    <input 
                      type="number" 
                      step="1"
                      className="form-control"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g., 5000"
                      required
                    />
                  </div>

                  {/* Current saved */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Current Saved Amount ({currency})</label>
                    <input 
                      type="number" 
                      step="1"
                      className="form-control"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Target Deadline Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Create Goal' : modalMode === 'edit' ? 'Save Changes' : 'Contribute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
