import React, { useState, useEffect } from 'react';
import { transactionService, profileService } from '../services/api';
import { INCOME_SOURCES } from '../data/mockData';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentId, setCurrentId] = useState(null);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const txs = await transactionService.getTransactions();
      const prof = await profileService.getProfile();
      setIncomes(txs.filter(t => t.type === 'income'));
      setCurrency(prof.currency || 'USD');
    } catch (err) {
      console.error('Error fetching incomes:', err);
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
    setAmount('');
    setSource('Salary');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setValidationError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (income) => {
    setModalMode('edit');
    setCurrentId(income.id);
    setAmount(income.amount.toString());
    setSource(income.category); // category stores source
    setDate(income.date);
    setDescription(income.description);
    setValidationError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await transactionService.deleteTransaction(id, "income");
        fetchIncomes();
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
    if (!description) {
      setValidationError('Please enter a description');
      return;
    }

    const payload = {
      type: 'income',
      amount: parseFloat(amount),
      category: source,
      date,
      description
    };

    try {
      if (modalMode === 'add') {
        await transactionService.addTransaction(payload);
      } else {
        await transactionService.updateTransaction(currentId, payload);
      }
      setShowModal(false);
      fetchIncomes();
    } catch (err) {
      setValidationError(err.message || 'Operation failed');
    }
  };

  // Export to CSV Functionality
  const exportToCSV = () => {
    const headers = ['Date,Description,Source,Amount\n'];
    const rows = filteredIncomes.map(i => 
      `"${i.date}","${i.description.replace(/"/g, '""')}","${i.category}",${i.amount}`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Income_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering Logic
  const filteredIncomes = incomes.filter(i => {
    const matchesSearch = i.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter ? i.category === sourceFilter : true;
    
    let matchesDateRange = true;
    if (startDate) {
      matchesDateRange = matchesDateRange && i.date >= startDate;
    }
    if (endDate) {
      matchesDateRange = matchesDateRange && i.date <= endDate;
    }

    return matchesSearch && matchesSource && matchesDateRange;
  });

  const totalIncomesSum = filteredIncomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">Income Management</h2>
          <p className="text-muted m-0">Log and analyze your revenue channels.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={exportToCSV} className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-download"></i> Export CSV
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i> Add Income
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
                placeholder="Search description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <select 
              className="form-select"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All Sources</option>
              {INCOME_SOURCES.map(src => (
                <option key={src} value={src}>{src}</option>
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
                setSourceFilter('');
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
      <div className="card glass-card p-3 border-0 mb-4 bg-success bg-opacity-10" style={{ borderLeft: '4px solid var(--accent-success)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold text-success fs-5">Filtered Total Income</span>
          <h3 className="fw-bold m-0 text-success">
            {symbol}{totalIncomesSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                <th>Description</th>
                <th>Source</th>
                <th className="text-end">Amount</th>
                <th className="text-center" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((i) => (
                <tr key={i.id}>
                  <td style={{ fontSize: '0.85rem' }}>{i.date}</td>
                  <td>
                    <span className="fw-semibold">{i.description}</span>
                  </td>
                  <td>
                    <span className="badge badge-category bg-success bg-opacity-10 text-success">
                      {i.category}
                    </span>
                  </td>
                  <td className="text-end fw-bold text-success">
                    +{symbol}{parseFloat(i.amount).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button onClick={() => handleOpenEditModal(i)} className="btn btn-sm btn-outline-primary border-0 p-1">
                        <i className="bi bi-pencil-fill fs-6"></i>
                      </button>
                      <button onClick={() => handleDelete(i.id)} className="btn btn-sm btn-outline-danger border-0 p-1">
                        <i className="bi bi-trash-fill fs-6"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIncomes.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No income records found. Add a record to begin tracking.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Overlay React Modal */}
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
              <h5 className="m-0 fw-bold">{modalMode === 'add' ? 'Log Income' : 'Edit Income Entry'}</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>

            {validationError && (
              <div className="alert alert-danger p-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {validationError}
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

              {/* Source Category */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Income Source</label>
                <select 
                  className="form-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {INCOME_SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
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
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Description / Source Details</label>
                <input 
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Weekly freelance paycheck"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Log Income' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
