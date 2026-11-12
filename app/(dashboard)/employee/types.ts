export interface EmployeeTaskItem {
  id: string
  agency_id: string | null
  brand_id: string
  brand_name: string
  assignee_id: string | null
  assignee_name?: string | null
  template_id: string | null
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'x' | 'youtube'
  content: 'reels' | 'post' | 'story' | 'shorts' | 'tweet' | 'carousel'
  due_date: string
  status: 'unassigned' | 'assigned' | 'pending_approval' | 'revision_requested' | 'completed'
  content_url: string | null
  assignment_note: string | null
  is_active: boolean
  created_at: string
  comments_count: number
  revisions_count: number
  comments: {
    id: string
    comment_text: string
    created_at: string
    author_name: string
    author_role: string
  }[]
  revisions: {
    id: string
    previous_url: string
    customer_note: string
    created_at: string
  }[]
}

export interface EmployeeDashboardMetrics {
  inProgressCount: number
  revisionsCount: number
  pendingApprovalCount: number
  completedCount: number
  poolCount: number
  overdueCount: number
  dueTodayCount: number
  completionPercentage: number
}

export interface BrandFilterOption {
  id: string
  name: string
}
