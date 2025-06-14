// Anomalies page JavaScript for SentinelScan

class AnomaliesPage {
    constructor() {
        this.currentPage = 0;
        this.limit = 10;
        this.sortBy = 'processed_at';
        this.autoRefreshInterval = null;
        this.autoRefreshEnabled = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnomalies();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Limit selector
        document.getElementById('limitSelect').addEventListener('change', (e) => {
            this.limit = parseInt(e.target.value);
            this.currentPage = 0;
            this.loadAnomalies();
        });

        // Sort selector
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.currentPage = 0;
            this.loadAnomalies();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadAnomalies();
            this.showToast('Anomalies refreshed', 'success');
        });

        // Auto refresh toggle
        document.getElementById('autoRefreshBtn').addEventListener('click', (e) => {
            this.toggleAutoRefresh();
        });
    }

    toggleAutoRefresh() {
        const btn = document.getElementById('autoRefreshBtn');
        
        if (this.autoRefreshEnabled) {
            // Stop auto refresh
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshEnabled = false;
            btn.innerHTML = '<i class="fas fa-play me-2"></i>Auto Refresh';
            btn.className = 'btn btn-outline-light w-100';
        } else {
            // Start auto refresh
            this.startAutoRefresh();
            this.autoRefreshEnabled = true;
            btn.innerHTML = '<i class="fas fa-pause me-2"></i>Auto Refresh';
            btn.className = 'btn btn-success w-100';
        }
    }

    startAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        this.autoRefreshInterval = setInterval(() => {
            this.loadAnomalies(false); // Silent refresh
        }, 10000); // Refresh every 10 seconds
        
        this.autoRefreshEnabled = true;
    }

    async loadAnomalies(showLoading = true) {
        const tableBody = document.getElementById('anomaliesTableBody');
        
        if (showLoading) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center text-muted py-4">
                        <i class="fas fa-spinner fa-spin fa-2x mb-2 d-block"></i>
                        Loading anomalies...
                    </td>
                </tr>
            `;
        }

        try {
            const skip = this.currentPage * this.limit;
            const url = `/api/anomalies?limit=${this.limit}&skip=${skip}&sort_by=${this.sortBy}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                this.renderAnomaliesTable(data.anomalies);
                this.updatePagination(data.total);
                this.updateTotalCount(data.total);
            } else {
                this.showError('Failed to load anomalies');
            }
        } catch (error) {
            console.error('Error loading anomalies:', error);
            this.showError('Network error loading anomalies');
        }
    }

    renderAnomaliesTable(anomalies) {
        const tableBody = document.getElementById('anomaliesTableBody');
        
        if (anomalies.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center text-muted py-4">
                        <i class="fas fa-search fa-2x mb-2 d-block"></i>
                        No anomalies detected yet
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = anomalies.map(anomaly => {
            const scoreClass = this.getScoreClass(anomaly.anomaly_score);
            const formattedDate = new Date(anomaly.processed_at).toLocaleString();
            const formattedAmount = `${anomaly.currency} ${anomaly.amount.toFixed(2)}`;
            
            return `
                <tr>
                    <td>
                        <code class="text-primary">${anomaly.transaction_id}</code>
                    </td>
                    <td>
                        <span class="text-muted">${anomaly.user_id}</span>
                    </td>
                    <td>
                        <strong>${formattedAmount}</strong>
                    </td>
                    <td>
                        <span class="badge bg-secondary">${anomaly.transaction_type}</span>
                    </td>
                    <td>
                        <i class="fas fa-globe me-1"></i>${anomaly.location_country}
                    </td>
                    <td>
                        <i class="fas fa-${this.getDeviceIcon(anomaly.device_info)} me-1"></i>
                        ${anomaly.device_info}
                    </td>
                    <td>
                        <span class="${scoreClass}">
                            ${(anomaly.anomaly_score * 100).toFixed(1)}%
                        </span>
                    </td>
                    <td>
                        <small class="text-muted">${formattedDate}</small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="anomaliesPage.showTransactionDetails('${anomaly.transaction_id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getScoreClass(score) {
        if (score >= 0.8) return 'anomaly-score-high';
        if (score >= 0.5) return 'anomaly-score-medium';
        return 'anomaly-score-low';
    }

    getDeviceIcon(device) {
        switch (device) {
            case 'mobile': return 'mobile-alt';
            case 'tablet': return 'tablet-alt';
            case 'desktop': return 'desktop';
            default: return 'device';
        }
    }

    updatePagination(total) {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(total / this.limit);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="anomaliesPage.goToPage(${this.currentPage - 1}); return false;">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(0, this.currentPage - 2);
        const endPage = Math.min(totalPages - 1, this.currentPage + 2);

        if (startPage > 0) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="anomaliesPage.goToPage(0); return false;">1</a>
                </li>
            `;
            if (startPage > 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="anomaliesPage.goToPage(${i}); return false;">
                        ${i + 1}
                    </a>
                </li>
            `;
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="anomaliesPage.goToPage(${totalPages - 1}); return false;">
                        ${totalPages}
                    </a>
                </li>
            `;
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage >= totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="anomaliesPage.goToPage(${this.currentPage + 1}); return false;">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadAnomalies();
    }

    updateTotalCount(total) {
        document.getElementById('totalAnomaliesCount').textContent = total;
    }

    async showTransactionDetails(transactionId) {
        try {
            // Find the transaction in current data
            const response = await fetch('/api/anomalies');
            const data = await response.json();
            
            const transaction = data.anomalies.find(a => a.transaction_id === transactionId);
            
            if (transaction) {
                this.renderTransactionModal(transaction);
                const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
                modal.show();
            }
        } catch (error) {
            console.error('Error loading transaction details:', error);
            this.showToast('Error loading transaction details', 'error');
        }
    }

    renderTransactionModal(transaction) {
        const detailsContainer = document.getElementById('transactionDetails');
        const formattedDate = new Date(transaction.processed_at).toLocaleString();
        const scoreClass = this.getScoreClass(transaction.anomaly_score);
        
        detailsContainer.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-primary mb-3">Transaction Information</h6>
                    <table class="table table-dark table-sm">
                        <tr>
                            <td><strong>Transaction ID:</strong></td>
                            <td><code>${transaction.transaction_id}</code></td>
                        </tr>
                        <tr>
                            <td><strong>User ID:</strong></td>
                            <td>${transaction.user_id}</td>
                        </tr>
                        <tr>
                            <td><strong>Amount:</strong></td>
                            <td><strong>${transaction.currency} ${transaction.amount.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Type:</strong></td>
                            <td><span class="badge bg-secondary">${transaction.transaction_type}</span></td>
                        </tr>
                        <tr>
                            <td><strong>Merchant ID:</strong></td>
                            <td>${transaction.merchant_id || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6 class="text-danger mb-3">Anomaly Details</h6>
                    <table class="table table-dark table-sm">
                        <tr>
                            <td><strong>Anomaly Score:</strong></td>
                            <td><span class="${scoreClass}">${(transaction.anomaly_score * 100).toFixed(1)}%</span></td>
                        </tr>
                        <tr>
                            <td><strong>Risk Level:</strong></td>
                            <td>
                                ${transaction.anomaly_score >= 0.8 ? 
                                    '<span class="badge bg-danger">High</span>' :
                                    transaction.anomaly_score >= 0.5 ?
                                    '<span class="badge bg-warning">Medium</span>' :
                                    '<span class="badge bg-info">Low</span>'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Location:</strong></td>
                            <td><i class="fas fa-globe me-1"></i>${transaction.location_country}</td>
                        </tr>
                        <tr>
                            <td><strong>Device:</strong></td>
                            <td><i class="fas fa-${this.getDeviceIcon(transaction.device_info)} me-1"></i>${transaction.device_info}</td>
                        </tr>
                        <tr>
                            <td><strong>Processed At:</strong></td>
                            <td>${formattedDate}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6 class="text-info mb-3">Recommended Actions</h6>
                    <div class="alert alert-info">
                        ${this.getRecommendedActions(transaction.anomaly_score)}
                    </div>
                </div>
            </div>
        `;
    }

    getRecommendedActions(score) {
        if (score >= 0.8) {
            return `
                <strong>High Risk Transaction</strong><br>
                • Immediately flag for manual review<br>
                • Consider temporary account restrictions<br>
                • Contact user for verification<br>
                • Review recent transaction history
            `;
        } else if (score >= 0.5) {
            return `
                <strong>Medium Risk Transaction</strong><br>
                • Queue for analyst review<br>
                • Monitor user activity patterns<br>
                • Consider additional authentication for future transactions
            `;
        } else {
            return `
                <strong>Low Risk Transaction</strong><br>
                • Log for pattern analysis<br>
                • Continue monitoring<br>
                • No immediate action required
            `;
        }
    }

    showError(message) {
        const tableBody = document.getElementById('anomaliesTableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-danger py-4">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
                    ${message}
                </td>
            </tr>
        `;
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toastContainer = document.getElementById('toastContainer') || document.body;
        const toastId = 'toast_' + Date.now();
        
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 'bg-primary';
        
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-white ${bgClass} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize anomalies page when DOM is loaded
let anomaliesPage;
document.addEventListener('DOMContentLoaded', () => {
    anomaliesPage = new AnomaliesPage();
});
