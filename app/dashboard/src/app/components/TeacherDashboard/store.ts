import { api } from '@dashboard/config/api'
import type { Treaty } from '@elysiajs/eden'
import { create } from 'zustand'

type Course = NonNullable<Treaty.Data<typeof api.teacher.courses.get>['data']>[0]
type Session = NonNullable<Treaty.Data<ReturnType<typeof api.teacher.courses>['get']>['data']>['sessions'][0]
type Room = NonNullable<Treaty.Data<typeof api.teacher.rooms.get>['data']>[0]

export type Student = NonNullable<Treaty.Data<ReturnType<typeof api.teacher.courses>['get']>['data']>['enrollments'][0]

interface TeacherStore {
  courses: Course[]
  sessions: Session[]
  rooms: Room[]
  enrolledStudents: Student[]
  checkIns: any[]

  selectedCourseId: string
  selectedSessionId: string
  selectedRoomId: string
  search: string

  setCourses: (courses: Course[]) => void
  setSessions: (sessions: Session[]) => void
  setRooms: (rooms: Room[]) => void
  setEnrolledStudents: (students: any[]) => void
  setCheckIns: (checkIns: any[]) => void

  setSelectedCourseId: (id: string) => void
  setSelectedSessionId: (id: string) => void
  setSelectedRoomId: (id: string) => void
  setSearch: (s: string) => void

  startSession: (courseId: string, roomId: string) => Promise<void>
  endSession: () => Promise<void>
  manualAttendance: (studentId: string, present: boolean) => Promise<void>
  refreshActiveSession: () => Promise<void>
}

export const useTeacherStore = create<TeacherStore>((set, get) => ({
  courses: [],
  sessions: [],
  rooms: [],
  enrolledStudents: [],
  checkIns: [],

  selectedCourseId: '',
  selectedSessionId: '',
  selectedRoomId: '',
  search: '',

  setCourses: (courses) => set({ courses }),
  setSessions: (sessions) => set({ sessions }),
  setRooms: (rooms) => set({ rooms }),
  setEnrolledStudents: (enrolledStudents) => set({ enrolledStudents }),
  setCheckIns: (checkIns) => set({ checkIns }),

  setSelectedCourseId: (selectedCourseId) => set({ selectedCourseId }),
  setSelectedSessionId: (selectedSessionId) => set({ selectedSessionId }),
  setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
  setSearch: (search) => set({ search }),

  startSession: async (courseId, roomId) => {
    try {
      const res = await api.teacher.courses({ courseId }).sessions.start.post({ roomId })
      if (res.data?.data) {
        const newSession = res.data.data
        set((state) => ({ sessions: [newSession, ...state.sessions], selectedSessionId: newSession.id }))
        get().refreshActiveSession()
      } else if (res.error) {
        alert('Failed to start session')
      }
    } catch (e) {
      console.error(e)
    }
  },
  endSession: async () => {
    const { selectedSessionId, refreshActiveSession } = get()
    if (!selectedSessionId) return
    try {
      await api.teacher.sessions({ id: selectedSessionId }).end.post()
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === selectedSessionId ? { ...s, status: 'COMPLETED' } : s,
        ),
      }))
      await refreshActiveSession()
    } catch (e) {
      console.error(e)
    }
  },
  manualAttendance: async (studentId, present) => {
    const { selectedSessionId, refreshActiveSession } = get()
    if (!selectedSessionId) return
    try {
      await api.teacher.sessions({ id: selectedSessionId }).attendance.post({ studentId, present })
      // Optimistic update
      set((state) => {
        if (present) {
          return {
            checkIns: [
              ...state.checkIns.filter((c: any) => c.studentId !== studentId),
              { studentId, checkInTimestamp: new Date().toISOString() },
            ],
          }
        } else {
          return { checkIns: state.checkIns.filter((c: any) => c.studentId !== studentId) }
        }
      })
      // Refresh to ensure in sync
      await refreshActiveSession()
    } catch (e) {
      console.error(e)
    }
  },
  refreshActiveSession: async () => {
    const { selectedCourseId, selectedSessionId } = get()
    if (!selectedCourseId || !selectedSessionId) return
    try {
      const { data } = await api.teacher.courses({ courseId: selectedCourseId })['active-session'].get()
      if (data?.data) {
        set({ enrolledStudents: data.data.enrolledStudents || [], checkIns: data.data.checkIns || [] })
      }
    } catch (e) {
      console.error(e)
    }
  },
}))
