import { BookOpen, CheckCircle2, Clock, Info, Layers, MapPin, Play, Square, Users, XCircle } from 'lucide-react'
import { useState } from 'react'
import { ConfirmModal } from './ConfirmModal'
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
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  const currentCourse = courses.find((c) => c.id === selectedCourseId)
  const currentSession = sessions.find((s) => s.id === selectedSessionId)

  // Current Subject Label
  const selectedSubjectStr = currentCourse
    ? `${currentCourse.courseCode} - ${currentCourse.courseName}`
    : courses.length > 0
      ? 'Chọn học phần'
      : 'Không có học phần'

  // Current Session Label
  const selectedSessionStr =
    selectedSessionId === ''
      ? 'Tạo buổi học mới'
      : currentSession
        ? `Phòng ${currentSession.roomId} - ${new Date(currentSession.sessionStartTime).toLocaleString('vi-VN')} ${currentSession.status === 'ACTIVE' ? '(Đang học)' : ''}`
        : sessions.length > 0
          ? 'Chọn buổi học'
          : 'Không có buổi học'

  // Options for Subject Dropdown
  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: `${c.courseCode} - ${c.courseName}`,
    badge: c.courseCode,
  }))

  // Options for Session Dropdown
  const sessionOptions = [
    ...(sessions.some((s) => s.status === 'ACTIVE')
      ? []
      : [
          {
            value: '',
            label: '+ Tạo buổi học mới',
            sublabel: 'Bắt đầu mở điểm danh theo thời gian thực',
            badge: 'TẠO MỚI',
          },
        ]),
    ...sessions.map((s) => {
      const isLive = s.status === 'ACTIVE'
      const dateStr = new Date(s.sessionStartTime).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      return {
        value: s.id,
        label: `Phòng ${s.roomId} (${dateStr})`,
        sublabel: isLive ? '🔴 Đang diễn ra điểm danh' : 'Đã kết thúc',
        badge: isLive ? 'ĐANG ĐIỂM DANH' : 'ĐÃ KẾT THÚC',
      }
    }),
  ]

  // Options for Room Dropdown
  const roomOptions = rooms.map((r) => ({
    value: r.id,
    label: r.name,
    sublabel: `Mã phòng: ${r.id}`,
  }))

  // Statistics Calculation
  const checkInsComputed = checkIns.map((c) => {
    if (!currentSession) return { ...c, isLate: false }
    const lateThreshold = new Date(currentSession.sessionStartTime).getTime() + 15 * 60 * 1000
    return { ...c, isLate: new Date(c.timestamp).getTime() > lateThreshold }
  })

  const totalStudents = enrolledStudents.length
  const present = checkInsComputed.length
  const late = checkInsComputed.filter((c) => c.isLate).length
  const onTime = present - late
  const absent = Math.max(0, totalStudents - present)

  const presentPct = totalStudents > 0 ? Math.round((onTime / totalStudents) * 100) : 0
  const latePct = totalStudents > 0 ? Math.round((late / totalStudents) * 100) : 0
  const absentPct = totalStudents > 0 ? Math.round((absent / totalStudents) * 100) : 0

  const handleStartSession = () => {
    if (!selectedCourseId || !selectedRoomId) return
    startSession(selectedCourseId, selectedRoomId)
  }

  return (
    <aside className="w-full md:w-80 lg:w-96 shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 shadow-xs flex flex-col overflow-y-auto">
      {/* 1. Subject & Session Selectors Section */}
      <div className="p-4 sm:p-5 space-y-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={14} className="text-blue-600" /> Quản lý lớp học
          </h2>
          {currentCourse && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {currentCourse.courseCode}
            </span>
          )}
        </div>

        {/* Học Phần Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="course">
            Học phần giảng dạy
          </label>
          <Dropdown
            value={selectedCourseId}
            options={courseOptions}
            open={openSubject}
            onToggle={() => {
              setOpenSubject(!openSubject)
              setOpenSession(false)
              setOpenRoom(false)
            }}
            onSelect={(v) => {
              setSelectedCourseId(v)
              setOpenSubject(false)
            }}
            icon={<BookOpen size={16} />}
            placeholder="Chọn học phần..."
            searchable={true}
          />
        </div>

        {/* Buổi Học Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="session">
            Buổi học & Phòng
          </label>
          <Dropdown
            value={selectedSessionId}
            options={sessionOptions}
            open={openSession}
            onToggle={() => {
              setOpenSession(!openSession)
              setOpenSubject(false)
              setOpenRoom(false)
            }}
            onSelect={(v) => {
              setSelectedSessionId(v)
              setOpenSession(false)
            }}
            icon={<MapPin size={16} />}
            placeholder="Chọn buổi học..."
          />
        </div>

        {/* Action area: Start new session */}
        {!selectedSessionId && (
          <div className="pt-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700" htmlFor="room">
                Chọn phòng để mở điểm danh
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Sẵn sàng
              </span>
            </div>
            <Dropdown
              value={selectedRoomId}
              options={roomOptions}
              open={openRoom}
              onToggle={() => {
                setOpenRoom(!openRoom)
                setOpenSession(false)
                setOpenSubject(false)
              }}
              onSelect={(v) => {
                setSelectedRoomId(v)
                setOpenRoom(false)
              }}
              icon={<MapPin size={16} />}
              placeholder="Vui lòng chọn phòng học..."
            />
            <button
              type="button"
              onClick={handleStartSession}
              disabled={!selectedRoomId}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-2.5 px-4 rounded-xl transition-all duration-200 font-semibold text-sm shadow-md shadow-blue-500/20 disabled:shadow-none disabled:cursor-not-allowed group"
            >
              <Play size={16} className="fill-white group-hover:scale-110 transition-transform" />
              <span>Bắt đầu buổi học mới</span>
            </button>
          </div>
        )}

        {/* Action area: End session if ACTIVE */}
        {currentSession && currentSession.status === 'ACTIVE' && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-xl transition-all duration-200 font-semibold text-sm shadow-md shadow-rose-500/20 group"
            >
              <Square size={16} className="fill-white group-hover:scale-95 transition-transform" />
              <span>Kết thúc buổi học</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Attendance Overview & Analytics */}
      <div className="p-4 sm:p-5 flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={14} className="text-blue-600" /> Thống kê điểm danh
          </h2>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            Tổng: {totalStudents} SV
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Tỷ lệ tham gia</span>
            <span className="font-bold text-blue-600">{presentPct + latePct}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-200">
            <div
              style={{ width: `${presentPct}%` }}
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
              title={`Đúng giờ: ${onTime} SV (${presentPct}%)`}
            />
            <div
              style={{ width: `${latePct}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Đi trễ: ${late} SV (${latePct}%)`}
            />
            <div
              style={{ width: `${absentPct}%` }}
              className="bg-rose-400 h-full rounded-r-full transition-all duration-500"
              title={`Vắng mặt: ${absent} SV (${absentPct}%)`}
            />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Đúng giờ */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between transition-all hover:bg-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-xs">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-800">Có mặt đúng giờ</p>
                <p className="text-lg font-extrabold text-emerald-950 leading-tight">
                  {onTime} <span className="text-xs font-normal text-emerald-700">sinh viên</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              {presentPct}%
            </span>
          </div>

          {/* Đi trễ */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between transition-all hover:bg-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-xs">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-800">Đi trễ (&gt;15 phút)</p>
                <p className="text-lg font-extrabold text-amber-950 leading-tight">
                  {late} <span className="text-xs font-normal text-amber-700">sinh viên</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded-lg">{latePct}%</span>
          </div>

          {/* Vắng mặt */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3.5 flex items-center justify-between transition-all hover:bg-rose-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-xs">
                <XCircle size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-rose-800">Vắng mặt</p>
                <p className="text-lg font-extrabold text-rose-950 leading-tight">
                  {absent} <span className="text-xs font-normal text-rose-700">sinh viên</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-800 rounded-lg">{absentPct}%</span>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-slate-500 text-[11px] leading-relaxed">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <span>
            Quy định: Sinh viên điểm danh sau 15 phút tính từ thời điểm mở buổi học sẽ tự động được đánh dấu là Đi trễ.
          </span>
        </div>
      </div>

      {/* Confirmation modal for ending session */}
      <ConfirmModal
        isOpen={showEndConfirm}
        title="Xác nhận kết thúc buổi học"
        message="Bạn có chắc chắn muốn kết thúc buổi học này? Sinh viên sẽ không thể tiếp tục điểm danh tự động sau khi kết thúc."
        confirmText="Kết thúc buổi học"
        cancelText="Quay lại"
        variant="danger"
        onConfirm={endSession}
        onCancel={() => setShowEndConfirm(false)}
      />
    </aside>
  )
}
