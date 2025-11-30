import { Interface__NavItem } from "@/constants/interfaces";
import {
  ActivityIcon,
  BlocksIcon,
  DatabaseIcon,
  House,
  LanguagesIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  PaletteIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldHalfIcon,
  UserCogIcon,
  UserIcon,
} from "lucide-react";

export const PRIVATE_ROUTE_INDEX = "/pvt";

export const PRIVATE_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "main",
    list: [
      {
        icon: House,
        labelKey: "navs.home",
        path: `/home`,
      },
      {
        icon: LayoutDashboardIcon,
        labelKey: "navs.dashboard",
        path: `/dashboard`,
      },
      {
        icon: ReceiptIcon,
        labelKey: "navs.transaction",
        path: `/transaction`,
      },
      {
        icon: MapPinIcon,
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
              {
                labelKey: "navs.other.index",
                path: `/other-navs/other`,
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
        icon: DatabaseIcon,
        labelKey: "navs.master_data",
        path: `/master-data`,
        subMenus: [
          {
            groupLabelKey: "master_data_navs.hr.index",
            list: [
              {
                icon: UserCogIcon,
                labelKey: "master_data_navs.hr.employment_status",
                path: `/master-data/employment-status`,
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
        subMenus: [
          {
            groupLabelKey: "settings_navs.main.index",
            list: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/settings/profile`,
                backPath: `/settings`,
              },
              {
                icon: PaletteIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/settings/personalization`,
                backPath: `/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                backPath: `/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/settings/app-permissions`,
                backPath: `/settings`,
              },
            ],
          },
          {
            groupLabelKey: "settings_navs.system.index",
            list: [
              {
                icon: UserCogIcon,
                labelKey: "settings_navs.system.account_role",
                path: `/settings/account-role`,
                backPath: `/settings`,
              },
              {
                icon: BlocksIcon,
                labelKey: "settings_navs.system.integration",
                path: `/settings/integration`,
                backPath: `/settings`,
              },
              {
                icon: ActivityIcon,
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
