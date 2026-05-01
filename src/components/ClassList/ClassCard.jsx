import "./ClassCard.css";
import ClassDetailItem from "./class-detail-item";

import CircleIcon from "@mui/icons-material/Circle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Check from "@mui/icons-material/Check";
import CheckCircle from "@mui/icons-material/CheckCircle";

export default function ClassCard({
  course,
  isExpanded,
  onToggle,
  isCourseAdded,
  handleToggleCourse,
  isCourseEnrolled,
  getCourseDisplayStatus,
  handleDropCourse,

  variant = "search",
  showCheckbox = false,
  isSelected = false,
  onToggleSelect,
}) {
  const addedOrEnrolledStatus = getCourseDisplayStatus(course.id);

  const displayStatus =
    variant === "schedule"
      ? addedOrEnrolledStatus === "Enrolled" || addedOrEnrolledStatus === "Waitlisted"
        ? addedOrEnrolledStatus
        : course.status
      : addedOrEnrolledStatus || course.status;

  const isEnrolled = displayStatus === "Enrolled";
  const isWaitlisted = displayStatus === "Waitlisted";
  const isCommittedCourse = isEnrolled || isWaitlisted;
  const statusClass = displayStatus.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`class-result-item class-result-item--${variant}`}>
      <div className="class-card-wrapper">
        {showCheckbox && (
          <label className="checkbox class-card-checkbox" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onToggleSelect?.(course.id)}
            />
            <span className="checkmark"></span>
          </label>
        )}
        <button
          className={`class-result-row class-result-row--${variant} 
            ${isExpanded ? "expanded" : ""}
            ${isEnrolled ? "class-result-row--enrolled" : ""}
            ${isWaitlisted ? "class-result-row--waitlisted" : ""}
        `}
          onClick={onToggle}>
          <div className="class-result-main">
            <span className="class-result-caret">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </span>

            <span className="class-result-title">
              {course.code} - {course.title}
            </span>
          </div>

          <div className="class-result-count">
            {course.enrolled}/{course.total}/{course.waitlist}
          </div>

          <div className={`class-result-status ${statusClass}`}>
            <span className="status-icon">
              {displayStatus === "Enrolled" ? (
                <CheckCircle />
              ) : displayStatus === "Waitlisted" ? (
                <ErrorIcon />
              ) : displayStatus === "Added" ? (
                <Check />
              ) : displayStatus === "Open" ? (
                <CircleIcon />
              ) : displayStatus === "Closed" ? (
                <CancelIcon />
              ) : (
                <ErrorIcon />
              )}
            </span>
            {displayStatus}
          </div>
        </button>
      </div>

      {isExpanded && (
        <div
          className={`class-result-details class-result-details--${variant}
            ${isCommittedCourse ? "class-result-details--enrolled" : ""}
            ${isWaitlisted ? "class-result-details--waitlisted" : ""}
          `}>
          <div className="class-result-details-grid">
            <div className="class-result-details-left">
              <ClassDetailItem label="Course Code" value={course.code} />
              <ClassDetailItem label="Session" value={course.session} />
              <ClassDetailItem label="Units" value={course.units} />
              <ClassDetailItem label="Instruction Mode" value={course.instructionMode} />
              <ClassDetailItem label="Career" value={course.career} />
              <ClassDetailItem label="Grading" value={course.grading} />
              <ClassDetailItem label="Dates" value={course.dates} />
              <ClassDetailItem label="Times" value={course.times} />
              <ClassDetailItem label="Location" value={course.location} />
              <ClassDetailItem label="Instructor" value={course.instructor} />
            </div>

            <div className="class-result-details-right">
              <div className="detail-block">
                <div className="detail-block-title">Description:</div>
                <p>{course.description}</p>
              </div>

              <div className="detail-block-row">
                <div className="detail-block">
                  <div className="detail-block-title">Prerequisite(s):</div>
                  <ul>
                    {course.prerequisites.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-block availability-block">
                  <div className="detail-block-title">Class Availability:</div>
                  <ul>
                    <li>Class capacity: {course.classAvailability.classCapacity}</li>
                    <li>Total enrolled: {course.classAvailability.totalEnrolled}</li>
                    <li>Available seats: {course.classAvailability.availableSeats}</li>
                    <li>Waitlist capacity: {course.classAvailability.waitlistCapacity}</li>
                  </ul>
                </div>
              </div>
              <div className="detail-block">
                <div className="detail-block-title">Allowed Declared Major:</div>
                <p>{course.allowedMajors.join(", ")}.</p>
                <p>Or Instructor consent.</p>
              </div>

              <div className="class-result-actions">
                {/* Search list button */}
                {variant === "search" &&
                  !isEnrolled &&
                  !isWaitlisted &&
                  course.status !== "Closed" && (
                    <button
                      className={`add-class-btn ${isCourseAdded(course.id) ? "remove" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCourse(course);
                      }}>
                      {isCourseAdded(course.id) ? "Remove from Schedule" : "Add to Schedule"}
                    </button>
                  )}

                {/* Schedule list button (only for enrolled and waitlisted classes) */}
                {variant === "schedule" && isCommittedCourse && (
                  <button
                    className="add-class-btn drop"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropCourse?.(course);
                    }}>
                    Drop Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
