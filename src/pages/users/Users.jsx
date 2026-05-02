import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/users.scss';

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';
import UserList from '../../components/UserList.jsx';
import displayUsers from './fetchUsers.js';
import InviteUserModal from '../../components/modals/InviteUserModal.jsx';
import RenewUserModal from '../../components/modals/RenewUserModal.jsx';
import DeleteUserModal from '../../components/modals/DeleteUserModal.jsx';

function Users() {
    const navigate = useNavigate();

    // UI States
    const [sidebarActive, setSidebarActive] = useState(false);
    const [inviteModalActive, setInviteModalActive] = useState(false);
    const [renewModalActive, setRenewModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [emptyState, setEmptyState] = useState(false);
    const [pageReload, setPageReload] = useState(0);

    // Data States
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter, Sort, and Pagination States
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortOption, setSortOption] = useState('newest'); // Replaced role with sort
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 1. Debounce Search Implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Reset back to Page 1 if any filter or sort logic is changed
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedStatus, sortOption]);

    // 3. Fetching users on state change
    const fetchUsers = async () => {
        const payload = {
            search: debouncedSearch,
            status: selectedStatus,
            sort: sortOption,
            page: currentPage,
            limit: 5,
        };

        const userData = await displayUsers(
            navigate,
            toast,
            payload,
            setUsers,
            setLoading,
            setTotalPages
        );

        if (userData && userData.users.length === 0) {
            setEmptyState(true);
        } else {
            setEmptyState(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, selectedStatus, sortOption, currentPage, pageReload]);



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
                        <h1 className="list-title">Manage Users</h1>
                        <div className="list-actions">
                            <button
                                className="action-btn primary"
                                onClick={() => setInviteModalActive(true)}>
                                <i className="fas fa-user-plus"></i>
                                Invite User
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
                    <div className="filter-group d-flex gap-2">
                        <div className="filter-dropdown w-100">
                            <select
                                className="status-filter w-100 h-100"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                        <div className="filter-dropdown w-100">
                            <select
                                className="sort-filter w-100 h-100"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="name_asc">Name (A to Z)</option>
                                <option value="name_desc">Name (Z to A)</option>
                                <option value="login_recent">Recently Logged In</option>
                                <option value="expiry_soon">Expiring Soon</option>
                                <option value="expiry_latest">Longest Expiry</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ListLoader loading={loading} />

                <div
                    className="user-table-container mb-4"
                    style={{ display: loading ? 'none' : 'block' }}>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>User Details</th>
                                <th>Created_At</th>
                                <th>Last_Login</th>
                                <th>Valid_Till</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <UserList
                                    key={user._id}
                                    user={user}
                                    refresh={setPageReload}
                                    setDeleteModalActive={setDeleteModalActive}
                                    setRenewModalActive={setRenewModalActive}
                                    setUserId={setUserId}
                                    setUserData={setUserData}
                                />
                            ))}
                        </tbody>
                    </table>

                    <div
                        className="empty-state mt-4"
                        style={{ display: emptyState ? 'flex' : 'none' }}>
                        <div className="empty-state-icon">
                            <i className="fas fa-users-slash"></i>
                        </div>
                        <h3 className="empty-state-title">No Users Found</h3>
                        <p className="empty-state-message">
                            We couldn't find any users matching your criteria.
                        </p>
                    </div>
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
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ background: 'transparent', border: 'none' }}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                )}

                <InviteUserModal isActive={inviteModalActive} onClose={() => setInviteModalActive(false)} refresh={setPageReload} />
                <RenewUserModal isActive={renewModalActive} onClose={() => setRenewModalActive(false)} user={userData} refresh={setPageReload} />
                <DeleteUserModal isActive={deleteModalActive} onClose={() => setDeleteModalActive(false)} userId={userId} refresh={setPageReload} />
            </main>
        </div>
    );
}

export default Users;