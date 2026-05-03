import React from 'react';

function ActivityList({ logData }) {
    // Determine badge class based on action keyword
    const getBadgeClass = (actionName) => {
        const actionStr = actionName.toLowerCase();
        if (actionStr.includes('uploaded') || actionStr.includes('renewed') || actionStr.includes('unblocked') || actionStr.includes('added')) return 'add';
        if (actionStr.includes('edited')) return 'edit';
        if (actionStr.includes('deleted') || actionStr.includes('blocked')) return 'delete';
        return '';
    };

    // Format date and time
    const logDate = new Date(logData.createdAt);
    const dateFormatted = logDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = logDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <tr>
            <td>
                <div className="admin-cell">
                    <span className="name">{logData.adminName}</span>
                    <span className="email">{logData.adminEmail}</span>
                </div>
            </td>
            <td>
                <span className={`log-badge ${getBadgeClass(logData.action)}`}>
                    {logData.action}
                </span>
            </td>
            <td className="target-cell">
                {logData.targetName}
            </td>
            <td>
                <div className="date-cell">
                    <span className="date">{dateFormatted}</span>
                    <span className="time">{timeFormatted}</span>
                </div>
            </td>
        </tr>
    );
}

export default ActivityList;