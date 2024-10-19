"use client";

import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TraineeManagement from "@/components/trainee-management";
import AttendanceTracking from "@/components/attendance-tracking";
import Analytics from "@/components/analytics";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("trainees");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Trainee Attendance Tracker
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="trainees">Trainee Management</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="trainees">
            <TraineeManagement />
          </TabsContent>
          <TabsContent value="attendance">
            <AttendanceTracking />
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
