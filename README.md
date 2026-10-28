# Aulten TaskHub — Enterprise Employee Task Dashboard

A production-grade, full-stack Employee Task Dashboard built for enterprise CRM and Helpdesk environments. Aulten TaskHub unifies disparate task pipelines into a single, high-performance operational interface featuring deterministic deadline scoring, partial-failure resilience via `Promise.allSettled`, and direct source deep-linking.

---

## Key Highlights

- **Linear / Stripe-Inspired Design System:** Clean, modern light theme (`#f8fafc` background, crisp slate typography, subtle borders, restrained shadows).
- **Dual REST API Aggregation:** Concurrently integrates CRM and Helpdesk feeds through an Express API gateway with shared task contracts.
- **Deterministic Prioritization Engine:** Transparent mathematical scoring based on deadline proximity, urgency severity, and workflow state.
- **Fault-Tolerant Resilience:** Built with non-blocking concurrent fetching (`Promise.allSettled`). If CRM or Helpdesk goes offline, the other service continues functioning with an informative warning banner.
- **Executive Visualizations:** Interactive Recharts Donut (Status Distribution) and Bar Chart (Priority Volume).
- **Interactive Multi-Filtering:** Search across titles/descriptions/IDs, filter by employee, status, priority, or source system with instant sorting.
- **Slide-Out Inspection Drawer:** Keyboard-accessible (`Esc`) drawer showing complete metadata, score breakdowns, and one-click status transitions.
- **Deep-Linking to Source Portals:** Every task features secure external links (`target="_blank" rel="noopener noreferrer"`) directly into the CRM deal or Helpdesk ticket portal.
- **100% Responsive Layout:** Seamlessly transitions from desktop table view with pagination into a stacked mobile card view on smaller viewports.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Recharts, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express 4, Morgan, CORS, Dotenv |
| **Testing** | Vitest (unit tests for prioritization engine & API resilience) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## Prioritization Engine Scoring Formula

The dashboard implements deterministic scoring:

$$\text{Priority Score} = \text{Priority Weight} + \text{Deadline Proximity Score} + \text{Status Modifier}$$

### Scoring Matrix

| Rule / Trigger | Points | Category | Business Rationale |
| :--- | :--- | :--- | :--- |
| **Overdue active task** | **+100 pts** | Deadline Proximity | Prevents SLA and contract breaches |
| **Due today (calendar today)** | **+70 pts** | Deadline Proximity | Target deliverables for end-of-day |
| **Due within 24 hours** | **+60 pts** | Deadline Proximity | Imminent deadline escalation |
| **Due within 3 days** | **+40 pts** | Deadline Proximity | Short-range sprint priorities |
| **Due within 7 days** | **+20 pts** | Deadline Proximity | Weekly operational horizon |
| **Urgent priority flag** | **+50 pts** | Severity | System outages, VIP customer escalations |
| **High priority flag** | **+30 pts** | Severity | Substantial commercial or client impact |
| **Medium priority flag** | **+15 pts** | Severity | Standard sprint deliverable |
| **Low priority flag** | **+5 pts** | Severity | Non-critical administrative action |
| **Blocked status modifier** | **+10 pts** | Bottleneck | Highlights bottleneck needing supervisor unblocking |
| **Completed status modifier** | **-1000 pts** | Resolution | Archives resolved items to bottom of list |

### Priority Tiers

- **P1 (Score ≥ 120):** Critical urgency (Overdue or Urgent Due Today).
- **P2 (Score 70 – 119):** High urgency (Due Today or Urgent within 3 days).
- **P3 (Score 35 – 69):** Medium priority (Due within week or High Priority).
- **P4 (Score < 35):** Standard backlog.
- **Done:** Archived resolved tasks.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Gateway health check, uptime, and system status |
| `GET` | `/api/crm/tasks` | Mock CRM REST endpoint (deals, pipeline renewals) |
| `GET` | `/api/helpdesk/tasks` | Mock Helpdesk REST endpoint (tickets, system incidents) |
| `GET` | `/api/tasks` | Unified aggregated tasks with server-side sorting/filtering |
| `PATCH` | `/api/tasks/:id/status` | Update task lifecycle (`To Do`, `In Progress`, `Blocked`, `Completed`) |
| `GET` | `/api/employees` | List of employees across systems with task allocation metrics |
| `GET` | `/api/analytics` | High-level KPI aggregations and distribution data for charts |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Installation & Local Run

1. **Install dependencies:**
   ```bash
   # In root directory
   npm run install:all
   ```

2. **Start both backend & frontend concurrently:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **Backend API Gateway:** [http://localhost:5000](http://localhost:5000)
   - **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Running Unit Tests

Unit tests are written with **Vitest** covering the prioritization rules and API failover resilience:

```bash
cd client
npm test
```

Expected output:
```
 ✓ src/tests/prioritizer.test.ts (6 tests)
 ✓ src/tests/api.test.ts (4 tests)

 Test Files  2 passed (2)
      Tests  10 passed (10)
```

---

## Fault Injection & Resilience Testing

The dashboard allows verifying fault tolerance directly from the **Integrations** tab in the sidebar or via query parameters:

- `?simulate_error=crm`: Forces CRM gateway to return HTTP 503. The dashboard continues running with Helpdesk tasks and displays an amber degradation banner.
- `?simulate_error=helpdesk`: Forces Helpdesk gateway to return HTTP 503. The dashboard continues running with CRM tasks.
- `?simulate_error=both`: Forces total outage, displaying a clean recovery alert with a retry action.

---

## Docker Deployment

To build and run containerized instances:

```bash
docker-compose up --build
```

Access the dashboard at `http://localhost:3000`.

---

## License

MIT © Aulten Digital Private Limited
