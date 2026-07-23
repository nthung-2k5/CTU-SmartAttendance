import { api } from '@dashboard/config/api'
import { useEffect } from 'react'
import type { User } from '../../App'
import { AttendanceTable } from './AttendanceTable'
import { DashboardHeader } from './Header'
import { DashboardSidebar } from './Sidebar'
import { useTeacherStore } from './store'

interface TeacherDashboardProps {
  user: User
  onLogout: () => void
}

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const {
    setCourses,
    setRooms,
    selectedCourseId,
    setSessions,
    setEnrolledStudents,
    setSelectedSessionId,
    setCheckIns,
    selectedSessionId,
    sessions,
    refreshActiveSession,
  } = useTeacherStore()

  // 1. Lấy danh sách khóa học và phòng
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [coursesRes, roomsRes] = await Promise.all([api.teacher.courses.get(), api.teacher.rooms.get()])
        if (coursesRes.data?.data) {
          setCourses(coursesRes.data.data)
        }
        if (roomsRes.data?.data) {
          setRooms(roomsRes.data.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchInit()
  }, [])

  // 2. Lấy danh sách buổi học theo khóa học và danh sách sinh viên
  useEffect(() => {
    if (!selectedCourseId) return

    const fetchData = async () => {
      try {
        const {data: courseData} = await api.teacher.courses({ courseId: selectedCourseId }).get()

        if (courseData?.data) {
          const { sessions, enrollments } = courseData.data
          setEnrolledStudents(enrollments)
          setSessions(sessions)

          const activeSession = sessions.find(s => s.status === 'ACTIVE')
          if (activeSession) {
            setSelectedSessionId(activeSession.id)
          } else {
            setSelectedSessionId('')
            setCheckIns([])
          }
        }

      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [selectedCourseId])

  // 3. Lấy chi tiết buổi học & Quản lý Polling
  useEffect(() => {
    if (!selectedSessionId) return

    const currentSession = sessions.find((s) => s.id === selectedSessionId)
    if (!currentSession) return

    if (currentSession.status === 'COMPLETED') {
      api.teacher
        .sessions({ id: selectedSessionId })
        .details.get()
        .then(({ data }) => {
          if (data?.data) {
            setEnrolledStudents(data.data.enrolledStudents || [])
            setCheckIns(data.data.checkIns || [])
          }
        })
    } else {
      // Initial fetch for ACTIVE session
      refreshActiveSession()

      // Polling every 10 seconds
      const intervalId = setInterval(() => {
        refreshActiveSession()
      }, 10000)

      return () => clearInterval(intervalId)
    }
  }, [selectedSessionId, sessions, refreshActiveSession])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <DashboardSidebar />
        <AttendanceTable />
      </div>
    </div>
  )
}
