import { useState } from "react";
import "./ClassFullModal.css";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ClassFullModal({ isOpen, onClose, course }) {

    const [waitlisted, setWaitlisted] = useState(false);

    if (!isOpen) return null;

    const handleAddToWaitList = () => {
        setWaitlisted(true);
    };

    const handleClose = () => {
        setWaitlisted(false);
        onClose();
    };

    if (waitlisted) {
    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div
            className="modal-container modal-alert"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-success-title"
            >
                <div className="modal-icon-row">
                    <CheckCircleIcon className="modal-icon modal-icon--success" />
                </div>

                <h2 className="modal-title" id ="waitlist-success-title">
                    Added to Wait List
                </h2>

                <p className="modal-body">
                    You have been added to the waitlist for{" "}
                    {course
                        ? `${course.code} - ${course.title}` : "this class"} 
                </p>

                <div className="modal-actions">
                    <button className="modal-btn modal-btn--primary" onClick={handleClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
    }

return (
    <div className="modal-backdrop" onClick={handleClose}>
        <div
            className="modal-container modal-alert"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-full-title"
        >
            <div className="modal-icon-row">
                <ErrorIcon className="modal-icon modal-icon--waitlist" />
            </div>

            <h2 className="modal-title" id="class-full-title">
                Class Full. Wait List?
            </h2>

            <p className="modal-body">
                {course 
                    ? `${course.code} - ${course.title} is currently full.`
                    : "This class is currently full."}{" "}
                Do you want to add yourself to the waitlist?
            </p>

            <div className="modal-actions modal-actions--split">
                    <button className="modal-btn modal-btn--secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="modal-btn modal-btn--primary" onClick={handleAddToWaitList}>
                        Add to Wait List
                    </button>
            </div>
        </div>
        </div>
    );

}