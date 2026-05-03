import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import '../../styles/content.scss';
import '../../styles/activity.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import ActivityList from '../../components/ActivityList.jsx';
import fetchActivityLogs from './fetchActivity.js';

function Activity() {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);

    // Data states
    const [logs, setLogs] = useState([]);
    const [availableActions, setAvailableActions] = useState([]);

    // Filter and Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedAction, setSelectedAction] = useState('all');
    const [selectedTime, setSelectedTime] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // UI states
    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedAction, selectedTime]);

    // 3. Fetch Data matching the Movies.jsx pattern
    const loadLogs = async () => {
        const payload = {
            search: debouncedSearch,
            action: selectedAction,
            time: selectedTime,
            page: currentPage,
            limit: 5,
        };

        const logData = await fetchActivityLogs(
            navigate,
            toast,
            payload,
            setLogs,
            setAvailableActions,
            setLoading,
            setTotalPages
        );

        // Check if activities exist to trigger empty state
        if (logData && logData.activities && logData.activities.length === 0) {
            setEmptyState(true);
        } else {
            setEmptyState(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [debouncedSearch, selectedAction, selectedTime, currentPage]);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} />

            <main className="admin-main">
                <header className="header-group">
                    <Hambargar
                        toggle={() => setSidebarActive(!sidebarActive)}
                        sidebarActive={sidebarActive}
                    />

                    <div className="list-header">
                        <h1 className="list-title">Activity Logs</h1>
                        <div className="list-actions">
                            <button
                                className="action-btn primary"
                                onClick={() => toast.info('Export functionality coming soon!')}>
                                <i className="fas fa-download"></i>
                                Export Logs
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="search-filter d-flex gap-2 flex-sm-row">
                    <div className="search-box w-100">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by Admin Name, Email, or Target..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group d-flex gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="w-100 h-100"
                                value={selectedAction}
                                onChange={(e) => setSelectedAction(e.target.value)}>
                                <option value="all">All Actions</option>
                                {availableActions.map((action) => (
                                    <option value={action} key={action}>
                                        {action}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-dropdown w-100">
                            <select
                                className="w-100 h-100"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}>
                                <option value="all">All Time</option>
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="1year">Last 1 Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ListLoader loading={loading} />

                <div
                    className="movie-table-container mb-4"
                    style={{ display: loading ? 'none' : 'block' }}>
                    <table className="movie-table">
                        <thead>
                            <tr>
                                <th>Admin_Details</th>
                                <th>Action_Performed</th>
                                <th>Target_Entity</th>
                                <th>Date_&_Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <ActivityList logData={log} key={log._id} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div
                    className="empty-state mt-4"
                    style={{ display: emptyState && !loading ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="empty-state-icon" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>
                        <i className="fas fa-history"></i>
                    </div>
                    <h3 className="empty-state-title" style={{ fontFamily: '"Oswald", sans-serif', color: '#fff' }}>No Logs Found</h3>
                    <p className="empty-state-message" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        No activity matches your current filters.
                    </p>
                </div>

                {/* Pagination */}
                {!emptyState && !loading && (
                    <div className="pagination">
                        <button
                            className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{ background: 'transparent', border: 'none' }}>
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Activity;