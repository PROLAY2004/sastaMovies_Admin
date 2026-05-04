import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import customStyles from '../../utils/reactSelectStyles.js'

import makeAdmin from "../../pages/users/upgradeUser.js";

function UpgradationModal({ isActive, onClose, refresh, userId }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);

    const options = [
        { value: "movies", label: "Movie" },
        { value: "series", label: "Series" },
        { value: "users", label: "User" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await makeAdmin({
            userId,
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
            <div className="custom-modal add-modal invite-modal">

                <div className="modal-header">
                    <h2>Upgrade User</h2>
                    <span className="close-btn" onClick={() => !loading && onClose()}>
                        &times;
                    </span>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Admin Permissions</label>

                        <Select
                            options={options}
                            isMulti
                            value={permissions}
                            onChange={setPermissions}
                            placeholder="Select permissions"
                            styles={customStyles}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn cancel"
                            onClick={() => !loading && onClose()}
                        >
                            Cancel
                        </button>

                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Upgrading...
                                </>
                            ) : (
                                'Upgrade User'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default UpgradationModal;