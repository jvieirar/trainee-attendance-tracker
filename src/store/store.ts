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
  addPackage: (traineeId: number) => void;
  addAttendance: (traineeId: number, date: string) => void;
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
      getTraineeById: (id) => get().trainees.find((t) => t.id === id),
    }),
    {
      name: "trainee-attendance-storage",
    }
  )
);
