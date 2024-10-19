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
import { Pencil, Plus, Minus } from "lucide-react";

export default function TraineeManagement() {
  const { trainees, addTrainee, editTrainee, addPackage, removePackage } =
    useStore();
  const [newTrainee, setNewTrainee] = useState({ name: "", packages: 1 });
  const [editingTrainee, setEditingTrainee] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [filter, setFilter] = useState("all");

  const handleAddTrainee = () => {
    addTrainee(newTrainee.name, newTrainee.packages);
    setNewTrainee({ name: "", packages: 1 });
  };

  const handleEditTrainee = () => {
    if (editingTrainee) {
      editTrainee(editingTrainee.id, editingTrainee.name);
      setEditingTrainee(null);
    }
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
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => addPackage(trainee.id)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => removePackage(trainee.id)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Trainee</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Trainee Name"
                          value={editingTrainee?.name || trainee.name}
                          onChange={(e) =>
                            setEditingTrainee({
                              id: trainee.id,
                              name: e.target.value,
                            })
                          }
                        />
                        <Button onClick={handleEditTrainee}>
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
