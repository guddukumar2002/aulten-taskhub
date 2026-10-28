# Employee Task Dashboard (TaskPulse)

A responsive full-stack web application that unifies and prioritizes tasks from multiple external systems (CRM and Helpdesk) into a single, clean employee dashboard.

Built with **React**, **Node.js/Express**, and **Tailwind CSS**.

---

## Features

- **Dual REST API Aggregation:** Fetches and harmonizes tasks from two mock REST APIs (CRM deals/leads and Helpdesk support tickets) via an Express backend gateway.
- **Intelligent Prioritization:** Calculates priority dynamically based on urgency level (Critical, High, Medium, Low) and deadline proximity (overdue escalation penalty, due today, due soon).
- **Multi-Dimensional Filters:** Filter tasks by assigned employee, status (Pending, In Progress, Resolved, Blocked), urgency, and source system, with real-time text search.
- **Clickable Source Links:** Every task includes direct links to view the item in its respective source application (CRM or Helpdesk).
- **Resilient Error Handling:** Includes graceful degradation and failover handling so that if one upstream service is unavailable, tasks from the remaining service continue to display alongside non-blocking user feedback and retry controls.
- **Multiple Views:** Switch between a responsive **Table View**, **Card Grid View**, and an **Eisenhower Priority Matrix**.

---

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Vite, Lucide Icons, Canvas Confetti
- **Backend:** Node.js, Express 4, Morgan, CORS
- **DevOps (Optional):** Docker, Docker Compose

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)

---

### Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd employee-task-dashboard
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start both Server & Client concurrently:**
   ```bash
   npm run dev
   ```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Manual Setup (Step-by-Step)

If you prefer running server and client in separate terminals:

**1. Start the Backend Server:**
```bash
cd server
npm install
npm run dev
# Server runs on port 5000
```

**2. Start the Frontend Client:**
```bash
cd client
npm install
npm run dev
# Frontend runs on port 3000
```

---

### Docker Deployment

To run containerized versions of the backend and frontend:

```bash
docker-compose up --build
```
Access the application at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and uptime |
| `GET` | `/api/tasks` | Unified aggregated tasks (supports `employeeId`, `status`, `source`, `urgency`, `search`, `sort`) |
| `PATCH` | `/api/tasks/:id/status` | Update task status (`pending`, `in_progress`, `completed`, `blocked`) |
| `GET` | `/api/crm/tasks` | Mock CRM REST API endpoint |
| `GET` | `/api/helpdesk/tickets` | Mock Helpdesk REST API endpoint |
| `GET` | `/api/employees` | List of employees across systems with task counts |
| `GET` | `/api/analytics` | High-level summary metrics (counts, completion rate) |

---

## Prioritization Logic

The priority score is calculated using:

$$\text{Priority Score} = \text{Urgency Weight} + \text{Deadline Proximity Boost} + \text{Status Factor}$$

- **Urgency Weights:** Critical (+100), High (+75), Medium (+45), Low (+20)
- **Deadline Proximity:**
  - Overdue tasks receive a +120 base boost plus an escalation factor based on overdue duration.
  - Imminent tasks (due within 6 hours) receive +90 points.
  - Tasks due today (within 24 hours) receive +60 points.
  - Tasks due within 3 days receive +35 points.
- **Status Factor:** Completed tasks receive a negative score (-1000) so active items remain at the top of the queue.

---

## License

MIT
