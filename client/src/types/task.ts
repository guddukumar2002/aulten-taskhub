// client/src/types/task.ts

export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Completed';
export type TaskSource = 'CRM' | 'Helpdesk';
export type PriorityTier = 'P1' | 'P2' | 'P3' | 'P4' | 'Done';
export type DeadlineStatus = 'overdue' | 'due_today' | 'due_24h' | 'due_3d' | 'due_7d' | 'upcoming' | 'none';

export interface Task {
  id: string;
  title: string;
  description?: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  source: TaskSource;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  sourceUrl: string;
  createdAt: string;
  metadata?: {
    customer?: string;
    dealValue?: string;
    stage?: string;
    requester?: string;
    category?: string;
    [key: string]: any;
  };
  // Dynamically evaluated fields
  priorityScore: number;
  priorityTier: PriorityTier;
  deadlineStatus: DeadlineStatus;
  timeRemainingFormatted: string;
  primaryReason: string;
  scoreBreakdown?: {
    priorityWeight: number;
    deadlineScore: number;
    statusScore: number;
    isOverdue: boolean;
  };
}

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  crmCount?: number;
  helpdeskCount?: number;
  totalAssigned?: number;
}

export interface ServiceHealth {
  crm: { healthy: boolean; error: string | null; count: number };
  helpdesk: { healthy: boolean; error: string | null; count: number };
}

export interface TaskAnalytics {
  total: number;
  overdue: number;
  dueToday: number;
  completed: number;
  activeTasks: number;
  inProgress: number;
  toDo: number;
  blocked: number;
  urgent: number;
  completionRate: number;
  sourceBreakdown: {
    crm: number;
    helpdesk: number;
  };
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  priorityDistribution: Array<{ name: string; count: number; color: string }>;
}

export interface TaskFilterParams {
  search?: string;
  employeeId?: string;
  status?: string;
  priority?: string;
  source?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
