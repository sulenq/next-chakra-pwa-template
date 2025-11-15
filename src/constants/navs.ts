import { Interface__NavItem } from "@/constants/interfaces";
import {
  IconActivity,
  IconCurrencyEthereum,
  IconDatabase,
  IconDeviceAnalytics,
  IconKey,
  IconLanguage,
  IconLayersIntersect,
  IconPalette,
  IconReceipt,
  IconSettings,
  IconShieldHalf,
  IconUser,
  IconUserCog,
} from "@tabler/icons-react";

export const PRIVATE_ROUTE_INDEX = "/pvt";

export const PRIVATE_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "main",
    list: [
      {
        icon: IconDeviceAnalytics,
        labelKey: "navs.dashboard",
        path: `/dashboard`,
      },
      {
        icon: IconReceipt,
        labelKey: "navs.transaction",
        path: `/transaction`,
      },
      {
        icon: IconCurrencyEthereum,
        labelKey: "navs.other.index",
        path: `/other-navs`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.other.user",
                path: `/other-navs/user`,
              },
              {
                labelKey: "navs.other.category",
                path: `/other-navs/category`,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const OTHER_PRIVATE_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "other",
    list: [
      {
        icon: IconDatabase,
        labelKey: "navs.master_data",
        path: `/master-data`,
        subMenus: [
          {
            groupLabelKey: "master_data_navs.access_control.index",
            list: [
              {
                icon: IconUserCog,
                labelKey: "master_data_navs.access_control.role",
                path: `/master-data/role`,
                backPath: `/master-data`,
              },
              {
                icon: IconKey,
                labelKey: "master_data_navs.access_control.permission",
                path: `/master-data/permission`,
                backPath: `/master-data`,
              },
            ],
          },
          {
            groupLabelKey: "master_data_navs.hr.index",
            list: [
              {
                icon: IconUserCog,
                labelKey: "master_data_navs.hr.employment_status",
                path: `/master-data/employment-status`,
                backPath: `/master-data`,
              },
            ],
          },
        ],
      },
      {
        icon: IconSettings,
        labelKey: "navs.settings",
        path: `/settings`,
        subMenus: [
          {
            groupLabelKey: "settings_navs.main.index",
            list: [
              {
                icon: IconUser,
                labelKey: "my_profile",
                path: `/settings/profile`,
                backPath: `/settings`,
              },
              {
                icon: IconPalette,
                labelKey: "settings_navs.main.personalization",
                path: `/settings/personalization`,
                backPath: `/settings`,
              },
              {
                icon: IconLanguage,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                backPath: `/settings`,
              },
              {
                icon: IconShieldHalf,
                labelKey: "settings_navs.main.permissions",
                path: `/settings/permissions`,
                backPath: `/settings`,
              },
            ],
          },
          {
            groupLabelKey: "settings_navs.system.index",
            list: [
              {
                icon: IconUserCog,
                labelKey: "settings_navs.system.account_role",
                path: `/settings/account-role`,
                backPath: `/settings`,
              },
              {
                icon: IconLayersIntersect,
                labelKey: "settings_navs.system.integration",
                path: `/settings/integration`,
                backPath: `/settings`,
              },
              {
                icon: IconActivity,
                labelKey: "settings_navs.system.activity_log",
                path: `/settings/activity-log`,
                backPath: `/settings`,
              },
            ],
          },
        ],
      },
    ],
  },
];
