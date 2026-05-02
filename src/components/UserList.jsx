function UserList({ user, handleToggleBlock, setSelectedUser, setRenewModalActive, onDelete }) {

    // Helper to format dates with Time
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Derived Status for display (No admin logic needed)
    const currentStatus = user.isBlocked
        ? 'blocked'
        : (new Date(user.validTill) < new Date() ? 'expired' : 'active');

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

                <button className="action-icon delete" onClick={() => onDelete(user._id)}>
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default UserList;