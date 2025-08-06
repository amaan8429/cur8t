"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconType } from "react-icons";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: IconType;
  trend?: "up" | "down" | "neutral";
}

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
}: DashboardStatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${getTrendColor()}`}>{subtitle}</p>
      </CardContent>
    </Card>
  );
}
