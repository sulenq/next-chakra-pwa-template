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

export const NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "main",
    list: [
      {
        icon: IconDeviceAnalytics,
        labelKey: "navs.dashboard",
        path: `${PRIVATE_ROUTE_INDEX}/dashboard`,
      },
      {
        icon: IconReceipt,
        labelKey: "navs.transaction",
        path: `${PRIVATE_ROUTE_INDEX}/transaction`,
      },
      {
        icon: IconDatabase,
        labelKey: "navs.master_data.index",
        path: `${PRIVATE_ROUTE_INDEX}/master-data`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.master_data.user",
                path: `${PRIVATE_ROUTE_INDEX}/master-data/user`,
              },
              {
                labelKey: "navs.master_data.category",
                path: `${PRIVATE_ROUTE_INDEX}/master-data/category`,
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
        path: `${PRIVATE_ROUTE_INDEX}/settings`,
        subMenus: [
          {
            groupLabelKey: "settings_navs.main.index",
            list: [
              {
                icon: IconUser,
                labelKey: "my_profile",
                path: `${PRIVATE_ROUTE_INDEX}/settings/profile`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
              {
                icon: IconDeviceDesktop,
                labelKey: "settings_navs.main.display",
                path: `${PRIVATE_ROUTE_INDEX}/settings/display`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
              {
                icon: IconLanguage,
                labelKey: "settings_navs.main.regional",
                path: `${PRIVATE_ROUTE_INDEX}/settings/regional`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
              {
                icon: IconShieldHalf,
                labelKey: "settings_navs.main.permissions",
                path: `${PRIVATE_ROUTE_INDEX}/settings/permissions`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
            ],
          },
        ],
      },
      {
        icon: IconUser,
        labelKey: "navs.profile",
        path: `${PRIVATE_ROUTE_INDEX}/profile`,
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
