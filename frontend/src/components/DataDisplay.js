import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataDisplay.css';

const DataDisplay = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({});
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(100);
    const [availableFilters, setAvailableFilters] = useState({
        categories: [],
        branches: [],
        suppliers: []
    });
    
    // Filter states
    const [filters, setFilters] = useState({
        categoryFilter: '',
        branchFilter: '',
        supplierFilter: ''
    });

    const API_BASE_URL = 'http://localhost:5000/api/data';

    // Fetch available filter options on component mount
    useEffect(() => {
        fetchAvailableFilters();
    }, []);

    // Fetch data when filters or pagination change
    useEffect(() => {
        fetchData();
        fetchSummary();
    }, [filters, currentPage, recordsPerPage]);

    const fetchAvailableFilters = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/filters`);
            setAvailableFilters(response.data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'All') {
                    params.append(key, value);
                }
            });
            params.append('limit', recordsPerPage);
            params.append('page', currentPage);

            const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
            setData(response.data.data || []);
            setFilteredData(response.data.data || []);
            setPagination(response.data.pagination || {});
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
            setFilteredData([]);
            setPagination({});
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'All') {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`${API_BASE_URL}/summary?${params.toString()}`);
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
            setSummary({});
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when filters change
        fetchData();
        fetchSummary();
    };

    const clearFilters = () => {
        setFilters({
            categoryFilter: '',
            branchFilter: '',
            supplierFilter: ''
        });
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRecordsPerPageChange = (newLimit) => {
        setRecordsPerPage(newLimit);
        setCurrentPage(1);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    const formatDate = (dateNum) => {
        if (!dateNum) return 'N/A';
        // Convert Excel date number to JavaScript date
        const date = new Date((dateNum - 25569) * 86400 * 1000);
        return date.toLocaleDateString('en-IN');
    };

    return (
        <div className="data-display-container">
            {/* Filter Section */}
            <div className="filter-section">
                <h2>Data Filters</h2>
                <form onSubmit={handleSubmit} className="filter-form">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label htmlFor="categoryFilter">Category Filter:</label>
                            <select
                                id="categoryFilter"
                                value={filters.categoryFilter}
                                onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {availableFilters.categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="branchFilter">Branch Filter:</label>
                            <select
                                id="branchFilter"
                                value={filters.branchFilter}
                                onChange={(e) => handleFilterChange('branchFilter', e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {availableFilters.branches.map((branch, index) => (
                                    <option key={index} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="supplierFilter">Supplier Filter:</label>
                            <select
                                id="supplierFilter"
                                value={filters.supplierFilter}
                                onChange={(e) => handleFilterChange('supplierFilter', e.target.value)}
                            >
                                <option value="">All Suppliers</option>
                                {availableFilters.suppliers.map((supplier, index) => (
                                    <option key={index} value={supplier}>
                                        {supplier}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button type="submit" className="submit-btn">
                            Apply Filters
                        </button>
                        <button type="button" onClick={clearFilters} className="clear-btn">
                            Clear Filters
                        </button>
                    </div>
                </form>
            </div>

            {/* Summary Section */}
            {summary.totalRecords > 0 && (
                <div className="summary-section">
                    <h3>Summary</h3>
                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="summary-label">Total Records</div>
                            <div className="summary-value">{summary.totalRecords}</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-label">Total Net Amount</div>
                            <div className="summary-value">{formatCurrency(summary.totalNetAmount)}</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-label">Total Quantity</div>
                            <div className="summary-value">{summary.totalNetSlsQty}</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-label">Avg Net Amount</div>
                            <div className="summary-value">{formatCurrency(summary.avgNetAmount)}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Table Section */}
            <div className="table-section">
                <div className="table-header">
                    <div className="table-header-left">
                        <h3>Data Results</h3>
                        {pagination.totalRecords && (
                            <p className="records-info">
                                Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, pagination.totalRecords)} of {pagination.totalRecords.toLocaleString()} records
                            </p>
                        )}
                    </div>
                    <div className="table-header-right">
                        <label>
                            Records per page:
                            <select 
                                value={recordsPerPage} 
                                onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                                className="records-selector"
                            >
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={250}>250</option>
                                <option value={500}>500</option>
                                <option value={1000}>1000</option>
                            </select>
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading data...</div>
                ) : filteredData.length === 0 ? (
                    <div className="no-data">No data found with current filters</div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Department</th>
                                        <th>Category</th>
                                        <th>Branch</th>
                                        <th>Supplier</th>
                                        <th>Article No</th>
                                        <th>Item ID</th>
                                        <th>Fabric</th>
                                        <th>MRP</th>
                                        <th>Quantity</th>
                                        <th>Net Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td>{formatDate(item.xnMemoDate)}</td>
                                            <td>{item.departmentShortName}</td>
                                            <td>{item.categoryFilter}</td>
                                            <td>{item.branchFilter}</td>
                                            <td>{item.supplierFilter}</td>
                                            <td>{item.articleNo}</td>
                                            <td>{item.itemId}</td>
                                            <td>{item.fabric}</td>
                                            <td>{formatCurrency(item.itemMRP)}</td>
                                            <td>{item.netSlsQty}</td>
                                            <td className={item.netAmount >= 0 ? 'positive' : 'negative'}>
                                                {formatCurrency(item.netAmount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="pagination-container">
                                <div className="pagination-info">
                                    Page {currentPage} of {pagination.totalPages}
                                </div>
                                <div className="pagination-controls">
                                    <button 
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        ⟪ First
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="pagination-btn"
                                    >
                                        ⟨ Previous
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="pagination-btn"
                                    >
                                        Next ⟩
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                        disabled={currentPage === pagination.totalPages}
                                        className="pagination-btn"
                                    >
                                        Last ⟫
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DataDisplay;
