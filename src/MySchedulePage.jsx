import { useState } from "react";
import Topbar from "./components/Navbars/Topbar";
import Sidebar from "./components/Navbars/Sidebar";
import ScheduleCalendar from "./components/Schedule/ScheduleCalendar";
import ClassCard from "./components/ClassList/ClassCard";
import { useSchedule } from "./context/ScheduleContext";
import "./MySchedulePage.css";

export default function MySchedulePage() {
  const { activeSchedule, setActiveSchedule, enrolledClasses, waitlistedClasses } = useSchedule();
  const [expandedScheduledCourseId, setExpandedScheduledCourseId] = useState(null);

  const myScheduleCourses = [
    ...enrolledClasses[activeSchedule],
    ...waitlistedClasses[activeSchedule],
  ];

  const enrolledScheduledCourses = enrolledClasses[activeSchedule];
  const waitlistedScheduledCourses = waitlistedClasses[activeSchedule];

  const isCourseEnrolled = (courseId) =>
    enrolledClasses[activeSchedule].some((c) => c.id === courseId);

  const isCourseWaitlisted = (courseId) =>
    waitlistedClasses[activeSchedule].some((c) => c.id === courseId);

  const getCourseDisplayStatus = (courseId) => {
    if (isCourseEnrolled(courseId)) return "Enrolled";
    if (isCourseWaitlisted(courseId)) return "Waitlisted";
    return null;
  };

  return (
    <div className="class-search-page">
      <Topbar />

      <div className="class-search-layout">
        <Sidebar
          activeItem="Academics: Enrollment"
          activeSubtab="My Schedule"
          defaultEnrollmentOpen={true}
        />

        <main className="class-search-content">
          <div className="class-search-card">
            <h2>My Schedule</h2>

            <div className="class-search-tabs">
              {[activeSchedule].map((num) => (
                <button
                  key={num}
                  className={activeSchedule === num ? "active" : ""}
                  onClick={() => setActiveSchedule(num)}>
                  Schedule {num}
                </button>
              ))}
            </div>

            <div className="class-search-schedule-shell">
              {(enrolledScheduledCourses.length > 0 || waitlistedScheduledCourses.length > 0) && (
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
                            isCourseAdded={() => false}
                            handleToggleCourse={() => {}}
                            isCourseEnrolled={isCourseEnrolled}
                            getCourseDisplayStatus={getCourseDisplayStatus}
                            handleDropCourse={() => {}}
                            showCheckbox={false}
                            showDropButton={false}
                          />
                        );
                      })}
                    </>
                  )}

                  {enrolledScheduledCourses.length > 0 && waitlistedScheduledCourses.length > 0 && (
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
                            isCourseAdded={() => false}
                            handleToggleCourse={() => {}}
                            isCourseEnrolled={isCourseEnrolled}
                            getCourseDisplayStatus={getCourseDisplayStatus}
                            handleDropCourse={() => {}}
                            showCheckbox={false}
                            showDropButton={false}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              )}

              <ScheduleCalendar
                courses={myScheduleCourses}
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
