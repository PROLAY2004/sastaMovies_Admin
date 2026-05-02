import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import renewUser from '../../pages/users/extendUser.js'


function RenewUserModal({ isActive, onClose, refresh, user }) {
    const navigate = useNavigate()
    const getNextDay = (d) => {
        const date = new Date(d);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString("en-CA");
    };

    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const resetForm = () => {
        setDate(getNextDay(user.validTill));
    }

    useEffect(() => {
        if (user?.validTill) {
            setDate(getNextDay(user.validTill)); // ✅ next day
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await renewUser({ userId: user._id, date }, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            onClose();
            refresh((prev) => prev + 1);
        }
    };

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"}>
            <div className="custom-modal add-modal invite-modal">

                <div className="modal-header">
                    <h2>Renew User</h2>
                    <span className="close-btn" onClick={() => { if (!loading) { onClose(); resetForm(); } }} >&times;</span>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Extend Till</label>
                        <input
                            type="date"
                            className="date-input w-100"
                            min={
                                user?.validTill
                                    ? getNextDay(user.validTill)
                                    : new Date().toLocaleDateString("en-CA")
                            }
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ colorScheme: "dark" }}
                        />
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
                                    Renewing...
                                </>
                            ) : (
                                'Renew User'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default RenewUserModal;
