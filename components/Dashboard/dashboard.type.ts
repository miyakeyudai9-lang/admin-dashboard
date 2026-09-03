export type DashboardStat = {
  title: string;
  value: string;
};

export type RecentActivity = {
  id: number;
  text: string;
};

export const recentActivities: RecentActivity[] = [
  { id: 1, text: "Ram updated ABC Pvt Ltd details" },
  { id: 2, text: "Admin assigned XYZ Company to Hari" },
  { id: 3, text: "New client added by Sita" },
];
