import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import customStyles from '../../utils/reactSelectStyles.js';
import addAdminApi from "../../pages/admin/addAdmin.js";

const permissionOptions = [
    { value: "movies", label: "Movie" },
    { value: "series", label: "Series" },
    { value: "users", label: "User" },
];

function AddAdminModal({ isActive, onClose, refresh }) {
    if (!isActive) return null;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [permissions, setPermissions] = useState([]);

    const resetForm = () => { setName(""); setEmail(""); setPermissions([]); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await addAdminApi({
            name, email, permissions: permissions.map(p => p.value),
        }, navigate, toast);

        setLoading(false);

        if (isSuccess) {
            onClose();
            resetForm();
            refresh((prev) => prev + 1);
        }
    };

    return (
        <div className={isActive ? "modal-overlay active" : "modal-overlay"}>
            <div className="custom-modal add-modal">
                <div className="modal-header">
                    <h2>Add New Admin</h2>
                    <span className="close-btn" onClick={() => { if (!loading) { onClose(); resetForm(); } }}>&times;</span>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Admin Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Permissions</label>
                        <Select options={permissionOptions} isMulti value={permissions} onChange={setPermissions} styles={customStyles} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn cancel" onClick={() => { if (!loading) { onClose(); resetForm(); } }}>Cancel</button>

                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Adding...
                                </>
                            ) : (
                                'Add Admin'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddAdminModal;