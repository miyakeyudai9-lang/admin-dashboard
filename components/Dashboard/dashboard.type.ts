export type DashboardStat = {
  title: string;
  value: string;
};

export type RecentActivity = {
  id: number;
  text: string;
};

export const dashboardStats: DashboardStat[] = [
  { title: "Total Staff", value: "10" },
  { title: "Total Clients", value: "250" },
  { title: "Active Projects", value: "75" },
];

export const recentActivities: RecentActivity[] = [
  { id: 1, text: "Ram updated ABC Pvt Ltd details" },
  { id: 2, text: "Admin assigned XYZ Company to Hari" },
  { id: 3, text: "New client added by Sita" },
];
