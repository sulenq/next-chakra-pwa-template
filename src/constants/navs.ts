import {
  IconDatabase,
  IconDeviceAnalytics,
  IconDeviceDesktop,
  IconLanguage,
  IconReceipt,
  IconShieldHalf,
} from "@tabler/icons-react";

export const NAVS = [
  {
    icon: IconDeviceAnalytics,
    labelKey: "navs.dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: IconReceipt,
    labelKey: "navs.transaction",
    path: "/admin/transaction",
  },
  {
    icon: IconDatabase,
    labelKey: "navs.master_data.index",
    path: "/admin/master-data",
    subMenus: [
      {
        labelKey: "navs.master_data.user",
        path: "/admin/master-data/user",
      },
      {
        labelKey: "navs.master_data.category",
        path: "/admin/master-data/category",
      },
    ],
  },
];

export const SETTINGS_NAVS = [
  {
    groupLabelKey: "settings_navs_group.main.index",
    list: [
      {
        icon: IconDeviceDesktop,
        labelKey: "settings_navs.main.display",
        path: "/settings/display",
      },
      {
        icon: IconLanguage,
        labelKey: "settings_navs.main.regional",
        path: "/settings/regional",
      },
      {
        icon: IconShieldHalf,
        labelKey: "settings_navs.main.permissions",
        path: "/settings/permissions",
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
