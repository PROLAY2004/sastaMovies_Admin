import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import renewUser from '../../pages/users/extendUser.js';

function RenewUserModal({ isActive, onClose, refresh, user }) {
    const navigate = useNavigate();

    // ✅ Helpers
    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toLocaleDateString("en-CA");
    };

    const getNextDay = (d) => {
        const date = new Date(d);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString("en-CA");
    };

    const normalizeDate = (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const getInitialDate = () => {
        if (user?.validTill) {
            const today = normalizeDate(new Date());
            const validTillDate = normalizeDate(user.validTill);

            if (today < validTillDate) {
                return getNextDay(user.validTill); // active user
            } else {
                return getTomorrow(); // expired user
            }
        }
        return getTomorrow();
    };

    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(getInitialDate());

    const resetForm = () => {
        setDate(getInitialDate());
    };

    useEffect(() => {
        setDate(getInitialDate());
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await renewUser(
            { userId: user._id, date },
            navigate,
            toast
        );

        setLoading(false);

        if (isSuccess) {
            onClose();
            refresh((prev) => prev + 1);
        }
    };

    // ✅ Dynamic min date
    const minDate = getInitialDate();

    return (
        <div className={isActive ? "modal-overlay active" : "modal-overlay"}>
            <div className="custom-modal add-modal invite-modal">

                <div className="modal-header">
                    <h2>Renew User</h2>
                    <span
                        className="close-btn"
                        onClick={() => {
                            if (!loading) {
                                onClose();
                                resetForm();
                            }
                        }}
                    >
                        &times;
                    </span>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Extend Till</label>
                        <input
                            type="date"
                            className="date-input w-100"
                            min={minDate}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ colorScheme: "dark" }}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn cancel"
                            onClick={() => {
                                if (!loading) {
                                    onClose();
                                    resetForm();
                                }
                            }}
                        >
                            Cancel
                        </button>

                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}
                                    ></div>{' '}
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