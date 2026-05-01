import { useState } from "react";
import "./WaitlistModal.css";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function WaitlistModal({ isOpen, onClose, onConfirm, courses = [] }) {
  const [waitlisted, setWaitlisted] = useState(false);

  if (!isOpen) return null;

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
          aria-labelledby="waitlist-success-title">
          <div className="modal-icon-row">
            <CheckCircleIcon className="modal-icon modal-icon--success" />
          </div>

          <h2 className="modal-title" id="waitlist-success-title">
            Added to Wait List
          </h2>

          <div className="modal-body">
            {courses.length > 0 && (
              <>
                <span>
                  The selected class(es) are currently full. Do you want to join the waitlist?
                </span>

                <div className="waitlist-list">
                  {courses.map((course) => (
                    <div key={course.id} className="waitlist-item">
                      <span>
                        {course.code} - {course.title}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

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
        aria-labelledby="class-full-title">
        <div className="modal-icon-row">
          <ErrorIcon className="modal-icon modal-icon--waitlist" />
        </div>

        <h2 className="modal-title" id="class-full-title">
          Class Full. Wait List?
        </h2>

        <p className="modal-body">
          {courses.length > 0 && (
            <>
              <span>
                The selected class(es) is currently full. Do you want to join the waitlist?
              </span>
              {courses.map((course) => (
                <div key={course.id} className="waitlist-item">
                  <span>
                    {course.code} - {course.title}
                  </span>
                </div>
              ))}
            </>
          )}
        </p>

        <div className="modal-actions modal-actions--split">
          <button className="modal-btn modal-btn--secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn--primary" onClick={onConfirm}>
            Join Wait List
          </button>
        </div>
      </div>
    </div>
  );
}
