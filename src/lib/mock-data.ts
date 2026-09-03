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

export const categories = [
  "Compliance",
  "Leadership",
  "Product",
  "Technology",
  "Sales",
  "Wellbeing",
];
export const departments = ["All", "Underwriting", "Claims", "IT", "HR", "Sales"];
export const levels = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export const courses: Course[] = [
  {
    id: "c1",
    title: "POPIA & Data Protection Essentials",
    description:
      "A compliance primer covering personal information handling, consent, and breach response under South African law.",
    category: "Compliance",
    department: "All",
    level: "Beginner",
    format: "PDF",
    durationMin: 45,
    lessons: 6,
    cover: gradients[0],
    instructor: "TIH Learning Team",
    rating: 4.8,
    enrolled: 1240,
  },
  {
    id: "c2",
    title: "Claims Handling Fundamentals",
    description:
      "Core claims processes, documentation requirements, and customer communication best practices.",
    category: "Product",
    department: "Claims",
    level: "Beginner",
    format: "Video",
    durationMin: 90,
    lessons: 12,
    cover: gradients[1],
    instructor: "TIH Learning Team",
    rating: 4.6,
    enrolled: 890,
  },
  {
    id: "c3",
    title: "Leadership Essentials",
    description:
      "Build core leadership skills including delegation, coaching, and giving effective feedback.",
    category: "Leadership",
    department: "All",
    level: "Intermediate",
    format: "Video",
    durationMin: 120,
    lessons: 15,
    cover: gradients[2],
    instructor: "TIH Learning Team",
    rating: 4.9,
    enrolled: 560,
  },
  {
    id: "c4",
    title: "Cybersecurity Awareness",
    description:
      "Recognize phishing, secure passwords, and protect company data from cyber threats.",
    category: "Technology",
    department: "All",
    level: "Beginner",
    format: "PDF",
    durationMin: 30,
    lessons: 4,
    cover: gradients[3],
    instructor: "TIH Learning Team",
    rating: 4.7,
    enrolled: 1450,
  },
  {
    id: "c5",
    title: "Sales Techniques for Insurance",
    description:
      "Consultative selling, needs analysis, and objection handling specifically for insurance products.",
    category: "Sales",
    department: "Sales",
    level: "Intermediate",
    format: "Video",
    durationMin: 75,
    lessons: 10,
    cover: gradients[4],
    instructor: "TIH Learning Team",
    rating: 4.5,
    enrolled: 670,
  },
  {
    id: "c6",
    title: "Underwriting Principles",
    description:
      "Risk assessment, pricing fundamentals, and decision-making frameworks for underwriters.",
    category: "Product",
    department: "Underwriting",
    level: "Advanced",
    format: "Video",
    durationMin: 150,
    lessons: 20,
    cover: gradients[5],
    instructor: "TIH Learning Team",
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
    instructor: "TIH Learning Team",
    rating: 4.9,
    enrolled: 980,
  },
  {
    id: "c8",
    title: "Excel for Data Analysis",
    description:
      "Master pivot tables, VLOOKUP, and data visualization tools for business reporting.",
    category: "Technology",
    department: "All",
    level: "Intermediate",
    format: "PDF",
    durationMin: 60,
    lessons: 8,
    cover: gradients[7],
    instructor: "TIH Learning Team",
    rating: 4.6,
    enrolled: 750,
  },
];

export const employees: Employee[] = [];

export const learningPaths: LearningPath[] = [
  {
    id: "p1",
    title: "New Joiner Onboarding",
    description:
      "Essential courses for all new TIH employees covering compliance, systems, and culture.",
    courseIds: ["c1", "c4", "c7"],
    assignedTo: [],
    dueDate: "2026-08-15",
  },
  {
    id: "p2",
    title: "Claims Excellence Track",
    description: "Comprehensive claims handling training for claims specialists.",
    courseIds: ["c2", "c1", "c8"],
    assignedTo: [],
    dueDate: "2026-09-01",
  },
  {
    id: "p3",
    title: "Emerging Leaders Program",
    description: "Development pathway for high-potential individual contributors.",
    courseIds: ["c3", "c7", "c8"],
    assignedTo: [],
    dueDate: "2026-10-31",
  },
];

export const progress: Progress[] = [];

export const sessions: SessionLog[] = [];

export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getPath = (id: string) => learningPaths.find((p) => p.id === id);
export const getEmployee = (id: string) => employees.find((e) => e.id === id);

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
