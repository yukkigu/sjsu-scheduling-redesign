import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClassSearchPage.css";
import { mockClasses } from "./data/mockClasses";
import { useSchedule } from "./context/ScheduleContext.jsx";

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
import ScheduleCalendar from "./components/Schedule/ScheduleCalendar";

export default function ClassSearchPage() {
  const navigate = useNavigate();

  // ------------------- search filters states -------------------
  const [term, setTerm] = useState("Spring 2026");
  const [subject, setSubject] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [courseFilterType, setCourseFilterType] = useState("");
  const [courseCareer, setCourseCareer] = useState("");

  // additional criteria states
  const modeOfInstructionOptions = ["Select", "Lecture", "Seminar", "Discussion", "Research"];
  const classTimeTypeOptions = ["Select", "Before", "After", "At Exactly"];
  const times = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  const [showAdditionalCriteria, setShowAdditionalCriteria] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [modeOfInstruction, setModeOfInstruction] = useState("");
  const [classTimeType, setClassTimeType] = useState("");
  const [classTimeValue, setClassTimeValue] = useState("");
  const [instructorLastName, setInstructorLastName] = useState("");

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
    selectedDays,
    setSelectedDays,
    instructorLastName,
    setInstructorLastName,
  };
  // --------------------------------------------------------------

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [expandedScheduledCourseId, setExpandedScheduledCourseId] = useState(null);

  const [pendingWaitlistEnrollment, setPendingWaitlistEnrollment] = useState({
    coursesToEnroll: [],
    waitlistCourses: [],
  });

  const {
    activeSchedule,
    setActiveSchedule,
    scheduledClasses,
    setScheduledClasses,
    enrolledClasses,
    setEnrolledClasses,
    waitlistedClasses,
    setWaitlistedClasses,
  } = useSchedule();

  // ------------------- modal states -------------------
  const [waitlistModal, setWaitlistModal] = useState({
    isOpen: false,
    courses: [],
  });

  const [prereqModal, setPrereqModal] = useState({
    isOpen: false,
    course: null,
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [enrollSuccessModal, setEnrollSuccessModal] = useState({
    isOpen: false,
    enrolledCourses: [],
    waitlistedCourses: [],
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
    "Select",
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

  const dropdownTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
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
    const isWaitlisted = waitlistedClasses[activeSchedule].some((c) => c.id === course.id);

    return meetingDays.map((day) => ({
      id: `${course.id}-${day}`,
      course,
      day,
      column: DAY_TO_COLUMN[day],
      startMinutes,
      endMinutes,
      isEnrolled,
      isWaitlisted,
    }));
  });

  const eventsConflict = (a, b) => {
    if (a.day !== b.day) return false;
    return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
  };

  const eventsWithConflicts = scheduledEvents.map((event, index) => {
    const hasConflict = scheduledEvents.some(
      (other, otherIndex) => otherIndex !== index && eventsConflict(event, other),
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
        courses: waitlistCourses,
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
      waitlistedCourses: [],
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
        courses: waitlistCourses,
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
      waitlistedCourses: [],
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

    setWaitlistModal({ isOpen: false, courses: [] });

    setEnrollSuccessModal({
      isOpen: true,
      enrolledCourses: coursesToEnroll,
      waitlistedCourses: waitlistCourses,
    });

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

      const matchesCourseNumber =
        !courseNumber ||
        (course.code &&
          (() => {
            const codeLower = course.code.toLowerCase();
            const queryLower = courseNumber.toLowerCase();

            if (courseFilterType === "Is Exactly") {
              return codeLower === queryLower;
            }

            return codeLower.includes(queryLower);
          })());

      const matchesInstructionMode =
        !modeOfInstruction || course.instructionMode === modeOfInstruction;

      const matchesInstructor =
        !instructorLastName ||
        course.instructor.toLowerCase().includes(instructorLastName.toLowerCase());

      const courseDays = parseMeetingDays(course.times);
      const matchesDays =
        selectedDays.length === 0 || selectedDays.every((day) => courseDays.includes(day));

      const { startMinutes } = parseTimeRange(course.times);
      const selectedTimeMinutes = classTimeValue
        ? parseTimeRange(`X ${classTimeValue}-00:00`).startMinutes
        : null;

      let matchesClassTime = true;
      if (classTimeType && classTimeValue) {
        const selectedMinutes = dropdownTimeToMinutes(classTimeValue);

        if (classTimeType === "Before") {
          matchesClassTime = startMinutes < selectedMinutes;
        } else if (classTimeType === "After") {
          matchesClassTime = startMinutes > selectedMinutes;
        } else if (classTimeType === "At Exactly") {
          matchesClassTime = startMinutes === selectedMinutes;
        }
      }

      return (
        matchesTerm &&
        matchesSubject &&
        matchesCareer &&
        matchesCourseNumber &&
        matchesInstructionMode &&
        matchesInstructor &&
        matchesDays &&
        matchesClassTime
      );
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
          setWaitlistModal({ isOpen: false, courses: [] });
          setPendingWaitlistEnrollment({ coursesToEnroll: [], waitlistCourses: [] });
        }}
        onConfirm={handleJoinWaitlistAndEnroll}
        courses={waitlistModal.courses}
      />

      <PrereqModal
        isOpen={prereqModal.isOpen}
        onClose={() => setPrereqModal({ isOpen: false, course: null })}
        course={prereqModal.course}
      />

      <EnrollSuccessModal
        isOpen={enrollSuccessModal.isOpen}
        onClose={() =>
          setEnrollSuccessModal({
            isOpen: false,
            enrolledCourses: [],
            waitlistedCourses: [],
          })
        }
        enrolledCourses={enrollSuccessModal.enrolledCourses}
        waitlistedCourses={enrollSuccessModal.waitlistedCourses}
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
          activeSubtab="Add/Drop Classes"
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
                  onChange={(value) => setSubject(value === "Select" ? "" : value)}
                  placeholder="Select Subject"
                />

                <label className="class-search-label">Course Number Filter</label>
                <div className="class-search-course-filter-wrap">
                  <input
                    className="class-search-course-input"
                    value={courseNumber}
                    onChange={(e) => setCourseNumber(e.target.value)}
                  />
                  <CustomDropdown
                    options={courseFilterOptions}
                    value={courseFilterType}
                    onChange={(value) => setCourseFilterType(value === "Select" ? "" : value)}
                    placeholder="Contains"
                  />
                </div>

                <label className="class-search-label">Course Career</label>
                <CustomDropdown
                  options={courseCareerOptions}
                  value={courseCareer}
                  onChange={(value) => setCourseCareer(value === "Select" ? "" : value)}
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
                  {enrolledScheduledCourses.length > 0 && (
                    <div className="schedule-course-divider"></div>
                  )}

                  {waitlistedScheduledCourses.length > 0 && (
                    <>
                      <div className="schedule-course-section-label">Waitlisted Courses</div>
                      {waitlistedScheduledCourses.map((course) => {
                        const isExpanded = expandedScheduledCourseId === course.id;

                        return (
                          <>
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
                          </>
                        );
                      })}
                      <div className="schedule-course-divider"></div>
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

              <ScheduleCalendar
                courses={scheduledClasses[activeSchedule]}
                isCourseEnrolled={isCourseEnrolled}
                isCourseWaitlisted={isCourseWaitlisted}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
