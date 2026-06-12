import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/users.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import AdminList from '../../components/AdminList.jsx';
import fetchAdmins from './fetchAdmins.js'; // Ensure you create these API helper files

import AddAdminModal from '../../components/modals/AddAdminModal.jsx';
import UpdatePermissionsModal from '../../components/modals/UpdatePermissionsModal.jsx';
import DowngradeAdminModal from '../../components/modals/DowngradeAdminModal.jsx';
import DeleteAdminModal from '../../components/modals/DeleteAdminModal.jsx';

function Admin() {
    const navigate = useNavigate();
    const [adminDetails, setAdminDetails] = useState({
        name: localStorage.getItem('adminName'),
        isSuperAdmin: localStorage.getItem('isSuperAdmin') === 'true'
    });

    // UI States
    const [sidebarActive, setSidebarActive] = useState(false);
    const [addModalActive, setAddModalActive] = useState(false);
    const [permissionsModalActive, setPermissionsModalActive] = useState(false);
    const [downgradeModalActive, setDowngradeModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);

    const [loading, setLoading] = useState(true);
    const [emptyState, setEmptyState] = useState(false);
    const [pageReload, setPageReload] = useState(0);

    // Data States
    const [admins, setAdmins] = useState([]);
    const [adminId, setAdminId] = useState('');
    const [selectedAdminData, setSelectedAdminData] = useState({});

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, selectedStatus, sortOption]);

    const loadAdmins = async () => {
        const payload = {
            search: debouncedSearch,
            status: selectedStatus,
            sort: sortOption,
            page: currentPage,
            limit: 5,
        };

        const result = await fetchAdmins(navigate, toast, payload, setAdmins, setLoading, setTotalPages);
        setEmptyState(result?.admins?.length === 0);
    };

    useEffect(() => {
        loadAdmins();
    }, [debouncedSearch, selectedStatus, sortOption, currentPage, pageReload]);

    return (
        <div className="admin-container">
            <Sidebar active={sidebarActive} adminDetails={adminDetails} />
            <main className="admin-main">
                <header className="header-group">
                    <Hambargar toggle={() => setSidebarActive(!sidebarActive)} sidebarActive={sidebarActive} />
                    <div className="list-header">
                        <h1 className="list-title">Manage Admins</h1>
                        <div className="list-actions">
                            <button className="action-btn primary" onClick={() => setAddModalActive(true)}>
                                <i className="fas fa-user-shield"></i> Add Admin
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filters & Sorting */}
                <div className="search-filter d-flex gap-2 flex-sm-row">
                    <div className="search-box w-100">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group d-flex flex-row w-100 gap-2">
                        {/* Status Dropdown */}
                        <div className="filter-dropdown w-100">
                            <select
                                className="status-filter w-100 h-100"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>

                        {/* NEW: Sort Dropdown */}
                        <div className="filter-dropdown w-100">
                            <select
                                className="sort-filter w-100 h-100"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="name_asc">Name (A to Z)</option>
                                <option value="name_desc">Name (Z to A)</option>
                                <option value="login_recent">Recently Logged In</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ListLoader loading={loading} />

                <div className="user-table-container mb-4" style={{ display: loading ? 'none' : 'block' }}>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Admin Details</th>
                                <th>Permissions</th>
                                <th>Created_At</th>
                                <th>Last_Login</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <AdminList
                                    key={admin._id}
                                    admin={admin}
                                    refresh={setPageReload}
                                    setAdminId={setAdminId}
                                    setSelectedAdminData={setSelectedAdminData}
                                    setPermissionsModalActive={setPermissionsModalActive}
                                    setDowngradeModalActive={setDowngradeModalActive}
                                    setDeleteModalActive={setDeleteModalActive}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="empty-state mt-4" style={{ display: emptyState && !loading ? 'flex' : 'none' }}>
                    <div className="empty-state-icon"><i className="fas fa-users-slash"></i></div>
                    <h3 className="empty-state-title">No Admins Found</h3>
                </div>

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

                <AddAdminModal isActive={addModalActive} onClose={() => setAddModalActive(false)} refresh={setPageReload} />
                <UpdatePermissionsModal isActive={permissionsModalActive} onClose={() => setPermissionsModalActive(false)} adminData={selectedAdminData} refresh={setPageReload} />
                <DowngradeAdminModal isActive={downgradeModalActive} onClose={() => setDowngradeModalActive(false)} adminData={selectedAdminData} refresh={setPageReload} />
                <DeleteAdminModal isActive={deleteModalActive} onClose={() => setDeleteModalActive(false)} adminId={adminId} refresh={setPageReload} />
            </main>
        </div>
    );
}

export default Admin;