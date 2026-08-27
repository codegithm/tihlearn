export type Role = "employee" | "manager";

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "PDF" | "Video" | "Quiz";
  durationMin: number;
  lessons: number;
  cover: string;
  instructor: string;
  rating: number;
  enrolled: number;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
  assignedTo: string[];
  dueDate: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarColor: string;
  managerId: string | null;
  upn: string;
  adGroups: string[];
};

export type Progress = {
  courseId: string;
  employeeId: string;
  percent: number;
  timeSpentMin: number;
  quizScore: number | null;
  status: "not_started" | "in_progress" | "completed";
  lastActive: string;
};

export type SessionLog = {
  id: string;
  employeeId: string;
  courseTitle: string;
  start: string;
  end: string;
  durationMin: number;
  activity: string;
};

const gradients = [
  "from-orange-500 to-amber-600",
  "from-slate-800 to-slate-950",
  "from-orange-400 to-rose-500",
  "from-emerald-600 to-teal-800",
  "from-indigo-700 to-slate-900",
  "from-amber-500 to-orange-700",
  "from-fuchsia-600 to-indigo-800",
  "from-sky-600 to-slate-900",
];

export const categories = ["Compliance", "Leadership", "Product", "Technology", "Sales", "Wellbeing"];
export const departments = ["All", "Underwriting", "Claims", "IT", "HR", "Sales"];
export const levels = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export const CURRENT_EMPLOYEE_ID = "emp-001";

export const courses: Course[] = [
  {
    id: "c1",
    title: "POPIA & Data Protection Essentials",
    description: "A compliance primer covering personal information handling, consent, and breach response under South African law.",
    category: "Compliance",
    department: "All",
    level: "Beginner",
    format: "PDF",
    durationMin: 45,
    lessons: 6,
    cover: gradients[0],
    instructor: "Nomsa Dlamini",
    rating: 4.8,
    enrolled: 1240,
  },
  {
    id: "c2",
    title: "Claims Handling Fundamentals",
    description: "Core claims processes, documentation requirements, and customer communication best practices.",
    category: "Product",
    department: "Claims",
    level: "Beginner",
    format: "Video",
    durationMin: 90,
    lessons: 12,
    cover: gradients[1],
    instructor: "Thabo Mthembu",
    rating: 4.6,
    enrolled: 890,
  },
  {
    id: "c3",
    title: "Leadership Essentials",
    description: "Build core leadership skills including delegation, coaching, and giving effective feedback.",
    category: "Leadership",
    department: "All",
    level: "Intermediate",
    format: "Video",
    durationMin: 120,
    lessons: 15,
    cover: gradients[2],
    instructor: "Emily Rodriguez",
    rating: 4.9,
    enrolled: 560,
  },
  {
    id: "c4",
    title: "Cybersecurity Awareness",
    description: "Recognize phishing, secure passwords, and protect company data from cyber threats.",
    category: "Technology",
    department: "All",
    level: "Beginner",
    format: "PDF",
    durationMin: 30,
    lessons: 4,
    cover: gradients[3],
    instructor: "Sipho Khumalo",
    rating: 4.7,
    enrolled: 1450,
  },
  {
    id: "c5",
    title: "Sales Techniques for Insurance",
    description: "Consultative selling, needs analysis, and objection handling specifically for insurance products.",
    category: "Sales",
    department: "Sales",
    level: "Intermediate",
    format: "Video",
    durationMin: 75,
    lessons: 10,
    cover: gradients[4],
    instructor: "Lerato Ndlovu",
    rating: 4.5,
    enrolled: 670,
  },
  {
    id: "c6",
    title: "Underwriting Principles",
    description: "Risk assessment, pricing fundamentals, and decision-making frameworks for underwriters.",
    category: "Product",
    department: "Underwriting",
    level: "Advanced",
    format: "Video",
    durationMin: 150,
    lessons: 20,
    cover: gradients[5],
    instructor: "Michael Chen",
    rating: 4.8,
    enrolled: 420,
  },
  {
    id: "c7",
    title: "Stress Management & Resilience",
    description: "Practical strategies to manage workplace stress and build personal resilience.",
    category: "Wellbeing",
    department: "All",
    level: "Beginner",
    format: "Video",
    durationMin: 45,
    lessons: 6,
    cover: gradients[6],
    instructor: "Dr. Fatima Hassan",
    rating: 4.9,
    enrolled: 980,
  },
  {
    id: "c8",
    title: "Excel for Data Analysis",
    description: "Master pivot tables, VLOOKUP, and data visualization tools for business reporting.",
    category: "Technology",
    department: "All",
    level: "Intermediate",
    format: "PDF",
    durationMin: 60,
    lessons: 8,
    cover: gradients[7],
    instructor: "Sarah Johnson",
    rating: 4.6,
    enrolled: 750,
  },
];

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@tihinsurance.com",
    role: "Claims Specialist",
    department: "Claims",
    avatarColor: "bg-blue-500",
    managerId: "mgr-001",
    upn: "sarah.johnson@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-Claims"],
  },
  {
    id: "emp-002",
    name: "Michael Chen",
    email: "michael.chen@tihinsurance.com",
    role: "Senior Underwriter",
    department: "Underwriting",
    avatarColor: "bg-green-500",
    managerId: "mgr-001",
    upn: "michael.chen@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-Underwriting"],
  },
  {
    id: "emp-003",
    name: "Lerato Ndlovu",
    email: "lerato.ndlovu@tihinsurance.com",
    role: "Sales Associate",
    department: "Sales",
    avatarColor: "bg-purple-500",
    managerId: "mgr-001",
    upn: "lerato.ndlovu@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-Sales"],
  },
  {
    id: "emp-004",
    name: "Thabo Mthembu",
    email: "thabo.mthembu@tihinsurance.com",
    role: "IT Support Specialist",
    department: "IT",
    avatarColor: "bg-red-500",
    managerId: "mgr-002",
    upn: "thabo.mthembu@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-IT"],
  },
  {
    id: "emp-005",
    name: "Nomsa Dlamini",
    email: "nomsa.dlamini@tihinsurance.com",
    role: "Compliance Officer",
    department: "HR",
    avatarColor: "bg-yellow-500",
    managerId: "mgr-002",
    upn: "nomsa.dlamini@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-HR"],
  },
  {
    id: "emp-006",
    name: "Sipho Khumalo",
    email: "sipho.khumalo@tihinsurance.com",
    role: "Junior Claims Handler",
    department: "Claims",
    avatarColor: "bg-pink-500",
    managerId: "mgr-001",
    upn: "sipho.khumalo@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-Claims"],
  },
  {
    id: "mgr-001",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@tihinsurance.com",
    role: "Claims Manager",
    department: "Claims",
    avatarColor: "bg-indigo-500",
    managerId: null,
    upn: "emily.rodriguez@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-Claims", "TIH-People-Managers"],
  },
  {
    id: "mgr-002",
    name: "David Williams",
    email: "david.williams@tihinsurance.com",
    role: "HR Director",
    department: "HR",
    avatarColor: "bg-teal-500",
    managerId: null,
    upn: "david.williams@tihinsurance.com",
    adGroups: ["TIH-All-Staff", "TIH-HR", "TIH-People-Managers"],
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: "p1",
    title: "New Joiner Onboarding",
    description: "Essential courses for all new TIH employees covering compliance, systems, and culture.",
    courseIds: ["c1", "c4", "c7"],
    assignedTo: ["emp-006"],
    dueDate: "2026-08-15",
  },
  {
    id: "p2",
    title: "Claims Excellence Track",
    description: "Comprehensive claims handling training for claims specialists.",
    courseIds: ["c2", "c1", "c8"],
    assignedTo: ["emp-001", "emp-006"],
    dueDate: "2026-09-01",
  },
  {
    id: "p3",
    title: "Emerging Leaders Program",
    description: "Development pathway for high-potential individual contributors.",
    courseIds: ["c3", "c7", "c8"],
    assignedTo: ["emp-002", "emp-003"],
    dueDate: "2026-10-31",
  },
];

export const progress: Progress[] = [
  { courseId: "c1", employeeId: "emp-001", percent: 100, timeSpentMin: 45, quizScore: 92, status: "completed", lastActive: "2026-07-20" },
  { courseId: "c2", employeeId: "emp-001", percent: 67, timeSpentMin: 60, quizScore: null, status: "in_progress", lastActive: "2026-07-28" },
  { courseId: "c8", employeeId: "emp-001", percent: 0, timeSpentMin: 0, quizScore: null, status: "not_started", lastActive: "2026-07-15" },
  { courseId: "c3", employeeId: "emp-002", percent: 45, timeSpentMin: 54, quizScore: null, status: "in_progress", lastActive: "2026-07-27" },
  { courseId: "c7", employeeId: "emp-002", percent: 100, timeSpentMin: 45, quizScore: null, status: "completed", lastActive: "2026-07-18" },
  { courseId: "c8", employeeId: "emp-002", percent: 30, timeSpentMin: 18, quizScore: null, status: "in_progress", lastActive: "2026-07-26" },
  { courseId: "c3", employeeId: "emp-003", percent: 15, timeSpentMin: 18, quizScore: null, status: "in_progress", lastActive: "2026-07-25" },
  { courseId: "c7", employeeId: "emp-003", percent: 0, timeSpentMin: 0, quizScore: null, status: "not_started", lastActive: "2026-07-10" },
  { courseId: "c8", employeeId: "emp-003", percent: 0, timeSpentMin: 0, quizScore: null, status: "not_started", lastActive: "2026-07-10" },
  { courseId: "c1", employeeId: "emp-006", percent: 100, timeSpentMin: 48, quizScore: 88, status: "completed", lastActive: "2026-07-22" },
  { courseId: "c4", employeeId: "emp-006", percent: 100, timeSpentMin: 32, quizScore: 95, status: "completed", lastActive: "2026-07-24" },
  { courseId: "c7", employeeId: "emp-006", percent: 60, timeSpentMin: 27, quizScore: null, status: "in_progress", lastActive: "2026-07-29" },
  { courseId: "c2", employeeId: "emp-006", percent: 25, timeSpentMin: 23, quizScore: null, status: "in_progress", lastActive: "2026-07-28" },
];

export const sessions: SessionLog[] = [
  { id: "s1", employeeId: "emp-001", courseTitle: "Claims Handling Fundamentals", start: "2026-07-28 09:15", end: "2026-07-28 10:05", durationMin: 50, activity: "Watched module 3" },
  { id: "s2", employeeId: "emp-002", courseTitle: "Leadership Essentials", start: "2026-07-27 14:00", end: "2026-07-27 14:45", durationMin: 45, activity: "Completed lesson 7" },
  { id: "s3", employeeId: "emp-002", courseTitle: "Excel for Data Analysis", start: "2026-07-26 11:30", end: "2026-07-26 12:00", durationMin: 30, activity: "Reviewed pivot tables" },
  { id: "s4", employeeId: "emp-003", courseTitle: "Leadership Essentials", start: "2026-07-25 16:20", end: "2026-07-25 17:00", durationMin: 40, activity: "Started module 2" },
  { id: "s5", employeeId: "emp-006", courseTitle: "Stress Management & Resilience", start: "2026-07-29 10:00", end: "2026-07-29 10:35", durationMin: 35, activity: "Watched breathing exercises video" },
  { id: "s6", employeeId: "emp-006", courseTitle: "Claims Handling Fundamentals", start: "2026-07-28 15:00", end: "2026-07-28 15:30", durationMin: 30, activity: "Started introduction module" },
  { id: "s7", employeeId: "emp-006", courseTitle: "Claims Handling Fundamentals", start: "2026-07-24 13:30", end: "2026-07-24 14:19", durationMin: 49, activity: "Reviewed case-study PDF" },
];

export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getPath = (id: string) => learningPaths.find((p) => p.id === id);
export const getEmployee = (id: string) => employees.find((e) => e.id === id);

export const directReportsOf = (managerId: string) =>
  employees.filter((e) => e.managerId === managerId);

export const isManagerUser = (id: string) => {
  const e = getEmployee(id);
  if (!e) return false;
  return directReportsOf(id).length > 0 || e.adGroups.includes("TIH-People-Managers");
};

export const progressFor = (employeeId: string, courseId: string) =>
  progress.find((p) => p.employeeId === employeeId && p.courseId === courseId);

export const assignedPathsFor = (employeeId: string) =>
  learningPaths.filter((p) => p.assignedTo.includes(employeeId));

export const employeeStats = (employeeId: string) => {
  const paths = assignedPathsFor(employeeId);
  const courseIds = Array.from(new Set(paths.flatMap((p) => p.courseIds)));
  const rows = courseIds.map((id) => progressFor(employeeId, id));
  const completed = rows.filter((r) => r?.status === "completed").length;
  const inProgress = rows.filter((r) => r?.status === "in_progress").length;
  const totalMin = rows.reduce((s, r) => s + (r?.timeSpentMin ?? 0), 0);
  return {
    coursesAssigned: courseIds.length,
    completed,
    inProgress,
    completionPct: courseIds.length === 0 ? 0 : Math.round((completed / courseIds.length) * 100),
    timeSpentMin: totalMin,
    pathCount: paths.length,
  };
};
