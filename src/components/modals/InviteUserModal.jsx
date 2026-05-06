import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import inviteUser from '../../pages/users/addUser.js'


function InviteUserModal({ isActive, onClose, refresh }) {
    const navigate = useNavigate()
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toLocaleDateString("en-CA");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(minDate);
    const resetForm = () => {
        setName("");
        setEmail("");
        setDate(minDate);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            name,
            email,
            date
        };

        const isSuccess = await inviteUser(userData, navigate, toast);
        setLoading(false);

        if (isSuccess) {
            onClose();
            resetForm();
            refresh((prev) => prev + 1);
        }
    };

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"}>
            <div className="custom-modal add-modal invite-modal">

                <div className="modal-header">
                    <h2>Invite User</h2>
                    <span className="close-btn" onClick={() => { if (!loading) { onClose(); resetForm(); } }} >&times;</span>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Valid Till</label>
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
                        <button type="button" className="btn cancel" onClick={() => { if (!loading) { onClose(); resetForm(); } }}>Cancel</button>
                        <button disabled={loading} className="btn submit" type="submit">
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border text-dark"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>{' '}
                                    Sending Invite...
                                </>
                            ) : (
                                'Sent Invite'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default InviteUserModal;
