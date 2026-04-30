import "./EnrollSuccessModal.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function EnrollSuccessModal({ isOpen, onClose, enrolledCourses = [] }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
        <div
            className="modal-container enroll-success-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enroll-success-title"
        >
            <div className="modal-icon-row">
                <CheckCircleIcon className="modal-icon modal-icon--enroll-success" />
            </div>

            <h2 className="modal-title" id="enroll-success-title">
                Enrolled in all classes!!
            </h2>

            <p className="modal-body">
                Congrats. You have enrolled in all your chosen classes.
            </p>

            {
                enrolledCourses.length > 0 && (
                    <div className="enroll-success-list">
                        {enrolledCourses.map((course) => (
                            <div key={course.id} className="enroll-success-item">
                                <CheckCircleIcon className="enroll-success-item-icon" />
                                <span>{course.code} - {course.title}</span>
                            </div>
                        ))}
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