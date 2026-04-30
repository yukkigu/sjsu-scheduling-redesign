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
import ClassConflictModal from "./components/Modals/ClassConflictModal";
import DropConfirmModal from "./components/Modals/DropConfirmModal";

import AdditionalCriteria from "./components/AdditionalCriteria/AdditionalCriteria";
import ClassCard from "./components/ClassList/ClassCard";

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
  const [expandedScheduledCourseId, setExpandedScheduledCourseId] = useState(null);

  const [activeSchedule, setActiveSchedule] = useState(1);
  const [scheduledClasses, setScheduledClasses] = useState({
    1: [],
    2: [],
    3: [],
  });

  const [pendingWaitlistEnrollment, setPendingWaitlistEnrollment] = useState({
    coursesToEnroll: [],
    waitlistCourses: [],
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

  const [enrolledClasses, setEnrolledClasses] = useState({
    1: [],
    2: [],
    3: [],
  });

  const [waitlistedClasses, setWaitlistedClasses] = useState({
    1: [],
    2: [],
    3: [],
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [enrollSuccessModal, setEnrollSuccessModal] = useState({
    isOpen: false,
    enrolledCourses: [],
  });

  const [classConflictModal, setClassConflictModal] = useState({
    isOpen: false,
    conflictingCourses: [],
  });

  const [dropConfirmModal, setDropConfirmModal] = useState({
    isOpen: false,
    course: null,
  });

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

  const eventsConflict = (a, b) => {
    if (a.day !== b.day) return false;
    return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
  };

  const hasScheduleConflict = (courses) => {
    const events = courses.flatMap((course) => {
      const meetingDays = parseMeetingDays(course.times);
      const { startMinutes, endMinutes } = parseTimeRange(course.times);

      return meetingDays.map((day) => ({
        day,
        startMinutes,
        endMinutes,
      }));
    });

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (eventsConflict(events[i], events[j])) {
          return true;
        }
      }
    }
    return false;
  };

  const eventsWithConflicts = scheduledEvents.map((event, index) => {
    const hasConflict = scheduledEvents.some(
      (other, otherIndex) => otherIndex < index && eventsConflict(event, other),
    );
    return { ...event, hasConflict };
  });

  const isCourseAdded = (courseId) => {
    return scheduledClasses[activeSchedule].some((c) => c.id === courseId);
  };

  const isCourseEnrolled = (courseId) =>
    enrolledClasses[activeSchedule].some((c) => c.id === courseId);

  const isCourseWaitlisted = (courseId) =>
    waitlistedClasses[activeSchedule].some((c) => c.id === courseId);

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

    if (course.status === "Closed") {
      return;
    }

    setScheduledClasses((prev) => ({
      ...prev,
      [activeSchedule]: [...prev[activeSchedule], course],
    }));
  };

  const handleToggleSelect = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id != courseId) : [...prev, courseId],
    );
  };

  const getConflictingCourses = (courses) => {
    const events = courses.flatMap((course) => {
      const meetingDays = parseMeetingDays(course.times);
      const { startMinutes, endMinutes } = parseTimeRange(course.times);

      return meetingDays.map((day) => ({
        course,
        day,
        startMinutes,
        endMinutes,
      }));
    });

    const conflicts = new Map();

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (eventsConflict(events[i], events[j])) {
          conflicts.set(events[i].course.id, events[i].course);
          conflicts.set(events[j].course.id, events[j].course);
        }
      }
    }

    return Array.from(conflicts.values());
  };

  const handleRemoveSelected = () => {
    const removableIds = scheduledClasses[activeSchedule]
      .filter((course) => selectedCourseIds.includes(course.id) && !isCourseEnrolled(course.id))
      .map((course) => course.id);

    if (removableIds.length === 0) return;

    setScheduledClasses((prev) => ({
      ...prev,
      [activeSchedule]: prev[activeSchedule].filter((c) => !removableIds.includes(c.id)),
    }));

    setSelectedCourseIds((prev) => prev.filter((id) => !removableIds.includes(id)));
    setExpandedScheduledCourseId(null);
  };

  const performDropCourse = (course) => {
    if (!course) return;

    setEnrolledClasses((prev) => ({
      ...prev,
      [activeSchedule]: prev[activeSchedule].filter((c) => c.id !== course.id),
    }));

    setWaitlistedClasses((prev) => ({
      ...prev,
      [activeSchedule]: prev[activeSchedule].filter((c) => c.id !== course.id),
    }));

    setExpandedScheduledCourseId((prev) => (prev === course.id ? null : prev));
    setExpandedCourseId((prev) => (prev === course.id ? null : prev));
    setSelectedCourseIds((prev) => prev.filter((id) => id !== course.id));
  };

  const handleDropCourse = (course) => {
    setDropConfirmModal({
      isOpen: true,
      course,
    });
  };

  const handleCheckoutSelected = () => {
    const toEnroll = scheduledClasses[activeSchedule].filter(
      (c) =>
        selectedCourseIds.includes(c.id) && !isCourseEnrolled(c.id) && !isCourseWaitlisted(c.id),
    );

    if (toEnroll.length === 0) return;

    const alreadyCommitted = [
      ...enrolledClasses[activeSchedule],
      ...waitlistedClasses[activeSchedule],
    ];

    const coursesToCheck = [...alreadyCommitted, ...toEnroll];

    const conflictingCourses = getConflictingCourses(coursesToCheck);
    if (conflictingCourses.length > 0) {
      setClassConflictModal({
        isOpen: true,
        conflictingCourses,
      });
      return;
    }

    const waitlistCourses = toEnroll.filter((course) => course.status === "Wait List");

    const regularCourses = toEnroll.filter((course) => course.status !== "Wait List");

    if (waitlistCourses.length > 0) {
      setPendingWaitlistEnrollment({
        coursesToEnroll: regularCourses,
        waitlistCourses,
      });

      setWaitlistModal({
        isOpen: true,
        course: waitlistCourses[0],
      });
      return;
    }

    setEnrolledClasses((prev) => ({
      ...prev,
      [activeSchedule]: [...prev[activeSchedule], ...regularCourses],
    }));

    setSelectedCourseIds([]);
    setEnrollSuccessModal({
      isOpen: true,
      enrolledCourses: regularCourses,
    });
  };

  const handleCheckoutAll = () => {
    const toEnroll = scheduledClasses[activeSchedule].filter(
      (course) => !isCourseEnrolled(course.id) && !isCourseWaitlisted(course.id),
    );

    if (toEnroll.length === 0) return;

    const alreadyCommitted = [
      ...enrolledClasses[activeSchedule],
      ...waitlistedClasses[activeSchedule],
    ];

    const coursesToCheck = [...alreadyCommitted, ...toEnroll];

    const conflictingCourses = getConflictingCourses(coursesToCheck);
    if (conflictingCourses.length > 0) {
      setClassConflictModal({
        isOpen: true,
        conflictingCourses,
      });
      return;
    }

    const waitlistCourses = toEnroll.filter((course) => course.status === "Wait List");

    const regularCourses = toEnroll.filter((course) => course.status !== "Wait List");

    if (waitlistCourses.length > 0) {
      setPendingWaitlistEnrollment({
        coursesToEnroll: regularCourses,
        waitlistCourses,
      });

      setWaitlistModal({
        isOpen: true,
        course: waitlistCourses[0],
      });
      return;
    }

    setEnrolledClasses((prev) => ({
      ...prev,
      [activeSchedule]: [...prev[activeSchedule], ...regularCourses],
    }));

    setSelectedCourseIds([]);
    setEnrollSuccessModal({
      isOpen: true,
      enrolledCourses: regularCourses,
    });
  };

  const handleJoinWaitlistAndEnroll = () => {
    const { coursesToEnroll, waitlistCourses } = pendingWaitlistEnrollment;

    if (!coursesToEnroll.length && !waitlistCourses.length) return;

    if (coursesToEnroll.length > 0) {
      setEnrolledClasses((prev) => ({
        ...prev,
        [activeSchedule]: [
          ...prev[activeSchedule].filter((c) => !coursesToEnroll.some((e) => e.id === c.id)),
          ...coursesToEnroll,
        ],
      }));
    }

    if (waitlistCourses.length > 0) {
      setWaitlistedClasses((prev) => ({
        ...prev,
        [activeSchedule]: [
          ...prev[activeSchedule].filter((c) => !waitlistCourses.some((w) => w.id === c.id)),
          ...waitlistCourses,
        ],
      }));
    }

    setSelectedCourseIds([]);
    setEnrollSuccessModal({
      isOpen: true,
      enrolledCourses: coursesToEnroll,
    });

    setWaitlistModal({ isOpen: false, course: null });
    setPendingWaitlistEnrollment({
      coursesToEnroll: [],
      waitlistCourses: [],
    });
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
    if (isCourseWaitlisted(courseId)) return "Waitlisted";
    if (isCourseAdded(courseId)) return "Added";
    return null;
  };

  const enrolledScheduledCourses = scheduledClasses[activeSchedule].filter((course) =>
    isCourseEnrolled(course.id),
  );

  const waitlistedScheduledCourses = scheduledClasses[activeSchedule].filter((course) =>
    isCourseWaitlisted(course.id),
  );

  const addedScheduledCourses = scheduledClasses[activeSchedule].filter(
    (course) => !isCourseEnrolled(course.id) && !isCourseWaitlisted(course.id),
  );

  return (
    <div className="class-search-page">
      {/* Modals */}
      <WaitlistModal
        isOpen={waitlistModal.isOpen}
        onClose={() => {
          setWaitlistModal({ isOpen: false, course: null });
          setPendingWaitlistEnrollment({ coursesToEnroll: [], waitlistCourses: [] });
        }}
        onConfirm={handleJoinWaitlistAndEnroll}
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

      <ClassConflictModal
        isOpen={classConflictModal.isOpen}
        onClose={() => setClassConflictModal({ isOpen: false, conflictingCourses: [] })}
        conflictingCourses={classConflictModal.conflictingCourses}
      />

      <DropConfirmModal
        isOpen={dropConfirmModal.isOpen}
        onClose={() => setDropConfirmModal({ isOpen: false, course: null })}
        courses={dropConfirmModal.course ? [dropConfirmModal.course] : []}
        onConfirm={() => {
          performDropCourse(dropConfirmModal.course);
          setDropConfirmModal({ isOpen: false, course: null });
        }}
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
                          <ClassCard
                            key={course.id}
                            course={course}
                            isExpanded={isExpanded}
                            onToggle={() => setExpandedCourseId(isExpanded ? null : course.id)}
                            isCourseAdded={isCourseAdded}
                            handleToggleCourse={handleToggleCourse}
                            isCourseEnrolled={isCourseEnrolled}
                            getCourseDisplayStatus={getCourseDisplayStatus}
                            handleDropCourse={handleDropCourse}
                          />
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
                  {enrolledScheduledCourses.length > 0 && (
                    <>
                      <div className="schedule-course-section-label">Enrolled Courses</div>
                      {enrolledScheduledCourses.map((course) => {
                        const isExpanded = expandedScheduledCourseId === course.id;

                        return (
                          <ClassCard
                            key={course.id}
                            course={course}
                            variant="schedule"
                            isExpanded={isExpanded}
                            onToggle={() =>
                              setExpandedScheduledCourseId(isExpanded ? null : course.id)
                            }
                            isCourseAdded={isCourseAdded}
                            handleToggleCourse={handleToggleCourse}
                            isCourseEnrolled={isCourseEnrolled}
                            getCourseDisplayStatus={getCourseDisplayStatus}
                            handleDropCourse={handleDropCourse}
                            showCheckbox={false}
                          />
                        );
                      })}
                    </>
                  )}
                  {enrolledScheduledCourses.length > 0 && addedScheduledCourses.length > 0 && (
                    <div className="schedule-course-divider"></div>
                  )}

                  {waitlistedScheduledCourses.length > 0 && (
                    <>
                      <div className="schedule-course-section-label">Waitlisted Courses</div>
                      {waitlistedScheduledCourses.map((course) => {
                        const isExpanded = expandedScheduledCourseId === course.id;

                        return (
                          <ClassCard
                            key={course.id}
                            course={course}
                            variant="schedule"
                            isExpanded={isExpanded}
                            onToggle={() =>
                              setExpandedScheduledCourseId(isExpanded ? null : course.id)
                            }
                            isCourseAdded={isCourseAdded}
                            handleToggleCourse={handleToggleCourse}
                            isCourseEnrolled={isCourseEnrolled}
                            isCourseWaitlisted={isCourseWaitlisted}
                            getCourseDisplayStatus={getCourseDisplayStatus}
                            handleDropCourse={handleDropCourse}
                            showCheckbox={false}
                          />
                        );
                      })}
                    </>
                  )}

                  {addedScheduledCourses.length > 0 && (
                    <>
                      <div className="schedule-course-section-label">Unenrolled Courses</div>
                      <p className="class-search-helper-text">
                        Select checkbox to enroll or remove classes.
                      </p>
                      {addedScheduledCourses.map((course) => {
                        const isSelected = selectedCourseIds.includes(course.id);
                        const isExpanded = expandedScheduledCourseId === course.id;

                        return (
                          <ClassCard
                            key={course.id}
                            course={course}
                            variant="schedule"
                            isExpanded={isExpanded}
                            onToggle={() =>
                              setExpandedScheduledCourseId(isExpanded ? null : course.id)
                            }
                            isCourseAdded={isCourseAdded}
                            handleToggleCourse={handleToggleCourse}
                            isCourseEnrolled={isCourseEnrolled}
                            getCourseDisplayStatus={getCourseDisplayStatus}
                            handleDropCourse={handleDropCourse}
                            showCheckbox={true}
                            isSelected={isSelected}
                            onToggleSelect={handleToggleSelect}
                          />
                        );
                      })}

                      <div className="class-search-actions">
                        <div className="actions-left">
                          <button className="action-btn" onClick={handleRemoveSelected}>
                            Remove Selected
                          </button>
                        </div>

                        <div className="actions-right">
                          <button className="action-btn" onClick={handleCheckoutSelected}>
                            Enroll Selected
                          </button>
                          <button className="action-btn" onClick={handleCheckoutAll}>
                            Enroll All
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="calendar-shell">
                <div className="calendar-header-row">
                  <div className="calendar-time-header"></div>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                    <div key={day} className="calendar-day-header">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="calendar-scroll">
                  <div className="calendar-grid">
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
                        const top =
                          ((event.startMinutes - calendarStartHour * 60) / 60) * hourHeight;

                        const height = ((event.endMinutes - event.startMinutes) / 60) * hourHeight;

                        const left = `calc(${timeColumnWidth}px + (${event.column} * ((100% - ${timeColumnWidth}px) / ${dayColumnCount})))`;
                        const width = `calc((100% - ${timeColumnWidth}px) / ${dayColumnCount})`;

                        return (
                          <div
                            key={event.id}
                            className={`calendar-event-card 
                              ${
                                event.isEnrolled
                                  ? "calendar-event-card--enrolled"
                                  : event.hasConflict
                                    ? "calendar-event-card--conflict"
                                    : ""
                              }`}
                            style={{
                              top: `${top}px`,
                              left,
                              width,
                              height: `${height}px`,
                            }}>
                            <div className="calendar-event-code">{event.course.code}</div>
                            <div className="calendar-event-instructor">
                              {event.course.instructor}
                            </div>
                            <div className="calendar-event-room">{event.course.location}</div>
                            {event.isEnrolled && (
                              <div className="calendar-event-enrolled-badge">Enrolled</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
