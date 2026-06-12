import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import '../styles/sidebar.scss';
import logout from '../utils/logout.js';

function Sidebar({ active, adminDetails }) {
    return (
        <aside className={"admin-sidebar" + (active ? " active" : "")}>
            <div className="sidebar-header">
                <div className="admin-logo">
                    <span className="logo-accent">Sasta</span>Movies
                </div>
                <div className="admin-user">
                    <div className="user-avatar">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <div className="user-info">
                        <div className="username">{localStorage.getItem('adminName') || 'Admin'}</div>
                        <div className="user-role">Administrator</div>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </NavLink>
                <div className="nav-section">Content Management</div>
                <NavLink to="/movies" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-film"></i>
                    <span>Movies</span>
                </NavLink>
                <NavLink to="/series" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-tv"></i>
                    <span>Series</span>
                </NavLink>
                <div className="nav-section">System</div>
                <NavLink to="/admin" style={{ display: localStorage.getItem('isSuperAdmin') === 'true' ? 'flex' : 'none' }} className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-user-shield"></i>
                    <span>Admin</span>
                </NavLink>
                <NavLink to="/users" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-users"></i>
                    <span>Users</span>
                </NavLink>
                <NavLink to="/responses" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-comments"></i>
                    <span>Responses</span>
                </NavLink>
                <NavLink to="/activity" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-history"></i>
                    <span>History</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/login" className="logout-btn" onClick={() => logout(toast)}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </NavLink>
            </div>
        </aside>);
}

export default Sidebar;
