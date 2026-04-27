import { useState } from "react";


function DeleteModal({ isActive, onClose }) {

    return (
        <div className={isActive ? " modal-overlay active" : " modal-overlay"} onClick={onClose}>
            <div className="custom-modal delete-modal">

                <div className="modal-header mb-0">
                    <h2>Delete Content</h2>
                    <span className="close-btn">&times;</span>
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
                    <button type="button" className="btn cancel">Cancel</button>
                    <button type="button" className="btn danger">Delete</button>
                </div>

            </div>
        </div>
    );
}

export default DeleteModal;
