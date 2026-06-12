import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/responses.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import ResponseList from '../../components/ResponseList.jsx';
import ViewMessageModal from '../../components/modals/ViewMessageModal.jsx';
import displayResponses from './fetchResponses.js';
import fetchSingleMessage from './fetchSingleMessage.js';

function Responses() {
    const navigate = useNavigate();
    const { msg_id } = useParams();

    const [sidebarActive, setSidebarActive] = useState(false);
    const [adminDetails, setAdminDetails] = useState({ name: localStorage.getItem('adminName') || 'Admin' });

    // Data states
    const [responses, setResponses] = useState([]);
    const [activeMessage, setActiveMessage] = useState(null);

    // Filter and Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [userTypeFilter, setUserTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset Pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, userTypeFilter]);

    useEffect(() => {
        if (!loading) {
            setEmptyState(responses.length === 0);
        }
    }, [responses, loading]);

    // Fetch Table Data
    const fetchResponsesData = async () => {
        const payload = {
            search: debouncedSearch,
            status: statusFilter,
            userType: userTypeFilter,
            page: currentPage,
            limit: 5,
        };

        const responseData = await displayResponses(
            navigate, toast, payload, setResponses, setLoading, setTotalPages, setAdminDetails
        );

        setEmptyState(responseData && responseData.responses.length === 0);
    };

    useEffect(() => {
        fetchResponsesData();
    }, [debouncedSearch, statusFilter, userTypeFilter, currentPage]);

    // --- DEEP LINK & MODAL LOGIC ---
    useEffect(() => {
        if (msg_id) {
            const existingMessage = responses.find(r => r._id === msg_id);

            if (existingMessage) {
                let displayData = { ...existingMessage };
                if (!existingMessage.isRead) {
                    displayData.isRead = true;
                    displayData.readBy = adminDetails.name;
                    displayData.updatedAt = new Date().toISOString();
                }
                setActiveMessage(displayData);
            } else {
                const fetchMessageDirectly = async () => {
                    const data = await fetchSingleMessage(msg_id, navigate, toast, setModalLoading);
                    if (data) setActiveMessage(data);
                    else navigate('/responses');
                };
                fetchMessageDirectly();
            }
        } else {
            setActiveMessage(null);
        }
    }, [msg_id, responses, adminDetails.name, navigate]);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} adminDetails={adminDetails} />

            <main className="admin-main">
                <header className="header-group">
                    <Hambargar toggle={() => setSidebarActive(!sidebarActive)} sidebarActive={sidebarActive} />
                    <div className="list-header">
                        <h1 className="list-title">Contact Responses</h1>
                    </div>
                </header>

                {/* Filters */}
                <div className="search-filter gap-2">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group d-flex flex-row w-100 gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="w-100 h-100"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All Messages</option>
                                <option value="new">New Messages</option>
                                <option value="viewed">Viewed Messages</option>
                            </select>
                        </div>
                        <div className="filter-dropdown w-100">
                            <select
                                className="w-100 h-100"
                                value={userTypeFilter}
                                onChange={(e) => setUserTypeFilter(e.target.value)}>
                                <option value="all">All Users</option>
                                <option value="existing">Existing Users</option>
                                <option value="unknown">Unknown Users</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ListLoader loading={loading} />

                <div className="movie-table-container mb-4" style={{ display: loading ? 'none' : 'block' }}>
                    <table className="movie-table">
                        <thead>
                            <tr>
                                <th>Contact Details</th>
                                <th>Message</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((res) => (
                                <ResponseList
                                    key={res._id}
                                    data={res}
                                    setResponses={setResponses}
                                    adminName={adminDetails.name}
                                    statusFilter={statusFilter}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="empty-state mt-4" style={{ display: emptyState && !loading ? 'flex' : 'none' }}>
                    <div className="empty-state-icon"><i className="fas fa-inbox"></i></div>
                    <h3 className="empty-state-title">No Responses Found</h3>
                    <p className="empty-state-message">We couldn't find any contact responses matching your criteria.</p>
                </div>

                {/* Pagination Rendering (Updated to match Series/Movies) */}
                {!emptyState && !loading && totalPages > 0 && (
                    <div className="pagination">
                        {/* Previous Button */}
                        <button
                            className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        {/* Dynamic Pagination with Ellipses */}
                        {(() => {
                            let pages = [];

                            if (totalPages <= 5) {
                                // Show all if 5 or fewer pages
                                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                            } else if (currentPage <= 3) {
                                // Near the start: 1, 2, 3, 4, ..., Last
                                pages = [1, 2, 3, 4, '...', totalPages];
                            } else if (currentPage >= totalPages - 2) {
                                // Near the end: 1, ..., Last-2, Last-1, Last
                                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                            } else {
                                // In the middle: 1, ..., Prev, Current, Next, ..., Last
                                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                            }

                            return pages.map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="page-link disabled"
                                            style={{ background: 'transparent', border: 'none', cursor: 'default', color: 'rgba(255,255,255,0.5)' }}>
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        className={`page-link ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                        style={{ background: 'transparent', border: 'none' }}>
                                        {page}
                                    </button>
                                );
                            });
                        })()}

                        {/* Next Button */}
                        <button
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                )}
            </main>

            {/* Modal driven by URL State */}
            <ViewMessageModal
                isActive={!!activeMessage}
                messageData={activeMessage}
            />
        </div>
    );
}

export default Responses;