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
import { useStore } from "@/store/store";

export default function TraineeManagement() {
  const { trainees, addTrainee, addPackage } = useStore();
  const [newTrainee, setNewTrainee] = useState({ name: "", packages: 1 });
  const [filter, setFilter] = useState("all");

  const handleAddTrainee = () => {
    addTrainee(newTrainee.name, newTrainee.packages);
    setNewTrainee({ name: "", packages: 1 });
  };

  const filteredTrainees = trainees.filter((trainee) => {
    if (filter === "active") return trainee.packagesRemaining > 0;
    if (filter === "inactive") return trainee.packagesRemaining === 0;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trainee Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Trainee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Trainee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Trainee Name"
                value={newTrainee.name}
                onChange={(e) =>
                  setNewTrainee({ ...newTrainee, name: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Number of Packages"
                value={newTrainee.packages}
                onChange={(e) =>
                  setNewTrainee({
                    ...newTrainee,
                    packages: parseInt(e.target.value),
                  })
                }
              />
              <Button onClick={handleAddTrainee}>Add Trainee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active Packages
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          onClick={() => setFilter("inactive")}
        >
          No Packages
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Packages Remaining</TableHead>
            <TableHead>Sessions Remaining</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTrainees.map((trainee) => (
            <TableRow key={trainee.id}>
              <TableCell>{trainee.name}</TableCell>
              <TableCell>{trainee.packagesRemaining}</TableCell>
              <TableCell>{trainee.sessionsRemaining}</TableCell>
              <TableCell>
                <Button onClick={() => addPackage(trainee.id)}>
                  Add Package
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
