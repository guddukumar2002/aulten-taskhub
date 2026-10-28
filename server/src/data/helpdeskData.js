// server/src/data/helpdeskData.js
// Simulating an Enterprise Helpdesk REST API (Zendesk / Jira Service Desk / Freshdesk)

export const initialHelpdeskTickets = [
  {
    ticketId: "HD-8810",
    subject: "Production Voltage Telemetry Ingestion Worker dropping packets",
    requester: "Aulten Industrial IOT Fleet Ops",
    severity: "critical",
    ticketStatus: "open",
    assignee: {
      empId: "EMP-001",
      fullName: "Guddu Kumar",
      email: "gk13212@gmail.com",
      role: "Lead Full Stack Engineer",
      department: "Engineering & Integration",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    resolutionDeadline: "2026-10-28T18:00:00Z", // Due in ~2 hours!
    createdTimestamp: "2026-10-28T12:15:00Z",
    category: "Production Incident",
    description: "Redis pub/sub queue buffer overflowing under heavy peak load from Bawana factory smart stabilizers.",
    supportPlatform: "Helpdesk (Zendesk / Jira)",
    ticketDeepLink: "https://helpdesk.aulten.internal/tickets/HD-8810",
    tags: ["P0 Incident", "IoT", "Redis", "Bawana Unit"]
  },
  {
    ticketId: "HD-8811",
    subject: "Razorpay Payment Gateway Webhook signature mismatch on order renewals",
    requester: "Billing & Finance Operations",
    severity: "critical",
    ticketStatus: "investigating",
    assignee: {
      empId: "EMP-001",
      fullName: "Guddu Kumar",
      email: "gk13212@gmail.com",
      role: "Lead Full Stack Engineer",
      department: "Engineering & Integration",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    resolutionDeadline: "2026-10-27T20:00:00Z", // OVERDUE by nearly a day!
    createdTimestamp: "2026-10-27T08:30:00Z",
    category: "Payment Gateway",
    description: "Customers reporting successful deductions but subscription status stays pending. Webhook secret key rotation required.",
    supportPlatform: "Helpdesk (Zendesk / Jira)",
    ticketDeepLink: "https://helpdesk.aulten.internal/tickets/HD-8811",
    tags: ["Payments", "Finance", "Urgent", "Overdue"]
  },
  {
    ticketId: "HD-8812",
    subject: "AWS CloudWatch Alarm: High CPU Utilization on PostgreSQL Read Replica",
    requester: "DevOps Automated Alert",
    severity: "high",
    ticketStatus: "investigating",
    assignee: {
      empId: "EMP-005",
      fullName: "Alex Rivera",
      email: "alex.r@aulten.com",
      role: "DevOps & Cloud Architect",
      department: "Infrastructure",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
    },
    resolutionDeadline: "2026-10-29T10:00:00Z",
    createdTimestamp: "2026-10-28T09:00:00Z",
    category: "Infrastructure",
    description: "Unindexed analytical query on order_events table causing query queue spikes above 85% CPU.",
    supportPlatform: "Helpdesk (Zendesk / Jira)",
    ticketDeepLink: "https://helpdesk.aulten.internal/tickets/HD-8812",
    tags: ["Database", "AWS", "Performance"]
  },
  {
    ticketId: "HD-8813",
    subject: "OAuth Token Expiration handling issue in Mobile App v2.4",
    requester: "Mobile QA Team",
    severity: "medium",
    ticketStatus: "open",
    assignee: {
      empId: "EMP-001",
      fullName: "Guddu Kumar",
      email: "gk13212@gmail.com",
      role: "Lead Full Stack Engineer",
      department: "Engineering & Integration",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    resolutionDeadline: "2026-10-31T17:00:00Z",
    createdTimestamp: "2026-10-26T16:00:00Z",
    category: "Authentication",
    description: "JWT refresh token rotation fails silently when app wakes up from background hibernation on Android 14.",
    supportPlatform: "Helpdesk (Zendesk / Jira)",
    ticketDeepLink: "https://helpdesk.aulten.internal/tickets/HD-8813",
    tags: ["JWT", "OAuth", "Mobile"]
  },
  {
    ticketId: "HD-8814",
    subject: "Customer Escalation: Warranty claim rejected erroneously by auto-rules",
    requester: "Surya Prakash (Enterprise Dealer)",
    severity: "medium",
    ticketStatus: "waiting_customer",
    assignee: {
      empId: "EMP-004",
      fullName: "Priya Sharma",
      email: "priya.s@aulten.com",
      role: "Customer Success Lead",
      department: "Customer Operations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
    },
    resolutionDeadline: "2026-11-01T15:00:00Z",
    createdTimestamp: "2026-10-25T11:40:00Z",
    category: "Warranty & RMA",
    description: "Dealer provided proof of purchase from authorized distributor. Need manual validation override.",
    supportPlatform: "Helpdesk (Zendesk / Jira)",
    ticketDeepLink: "https://helpdesk.aulten.internal/tickets/HD-8814",
    tags: ["Escalation", "Warranty"]
  },
  {
    ticketId: "HD-8815",
    subject: "Setup CI/CD Automated Staging Deployment Pipeline on GitHub Actions",
    requester: "Engineering Leadership",
    severity: "low",
    ticketStatus: "resolved",
    assignee: {
      empId: "EMP-005",
      fullName: "Alex Rivera",
      email: "alex.r@aulten.com",
      role: "DevOps & Cloud Architect",
      department: "Infrastructure",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
    },
    resolutionDeadline: "2026-10-25T18:00:00Z",
    createdTimestamp: "2026-10-20T10:00:00Z",
    category: "DevOps",
    description: "Docker multi-stage builds and automated unit tests now run on every pull request to staging branch.",
    supportPlatform: "Helpdesk (Zendesk / Jira)",
    ticketDeepLink: "https://helpdesk.aulten.internal/tickets/HD-8815",
    tags: ["Docker", "CI/CD", "GitHub Actions"]
  }
];
