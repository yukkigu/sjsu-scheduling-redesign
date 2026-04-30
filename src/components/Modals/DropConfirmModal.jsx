import "./DropConfirmModal.css";
import ErrorIcon from "@mui/icons-material/Error";

export default function DropConfirmModal({ isOpen, onClose, onConfirm, courses = [] }) {
  if (!isOpen) return null;

  const isMultiple = courses.length > 1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container drop-confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drop-confirm-title">
        <div className="modal-icon-row">
          <ErrorIcon className="modal-icon modal-icon--drop-confirm" />
        </div>

        <h2 className="modal-title" id="drop-confirm-title">
          Confirm Drop
        </h2>

        <p className="modal-body">
          {isMultiple
            ? "Are you sure you want to drop these enrolled classes?"
            : "Are you sure you want to drop this enrolled class?"}
        </p>

        {courses.length > 0 && (
          <div className="drop-confirm-list">
            {courses.map((course) => (
              <div key={course.id} className="drop-confirm-item">
                <span>
                  {course.code} - {course.title}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn--danger" onClick={onConfirm}>
            Drop
          </button>
        </div>
      </div>
    </div>
  );
}
