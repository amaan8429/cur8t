import {
  PiGear,
  PiLink,
  PiCopy,
  PiChartLine,
  PiArrowDown,
  PiStar,
} from "react-icons/pi";
import { ActionItem } from "./ActionItems";

// Define action types for better type safety
export type ActionType =
  | "customize"
  | "visibility"
  | "copy-link"
  | "duplicate"
  | "analytics"
  | "export";

// Add type property to each action item
export const actionsData: ActionItem[][] = [
  [
    {
      label: "Customize Page",
      icon: PiGear,
      type: "customize",
    },
    {
      label: "Change Visibility",
      icon: PiStar,
      type: "visibility",
    },
  ],
  [
    {
      label: "Copy Link",
      icon: PiLink,
      type: "copy-link",
    },
    {
      label: "Duplicate",
      icon: PiCopy,
      type: "duplicate",
    },
  ],
  [
    {
      label: "View analytics",
      icon: PiChartLine,
      type: "analytics",
    },
  ],
  [
    {
      label: "Export",
      icon: PiArrowDown,
      type: "export",
    },
  ],
];
