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

export const dummyChartData = {
  "1D": generate1D(),

  "1W": generate1W(),

  "1M": generate1M(),

  "3M": generate3M(),
};

export const dummyUser = {
  id: "1",
  avatar: [
    {
      id: "10",
      fileName: "profile_rani_kartika.jpg",
      filePath: "/uploads/profile/profile_rani_kartika.jpg",
      fileUrl:
        "https://cdn.rssehat.id/uploads/profile/profile_rani_kartika.jpg",
      fileMimeType: "image/jpeg",
      fileSize: "245320",
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-03-10T08:42:00Z",
      updatedAt: "2025-11-12T04:20:00Z",
    },
  ],
  name: "Dr. Rani Kartika",
  email: "rani.kartika@rssehat.id",
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
  accountStatus: "active",
  gender: false, // female
  phoneNumber: "+6281234567890",
  birthDate: "1985-07-12",
  address: "Jl. Melati No. 12, Jakarta Selatan",
  registeredAt: "2023-03-10T08:42:00Z",
  lastLogin: "2025-11-12T04:20:00Z",
  lastChangePasswordAt: "2025-05-01T12:30:00Z",
  deactiveAt: null,
  createdBy: "system",
  updatedBy: "system",
  createdAt: "2023-03-10T08:42:00Z",
  updatedAt: "2025-11-12T04:20:00Z",
};

export const dummyUsers = [
  {
    id: "101",
    avatar: [
      {
        id: "SF001",
        fileName: "AsepS_avatar.svg",
        filePath: "/users/101/avatars/",
        fileUrl: "https://i.pravatar.cc/300",
        fileMimeType: "image/svg+xml",
        fileSize: "5000",
        createdBy: "system",
        updatedBy: "system",
        createdAt: "2024-01-01T08:00:00.000Z",
        updatedAt: "2024-01-01T08:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Asep Setiawan",
    email: "asep.setiawan@example.com",
    role: {
      id: "R001",
      name: "ADMIN",
      description: "Superuser with full administrative access.",
      permissions: ["all.access", "user.manage", "system.config"],
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: true,
    phoneNumber: "+6281234567890",
    birthDate: "1990-05-15",
    address: "Jl. Sudirman No. 12, Jakarta",
    registeredAt: "2024-01-01T08:00:00.000Z",
    lastLogin: "2025-11-14T01:15:00.000Z",
    lastChangePasswordAt: null,
    deactiveAt: null,
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2024-01-01T08:00:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "102",
    avatar: [
      {
        id: "SF002",
        fileName: "BudiW_avatar.svg",
        filePath: "/users/102/avatars/",
        fileUrl: "https://i.pravatar.cc/300",
        fileMimeType: "image/svg+xml",
        fileSize: "5500",
        createdBy: "system",
        updatedBy: "system",
        createdAt: "2024-03-10T10:00:00.000Z",
        updatedAt: "2024-03-10T10:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Budi Wijaya",
    email: "budi.wijaya@example.com",
    role: {
      id: "R002",
      name: "EDITOR",
      description: "Content creator with limited write access.",
      permissions: ["content.read", "content.write", "media.upload"],
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-03-01T00:00:00.000Z",
      updatedAt: "2025-10-10T12:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: true,
    phoneNumber: "+6281122334455",
    birthDate: "1995-03-20",
    address: "Jl. Merdeka No. 5, Bandung",
    registeredAt: "2024-03-10T10:00:00.000Z",
    lastLogin: "2025-11-13T10:20:00.000Z",
    lastChangePasswordAt: null,
    deactiveAt: null,
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2024-03-10T10:00:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "103",
    avatar: [
      {
        id: "SF003",
        fileName: "CindyL_avatar.svg",
        filePath: "/users/103/avatars/",
        fileUrl: "https://i.pravatar.cc/300",
        fileMimeType: "image/svg+xml",
        fileSize: "4800",
        createdBy: "system",
        updatedBy: "system",
        createdAt: "2024-05-20T14:30:00.000Z",
        updatedAt: "2024-05-20T14:30:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Cindy Lestari",
    email: "cindy.lestar@example.com",
    role: {
      id: "R003",
      name: "VIEWER",
      description: "Read-only access to all public data.",
      permissions: ["content.read", "user.read_self"],
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-05-01T00:00:00.000Z",
      updatedAt: "2025-05-01T00:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "inactive",
    gender: false,
    phoneNumber: "+6287788990011",
    birthDate: "1998-10-01",
    address: "Jl. Asia Afrika No. 8, Surabaya",
    registeredAt: "2024-05-20T14:30:00.000Z",
    lastLogin: "2025-11-12T18:45:00.000Z",
    lastChangePasswordAt: "2025-10-01T00:00:00.000Z",
    deactiveAt: null,
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2024-05-20T14:30:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "104",
    avatar: [
      {
        id: "SF004",
        fileName: "DavidP_avatar.svg",
        filePath: "/users/104/avatars/",
        fileUrl: "https://i.pravatar.cc/300",
        fileMimeType: "image/svg+xml",
        fileSize: "5200",
        createdBy: "101",
        updatedBy: "101",
        createdAt: "2023-10-15T09:00:00.000Z",
        updatedAt: "2023-10-15T09:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "David Pratama",
    email: "david.pratama@example.com",
    role: {
      id: "R001",
      name: "ADMIN",
      description: "Superuser with full administrative access.",
      permissions: ["all.access", "user.manage", "system.config"],
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: true,
    phoneNumber: "+6289988776655",
    birthDate: "1985-12-25",
    address: "Jl. Gatot Subroto No. 3, Medan",
    registeredAt: "2023-10-15T09:00:00.000Z",
    lastLogin: "2025-11-13T09:05:00.000Z",
    lastChangePasswordAt: null,
    deactiveAt: null,
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2023-10-15T09:00:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "105",
    avatar: [
      {
        id: "SF005",
        fileName: "EkaF_avatar.svg",
        filePath: "/users/105/avatars/",
        fileUrl: "https://i.pravatar.cc/300",
        fileMimeType: "image/svg+xml",
        fileSize: "4900",
        createdBy: "102",
        updatedBy: "102",
        createdAt: "2024-08-01T11:00:00.000Z",
        updatedAt: "2024-08-01T11:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Eka Fitriani",
    email: "eka.fitriani@example.com",
    role: {
      id: "R002",
      name: "EDITOR",
      description: "Content creator with limited write access.",
      permissions: ["content.read", "content.write", "media.upload"],
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-03-01T00:00:00.000Z",
      updatedAt: "2025-10-10T12:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: false,
    phoneNumber: "+6285544332211",
    birthDate: "2000-07-07",
    address: "Jl. Veteran No. 10, Semarang",
    registeredAt: "2024-08-01T11:00:00.000Z",
    lastLogin: "2025-11-12T18:30:00.000Z",
    lastChangePasswordAt: "2024-12-01T00:00:00.000Z",
    deactiveAt: null,
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2024-08-01T11:00:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];

export const dummyAuthLogs = [
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

export const dummyActivityLogs = [
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

export const dummyAllActivityLogs = [
  {
    id: "1",
    userId: "103",
    user: dummyUsers[2],
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    user: dummyUsers[0],
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "102",
    user: dummyUsers[1],
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "104",
    user: dummyUsers[3],
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "105",
    user: dummyUsers[4],
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];
