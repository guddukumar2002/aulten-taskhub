// server/src/data/helpdeskData.js
// Mock Helpdesk REST API dataset for Aulten TaskHub

export const initialHelpdeskTasks = [
  {
    id: "HD-201",
    title: "Production Voltage Telemetry Ingestion Worker Dropping Packets",
    description: "Redis pub/sub queue buffer overflowing under heavy peak load from Bawana factory IoT smart stabilizers.",
    employeeId: "EMP-001",
    employeeName: "Guddu Kumar",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "Urgent",
    status: "To Do",
    dueDate: "2026-10-28T19:30:00Z", // Due today in a couple of hours
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-201",
    createdAt: "2026-10-28T12:15:00Z",
    metadata: {
      requester: "Industrial IoT Operations",
      category: "Production Incident"
    }
  },
  {
    id: "HD-202",
    title: "Payment Gateway Webhook Signature Mismatch on Order Renewals",
    description: "Customers reporting successful Razorpay debit but subscription state remains pending. Webhook secret rotation required.",
    employeeId: "EMP-001",
    employeeName: "Guddu Kumar",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2026-10-27T20:00:00Z", // OVERDUE by ~1 day!
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-202",
    createdAt: "2026-10-27T08:30:00Z",
    metadata: {
      requester: "Billing & Finance Operations",
      category: "Payment Gateway"
    }
  },
  {
    id: "HD-203",
    title: "AWS CloudWatch Alarm: High CPU Utilization on PostgreSQL Read Replica",
    description: "Unindexed analytical query on order_events table causing read connection pool saturation above 85% CPU.",
    employeeId: "EMP-005",
    employeeName: "Alex Rivera",
    employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-10-29T10:00:00Z",
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-203",
    createdAt: "2026-10-28T09:00:00Z",
    metadata: {
      requester: "DevOps Automated Alert",
      category: "Infrastructure"
    }
  },
  {
    id: "HD-204",
    title: "OAuth Token Refresh Expiration Issue in Mobile App v2.4",
    description: "JWT refresh token rotation fails silently when application wakes from background hibernation on Android 14.",
    employeeId: "EMP-001",
    employeeName: "Guddu Kumar",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-10-31T17:00:00Z",
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-204",
    createdAt: "2026-10-26T16:00:00Z",
    metadata: {
      requester: "Mobile QA Lead",
      category: "Authentication"
    }
  },
  {
    id: "HD-205",
    title: "Dealer Warranty Claim Rejected Erroneously by Auto-Rule #14",
    description: "Authorized distributor proof-of-purchase receipt failed automated OCR boundary check. Manual validation override required.",
    employeeId: "EMP-004",
    employeeName: "Priya Sharma",
    employeeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "Medium",
    status: "Blocked",
    dueDate: "2026-11-01T15:00:00Z",
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-205",
    createdAt: "2026-10-25T11:40:00Z",
    metadata: {
      requester: "Surya Prakash (Dealer)",
      category: "Warranty & RMA"
    }
  },
  {
    id: "HD-206",
    title: "Setup Automated Staging Deployment Workflow via GitHub Actions",
    description: "Docker multi-stage builds and automated integration tests now run on every pull request to staging branch.",
    employeeId: "EMP-005",
    employeeName: "Alex Rivera",
    employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-10-25T18:00:00Z",
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-206",
    createdAt: "2026-10-20T10:00:00Z",
    metadata: {
      requester: "Engineering Operations",
      category: "DevOps"
    }
  },
  {
    id: "HD-207",
    title: "Distributor B2B Portal Session Timeout Threshold Increase",
    description: "", // Missing description edge case
    employeeId: "EMP-004",
    employeeName: "Priya Sharma",
    employeeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "Low",
    status: "To Do",
    dueDate: "2026-11-05T12:00:00Z",
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-207",
    createdAt: "2026-10-27T14:00:00Z",
    metadata: {
      requester: "Customer Support Desk",
      category: "Portal Configuration"
    }
  },
  {
    id: "HD-208",
    title: "Factory Edge Gateway TLS Certificate Rotation Due Soon",
    description: "Production mTLS certificate expiring in 48 hours for Bawana unit 2 telemetry bridge.",
    employeeId: "EMP-005",
    employeeName: "Alex Rivera",
    employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    source: "Helpdesk",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-10-30T10:00:00Z",
    sourceUrl: "https://helpdesk.aultentaskhub.internal/tickets/HD-208",
    createdAt: "2026-10-28T08:00:00Z",
    metadata: {
      requester: "Security Operations",
      category: "Certificate Management"
    }
  }
];
