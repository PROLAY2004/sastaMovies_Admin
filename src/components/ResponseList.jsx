import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import formatDate from '../utils/dateFormater.js';
import markReadStatus from '../pages/responses/markRead.js';

function ResponseList({ data, setResponses, adminName, statusFilter }) {
    const navigate = useNavigate();

    // Safety guard: If data is missing, don't attempt to render the row
    if (!data) return null;

    const handleMarkAsRead = (e) => {
        if (e) e.stopPropagation();

        // Optimistic UI Update with Filter Awareness
        setResponses(prev => {
            if (statusFilter === 'new') {
                return prev.filter(msg => msg._id !== data._id);
            }

            return prev.map(msg =>
                msg._id === data._id ? {
                    ...msg,
                    isRead: true,
                    readBy: adminName,
                    updatedAt: new Date().toISOString()
                } : msg
            );
        });

        // Trigger API silently
        markReadStatus(data._id, navigate, toast);
    };

    const handleView = () => {
        if (!data.isRead) {
            handleMarkAsRead();
        }
        navigate(`/responses/${data._id}`);
    };

    return (
        <tr style={{ backgroundColor: data.isRead ? 'transparent' : 'rgba(255, 255, 255, 0.03)' }}>
            <td>
                <div className="font-weight-bold">{data.name}</div>
                <a
                    href={`mailto:${data.email}`}
                    className="mailto-link text-muted"
                    onClick={(e) => e.stopPropagation()}
                >
                    {data.email}
                </a>
            </td>
            <td>
                <span className="message-preview" title={data.message}>
                    {data.message}
                </span>
            </td>
            <td>{formatDate(data.createdAt)}</td>
            <td>
                <span className={`status-badge ${data.isRead ? 'viewed' : 'new'}`}>
                    {data.isRead ? 'Viewed' : 'New'}
                </span>
            </td>
            <td className="action-cell">
                <button
                    className="action-icon view"
                    title="View Message"
                    onClick={handleView}
                >
                    <i className="fas fa-eye"></i>
                </button>

                <button
                    className="action-icon read"
                    title={data.isRead ? "Already Read" : "Mark as Read"}
                    onClick={handleMarkAsRead}
                    disabled={data.isRead}
                >
                    <i className="fas fa-check-double"></i>
                </button>
            </td>
        </tr>
    );
}

export default ResponseList;