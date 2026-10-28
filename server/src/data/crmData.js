// server/src/data/crmData.js
// Simulating an Enterprise CRM REST API (Zoho CRM / Salesforce)

export const initialCrmTasks = [
  {
    id: "CRM-2041",
    title: "Finalize Enterprise API Integration SLA with Reliance Retail",
    customerName: "Reliance Retail Ltd",
    dealValue: "₹24,50,000",
    assignedEmployee: {
      id: "EMP-001",
      name: "Guddu Kumar",
      email: "gk13212@gmail.com",
      role: "Lead Full Stack Engineer",
      department: "Engineering & Integration",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    urgency: "critical",
    status: "in_progress",
    dueDate: "2026-10-28T19:30:00Z", // Due today in a few hours
    createdAt: "2026-10-24T09:00:00Z",
    stage: "Contract Negotiation",
    notes: "Requires architect sign-off on 99.95% uptime SLA and webhook retry policy.",
    sourceSystem: "CRM (Zoho / Salesforce)",
    sourceAppUrl: "https://crm.aulten.internal/deals/CRM-2041",
    tags: ["Enterprise", "SLA", "High-Value"]
  },
  {
    id: "CRM-2042",
    title: "Review Custom Webhook Specs for Havells Smart Hub Onboarding",
    customerName: "Havells India Ltd",
    dealValue: "₹18,00,000",
    assignedEmployee: {
      id: "EMP-001",
      name: "Guddu Kumar",
      email: "gk13212@gmail.com",
      role: "Lead Full Stack Engineer",
      department: "Engineering & Integration",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    urgency: "high",
    status: "pending",
    dueDate: "2026-10-27T17:00:00Z", // OVERDUE by 1 day!
    createdAt: "2026-10-22T11:15:00Z",
    stage: "Technical Review",
    notes: "Client requires custom HMAC signature verification for bi-directional event sync.",
    sourceSystem: "CRM (Zoho / Salesforce)",
    sourceAppUrl: "https://crm.aulten.internal/deals/CRM-2042",
    tags: ["Webhooks", "Security", "Overdue"]
  },
  {
    id: "CRM-2043",
    title: "Client Demo: AI-Powered Warranty Registration Flow for Schneider",
    customerName: "Schneider Electric",
    dealValue: "₹32,00,000",
    assignedEmployee: {
      id: "EMP-002",
      name: "David Chen",
      email: "david.chen@aulten.com",
      role: "Enterprise Solutions Director",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    },
    urgency: "high",
    status: "pending",
    dueDate: "2026-10-29T14:00:00Z", // Tomorrow
    createdAt: "2026-10-25T14:30:00Z",
    stage: "Product Demonstration",
    notes: "Present automated OCR invoice reader and ERP inventory sync module.",
    sourceSystem: "CRM (Zoho / Salesforce)",
    sourceAppUrl: "https://crm.aulten.internal/deals/CRM-2043",
    tags: ["Demo", "AI", "Sales"]
  },
  {
    id: "CRM-2044",
    title: "Follow up with Tata Power on Annual AMC Contract Renewal",
    customerName: "Tata Power Renewable",
    dealValue: "₹12,80,000",
    assignedEmployee: {
      id: "EMP-003",
      name: "Sarah Jenkins",
      email: "sarah.j@aulten.com",
      role: "Senior Product Manager",
      department: "Product",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
    },
    urgency: "medium",
    status: "in_progress",
    dueDate: "2026-10-30T16:00:00Z",
    createdAt: "2026-10-21T08:45:00Z",
    stage: "Renewal",
    notes: "Send updated Q4 feature roadmap and multi-tenant security certification.",
    sourceSystem: "CRM (Zoho / Salesforce)",
    sourceAppUrl: "https://crm.aulten.internal/deals/CRM-2044",
    tags: ["Renewal", "Q4"]
  },
  {
    id: "CRM-2045",
    title: "Distributor Portal Onboarding Checklist Verification",
    customerName: "Bawana Industrial Distributors Guild",
    dealValue: "₹8,50,000",
    assignedEmployee: {
      id: "EMP-004",
      name: "Priya Sharma",
      email: "priya.s@aulten.com",
      role: "Customer Success Lead",
      department: "Customer Operations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
    },
    urgency: "low",
    status: "completed",
    dueDate: "2026-10-26T12:00:00Z",
    createdAt: "2026-10-18T10:00:00Z",
    stage: "Closed Won",
    notes: "All 18 distributors provided KYC documents and merchant credentials.",
    sourceSystem: "CRM (Zoho / Salesforce)",
    sourceAppUrl: "https://crm.aulten.internal/deals/CRM-2045",
    tags: ["Distributor", "Onboarding"]
  },
  {
    id: "CRM-2046",
    title: "Prepare Vendor Evaluation Dossier for Delhi Metro E&M Tender",
    customerName: "DMRC Rail Logistics",
    dealValue: "₹45,00,000",
    assignedEmployee: {
      id: "EMP-001",
      name: "Guddu Kumar",
      email: "gk13212@gmail.com",
      role: "Lead Full Stack Engineer",
      department: "Engineering & Integration",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    urgency: "medium",
    status: "pending",
    dueDate: "2026-11-03T11:00:00Z",
    createdAt: "2026-10-26T15:20:00Z",
    stage: "Proposal Preparation",
    notes: "Collate architecture documentation, Docker deployment topologies, and disaster recovery plan.",
    sourceSystem: "CRM (Zoho / Salesforce)",
    sourceAppUrl: "https://crm.aulten.internal/deals/CRM-2046",
    tags: ["Tender", "Government", "Architecture"]
  }
];
