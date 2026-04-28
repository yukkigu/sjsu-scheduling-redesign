import "./PrereqModal.css";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PrereqModal({ isOpen, onClose, course, prerequisites }) {
    if (!isOpen) return null;

    const prereqs = prerequisites ?? course?.prerequisites ?? [];

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
            className="modal-container modal-prereq"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prereq-title"
            >

            <div className="modal-icon-row">
                <CancelIcon className="modal-icon modal-icon--prereq" />
            </div>

            <h2 className="modal-title" id="prereq-title">
                Prerequisite(s) Not Satisfied
            </h2>

            <p className="modal-body">
                One or more prerequisite(s) are not satisfied. You are not eligible to take the course. 
            </p>

            {
                prereqs.length > 0 && (
                    <div className="modal-prereq-list">
                        <p className="modal-prereq-label">Required Prerequisite(s): </p>
                        <ul>
                            {
                                prereqs.map((req) => (
                                    <li key={req}>{req}</li>
                                ))
                            }
                        </ul>
                    </div>    
                )
            }

            <div className="modal-actions">
                <button className="modal-btn modal-btn--primary" onClick={onClose}>
                    OK
                </button>
            </div>
            </div>

        </div>
    );
}