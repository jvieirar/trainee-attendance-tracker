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
import { Pencil, Trash2 } from "lucide-react";

export default function AttendanceTracking() {
  const {
    trainees,
    attendances,
    addAttendance,
    editAttendance,
    deleteAttendance,
    getTraineeById,
  } = useStore();
  const [newAttendance, setNewAttendance] = useState({
    traineeId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [editingAttendance, setEditingAttendance] = useState<{
    id: number;
    traineeId: string;
    date: string;
  } | null>(null);
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

  const handleEditAttendance = () => {
    if (editingAttendance) {
      editAttendance(
        editingAttendance.id,
        parseInt(editingAttendance.traineeId),
        editingAttendance.date
      );
      setEditingAttendance(null);
    }
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
                className="text-base" // Increased text size for better mobile usability
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
          className="text-base" // Increased text size for better mobile usability
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trainee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sessions Used</TableHead>
            <TableHead>Sessions Remaining</TableHead>
            <TableHead>Actions</TableHead>
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
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Attendance</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select
                            value={
                              editingAttendance?.traineeId ||
                              attendance.traineeId.toString()
                            }
                            onValueChange={(value) =>
                              setEditingAttendance({
                                ...editingAttendance!,
                                traineeId: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Trainee" />
                            </SelectTrigger>
                            <SelectContent>
                              {trainees.map((trainee) => (
                                <SelectItem
                                  key={trainee.id}
                                  value={trainee.id.toString()}
                                >
                                  {trainee.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={editingAttendance?.date || attendance.date}
                            onChange={(e) =>
                              setEditingAttendance({
                                ...editingAttendance!,
                                date: e.target.value,
                              })
                            }
                            className="text-base" // Increased text size for better mobile usability
                          />
                          <Button onClick={handleEditAttendance}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteAttendance(attendance.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
