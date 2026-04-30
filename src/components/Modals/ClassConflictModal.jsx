import "./ClassConflictModal.css";
import ErrorIcon from "@mui/icons-material/Error";

export default function ClassConflictModal({ isOpen, onClose, conflictingCourses = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container class-conflict-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="class-conflict-title">
        <div className="modal-icon-row">
          <ErrorIcon className="modal-icon modal-icon--class-conflict" />
        </div>

        <h2 className="modal-title" id="class-conflict-title">
          Class Conflict Detected
        </h2>

        <p className="modal-body">
          The following classes have schedule conflicts with the courses you're trying to enroll in.
          Please review your schedule and try again.
        </p>

        {conflictingCourses.length > 0 && (
          <div className="class-conflict-list">
            {conflictingCourses.map((course) => (
              <div key={course.id} className="class-conflict-item">
                <ErrorIcon className="class-conflict-item-icon" />
                <span>
                  {course.code} - {course.title}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-btn modal-btn--primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
