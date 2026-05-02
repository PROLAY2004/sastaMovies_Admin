import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import removeContent from "../../pages/deleteContent.js";


function DeleteUserModal({ isActive, onClose, contentId, refresh }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const isSuccess = await removeContent(contentId, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            onClose();
            refresh((prev) => prev + 1);
        }
    }

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"}>
            <div className="custom-modal delete-modal">

                <div className="modal-header mb-0">
                    <h2>Delete Content</h2>
                    <span className="close-btn" onClick={() => { if (!loading) { onClose(); resetForm(); } }}>&times;</span>
                </div>

                <div className="delete-content">
                    <p className="delete-text fw-lighter mb-0">
                        Are you sure you want to delete this content?
                    </p>
                    <p className="delete-warning">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn cancel" onClick={() => { if (!loading) { onClose(); resetForm(); } }}>Cancel</button>
                    <button disabled={loading} className="btn danger" type="button" onClick={handleDelete}>
                        {loading ? (
                            <>
                                <div
                                    className="spinner-border"
                                    role="status"
                                    style={{ width: '20px', height: '20px' }}></div>{' '}
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default DeleteUserModal;
