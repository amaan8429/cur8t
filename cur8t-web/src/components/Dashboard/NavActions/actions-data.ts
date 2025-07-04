import {
  Settings2,
  FileText,
  Link,
  Copy,
  CornerUpRight,
  Trash2,
  CornerUpLeft,
  LineChart,
  GalleryVerticalEnd,
  Trash,
  Bell,
  ArrowUp,
  ArrowDown,
  StarHalf,
  StarOff,
} from "lucide-react";
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
      icon: Settings2,
      type: "customize",
    },
    {
      label: "Change Visibility",
      icon: StarOff,
      type: "visibility",
    },
  ],
  [
    {
      label: "Copy Link",
      icon: Link,
      type: "copy-link",
    },
    {
      label: "Duplicate",
      icon: Copy,
      type: "duplicate",
    },
  ],
  [
    {
      label: "View analytics",
      icon: LineChart,
      type: "analytics",
    },
  ],
  [
    {
      label: "Export",
      icon: ArrowDown,
      type: "export",
    },
  ],
];
