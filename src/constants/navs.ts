import { Interface__NavItem } from "@/constants/interfaces";
import {
  IconDatabase,
  IconDeviceAnalytics,
  IconDeviceDesktop,
  IconLanguage,
  IconReceipt,
  IconSettings,
  IconShieldHalf,
  IconUser,
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
        icon: IconDatabase,
        labelKey: "navs.master_data.index",
        path: `/master-data`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.master_data.user",
                path: `/master-data/user`,
              },
              {
                labelKey: "navs.master_data.category",
                path: `/master-data/category`,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const OTHER_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "other",
    list: [
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
                icon: IconDeviceDesktop,
                labelKey: "settings_navs.main.display",
                path: `/settings/display`,
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
        ],
      },
      {
        icon: IconUser,
        labelKey: "navs.profile",
        path: `/profile`,
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
