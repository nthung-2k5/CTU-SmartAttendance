import { BookOpen, Check, Clock, MapPin, Play, Square } from 'lucide-react'
import { useState } from 'react'
import { Dropdown } from './Dropdown'
import { useTeacherStore } from './store'

export function DashboardSidebar() {
  const {
    courses,
    sessions,
    rooms,
    selectedCourseId,
    selectedSessionId,
    selectedRoomId,
    enrolledStudents,
    checkIns,
    setSelectedCourseId,
    setSelectedSessionId,
    setSelectedRoomId,
    startSession,
    endSession,
  } = useTeacherStore()

  const [openSubject, setOpenSubject] = useState(false)
  const [openSession, setOpenSession] = useState(false)
  const [openRoom, setOpenRoom] = useState(false)

  const currentCourse = courses.find((c) => c.id === selectedCourseId)
  const currentSession = sessions.find((s) => s.id === selectedSessionId)

  const selectedSubjectStr = currentCourse
    ? `${currentCourse.courseCode} - ${currentCourse.courseName}`
    : courses.length > 0
      ? 'Chọn học phần'
      : 'Không có học phần'

  const selectedRoomTimeStr =
    selectedSessionId === ''
      ? 'Tạo buổi học mới'
      : currentSession
        ? `Phòng ${currentSession.roomId} - ${new Date(currentSession.sessionStartTime).toLocaleString('vi-VN')} ${currentSession.status === 'ACTIVE' ? '(Đang học)' : ''}`
        : sessions.length > 0
          ? 'Chọn buổi học'
          : 'Không có buổi học'

  // Thống kê
  const presentCount = checkIns.length
  const lateCount = checkIns.filter((c) => c.isLate).length // Note: checkIns only has checkInTimestamp right now from activeSession, we can compute isLate but let's approximate or update later. Wait, actually we don't have isLate directly in state checkIns. Let's compute it if needed or just show lengths.
  // We'll compute it properly
  const checkInsComputed = checkIns.map(c => {
    if (!currentSession) return { ...c, isLate: false }
    const lateThreshold = new Date(currentSession.sessionStartTime).getTime() + 15 * 60 * 1000
    return { ...c, isLate: new Date(c.checkInTimestamp).getTime() > lateThreshold }
  })

  const present = checkInsComputed.length
  const late = checkInsComputed.filter(c => c.isLate).length
  const absent = enrolledStudents.length - present

  const statCards = [
    { label: 'Có mặt', count: present, icon: <Check size={18} className="text-green-600" />, bg: 'bg-green-100' },
    { label: 'Đi trễ', count: late, icon: <Clock size={18} className="text-amber-500" />, bg: 'bg-amber-100' },
    { label: 'Vắng', count: absent, icon: <span className="text-red-500 font-bold text-sm">✗</span>, bg: 'bg-red-100' },
  ]

  const handleStartSession = () => {
    if (!selectedCourseId || !selectedRoomId) return
    startSession(selectedCourseId, selectedRoomId)
  }

  return (
    <aside className="md:w-72 lg:w-80 shrink-0 bg-white md:border-r border-gray-100 md:shadow-sm flex flex-col">
      {/* Stat cards */}
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 hidden md:block">
          Thống kê buổi học
        </p>
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {statCards.map(({ label, count, icon, bg }) => (
            <div
              key={label}
              className="bg-gray-50 md:bg-white border border-gray-100 rounded-2xl p-3 md:p-4 shadow-sm flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
              <div className="text-center md:text-left">
                <p className="text-xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block h-px bg-gray-100 mx-4" />

      {/* Selectors */}
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Chọn học phần
          </label>
          <Dropdown
            value={selectedSubjectStr}
            options={courses.map((c) => `${c.courseCode} - ${c.courseName}`)}
            open={openSubject}
            onToggle={() => {
              setOpenSubject(!openSubject)
              setOpenSession(false)
              setOpenRoom(false)
            }}
            onSelect={(v) => {
              const course = courses.find((c) => `${c.courseCode} - ${c.courseName}` === v)
              if (course) setSelectedCourseId(course.id)
              setOpenSubject(false)
            }}
            icon={<BookOpen size={18} />}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Chọn phòng - buổi học
          </label>
          <Dropdown
            value={selectedRoomTimeStr}
            options={[
              ...(sessions.some((s) => s.status === 'ACTIVE') ? [] : ['Tạo buổi học mới']),
              ...sessions.map(
                (s) =>
                  `Phòng ${s.roomId} - ${new Date(s.sessionStartTime).toLocaleString('vi-VN')} ${s.status === 'ACTIVE' ? '(Đang học)' : ''}`,
              ),
            ]}
            open={openSession}
            onToggle={() => {
              setOpenSession(!openSession)
              setOpenSubject(false)
              setOpenRoom(false)
            }}
            onSelect={(v) => {
              if (v === 'Tạo buổi học mới') {
                setSelectedSessionId('')
                setOpenSession(false)
                return
              }
              const sessionIndex = sessions.findIndex(
                (s) =>
                  `Phòng ${s.roomId} - ${new Date(s.sessionStartTime).toLocaleString('vi-VN')} ${s.status === 'ACTIVE' ? '(Đang học)' : ''}` ===
                  v,
              )
              if (sessionIndex !== -1) setSelectedSessionId(sessions[sessionIndex].id)
              setOpenSession(false)
            }}
            icon={<MapPin size={18} />}
          />
        </div>

        {!selectedSessionId && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Chọn phòng học
            </label>
            <Dropdown
              value={selectedRoomId ? rooms.find((r) => r.id === selectedRoomId)?.name || '' : 'Chọn phòng...'}
              options={rooms.map((r) => r.name)}
              open={openRoom}
              onToggle={() => {
                setOpenRoom(!openRoom)
                setOpenSession(false)
                setOpenSubject(false)
              }}
              onSelect={(v) => {
                const room = rooms.find((r) => r.name === v)
                if (room) setSelectedRoomId(room.id)
                setOpenRoom(false)
              }}
              icon={<MapPin size={18} />}
            />
            <button
              type="button"
              onClick={handleStartSession}
              disabled={!selectedRoomId}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl transition-colors font-medium text-sm"
            >
              <Play size={16} /> Bắt đầu buổi học
            </button>
          </div>
        )}

        {currentSession && currentSession.status === 'ACTIVE' && (
          <div className="pt-2">
            <button
              type="button"
              onClick={endSession}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-colors font-medium text-sm shadow-sm shadow-red-200"
            >
              <Square size={16} /> Kết thúc buổi học
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
