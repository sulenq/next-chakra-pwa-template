import { Interface__NavGroup } from "@/constants/interfaces";
import {
  ActivityIcon,
  BlocksIcon,
  BrushIcon,
  ChartPieIcon,
  DatabaseIcon,
  LanguagesIcon,
  MapPinIcon,
  SettingsIcon,
  ShieldHalfIcon,
  UserCogIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export const PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "main",
    navs: [
      {
        icon: ChartPieIcon,
        labelKey: "navs.dashboard",
        path: `/dashboard`,
        allowedRoles: [],
      },
      {
        icon: UsersIcon,
        labelKey: "navs.user",
        path: `/user`,
        allowedRoles: [],
      },
      {
        icon: MapPinIcon,
        labelKey: "navs.other.index",
        path: `/other-navs`,
        allowedRoles: [],
        children: [
          {
            navs: [
              {
                labelKey: "navs.other.type",
                path: `/other-navs/type`,
                allowedRoles: [],
              },
              {
                labelKey: "navs.other.category",
                path: `/other-navs/category`,
                allowedRoles: [],
              },
              {
                labelKey: "navs.other.index",
                path: `/other-navs/other`,
                allowedRoles: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const OTHER_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "other",
    navs: [
      {
        icon: DatabaseIcon,
        labelKey: "navs.master_data",
        path: `/master-data`,
        allowedRoles: [],
        children: [
          {
            labelKey: "master_data_navs.hr.index",
            navs: [
              {
                icon: UserCogIcon,
                labelKey: "master_data_navs.hr.employment_status",
                path: `/master-data/employment-status`,
                allowedRoles: [],
                backPath: `/master-data`,
              },
            ],
          },
        ],
      },
      {
        icon: SettingsIcon,
        labelKey: "navs.settings",
        path: `/settings`,
        allowedRoles: [],
        children: [
          {
            labelKey: "settings_navs.main.index",
            navs: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/settings/profile`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: BrushIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/settings/personalization`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/settings/app-permissions`,
                allowedRoles: [],
                backPath: `/settings`,
              },
            ],
          },
          {
            labelKey: "settings_navs.system.index",
            navs: [
              {
                icon: UserCogIcon,
                labelKey: "settings_navs.system.account_role",
                path: `/settings/account-role`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: BlocksIcon,
                labelKey: "settings_navs.system.integration",
                path: `/settings/integration`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: ActivityIcon,
                labelKey: "settings_navs.system.activity_log",
                path: `/settings/activity-log`,
                allowedRoles: [],
                backPath: `/settings`,
              },
            ],
          },
        ],
      },
    ],
  },
];
