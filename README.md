# Early-Reporting

A React + Redux Toolkit reporting dashboard that provides KPIs, charts, and tabular/virtualized reports with filtering by date, user, and activity.  
Built with **React, TypeScript, Redux Toolkit, RTK Query, Ant Design, and Ant Design Plots**.

## Features

- **Filters**: Date range, users, and activities with virtualized multi-selects.
- **KPIs Summary**: Total hours, entries, and distinct users at a glance.
- **Charts**:
  - Group by activity or user (bar + pie charts).
  - Daily stacked activity chart with scrollable timeline.
- **Reports**:
  - Standard Ant Design table with pagination.
  - Virtualized infinite scroll list for large datasets.
- **Performance Optimizations**: Virtual list rendering, memoized selectors, and chart data transformations.

## Preview

- (Optional: Add a deployed link if available, e.g. Vercel/Netlify preview)

## Getting Started

### Prerequisites

- Node.js (>= 16)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/early-reporting.git
   cd early-reporting

   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

## ⏳ Anything I Would Do Differently With More Time

- **Testing & QA** – Add unit, integration, and end-to-end tests for reliability.
- **UI/UX** – Better accessibility and layouts.
- **Deployment** – Add GitHub Actions for CI/CD automation.
