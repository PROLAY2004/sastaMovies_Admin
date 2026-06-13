import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import changeAdminStatus from '../pages/admin/changeAdminStatus.js';
import formatDate from '../utils/dateFormater.js';

function AdminList({ admin, refresh, setAdminId, setSelectedAdminData, setPermissionsModalActive, setDowngradeModalActive, setDeleteModalActive }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const currentStatus = admin.isBlocked ? 'blocked' : 'active';

    const handleStatusUpdate = async (adminId) => {
        setLoading(true);
        const isSuccess = await changeAdminStatus(adminId, navigate, toast);
        setLoading(false);
        if (isSuccess) refresh((prev) => prev + 1);
    }

    return (
        <tr>
            <td>
                <span className="font-weight-bold">{admin.name}</span>
                <p className="text-muted mb-0">{admin.email}</p>
            </td>
            <td>
                {admin.permission.map(p => (
                    <span key={p} className="badge bg-secondary me-1">{p}</span>
                ))}
            </td>
            <td>{formatDate(admin.createdAt)}</td>
            <td>{formatDate(admin.lastLogin)}</td>
            <td>
                <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </span>
            </td>
            <td className="action-cell">
                <button className="action-icon renew" title="User Analytics" onClick={() => navigate(`/analytics/${admin._id}`)}>
                    <i className="fas fa-chart-line"></i>
                </button>

                {/* Block/Unblock */}
                <button className={`action-icon ${admin.isBlocked ? 'unblock' : 'block'}`} onClick={() => handleStatusUpdate(admin._id)} title={admin.isBlocked ? "Unblock Admin" : "Block Admin"}>
                    {loading ? <div className="spinner-border" style={{ width: '20px', height: '20px' }}></div> : <i className={`fas ${admin.isBlocked ? 'fa-unlock' : 'fa-ban'}`}></i>}
                </button>

                {/* Update Permissions */}
                <button className="action-icon renew" title="Update Permissions" onClick={() => { setSelectedAdminData(admin); setPermissionsModalActive(true); }}>
                    <i className="fas fa-tasks"></i>
                </button>

                {/* Downgrade to User */}
                {/* Downgrade to User */}
                <button
                    className="action-icon edit"
                    title="Downgrade to User"
                    onClick={() => {
                        setSelectedAdminData(admin); // <-- CHANGE THIS!
                        setDowngradeModalActive(true);
                    }}>
                    <i className="fas fa-arrow-down"></i>
                </button>

                {/* Delete */}
                <button className="action-icon delete" title="Delete Admin" onClick={() => { setAdminId(admin._id); setDeleteModalActive(true); }}>
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default AdminList;