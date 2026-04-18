export const mockCourses = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    code: 'CS101',
    grade: '94%',
    nextAssignment: 'Project 1: Binary Trees',
    dueDate: 'In 3 Days',
    importance: 'High (Major Specific)',
  },
  {
    id: 2,
    name: 'Calculus II',
    code: 'MATH102',
    grade: '88%',
    nextAssignment: 'Midterm Exam',
    dueDate: 'Next Week',
    importance: 'High (Prerequisite)',
  },
  {
    id: 3,
    name: 'World History',
    code: 'HIST201',
    grade: '96%',
    nextAssignment: 'Reading Response',
    dueDate: 'Tomorrow',
    importance: 'Low (General Ed)',
  },
];

export const mockAnnouncements = [
  {
    id: 1,
    course: 'CS101',
    title: 'Midterm format changed',
    date: '2 hours ago',
    content: 'The midterm will now be open notes and open book. Please make sure to bring your laptop fully charged as we will be using the lockdown browser. Also, note that questions 4 and 5 from the study guide will be weighted heavily.',
  },
  {
    id: 2,
    course: 'MATH102',
    title: 'Homework 4 Extension',
    date: 'Yesterday',
    content: 'Due to the server outage yesterday, the deadline for Homework 4 has been extended by 48 hours. Please reach out to your TAs if you have any questions.',
  },
  {
    id: 3,
    course: 'HIST201',
    title: 'Guest Speaker Tomorrow',
    date: '2 days ago',
    content: "We will have a guest speaker joining us for tomorrow's lecture. Attendance is mandatory and there will be a short quiz based on the presentation at the end of the class.",
  }
];

export const mockCalendarEvents = [
  { id: 1, title: 'CS101 Project 1 Due', date: '2023-10-25', time: '23:59', type: 'deadline' },
  { id: 2, title: 'Start MATH102 Studying', date: '2023-10-23', time: '18:00', type: 'start_time' },
  { id: 3, title: 'HIST201 Reading', date: '2023-10-24', time: '14:00', type: 'start_time' },
  { id: 4, title: 'MATH102 Midterm', date: '2023-10-28', time: '10:00', type: 'deadline' },
  { id: 5, title: 'CS101 Office Hours', date: '2023-10-23', time: '10:00', type: 'event' },
  { id: 6, title: 'Group meeting for HIST201', date: '2023-10-26', time: '11:00', type: 'event' },
  { id: 7, title: 'Review lecture notes for MATH102', date: '2023-10-22', time: '16:00', type: 'start_time' },
];
