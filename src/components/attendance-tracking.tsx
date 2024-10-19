"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/store";

export default function AttendanceTracking() {
  const { trainees, attendances, addAttendance, getTraineeById } = useStore();
  const [newAttendance, setNewAttendance] = useState({
    traineeId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleAddAttendance = () => {
    addAttendance(parseInt(newAttendance.traineeId), newAttendance.date);
    setNewAttendance({
      traineeId: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const filteredAttendances = attendances.filter((a) => a.date === filterDate);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Attendance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Attendance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                value={newAttendance.traineeId}
                onValueChange={(value) =>
                  setNewAttendance({ ...newAttendance, traineeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Trainee" />
                </SelectTrigger>
                <SelectContent>
                  {trainees.map((trainee) => (
                    <SelectItem key={trainee.id} value={trainee.id.toString()}>
                      {trainee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newAttendance.date}
                onChange={(e) =>
                  setNewAttendance({ ...newAttendance, date: e.target.value })
                }
              />
              <Button onClick={handleAddAttendance}>Add Attendance</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-4">
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trainee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sessions Used</TableHead>
            <TableHead>Sessions Remaining</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAttendances.map((attendance) => {
            const trainee = getTraineeById(attendance.traineeId);
            return (
              <TableRow key={attendance.id}>
                <TableCell>{trainee?.name}</TableCell>
                <TableCell>
                  {new Date(attendance.date).toLocaleDateString()}
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>{trainee?.sessionsRemaining}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
