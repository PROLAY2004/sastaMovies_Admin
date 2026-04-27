import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../styles/sidebar.scss';

function Sidebar({ active }) {
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
                        <div className="username">Admin</div>
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
                <NavLink to="/users" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-users"></i>
                    <span>Users</span>
                </NavLink>
                <NavLink to="/logout" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <i className="fas fa-sign-out"></i>
                    <span>Logout</span>
                </NavLink>
            </nav>
        </aside>);
}

export default Sidebar;
