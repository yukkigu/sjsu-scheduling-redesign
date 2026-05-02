# SJSU Scheduling System Redesign

## Project Overview

This project is a high-fidelity redesign of San Jose State University’s course scheduling and enrollment system.

Our goal was to improve the user experience of class search, schedule planning, enrollment, and waitlist management by creating a more intuitive, visually polished, and interactive interface. The redesigned system focuses on reducing cognitive load, improving visibility of system status, and supporting faster schedule-building decisions.

This prototype includes:

- Class search with filtering
- Expandable class cards with inline details
- Multi-schedule comparison
- Calendar-based schedule visualization
- Real-time conflict detection
- Enrollment and waitlist flows
- Separate My Schedule view for enrolled and waitlisted courses

Because this project focuses on redesigning the scheduling experience, features outside of scheduling may not be fully implemented.

## Main Design Changes

### Visual / UI Improvements

- Clean, modern card-based layout
- Rounded corners and softer visual styling
- Improved spacing and visual hierarchy
- Pastel-inspired interface for a lighter, more approachable experience

### Color System

- Replaced the original grey-white interface with a pastel blue and white palette
- Used multiple shades of blue for consistency and hierarchy
- Chose blue as the primary color because it reflects SJSU’s school identity

### Functional Improvements

- Consolidated scheduling-related tasks into a single Class Search workflow
- Reduced unnecessary tab switching and page changes
- Added expandable class cards so users can see full class information inline
- Reflected added, enrolled, and waitlisted courses directly in the calendar
- Added real-time schedule conflict detection
- Supported quick enrollment / checkout workflows
- Added support for multiple schedules for comparison
- Created a My Schedule page for enrolled and waitlisted classes

## Tech Stack

- **Frontend:** React
- **Build Tool:** Vite
- **Language:** JavaScript / JSX
- **Styling:** CSS
- **Icons:** Material UI Icons
- **Version Control:** GitHub

# Setup Instructions

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm

## Installation

```bash
# 1. Clone the repository:
git clone https://github.com/yukkigu/sjsu-scheduling-redesign.git

# 2. Navigate into the project folder:
cd sjsu-scheduling-redesign

# 3. Install dependencies
npm install
```

## Run the Project

```bash
npm run dev
```

URL should open in: `http://localhost:5173`

# Project Structure

```
sjsu-scheduling-redesign/
├── public/
├── src/
│   ├── components/                # reusable UI components (e.g., Sidebar, CustomDropdown)
│   ├── context/                   # shared scheduling state
│   ├── data/
│   │   └── mockClasses.js         # mock course data
│   ├── ClassSearchPage.jsx
│   ├── ClassSearchPage.css
│   ├── MySchedulePage.jsx
│   ├── LandingPage.jsx
│   ├── LandingPage.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

# Future Work

- Integrate live SJSU course catalog data
- Add waitlist notifications
- Support academic progress tracking
- Show prerequisite completion based on student records
- Add smarter schedule recommendations
