// server/src/data/crmData.js
// Mock CRM REST API dataset for Aulten TaskHub

export const initialCrmTasks = [
  {
    id: "CRM-101",
    title: "Finalize Enterprise API Integration SLA with Reliance Retail",
    description: "Review and sign off on 99.95% uptime SLA, webhook retry policy, and payload rate limits for Bawana warehouse sync.",
    employeeId: "EMP-001",
    employeeName: "Guddu Kumar",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2026-10-28T21:00:00Z", // Due today in a few hours
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-101",
    createdAt: "2026-10-24T09:00:00Z",
    metadata: {
      customer: "Reliance Retail Ltd",
      dealValue: "₹24,50,000",
      stage: "Contract Negotiation"
    }
  },
  {
    id: "CRM-102",
    title: "Review Custom Webhook Specs for Havells Smart Hub Onboarding",
    description: "Client requires SHA-256 HMAC signature verification and bi-directional event callback for stabilizer units.",
    employeeId: "EMP-001",
    employeeName: "Guddu Kumar",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "High",
    status: "To Do",
    dueDate: "2026-10-27T17:00:00Z", // OVERDUE by 1 day!
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-102",
    createdAt: "2026-10-22T11:15:00Z",
    metadata: {
      customer: "Havells India Ltd",
      dealValue: "₹18,00,000",
      stage: "Technical Review"
    }
  },
  {
    id: "CRM-103",
    title: "AI-Powered Warranty Registration Flow Demo for Schneider",
    description: "Prepare and present automated OCR warranty invoice reader and ERP inventory sync module for Schneider team.",
    employeeId: "EMP-002",
    employeeName: "David Chen",
    employeeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "High",
    status: "To Do",
    dueDate: "2026-10-29T14:00:00Z", // Due tomorrow
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-103",
    createdAt: "2026-10-25T14:30:00Z",
    metadata: {
      customer: "Schneider Electric",
      dealValue: "₹32,00,000",
      stage: "Product Demonstration"
    }
  },
  {
    id: "CRM-104",
    title: "Follow up with Tata Power on Annual AMC Contract Renewal",
    description: "Present updated Q4 stability metrics, maintenance logs, and multi-tenant security certification.",
    employeeId: "EMP-003",
    employeeName: "Sarah Jenkins",
    employeeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-10-30T16:00:00Z",
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-104",
    createdAt: "2026-10-21T08:45:00Z",
    metadata: {
      customer: "Tata Power Renewable",
      dealValue: "₹12,80,000",
      stage: "Renewal Review"
    }
  },
  {
    id: "CRM-105",
    title: "Distributor Portal Onboarding Checklist Verification",
    description: "Verify KYC records, GSTIN compliance, and distributor merchant credentials across 18 regional hubs.",
    employeeId: "EMP-004",
    employeeName: "Priya Sharma",
    employeeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-10-26T12:00:00Z",
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-105",
    createdAt: "2026-10-18T10:00:00Z",
    metadata: {
      customer: "Bawana Industrial Guild",
      dealValue: "₹8,50,000",
      stage: "Closed Won"
    }
  },
  {
    id: "CRM-106",
    title: "Vendor Technical Dossier for Delhi Metro E&M Tender",
    description: "Collate architecture documentation, Docker deployment topologies, and disaster recovery SLA documentation.",
    employeeId: "EMP-001",
    employeeName: "Guddu Kumar",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-11-03T11:00:00Z",
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-106",
    createdAt: "2026-10-26T15:20:00Z",
    metadata: {
      customer: "DMRC Rail Logistics",
      dealValue: "₹45,00,000",
      stage: "Proposal Preparation"
    }
  },
  {
    id: "CRM-107",
    title: "ERP Inventory Sync Gateway Configuration for Adani Solar",
    description: "Map automated webhook payload fields to SAP ERP inventory tables for commercial stabilizers.",
    employeeId: "EMP-005",
    employeeName: "Alex Rivera",
    employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "High",
    status: "Blocked",
    dueDate: "2026-10-31T18:00:00Z",
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-107",
    createdAt: "2026-10-25T09:15:00Z",
    metadata: {
      customer: "Adani Green Energy",
      dealValue: "₹38,00,000",
      stage: "Blocked by SAP Firewall"
    }
  },
  {
    id: "CRM-108",
    title: "Quarterly Enterprise Lead Scoring Model Audit",
    description: "", // Intentionally empty description to test edge case
    employeeId: "EMP-003",
    employeeName: "Sarah Jenkins",
    employeeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    source: "CRM",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-10-25T15:00:00Z",
    sourceUrl: "https://crm.aultentaskhub.internal/deals/CRM-108",
    createdAt: "2026-10-15T12:00:00Z",
    metadata: {
      customer: "Internal Operations",
      dealValue: "N/A",
      stage: "Audit Complete"
    }
  }
];
