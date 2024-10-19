"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/store";

type MonthlyAttendance = {
  month: string;
  attendances: number;
};

export default function Analytics() {
  const { attendances } = useStore();
  const [monthlyAttendance, setMonthlyAttendance] = useState<
    MonthlyAttendance[]
  >([]);

  useEffect(() => {
    const monthlyData = attendances.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString("default", {
        month: "long",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const result = Object.entries(monthlyData).map(([month, attendances]) => ({
      month,
      attendances,
    }));

    setMonthlyAttendance(result);
  }, [attendances]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendances" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
