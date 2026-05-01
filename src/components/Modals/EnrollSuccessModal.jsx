import "./EnrollSuccessModal.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function EnrollSuccessModal({
  isOpen,
  onClose,
  enrolledCourses = [],
  waitlistedCourses = [],
}) {
  if (!isOpen) return null;

  const hasEnrolled = enrolledCourses.length > 0;
  const hasWaitlisted = waitlistedCourses.length > 0;

  let title = "Successfully Enrolled!";
  let body = "Congrats. You have enrolled in all your selected classes.";

  if (!hasEnrolled && hasWaitlisted) {
    title = "Added to Waitlist";
    body = "You have been added to the waitlist for your selected class(es).";
  } else if (hasEnrolled && hasWaitlisted) {
    title = "Enrollment Update";
    body = "Some classes were enrolled successfully, and some were added to the waitlist.";
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container enroll-success-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-success-title">
        <div className="modal-icon-row">
          <CheckCircleIcon className="modal-icon modal-icon--enroll-success" />
        </div>

        <h2 className="modal-title" id="enroll-success-title">
          {title}
        </h2>

        <p className="modal-body">{body}</p>

        {enrolledCourses.length > 0 && (
          <>
            <p className="enroll-success-list-title">Enrolled</p>
            <div className="enroll-success-list enroll-success-block">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="enroll-success-item">
                  <CheckCircleIcon className="enroll-success-item-icon" />
                  <span>
                    {course.code} - {course.title}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {waitlistedCourses.length > 0 && (
          <>
            <p className="enroll-success-list-title">Waitlisted</p>
            <div className="enroll-success-list waitlist-success-block">
              {waitlistedCourses.map((course) => (
                <div key={course.id} className="enroll-success-item">
                  <CheckCircleIcon className="enroll-success-item-icon" />
                  <span>
                    {course.code} - {course.title}
                  </span>
                </div>
              ))}
            </div>
          </>
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
