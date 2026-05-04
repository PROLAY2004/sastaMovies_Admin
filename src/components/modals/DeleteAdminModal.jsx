import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import deleteAdminApi from "../../pages/admin/deleteAdmin.js";

function DeleteAdminModal({ isActive, onClose, adminId, refresh }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const isSuccess = await deleteAdminApi(adminId, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            onClose();
            refresh((prev) => prev + 1);
        }
    }

    return (
        <div className={isActive ? "modal-overlay active" : "modal-overlay"}>
            <div className="custom-modal delete-modal">

                <div className="modal-header mb-0">
                    <h2>Delete Admin</h2>
                    <span className="close-btn" onClick={() => { if (!loading) { onClose(); } }}>&times;</span>
                </div>

                <div className="delete-content">
                    <p className="delete-text fw-lighter mb-0">
                        Are you sure you want to completely delete this admin?
                    </p>
                    <p className="delete-warning">
                        This action cannot be undone and will permanently remove them from the system.
                    </p>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn cancel" onClick={() => { if (!loading) { onClose(); } }}>Cancel</button>
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

export default DeleteAdminModal;