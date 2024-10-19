import { create } from "zustand";
import { persist } from "zustand/middleware";

type Trainee = {
  id: number;
  name: string;
  packagesRemaining: number;
  sessionsRemaining: number;
};

type Attendance = {
  id: number;
  traineeId: number;
  date: string;
};

type Store = {
  trainees: Trainee[];
  attendances: Attendance[];
  addTrainee: (name: string, packages: number) => void;
  editTrainee: (id: number, name: string) => void;
  addPackage: (traineeId: number) => void;
  removePackage: (traineeId: number) => void;
  addAttendance: (traineeId: number, date: string) => void;
  editAttendance: (id: number, traineeId: number, date: string) => void;
  deleteAttendance: (id: number) => void;
  getTraineeById: (id: number) => Trainee | undefined;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      trainees: [],
      attendances: [],
      addTrainee: (name, packages) =>
        set((state) => ({
          trainees: [
            ...state.trainees,
            {
              id: Date.now(),
              name,
              packagesRemaining: packages,
              sessionsRemaining: packages * 5,
            },
          ],
        })),
      editTrainee: (id, name) =>
        set((state) => ({
          trainees: state.trainees.map((trainee) =>
            trainee.id === id ? { ...trainee, name } : trainee
          ),
        })),
      addPackage: (traineeId) =>
        set((state) => ({
          trainees: state.trainees.map((trainee) =>
            trainee.id === traineeId
              ? {
                  ...trainee,
                  packagesRemaining: trainee.packagesRemaining + 1,
                  sessionsRemaining: trainee.sessionsRemaining + 5,
                }
              : trainee
          ),
        })),
      removePackage: (traineeId) =>
        set((state) => ({
          trainees: state.trainees.map((trainee) =>
            trainee.id === traineeId && trainee.packagesRemaining > 0
              ? {
                  ...trainee,
                  packagesRemaining: trainee.packagesRemaining - 1,
                  sessionsRemaining: Math.max(0, trainee.sessionsRemaining - 5),
                }
              : trainee
          ),
        })),
      addAttendance: (traineeId, date) =>
        set((state) => {
          const trainee = state.trainees.find((t) => t.id === traineeId);
          if (!trainee || trainee.sessionsRemaining === 0) return state;

          return {
            attendances: [
              ...state.attendances,
              { id: Date.now(), traineeId, date },
            ],
            trainees: state.trainees.map((t) =>
              t.id === traineeId
                ? {
                    ...t,
                    sessionsRemaining: t.sessionsRemaining - 1,
                    packagesRemaining:
                      t.sessionsRemaining === 1
                        ? t.packagesRemaining - 1
                        : t.packagesRemaining,
                  }
                : t
            ),
          };
        }),
      editAttendance: (id, traineeId, date) =>
        set((state) => ({
          attendances: state.attendances.map((attendance) =>
            attendance.id === id
              ? { ...attendance, traineeId, date }
              : attendance
          ),
        })),
      deleteAttendance: (id) =>
        set((state) => {
          const attendance = state.attendances.find((a) => a.id === id);
          if (!attendance) return state;

          return {
            attendances: state.attendances.filter((a) => a.id !== id),
            trainees: state.trainees.map((t) =>
              t.id === attendance.traineeId
                ? {
                    ...t,
                    sessionsRemaining: t.sessionsRemaining + 1,
                    packagesRemaining:
                      t.sessionsRemaining === 0
                        ? t.packagesRemaining + 1
                        : t.packagesRemaining,
                  }
                : t
            ),
          };
        }),
      getTraineeById: (id) => get().trainees.find((t) => t.id === id),
    }),
    {
      name: "trainee-attendance-storage",
    }
  )
);
