import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../../styles/users.scss'; // New SCSS file imported

import Sidebar from '../../components/Sidebar.jsx';
import Hambargar from '../../components/Hambargar.jsx';
import ListLoader from '../../components/loader/ListLoader.jsx';

// Placeholders for modals you might build later
import InviteUserModal from '../../components/modals/InviteUserModal.jsx';
// import RenewModal from '../../components/modals/RenewModal.jsx';

function Users() {
    const navigate = useNavigate();

    // UI States
    const [sidebarActive, setSidebarActive] = useState(false);
    const [inviteModalActive, setInviteModalActive] = useState(false);
    const [renewModalActive, setRenewModalActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [emptyState, setEmptyState] = useState(false);
    const [pageReload, setPageReload] = useState(0);

    // Data States
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter and Pagination States
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all'); // The secondary chosen dropdown
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 1. Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Reset Page on Filter Change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedStatus, selectedRole]);

    // 3. Mock Fetching Data (Replace with your API call)
    const fetchUsers = async () => {
        setLoading(true);

        // Mock API Payload
        const payload = {
            search: debouncedSearch,
            status: selectedStatus,
            role: selectedRole,
            page: currentPage,
            limit: 10,
        };

        // TODO: Replace with actual fetch call
        // const response = await displayUsers(payload);

        // Mocking a delay & response for demonstration
        setTimeout(() => {
            const mockUsers = [
                { _id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'User', created: '2025-01-15T10:30:00Z', lastLogin: '2026-05-01T14:20:00Z', validTill: '2027-01-15T10:30:00Z', isBlocked: false },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'expired', role: 'User', created: '2024-02-10T09:15:00Z', lastLogin: '2025-02-09T18:45:00Z', validTill: '2025-02-10T09:15:00Z', isBlocked: false },
                { _id: '3', name: 'Admin Master', email: 'admin@sastamovies.com', status: 'active', role: 'Admin', created: '2023-11-05T08:00:00Z', lastLogin: '2026-05-02T09:00:00Z', validTill: '2099-12-31T23:59:00Z', isBlocked: false },
                { _id: '4', name: 'Spam Account', email: 'spammy@fake.com', status: 'blocked', role: 'User', created: '2026-04-20T11:11:00Z', lastLogin: '2026-04-21T12:00:00Z', validTill: '2027-04-20T11:11:00Z', isBlocked: true },
            ];

            // Apply basic mock filtering for empty state demo
            let filtered = mockUsers;
            if (payload.status !== 'all') filtered = filtered.filter(u => u.status === payload.status);
            if (payload.role !== 'all') filtered = filtered.filter(u => u.role.toLowerCase() === payload.role);
            if (payload.search) filtered = filtered.filter(u => u.name.toLowerCase().includes(payload.search.toLowerCase()) || u.email.toLowerCase().includes(payload.search.toLowerCase()));

            setUsers(filtered);
            setTotalPages(1); // Set actual total pages from API
            setEmptyState(filtered.length === 0);
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, selectedStatus, selectedRole, currentPage, pageReload]);

    // Format Date Helper
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    // Action Handlers
    const handleToggleBlock = (user) => {
        // Add API call here
        toast.info(user.isBlocked ? `Unblocked ${user.name}` : `Blocked ${user.name}`);
        setPageReload(prev => prev + 1);
    };

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
                        <h1 className="list-title">User Management</h1>
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

                {/* Filters */}
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
                                className="role-filter w-100 h-100"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}>
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Created At</th>
                                <th>Last Login</th>
                                <th>Valid Till</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="font-weight-bold">{user.name}</td>
                                    <td className="text-info">{user.email}</td>
                                    <td>{formatDate(user.created)}</td>
                                    <td>{formatDate(user.lastLogin)}</td>
                                    <td>{formatDate(user.validTill)}</td>
                                    <td>
                                        <span className={`status-badge ${user.status}`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        <button
                                            className={`action-icon ${user.isBlocked ? 'unblock' : 'block'}`}
                                            onClick={() => handleToggleBlock(user)}
                                            title={user.isBlocked ? "Unblock User" : "Block User"}
                                        >
                                            <i className={`fas ${user.isBlocked ? 'fa-unlock' : 'fa-ban'}`}></i>
                                        </button>
                                        <button
                                            className="action-icon renew"
                                            onClick={() => { setSelectedUser(user); setRenewModalActive(true); }}
                                            title="Extend/Renew Subscription"
                                        >
                                            <i className="fas fa-calendar-plus"></i>
                                        </button>
                                    </td>
                                </tr>
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
                            disabled={currentPage === 1}>
                            <i className="fas fa-angle-left"></i>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}>
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                    </div>
                )}

                {/* Modals placeholders */}
                <InviteUserModal isActive={inviteModalActive} onClose={() => setInviteModalActive(false)} refresh={setPageReload} />
                {/* <RenewModal isActive={renewModalActive} onClose={() => setRenewModalActive(false)} user={selectedUser} refresh={setPageReload} /> */}

            </main>
        </div>
    );
}

export default Users;