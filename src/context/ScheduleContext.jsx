import { createContext, useContext, useState } from "react";

const ScheduleContext = createContext(null);

export function ScheduleProvider({ children }) {
  const [activeSchedule, setActiveSchedule] = useState(1);

  const [scheduledClasses, setScheduledClasses] = useState({
    1: [],
    2: [],
    3: [],
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

  const value = {
    activeSchedule,
    setActiveSchedule,
    scheduledClasses,
    setScheduledClasses,
    enrolledClasses,
    setEnrolledClasses,
    waitlistedClasses,
    setWaitlistedClasses,
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

export function useSchedule() {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }

  return context;
}
