import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';

import updateStatus from '../pages/users/changeStatus.js';
import formatDate from '../utils/dateFormater.js';

function UserList({ user, refresh, setDeleteModalActive, setUserId, setRenewModalActive, setUserData, adminDetails, setUpgradeModalActive }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const currentStatus = user.isBlocked ? 'blocked' : (new Date(user.validTill) < new Date() ? 'expired' : 'active');

    const handleStatusUpdate = async (userId) => {
        setLoading(true);
        const isSuccess = await updateStatus(userId, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            refresh((prev) => prev + 1);
        }
    }

    return (
        <tr>
            <td>
                <span className="font-weight-bold">{user.name}</span>
                <p className="text-muted mb-0">{user.email}</p>
            </td>
            <td>{formatDate(user.createdAt)}</td>
            <td>{formatDate(user.lastLogin)}</td>
            <td>{formatDate(user.validTill)}</td>
            <td>
                <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </span>
            </td>
            <td className="action-cell">
                <button
                    className={`action-icon ${user.isBlocked ? 'unblock' : 'block'}`}
                    onClick={() => handleStatusUpdate(user._id)}
                    title={user.isBlocked ? "Unblock User" : "Block User"}
                >
                    {loading ? (
                        <>
                            <div className="spinner-border" role="status" style={{ width: '20px', height: '20px' }}></div>
                        </>
                    ) : (
                            <i className={`fas ${user.isBlocked ? 'fa-unlock' : 'fa-ban'}`}></i>
                    )}
                </button>

                <button
                    className="action-icon renew"
                    onClick={() => { setUserData(user); setRenewModalActive(true); }}
                    title="Extend/Renew Subscription"
                >
                    <i className="fas fa-calendar-plus"></i>
                </button>

                <button
                    className="action-icon edit" title='Make Admin'
                    style={{ display: adminDetails.isSuperAdmin ? 'inline' : 'none' }}
                    onClick={() => { setUpgradeModalActive(true); setUserId(user._id) }}
                >
                    <i className="fas fa-user-shield"></i>
                </button>

                <button className="action-icon delete" title='Delete User' onClick={() => { setDeleteModalActive(true); setUserId(user._id) }}>
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default UserList;