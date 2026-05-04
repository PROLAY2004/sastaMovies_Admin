import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import customStyles from '../../utils/reactSelectStyles.js';
import updateAdminPermissions from "../../pages/admin/updatePermissions.js";

const permissionOptions = [
    { value: "movies", label: "Movie" },
    { value: "series", label: "Series" },
    { value: "users", label: "User" },
];

function UpdatePermissionsModal({ isActive, onClose, refresh, adminData }) {
    if (!isActive) return null;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);

    // Pre-fill existing permissions
    useEffect(() => {
        if (adminData?.permission) {
            const initialPerms = permissionOptions.filter(opt => adminData.permission.includes(opt.value));
            setPermissions(initialPerms);
        }
    }, [adminData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await updateAdminPermissions({
            adminId: adminData._id,
            permissions: permissions.map(p => p.value),
        }, navigate, toast);

        setLoading(false);

        if (isSuccess) {
            onClose();
            refresh((prev) => prev + 1);
        }
    };

    return (
        <div className={isActive ? "modal-overlay active" : "modal-overlay"}>
            <div className="custom-modal add-modal">
                <div className="modal-header">
                    <h2>Update Permissions: {adminData?.name}</h2>
                    <span className="close-btn" onClick={() => !loading && onClose()}>&times;</span>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Permissions</label>
                        <Select options={permissionOptions} isMulti value={permissions} onChange={setPermissions} styles={customStyles} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn cancel" onClick={() => !loading && onClose()}>Cancel</button>

                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Updating...
                                </>
                            ) : (
                                'Update Permissions'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default UpdatePermissionsModal;