import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClassSearchPage.css";
import { mockClasses } from "./data/mockClasses";

import Sidebar from "./components/Sidebar";
import CustomDropdown from "./components/CustomDropdown";

import CircleIcon from "@mui/icons-material/Circle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ClassSearchPage() {
  const navigate = useNavigate();
  const [showAdditionalCriteria, setShowAdditionalCriteria] = useState(false);

  const [term, setTerm] = useState("Spring 2025");
  const [subject, setSubject] = useState("");
  const [courseFilterType, setCourseFilterType] = useState("Contains");
  const [courseCareer, setCourseCareer] = useState("");

  const [modeOfInstruction, setModeOfInstruction] = useState("");
  const [classTimeType, setClassTimeType] = useState("Select");
  const [classTimeValue, setClassTimeValue] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const [activeSchedule, setActiveSchedule] = useState(1);
  const [scheduledClasses, setScheduledClasses] = useState({
    1: [],
    2: [],
    3: [],
  });

  const times = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  const termOptions = ["Spring 2025", "Fall 2026", "Summer 2026", "Spring 2027"];

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

  const modeOfInstructionOptions = ["Select", "Lecture", "Seminar", "Discussion", "Research"];

  const classTimeTypeOptions = ["Select", "Before", "After", "At Exactly"];
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

    return meetingDays.map((day) => ({
      id: `${course.id}-${day}`,
      course,
      day,
      column: DAY_TO_COLUMN[day],
      startMinutes,
      endMinutes,
    }));
  });

  const isCourseAdded = (courseId) => {
    return scheduledClasses[activeSchedule].some((c) => c.id === courseId);
  };

  const handleToggleCourse = (course) => {
    const alreadyAdded = isCourseAdded(course.id);

    setScheduledClasses((prev) => {
      const currentSchedule = prev[activeSchedule];

      if (alreadyAdded) {
        return {
          ...prev,
          [activeSchedule]: currentSchedule.filter((c) => c.id !== course.id),
        };
      }

      return {
        ...prev,
        [activeSchedule]: [...currentSchedule, course],
      };
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

  return (
    <div className="class-search-page">
      <div className="class-search-header">
        <div className="class-search-header-inner">
          <div className="class-search-logo">
            <div className="class-search-logo-main">SJSU</div>
            <div className="class-search-logo-sub">
              <div>SAN JOSE STATE</div>
              <div>UNIVERSITY</div>
            </div>
          </div>
        </div>
      </div>

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

              {showAdditionalCriteria && (
                <div className="class-search-criteria-body">
                  <div className="class-search-criteria-row class-search-days-row">
                    <div className="class-search-criteria-label">Days of the Week</div>

                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Monday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Tuesday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Wednesday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Thursday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Friday</span>
                      </label>
                    </label>
                  </div>

                  <div className="class-search-criteria-row class-search-mode-time-row">
                    <label className="class-search-criteria-label">Mode of Instruction</label>
                    <CustomDropdown
                      options={modeOfInstructionOptions}
                      value={modeOfInstruction}
                      onChange={setModeOfInstruction}
                      placeholder="Select Mode of Instruction"
                    />

                    <label className="class-search-criteria-label class-search-time-label">
                      Class Time
                    </label>

                    <CustomDropdown
                      options={classTimeTypeOptions}
                      value={classTimeType}
                      onChange={setClassTimeType}
                      placeholder="Select"
                    />

                    <CustomDropdown
                      options={times}
                      value={classTimeValue}
                      onChange={setClassTimeValue}
                      placeholder="Select class time"
                    />
                  </div>

                  <div className="class-search-criteria-row class-search-instructor-row">
                    <label className="class-search-criteria-label">Instructor Last Name</label>
                    <input className="class-search-instructor-input" placeholder="Search..." />
                  </div>
                </div>
              )}
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
                                      <button
                                        className={`add-class-btn ${isCourseAdded(course.id) ? "remove" : ""}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleCourse(course);
                                        }}>
                                        {isCourseAdded(course.id) ? "Remove Class" : "Add Class"}
                                      </button>
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
                    {scheduledEvents.map((event) => {
                      const top = ((event.startMinutes - calendarStartHour * 60) / 60) * hourHeight;

                      const height = ((event.endMinutes - event.startMinutes) / 60) * hourHeight;

                      const left = `calc(${timeColumnWidth}px + (${event.column} * ((100% - ${timeColumnWidth}px) / ${dayColumnCount})))`;
                      const width = `calc((100% - ${timeColumnWidth}px) / ${dayColumnCount}`;

                      return (
                        <div
                          key={event.id}
                          className="calendar-event-card"
                          style={{
                            top: `${top + 38}px`, // offset for header row
                            left,
                            width,
                            height: `${height}px`,
                          }}>
                          <div className="calendar-event-code">{event.course.code}</div>
                          <div className="calendar-event-instructor">{event.course.instructor}</div>
                          <div className="calendar-event-room">{event.course.location}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="class-search-actions">
                <div className="actions-left">
                  <button className="action-btn">Drop Selected</button>
                  <button className="action-btn">Drop All</button>
                </div>

                <div className="actions-right">
                  <button className="action-btn">Checkout Selected</button>
                  <button className="action-btn">Checkout All</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
