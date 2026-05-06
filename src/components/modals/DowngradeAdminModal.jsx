import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import downgradeAdminApi from "../../pages/admin/downgradeAdmin.js";

function DowngradeAdminModal({ isActive, onClose, adminData, refresh }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // ✅ Helpers
    const formatDate = (date) => {
        return date.toLocaleDateString("en-CA");
    };

    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const getNextDay = (d) => {
        const date = new Date(d);
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const normalizeDate = (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const [minDate, setMinDate] = useState(formatDate(getTomorrow()));
    const [date, setDate] = useState(formatDate(getTomorrow()));

    // ✅ Calculate min date
    useEffect(() => {
        if (isActive) {

            const tomorrow = getTomorrow();

            let initialDate = tomorrow;

            // 🔥 if validTill exists
            if (adminData?.validTill) {

                const validTill = normalizeDate(adminData.validTill);

                // ✅ if validTill <= today → use validTill + 1
                if (validTill <= normalizeDate(new Date())) {
                    initialDate = getNextDay(validTill);
                }
                // ✅ else keep validTill itself
                else {
                    initialDate = validTill;
                }
            }

            setMinDate(formatDate(initialDate));
            setDate(formatDate(initialDate));
        }
    }, [isActive, adminData]);

    const resetForm = () => {
        setDate(minDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await downgradeAdminApi(
            {
                adminId: adminData?._id,
                date
            },
            navigate,
            toast
        );

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
                    <h2>Downgrade to User</h2>

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
                        <label>Valid Till</label>

                        <input
                            type="date"
                            className="date-input w-100"
                            min={minDate}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ colorScheme: "dark" }}
                            required
                        />
                    </div>

                    <div className="modal-actions mt-3">

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

                        <button
                            disabled={loading}
                            className="btn danger"
                            type="submit"
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{
                                            width: '20px',
                                            height: '20px'
                                        }}
                                    ></div>{' '}
                                    Downgrading...
                                </>
                            ) : (
                                'Downgrade'
                            )}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default DowngradeAdminModal;