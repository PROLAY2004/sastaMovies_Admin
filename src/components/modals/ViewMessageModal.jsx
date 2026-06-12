import { useNavigate } from 'react-router-dom';
import formatDate from '../../utils/dateFormater.js';

function ViewMessageModal({ isActive, messageData }) {
    const navigate = useNavigate();

    // Safety guard: Prevents crashing if the modal tries to open without data
    if (!messageData) return null;

    const handleClose = () => {
        navigate('/responses');
    };

    return (
        <div className={isActive ? "modal-overlay active" : "modal-overlay"} onClick={handleClose}>
            <div className="custom-modal add-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Message Details</h2>
                    <span className="close-btn" onClick={handleClose}>
                        &times;
                    </span>
                </div>

                <div className="message-modal-content">
                    <div className="message-meta">
                        <div className="meta-item">
                            <span className="meta-label">Sender</span>
                            <span className="meta-value">{messageData.name}</span>
                        </div>
                        <div className="meta-item text-right">
                            <span className="meta-label">Received On</span>
                            <span className="meta-value">{formatDate(messageData.createdAt)}</span>
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label>Email Address</label>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="text"
                                value={messageData.email}
                                readOnly
                                className="w-100"
                            />
                            <a
                                href={`mailto:${messageData.email}`}
                                className="btn submit"
                                style={{ padding: '10px 15px', textDecoration: 'none' }}
                                title="Reply via Email Client"
                            >
                                <i className="fas fa-reply"></i>
                            </a>
                        </div>
                    </div>

                    <div className="message-body mt-3">
                        <p>{messageData.message}</p>
                    </div>

                    <div className="visited-info">
                        <i className="fas fa-info-circle"></i>
                        <div className="visited-text">
                            Message viewed by <strong>{messageData.readBy || 'You'}</strong> on <strong>{formatDate(messageData.updatedAt)}</strong>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn cancel" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewMessageModal;