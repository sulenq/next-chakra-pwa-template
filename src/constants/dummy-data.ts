import { Gender } from "@/types/global.types";

const generate1D = () => {
  let v23 = 80;
  let v24 = 90;
  let v25 = 100;

  return Array.from({ length: 366 }, (_, i) => {
    v23 += Math.floor(Math.random() * 7 - 3);
    v24 += Math.floor(Math.random() * 7 - 3);
    v25 += Math.floor(Math.random() * 7 - 3);

    v23 = Math.max(20, Math.min(160, v23));
    v24 = Math.max(20, Math.min(160, v24));
    v25 = Math.max(20, Math.min(160, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      day: i + 1,
    };
  });
};
const generate1W = () => {
  let v23 = 90;
  let v24 = 100;
  let v25 = 110;

  return Array.from({ length: 52 }, (_, i) => {
    v23 += Math.floor(Math.random() * 9 - 4);
    v24 += Math.floor(Math.random() * 9 - 4);
    v25 += Math.floor(Math.random() * 9 - 4);

    v23 = Math.max(30, Math.min(180, v23));
    v24 = Math.max(30, Math.min(180, v24));
    v25 = Math.max(30, Math.min(180, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      week: i + 1,
    };
  });
};
const generate1M = () => {
  let v23 = 90;
  let v24 = 100;
  let v25 = 110;

  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month) => {
    v23 += Math.floor(Math.random() * 5 - 2);
    v24 += Math.floor(Math.random() * 5 - 2);
    v25 += Math.floor(Math.random() * 5 - 2);

    v23 = Math.max(60, Math.min(140, v23));
    v24 = Math.max(60, Math.min(140, v24));
    v25 = Math.max(60, Math.min(140, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      month,
    };
  });
};
const generate3M = () => {
  let v23 = 95;
  let v24 = 105;
  let v25 = 115;

  return ["January", "April", "July", "October"].map((month) => {
    v23 += Math.floor(Math.random() * 3 - 1);
    v24 += Math.floor(Math.random() * 3 - 1);
    v25 += Math.floor(Math.random() * 3 - 1);

    v23 = Math.max(80, Math.min(130, v23));
    v24 = Math.max(80, Math.min(130, v24));
    v25 = Math.max(80, Math.min(130, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      month,
    };
  });
};

export const DUMMY_CHART_DATA = {
  "1D": generate1D(),

  "1W": generate1W(),

  "1M": generate1M(),

  "3M": generate3M(),
};

export const DUMMY_DASHBOARD_DATA = {
  overview: {
    totalUsers: 1284,
    totalDocument: 356,
    totalQueryThisDay: 742,
    totalDOcumentCompared: 189,
    AnswerSuccessRate: 0.94,
    AvgResponseTime: 1820,
  },
  usage: DUMMY_CHART_DATA,
  modelPerformance: {},
  comparison: {},
};

export const DUMMY_USER = {
  id: "1",
  avatar: [
    {
      id: "10",
      name: "profile_rani_kartika.jpg",
      path: "/uploads/profile/profile_rani_kartika.jpg",
      url: "https://i.pravatar.cc/300?img=12",
      mimeType: "image/jpeg",
      size: 5320,
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-03-10T08:42:00Z",
      updatedAt: "2025-11-12T04:20:00Z",
    },
  ],
  name: "Sulenq Wazawsky",
  email: "sulengpol@gmail.com",
  role: {
    id: "3",
    name: "HR Manager",
    description:
      "Responsible for managing employee data, policies, and approvals",
    permissions: [
      "employee.read",
      "employee.write",
      "attendance.validate",
      "leave.approve",
      "role.manage",
    ],
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2023-03-10T08:42:00Z",
    updatedAt: "2025-11-12T04:20:00Z",
    deletedAt: null,
  },
  username: null,
  accountStatus: "active",
  gender: "FEMALE" as Gender,
  phoneNumber: "+6281234567890",
  birthDate: "1985-07-12",
  address: "Jl. Melati No. 12, Jakarta Selatan",
  registeredAt: "2023-03-10T08:42:00Z",
  lastLoginAt: "2025-11-12T04:20:00Z",
  lastChangePasswordAt: "2025-05-01T12:30:00Z",
  deactiveAt: null,
  createdBy: "system",
  updatedBy: "system",
  createdAt: "2023-03-10T08:42:00Z",
  updatedAt: "2025-11-12T04:20:00Z",

  taskCount: 10,
};

export const DUMMY_AUTH_LOGS = [
  {
    id: "sh_001",
    action: "Sign out",
    ip: "192.168.1.10",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: "2025-11-14T03:20:00.000Z",
    updatedAt: "2025-11-14T03:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_002",
    action: "Sign in",
    ip: "10.0.0.5",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)",
    createdAt: "2025-11-13T10:45:00.000Z",
    updatedAt: "2025-11-13T10:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_003",
    action: "Sign in",
    ip: "36.72.11.88",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1)",
    createdAt: "2025-11-10T21:12:00.000Z",
    updatedAt: "2025-11-11T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_004",
    action: "Sign out",
    ip: "172.16.0.22",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Linux; Android 14)",
    createdAt: "2025-11-09T14:30:00.000Z",
    updatedAt: "2025-11-09T14:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_005",
    action: "Sign in",
    ip: "103.110.7.51",
    city: "Jakarta",
    countryCode: "ID",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; rv:144.0) Gecko/20100101 Firefox/144.0",
    createdAt: "2025-11-08T08:12:00.000Z",
    updatedAt: "2025-11-08T08:12:00.000Z",
    deletedAt: null,
  },
];

export const DUMMY_ACTIVITY_LOGS = [
  {
    id: "1",
    userId: "101",
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "101",
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "101",
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "101",
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];

export const DUMMY_ALL_ACTIVITY_LOGS = [
  {
    id: "1",
    userId: "103",
    user: DUMMY_USER,
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    user: DUMMY_USER,
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "102",
    user: DUMMY_USER,
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "104",
    user: DUMMY_USER,
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "105",
    user: DUMMY_USER,
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];
