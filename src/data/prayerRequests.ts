export interface PrayerRequest {
  id: string;
  member: string;
  request: string;
  isPublic: boolean;
  status: "pending" | "answered";
  date: string;
  category: string;
}

export const initialRequests: PrayerRequest[] = [
  { id: "PR-001", member: "John Adeyemi", request: "Praying for healing from a prolonged illness. Trusting God for complete restoration.", isPublic: true, status: "pending", date: "2024-01-14", category: "Healing" },
  { id: "PR-002", member: "Grace Okafor", request: "Seeking God's guidance for a new job opportunity abroad.", isPublic: true, status: "pending", date: "2024-01-13", category: "Guidance" },
  { id: "PR-003", member: "Samuel Eze", request: "Prayer for family unity and restoration of relationships.", isPublic: false, status: "pending", date: "2024-01-13", category: "Family" },
  { id: "PR-004", member: "Mary Johnson", request: "Praying for safe delivery of my baby next month.", isPublic: true, status: "answered", date: "2024-01-10", category: "Healing" },
  { id: "PR-005", member: "David Nwosu", request: "Financial breakthrough and debt cancellation.", isPublic: true, status: "pending", date: "2024-01-12", category: "Financial" },
  { id: "PR-006", member: "Esther Williams", request: "Prayers for my children's education and spiritual growth.", isPublic: false, status: "answered", date: "2024-01-08", category: "Family" },
  { id: "PR-007", member: "Peter Obi", request: "Seeking direction for ministry and leadership calling.", isPublic: true, status: "pending", date: "2024-01-11", category: "Guidance" },
  { id: "PR-008", member: "Ruth Balogun", request: "Praying for peace and comfort during a difficult season.", isPublic: true, status: "pending", date: "2024-01-09", category: "Comfort" },
];

export const categoryColors: Record<string, string> = {
  Healing: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Guidance: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Family: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Financial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Comfort: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};
