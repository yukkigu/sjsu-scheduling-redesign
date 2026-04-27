# SJSU Scheduling System Redesign

This project implements a custom redesign of SJSU's scheduling system.

# Setup

# Main Changes:
### Visuals/UI:
  - Inspired by Google Drive's pastel and minimalistic designs
  - Clean background color with card items
  - Rounded corners
### Color scheme:
  - Changed from a dull yellowish white to pastel blue as the main background color and white items
  - Variants of blue are used
  - Reasoning: Different shades of blue were chosen because it's part of the SJSU school color
### Functionalities/Features:
  - Grouped Class Search, Add/Drop Class, MyScheduler, Browse Class --> Class Search 
      - Removed redundant usage of different tabs (Class Search can do all scheduling modifications)
  - Removed new window/system for MyScheduler --> Schedule can be adjusted and viewed in Class Schedule or at the bottom of Class Search (for quick class modification visibility)
  - Expanded classes show all necessary information (no longer need to open a new page to see class details)
  - Add/Drop classes are instantly reflected in the Calendar (easy to detect class conflicts)
  - Quick Checkout/Enrollment of classes (one click)
  - Ability to create several schedules to compare courses/schedules 

This project mainly focuses on the design aspects of the SJSU scheduling system, so many other tab features may not be available.

# Project Structure
```
sjsu-scheduling-redesign/
├── public/
├── src/
│   ├── components/                // reusable components (e.g., Sidebar, CustomDropdown)
│   ├── data/
│   │   └── mockClasses.js
│   ├── ClassSearchPage.jsx
│   ├── ClassSearchPage.css
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
