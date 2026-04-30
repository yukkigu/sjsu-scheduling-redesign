import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClassSearchPage.css";
import { mockClasses } from "./data/mockClasses";

import CircleIcon from "@mui/icons-material/Circle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import Topbar from "./components/Navbars/Topbar";
import Sidebar from "./components/Navbars/Sidebar";
import CustomDropdown from "./components/Dropdown/CustomDropdown";
import WaitlistModal from "./components/Modals/WaitlistModal";
import PrereqModal from "./components/Modals/PrereqModal";

import EnrollSuccessModal from "./components/Modals/EnrollSuccessModal";

// import DaysCard from "./components/AdditionalCriteria/days-card";
import AdditionalCriteria from "./components/AdditionalCriteria/AdditionalCriteria";

export default function ClassSearchPage() {
  const navigate = useNavigate();

  // ------------------- search filters states -------------------
  const [term, setTerm] = useState("Spring 2026");
  const [subject, setSubject] = useState("");
  const [courseFilterType, setCourseFilterType] = useState("Contains");
  const [courseCareer, setCourseCareer] = useState("");

  // additional criteria states
  const modeOfInstructionOptions = ["Select", "Lecture", "Seminar", "Discussion", "Research"];
  const classTimeTypeOptions = ["Select", "Before", "After", "At Exactly"];
  const times = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  const [showAdditionalCriteria, setShowAdditionalCriteria] = useState(false);
  const [modeOfInstruction, setModeOfInstruction] = useState("");
  const [classTimeType, setClassTimeType] = useState("Select");
  const [classTimeValue, setClassTimeValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const additionalCriteriaProps = {
    modeOfInstructionOptions,
    modeOfInstruction,
    setModeOfInstruction,
    classTimeTypeOptions,
    classTimeType,
    setClassTimeType,
    times,
    classTimeValue,
    setClassTimeValue,
  };
  // --------------------------------------------------------------

  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const [activeSchedule, setActiveSchedule] = useState(1);
  const [scheduledClasses, setScheduledClasses] = useState({
    1: [],
    2: [],
    3: [],
  });

  // ------------------- modal states -------------------
  const [waitlistModal, setWaitlistModal] = useState({
    isOpen: false,
    course: null,
  });

  const [prereqModal, setPrereqModal] = useState({
    isOpen: false,
    course: null,
  });

  const [enrolledClasses, setEnrolledClasses] = useState( { 
    1: [], 
    2: [], 
    3: [] 
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [enrollSuccessModal, setEnrollSuccessModal] = useState({ isOpen: false, enrolledCourses: [] });

  // -----------------------------------------------------

  const termOptions = ["Spring 2026", "Fall 2026", "Summer 2026", "Spring 2027"];

  const subjectOptions = [
    "Art",
    "Accouting",
    "Aerospace Engineering",
    "Biology",
    "Biomedical",
    "Chemistry",
    "Computer Science",
    "Data Science",
    "Design",
    "Economics",
    "Electrical Engineering",
    "Information Systems",
    "Mathematics",
    "Software Engineering",
  ];

  const courseFilterOptions = ["Select", "Contains", "Is Exactly"];

  const courseCareerOptions = [
    "Select",
    "Undergraduate",
    "Graduate",
    "Postbaccalaureate",
    "Non-credit Extension",
  ];

  const DAY_TO_COLUMN = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
  };

  const SHORT_DAY_MAP = {
    Mo: "Monday",
    Tu: "Tuesday",
    We: "Wednesday",
    Th: "Thursday",
    Fr: "Friday",
  };

  const parseMeetingDays = (timesString) => {
    if (!timesString) return [];
    const dayPart = timesString.split(" ")[0];
    const matches = dayPart.match(/Mo|Tu|We|Th|Fr/g) || [];
    return matches.map((d) => SHORT_DAY_MAP[d]);
  };

  const to24HourMinutes = (timeStr) => {
    if (!timeStr) return 0;

    const normalized = timeStr.trim().toLowerCase();
    const match = normalized.match(/(\d{1,2}):(\d{2})(am|pm)/);

    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3];

    if (meridiem === "pm" && hours !== 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const parseTimeRange = (timesString) => {
    if (!timesString) return { startMinutes: 0, endMinutes: 0 };

    const parts = timesString.split(" ");
    const timePart = parts.slice(1).join(" ");
    const [startRaw, endRaw] = timePart.split("-").map((s) => s.trim());

    return {
      startMinutes: to24HourMinutes(startRaw),
      endMinutes: to24HourMinutes(endRaw),
    };
  };

  // calendar absolute positioning constants for overlaying courses on the schedule table
  const calendarStartHour = 6;
  const calendarEndHour = 22;
  const hourHeight = 62; // px per hour row
  const timeColumnWidth = 90;
  const dayColumnCount = 5; // Monday to Friday

  const scheduledEvents = scheduledClasses[activeSchedule].flatMap((course) => {
    const meetingDays = parseMeetingDays(course.times);
    const { startMinutes, endMinutes } = parseTimeRange(course.times);
    const isEnrolled = enrolledClasses[activeSchedule].some((c) => c.id === course.id);


    return meetingDays.map((day) => ({
      id: `${course.id}-${day}`,
      course,
      day,
      column: DAY_TO_COLUMN[day],
      startMinutes,
      endMinutes,
      isEnrolled,
    }));
  });

  const eventsConflict = (a,b) => {
    if (a.day !== b.day) return false;
    return a.startMinutes <b.endMinutes && b.startMinutes <a.endMinutes;
  };

  const eventsWithConflicts = scheduledEvents.map((event, index) => {
    const hasConflict = scheduledEvents.some(
      (other, otherIndex) => otherIndex <index && eventsConflict(event, other)
    );
    return { ...event, hasConflict };
  });

  const isCourseAdded = (courseId) => {
    return scheduledClasses[activeSchedule].some((c) => c.id === courseId);
  };

  const isCourseEnrolled = (courseId) => 
    enrolledClasses[activeSchedule].some((c) => c.id === courseId);

  const handleToggleCourse = (course) => {
    const alreadyAdded = isCourseAdded(course.id);

    if (alreadyAdded) {
      setScheduledClasses((prev) => ({
        ...prev,
        [activeSchedule]: prev[activeSchedule].filter((c) => c.id !== course.id),
      }));
      return;
    }

    if (course.career != "Graduate") {
      setPrereqModal({ isOpen: true, course });
      return;
    }

    if (course.prereqNotMet) {
      setPrereqModal({ isOpen: true, course });
      return;
    }

    if (course.status === "Closed" || course.status === "Wait List") {
      setWaitlistModal({ isOpen: true, course });
      return;
    }

    setScheduledClasses((prev) => ({
      ...prev,
      [activeSchedule]: [...prev[activeSchedule], course],
    }));
  };

  const handleToggleSelect = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id != courseId) : [...prev, courseId]
    );
  };

  const handleDropSelected = () => {
    setScheduledClasses((prev) => ({
      ...prev,
      [activeSchedule]: prev[activeSchedule].filter((c) => !selectedCourseIds.includes(c.id)),
    }));
    setEnrolledClasses((prev) => ({
      ...prev,
      [activeSchedule]: prev[activeSchedule].filter((c) => !selectedCourseIds.includes(c.id)),
    }));
    setSelectedCourseIds([]);
  };

  const handleDropAll = () => {
    setScheduledClasses((prev) => ({ ...prev, [activeSchedule]: [] }));
    setEnrolledClasses((prev) => ({ ...prev, [activeSchedule]: [] }));
    setSelectedCourseIds([]);
  };

  const handleCheckoutSelected = () => {
    const toEnroll = scheduledClasses[activeSchedule].filter((c) => selectedCourseIds.includes(c.id));
    if (toEnroll.length === 0) return;
    setEnrolledClasses((prev) => ({
      ...prev,
      [activeSchedule]: [...prev[activeSchedule].filter((c) => !toEnroll.some((e) => e.id === c.id)), ...toEnroll],
    }));
    setSelectedCourseIds([]);
    setEnrollSuccessModal({ isOpen: true, enrolledCourses: toEnroll }); 
  };

  const handleCheckoutAll = () => {
    const toEnroll = scheduledClasses[activeSchedule];
    if (toEnroll.length === 0) return;
    setEnrolledClasses((prev) => ({ ...prev, [activeSchedule]: toEnroll }));
    setSelectedCourseIds([]);
    setEnrollSuccessModal({ isOpen: true, enrolledCourses: toEnroll });
  };

  const handleSearch = () => {
    const filtered = mockClasses.filter((course) => {
      const matchesTerm = !term || course.term === term;
      const matchesSubject = !subject || course.subject === subject;
      const matchesCareer = !courseCareer || course.career === courseCareer;

      return matchesTerm && matchesSubject && matchesCareer;
    });

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const getCourseDisplayStatus = (courseId) => {
    if (isCourseEnrolled(courseId)) return "Enrolled";
    if (isCourseAdded(courseId)) return "Added";
    return null;
  }

  return (
    <div className="class-search-page">
      <WaitlistModal
        isOpen={waitlistModal.isOpen}
        onClose={() => setWaitlistModal({ isOpen: false, course: null })}
        course={waitlistModal.course}
      />

      <PrereqModal
        isOpen={prereqModal.isOpen}
        onClose={() => setPrereqModal({ isOpen: false, course: null })}
        course={prereqModal.course}
      />

      <EnrollSuccessModal
        isOpen={enrollSuccessModal.isOpen}
        onClose={() => setEnrollSuccessModal({ isOpen: false, enrolledCourses: [] })}
        enrolledCourses={enrollSuccessModal.enrolledCourses}
      />  

      <Topbar />

      <div className="class-search-layout">
        <Sidebar
          activeItem="Academics: Enrollment"
          activeSubtab="Class Search"
          defaultEnrollmentOpen={true}
        />

        <main className="class-search-content">
          <div className="class-search-card">
            <button className="class-search-back-btn" onClick={() => navigate(-1)}>
              Back
            </button>

            <div className="class-search-top-form">
              <div className="class-search-form-grid">
                <label className="class-search-label">Term</label>
                <CustomDropdown
                  options={termOptions}
                  value={term}
                  onChange={setTerm}
                  placeholder="Select Term"
                />

                <label className="class-search-label">Subject</label>
                <CustomDropdown
                  options={subjectOptions}
                  value={subject}
                  onChange={setSubject}
                  placeholder="Select Subject"
                />

                <label className="class-search-label">Course Number Filter</label>
                <div className="class-search-course-filter-wrap">
                  <input className="class-search-course-input" />
                  <CustomDropdown
                    options={courseFilterOptions}
                    value={courseFilterType}
                    onChange={setCourseFilterType}
                    placeholder="Contains"
                  />
                </div>

                <label className="class-search-label">Course Career</label>
                <CustomDropdown
                  options={courseCareerOptions}
                  value={courseCareer}
                  onChange={setCourseCareer}
                  placeholder="Select Course Career"
                />
              </div>
            </div>

            <div className="class-search-criteria-section">
              <button
                className={`class-search-criteria-toggle ${showAdditionalCriteria ? "open" : ""}`}
                onClick={() => setShowAdditionalCriteria((prev) => !prev)}>
                <span className="class-search-criteria-icon">
                  {showAdditionalCriteria ? "▾" : "▸"}
                </span>
                <span>Additional Search Criteria</span>
              </button>

              {showAdditionalCriteria && <AdditionalCriteria {...additionalCriteriaProps} />}
            </div>

            <div className="class-search-search-row">
              <button className="class-search-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>

            {hasSearched && (
              <div className="class-results-section">
                <div className="class-results-section">
                  <div className="class-results-header">
                    <div className="class-results-legend">
                      <span className="legend-item">
                        <CircleIcon className="legend-icon open" />
                        Open
                      </span>

                      <span className="legend-item">
                        <CancelIcon className="legend-icon closed" />
                        Closed
                      </span>

                      <span className="legend-item">
                        <ErrorIcon className="legend-icon waitlist" />
                        Wait List
                      </span>
                    </div>

                    <div className="class-results-columns">
                      <span># students enrolled / Total # spots / # waitlisting</span>
                      <span>Status</span>
                    </div>
                  </div>

                  <div className="class-results-list">
                    {searchResults.length > 0 ? (
                      searchResults.map((course) => {
                        const isExpanded = expandedCourseId === course.id;

                        return (
                          <div key={course.id} className="class-result-item">
                            <button
                              className={`class-result-row ${isExpanded ? "expanded" : ""}`}
                              onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}>
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

                              <div
                                className={`class-result-status ${
                                  isCourseAdded(course.id)
                                    ? "added"
                                    : course.status.toLowerCase().replace(" ", "-")
                                }`}>
                                <span className="status-icon">
                                  {isCourseAdded(course.id) ? (
                                    <CircleIcon />
                                  ) : course.status === "Open" ? (
                                    <CircleIcon />
                                  ) : course.status === "Closed" ? (
                                    <CancelIcon />
                                  ) : (
                                    <ErrorIcon />
                                  )}
                                </span>
                                {isCourseAdded(course.id) ? "Added" : course.status}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="class-result-details">
                                <div className="class-result-details-grid">
                                  <div className="class-result-details-left">
                                    <div className="detail-row">
                                      <span className="detail-label">Class Number</span>
                                      <span>{course.classNumber}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Session</span>
                                      <span>{course.session}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Units</span>
                                      <span>{course.units}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Instruction Mode</span>
                                      <span>{course.instructionMode}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Career</span>
                                      <span>{course.career}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Grading</span>
                                      <span>{course.grading}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Dates</span>
                                      <span>{course.dates}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Times</span>
                                      <span>{course.times}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Location</span>
                                      <span>{course.location}</span>
                                    </div>
                                    <div className="detail-row">
                                      <span className="detail-label">Instructor</span>
                                      <span>{course.instructor}</span>
                                    </div>
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
                                        <div className="detail-block-title">
                                          Class Availability:
                                        </div>
                                        <ul>
                                          <li>
                                            Class capacity: {course.classAvailability.classCapacity}
                                          </li>
                                          <li>
                                            Total enrolled: {course.classAvailability.totalEnrolled}
                                          </li>
                                          <li>
                                            Available seats:{" "}
                                            {course.classAvailability.availableSeats}
                                          </li>
                                          <li>
                                            Waitlist capacity:{" "}
                                            {course.classAvailability.waitlistCapacity}
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="detail-block">
                                      <div className="detail-block-title">
                                        Allowed Declared Major:
                                      </div>
                                      <p>{course.allowedMajors.join(", ")}.</p>
                                      <p>Or Instructor consent.</p>
                                    </div>

                                    <div className="class-result-actions">
                                      {course.status !== "Closed" && (
                                        <button
                                          className={`add-class-btn ${isCourseAdded(course.id) ? "remove" : ""}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleCourse(course);
                                          }}>
                                          {isCourseAdded(course.id) ? "Remove Class" : "Add Class"}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="class-results-empty">
                        No classes found for the selected filters.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="class-search-tabs">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={activeSchedule === num ? "active" : ""}
                  onClick={() => setActiveSchedule(num)}>
                  Schedule {num}
                </button>
              ))}
            </div>

            <div className="class-search-schedule-shell">
               {scheduledClasses[activeSchedule].length > 0 && (
                <div className="schedule-course-list">
                  {scheduledClasses[activeSchedule].map((course) => {
                    const isEnrolled = isCourseEnrolled(course.id);
                    const isSelected = selectedCourseIds.includes(course.id);
                    return(
                      <div key={course.id} className={`schedule-list-row ${isEnrolled ? "schedule-list-row--enrolled" : ""}`}>
                        <label className="checkbox" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={isSelected} onChange={() => handleToggleSelect(course.id)} />
                            <span className="checkmark"></span>
                        </label>
                        <span className="schedule-list-code">{course.code}</span>
                        <span className="schedule-list-title">{course.title}</span>
                        <span className="schedule-list-count">{course.enrolled}/{course.total}/{course.waitlist}</span>
                        <span className={`schedule-list-status ${isEnrolled ? "status-enrolled" : "status-open"}`}>
                          {isEnrolled ? "Enrolled" : "Open"}
                        </span>
                      </div>
                    );
                  })}
                </div>  
              )}

              <div className="calendar-shell">
                <div className="calendar-grid">
                  <div className="calendar-header-row">
                    <div className="calendar-time-header"></div>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <div key={day} className="calendar-day-header">
                        {day}
                      </div>
                    ))}
                  </div>

                  {Array.from({ length: calendarEndHour - calendarStartHour + 1 }, (_, i) => {
                    const hour = calendarStartHour + i;
                    return (
                      <div key={hour} className="calendar-hour-row">
                        <div className="calendar-time-label">
                          {String(hour).padStart(2, "0")}:00
                        </div>
                        {Array.from({ length: dayColumnCount }, (_, col) => (
                          <div key={col} className="calendar-cell"></div>
                        ))}
                      </div>
                    );
                  })}

                  <div className="calendar-events-layer">
                    {eventsWithConflicts.map((event) => {
                      const top = ((event.startMinutes - calendarStartHour * 60) / 60) * hourHeight;

                      const height = ((event.endMinutes - event.startMinutes) / 60) * hourHeight;

                      const left = `calc(${timeColumnWidth}px + (${event.column} * ((100% - ${timeColumnWidth}px) / ${dayColumnCount})))`;
                      const width = `calc((100% - ${timeColumnWidth}px) / ${dayColumnCount})`;

                      return (
                        <div
                          key={event.id}
                          className={`calendar-event-card ${event.hasConflict ? "calendar-event-card--conflict" : event.isEnrolled ? "calendar-event-card--enrolled" : ""}`}
                          style={{
                            top: `${top + 38}px`, // offset for header row
                            left,
                            width,
                            height: `${height}px`,
                          }}>
                          <div className="calendar-event-code">{event.course.code}</div>
                          <div className="calendar-event-instructor">{event.course.instructor}</div>
                          <div className="calendar-event-room">{event.course.location}</div>
                          {event.isEnrolled && <div className="calendar-event-enrolled-badge">Enrolled</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="class-search-actions">
                <div className="actions-left">
                  <button className="action-btn" onClick={handleDropSelected}>Drop Selected</button>
                  <button className="action-btn" onClick={handleDropAll}>Drop All</button>
                </div>

                <div className="actions-right">
                  <button className="action-btn" onClick={handleCheckoutSelected}>Checkout Selected</button>
                  <button className="action-btn" onClick={handleCheckoutAll}>Checkout All</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
