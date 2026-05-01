import "./ScheduleCalendar.css";

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

const eventsConflict = (a, b) => {
  if (a.day !== b.day) return false;
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
};

export default function ScheduleCalendar({
  courses = [],
  isCourseEnrolled = () => false,
  isCourseWaitlisted = () => false,
}) {
  const calendarStartHour = 6;
  const calendarEndHour = 22;
  const hourHeight = 62;
  const timeColumnWidth = 90;
  const dayColumnCount = 5;

  const scheduledEvents = courses.flatMap((course) => {
    const meetingDays = parseMeetingDays(course.times);
    const { startMinutes, endMinutes } = parseTimeRange(course.times);
    const isEnrolled = isCourseEnrolled(course.id);
    const isWaitlisted = isCourseWaitlisted(course.id);

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

  const eventsWithConflicts = scheduledEvents.map((event, index) => {
    const hasConflict = scheduledEvents.some(
      (other, otherIndex) => otherIndex !== index && eventsConflict(event, other),
    );
    return { ...event, hasConflict };
  });

  return (
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
                <div className="calendar-time-label">{String(hour).padStart(2, "0")}:00</div>
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
                  className={`calendar-event-card ${
                    event.isEnrolled
                      ? "calendar-event-card--enrolled"
                      : event.isWaitlisted
                        ? "calendar-event-card--waitlisted"
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
                  <div className="calendar-event-instructor">{event.course.instructor}</div>
                  <div className="calendar-event-room">{event.course.location}</div>

                  {event.isEnrolled && (
                    <div className="calendar-event-enrolled-badge">Enrolled</div>
                  )}
                  {event.isWaitlisted && (
                    <div className="calendar-event-waitlisted-badge">Waitlisted</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
