import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import downgradeAdminApi from "../../pages/admin/downgradeAdmin.js";

function DowngradeAdminModal({ isActive, onClose, adminId, refresh }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDowngrade = async () => {
        setLoading(true);
        const isSuccess = await downgradeAdminApi(adminId, navigate, toast);
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
                    <h2>Downgrade Admin</h2>
                    <span className="close-btn" onClick={() => !loading && onClose()}>&times;</span>
                </div>
                <div className="delete-content">
                    <p className="delete-text fw-lighter mb-0">Are you sure you want to downgrade this admin to a regular user?</p>
                    <p className="delete-warning">They will lose all administrative privileges immediately.</p>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn cancel" onClick={() => !loading && onClose()}>Cancel</button>

                    <button disabled={loading} className="btn danger" type="submit" onClick={handleDowngrade}>
                        {loading ? (
                            <>
                                <div
                                    className="spinner-border text-dark"
                                    role="status"
                                    style={{ width: '20px', height: '20px' }}></div>{' '}
                                Downgrading...
                            </>
                        ) : (
                            'Downgrade'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default DowngradeAdminModal;