import { api } from '@dashboard/config/api'
import ctuLogo from '@dashboard/imports/GenerateWireframeDesign/97e3160c170c3b0c0e2ef6fc17335bd1e23871d5.png'
import type { Treaty } from '@elysiajs/eden'
import { BookOpen, Check, ChevronDown, Clock, LogOut, MapPin, Search, User as UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User } from '../App'

interface Student {
  stt: number
  mssv: string
  name: string
  present: boolean
  late: boolean
}

interface TeacherDashboardProps {
  user: User
  onLogout: () => void
}

function Dropdown({
  value,
  options,
  open,
  onToggle,
  onSelect,
  icon,
}: {
  value: string
  options: string[]
  open: boolean
  onToggle: () => void
  onSelect: (v: string) => void
  icon: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-300 transition-colors"
      >
        <span className="text-blue-500 shrink-0">{icon}</span>
        <span className="flex-1 text-left text-gray-800 text-sm font-medium truncate">{value}</span>
        <ChevronDown size={18} className={`text-blue-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
          {options.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => onSelect(s)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${value === s ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
            >
              {value === s && <Check size={14} className="text-blue-500" />}
              <span className={value === s ? '' : 'ml-5'}>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const teacherName = user.name
  const teacherId = user.teacherId

  const [courses, setCourses] = useState<Treaty.Data<typeof api.teacher.courses.get>['data']>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState('')

  const [openSubject, setOpenSubject] = useState(false)
  const [openSession, setOpenSession] = useState(false)
  const [search, setSearch] = useState('')

  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([])
  const [checkIns, setCheckIns] = useState<any[]>([])

  // 1. Lấy danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.teacher.courses.get()
        if (data?.data) {
          setCourses(data.data)
          if (data.data.length > 0) {
            setSelectedCourseId(data.data[0].id)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchCourses()
  }, [])

  // 2. Lấy danh sách buổi học theo khóa học
  useEffect(() => {
    if (!selectedCourseId) return

    const fetchSessions = async () => {
      try {
        const { data } = await api.teacher.courses({ courseId: selectedCourseId }).sessions.get()
        if (data?.data) {
          setSessions(data.data)
          if (data.data.length > 0) {
            setSelectedSessionId(data.data[0].id)
          } else {
            setSelectedSessionId('')
            setEnrolledStudents([])
            setCheckIns([])
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchSessions()
  }, [selectedCourseId])

  // 3. Lấy chi tiết buổi học & Polling Lắng nghe Check-in Realtime
  useEffect(() => {
    if (!selectedSessionId) return

    const fetchDetails = async () => {
      try {
        const { data } = await api.teacher.sessions({ id: selectedSessionId }).details.get()
        if (data?.data) {
          setEnrolledStudents(data.data.enrolledStudents || [])
          setCheckIns(data.data.checkIns || [])
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchDetails()
    // Fetch every 5 seconds for "real-time" experience
    const intervalId = setInterval(fetchDetails, 5000)
    return () => clearInterval(intervalId)
  }, [selectedSessionId])

  // 3. Kết hợp danh sách sinh viên lớp và lịch sử điểm danh
  const students: Student[] = enrolledStudents.map((s, index) => {
    const checkRecord = checkIns.find((c) => c.studentId === s.studentId)
    return {
      stt: index + 1,
      mssv: s.studentId!,
      name: s.name,
      present: !!checkRecord,
      late: checkRecord ? checkRecord.isLate : false,
    }
  })

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.mssv.toLowerCase().includes(search.toLowerCase()),
  )

  const presentCount = students.filter((s) => s.present).length
  const lateCount = students.filter((s) => s.late).length
  const absentCount = students.filter((s) => !s.present).length

  const statCards = [
    { label: 'Có mặt', count: presentCount, icon: <Check size={18} className="text-green-600" />, bg: 'bg-green-100' },
    { label: 'Đi trễ', count: lateCount, icon: <Clock size={18} className="text-amber-500" />, bg: 'bg-amber-100' },
    {
      label: 'Vắng',
      count: absentCount,
      icon: <span className="text-red-500 font-bold text-sm">✗</span>,
      bg: 'bg-red-100',
    },
  ]

  const currentCourse = courses.find((c) => c.id === selectedCourseId)
  const currentSession = sessions.find((s) => s.id === selectedSessionId)

  const selectedSubjectStr = currentCourse
    ? `${currentCourse.courseCode} - ${currentCourse.courseName}`
    : courses.length > 0
      ? 'Đang tải...'
      : 'Không có học phần'
  const selectedRoomTimeStr = currentSession
    ? `Phòng ${currentSession.roomId} - ${new Date(currentSession.sessionStartTime).toLocaleString('vi-VN')}`
    : sessions.length > 0
      ? 'Đang tải...'
      : 'Không có buổi học'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top Header ── */}
      <header className="bg-linear-to-r from-blue-800 to-blue-500 shadow-lg relative overflow-hidden shrink-0">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white opacity-5 rounded-full" />
        <div className="absolute top-8 -right-4 w-24 h-24 bg-white opacity-5 rounded-full" />

        {/* Mobile header */}
        <div className="relative md:hidden px-5 pt-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img src={ctuLogo} alt="CTU Logo" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <span className="text-white font-bold text-lg">SmartAttendance</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <LogOut size={18} color="white" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <UserIcon size={20} color="white" />
            </div>
            <div>
              <p className="text-blue-200 text-xs">Xin chào 👋</p>
              <p className="text-white font-bold text-sm">
                {teacherId} - {teacherName}
              </p>
              <p className="text-blue-200 text-xs">Thứ Sáu, 10/07/2026</p>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="relative hidden md:flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11">
              <img src={ctuLogo} alt="CTU Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-wide">SmartAttendance</span>
              <p className="text-blue-200 text-xs">Trường Đại học Cần Thơ</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <UserIcon size={18} color="white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  {teacherId} - {teacherName}
                </p>
                <p className="text-blue-200 text-xs">Thứ Sáu, 10/07/2026</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 rounded-xl hover:bg-white/25 transition-colors text-white text-sm font-medium"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ── Sidebar (desktop) / top section (mobile) ── */}
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
              <label
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                htmlFor="selectedSubject"
              >
                Chọn học phần
              </label>
              <Dropdown
                value={selectedSubjectStr}
                options={courses.map((c) => `${c.courseCode} - ${c.courseName}`)}
                open={openSubject}
                onToggle={() => {
                  setOpenSubject(!openSubject)
                  setOpenSession(false)
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
              <label
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                htmlFor="selectedRoomTime"
              >
                Chọn phòng - buổi học
              </label>
              <Dropdown
                value={selectedRoomTimeStr}
                options={sessions.map(
                  (s) => `Phòng ${s.roomId} - ${new Date(s.sessionStartTime).toLocaleString('vi-VN')}`,
                )}
                open={openSession}
                onToggle={() => {
                  setOpenSession(!openSession)
                  setOpenSubject(false)
                }}
                onSelect={(v) => {
                  const sessionIndex = sessions.findIndex(
                    (s) => `Phòng ${s.roomId} - ${new Date(s.sessionStartTime).toLocaleString('vi-VN')}` === v,
                  )
                  if (sessionIndex !== -1) setSelectedSessionId(sessions[sessionIndex].id)
                  setOpenSession(false)
                }}
                icon={<MapPin size={18} />}
              />
            </div>
          </div>

          {/* Save button deleted as data is synced real-time */}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 gap-4">
          {/* Attendance table card */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Table header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-base">Danh sách điểm danh</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {students.length} sinh viên
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm MSSV hoặc tên sinh viên..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
              <div className="col-span-1 text-xs font-semibold text-gray-500">#</div>
              <div className="col-span-3 text-xs font-semibold text-gray-500">MSSV</div>
              <div className="col-span-5 text-xs font-semibold text-gray-500">Họ và tên</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 text-center">Có mặt</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 text-center">Trễ</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50 overflow-y-auto flex-1">
              {filtered.map((student) => (
                <div
                  key={student.mssv}
                  className={`grid grid-cols-12 px-5 py-3.5 items-center transition-colors hover:bg-gray-50/50 ${student.present ? '' : 'bg-red-50/40'}`}
                >
                  <div className="col-span-1 text-xs text-gray-400 font-medium">{student.stt}</div>
                  <div className="col-span-3 text-xs font-mono text-gray-600">{student.mssv}</div>
                  <div className="col-span-5 text-sm text-gray-800 font-medium">{student.name}</div>
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        student.present ? 'bg-green-500 shadow-md shadow-green-200' : 'bg-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {student.present && <Check size={14} color="white" strokeWidth={3} />}
                    </button>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        student.late
                          ? 'bg-amber-400 shadow-md shadow-amber-200'
                          : student.present
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-gray-100 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {student.late && <Clock size={12} color="white" strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile save button deleted */}
        </main>
      </div>
    </div>
  )
}
