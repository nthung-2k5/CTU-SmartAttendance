import { Check, CheckCheck, Clock, Download, Filter, RefreshCw, Search, UserCheck, Users, UserX, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmModal } from './ConfirmModal'
import { useTeacherStore } from './store'

type FilterStatus = 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT'

// Helper to generate pastel bg colors for student avatars based on name
function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-600 text-white',
    'bg-indigo-600 text-white',
    'bg-emerald-600 text-white',
    'bg-violet-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
    'bg-cyan-600 text-white',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function AttendanceTable() {
  const { enrolledStudents, checkIns, sessions, selectedSessionId, manualAttendance, refreshActiveSession } =
    useTeacherStore()

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showMarkAllConfirm, setShowMarkAllConfirm] = useState(false)

  const currentSession = sessions.find((s) => s.id === selectedSessionId)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 1. Compute attendance status for each student
  const studentsWithStatus = useMemo(() => {
    return enrolledStudents
      .toSorted((a, b) => (a.studentId || '').localeCompare(b.studentId || ''))
      .map((student) => {
        const checkRecord = checkIns.find((c) => c.studentId === student.studentId)

        let isLate = false
        let checkInTimeFormatted = ''

        if (checkRecord) {
          const timestamp = new Date(checkRecord.timestamp)
          checkInTimeFormatted = timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })

          if (currentSession) {
            const lateThreshold = new Date(currentSession.sessionStartTime).getTime() + 15 * 60 * 1000
            if (timestamp.getTime() > lateThreshold) {
              isLate = true
            }
          }
        }

        const isPresent = !!checkRecord

        return {
          ...student,
          present: isPresent,
          late: isLate,
          checkInTime: checkInTimeFormatted,
        }
      })
  }, [enrolledStudents, checkIns, currentSession])

  // 2. Filter students by search term & status tab
  const filteredStudents = useMemo(() => {
    return studentsWithStatus.filter((s) => {
      // Search filter
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase())

      if (!matchesSearch) return false

      // Tab status filter
      if (filterStatus === 'PRESENT') return s.present && !s.late
      if (filterStatus === 'LATE') return s.present && s.late
      if (filterStatus === 'ABSENT') return !s.present

      return true
    })
  }, [studentsWithStatus, search, filterStatus])

  // Counts for tabs
  const countTotal = studentsWithStatus.length
  const countPresent = studentsWithStatus.filter((s) => s.present && !s.late).length
  const countLate = studentsWithStatus.filter((s) => s.late).length
  const countAbsent = studentsWithStatus.filter((s) => !s.present).length

  // 3. Export to CSV
  const handleExportCSV = () => {
    if (studentsWithStatus.length === 0) return

    const headers = ['STT', 'MSSV', 'Họ và tên', 'Email', 'Trạng thái', 'Thời gian điểm danh']
    const rows = studentsWithStatus.map((s, index) => [
      index + 1,
      s.studentId || '',
      `"${s.name}"`,
      s.name || '',
      s.late ? 'Đi trễ' : s.present ? 'Có mặt' : 'Vắng mặt',
      s.checkInTime || '—',
    ])

    const csvContent = `\uFEFF${[headers.join(','), ...rows.map((e) => e.join(','))].join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `DiemDanh_${currentSession?.room.id || 'Lop'}_${new Date().toISOString().slice(0, 10)}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Đã xuất danh sách điểm danh thành công (File CSV)')
  }

  // 4. Mark all present
  const handleMarkAllPresent = async () => {
    if (currentSession?.status !== 'ACTIVE') return
    const absentStudents = studentsWithStatus.filter((s) => !s.present)
    for (const student of absentStudents) {
      if (student.studentId) {
        await manualAttendance(student.studentId, true)
      }
    }
    showToast(`Đã đánh dấu có mặt cho tất cả ${absentStudents.length} sinh viên`)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshActiveSession()
    setTimeout(() => setIsRefreshing(false), 500)
    showToast('Đã làm mới dữ liệu điểm danh')
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-50/60 p-4 sm:p-6 overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
        {/* Top Header & Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Danh sách sinh viên điểm danh</h1>
                {currentSession?.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    LIVE
                  </span>
                ) : currentSession ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Đã kết thúc
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentSession
                  ? `Buổi học tại phòng ${currentSession.room.name} • Bắt đầu lúc ${new Date(currentSession.sessionStartTime).toLocaleTimeString('vi-VN')}`
                  : 'Vui lòng chọn hoặc bắt đầu một buổi học từ bảng bên trái'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {currentSession?.status === 'ACTIVE' && (
                <>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
                    title="Cập nhật dữ liệu mới nhất"
                  >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
                    <span className="hidden sm:inline">Làm mới</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMarkAllConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 text-xs font-semibold transition-colors"
                    title="Đánh dấu tất cả sinh viên có mặt"
                  >
                    <CheckCheck size={14} />
                    <span className="hidden sm:inline">Điểm danh tất cả</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={studentsWithStatus.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Xuất báo cáo danh sách sinh viên ra file CSV"
              >
                <Download size={14} />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({countTotal})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('PRESENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === 'PRESENT'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Có mặt ({countPresent})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('LATE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === 'LATE' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Đi trễ ({countLate})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('ABSENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === 'ABSENT' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Vắng mặt ({countAbsent})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative md:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm MSSV hoặc Tên sinh viên..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 w-32">MSSV</th>
                <th className="py-3 px-6">Sinh viên</th>
                <th className="py-3 px-4 w-40 text-center">Giờ điểm danh</th>
                <th className="py-3 px-4 w-36 text-center">Trạng thái</th>
                <th className="py-3 px-4 w-28 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                        {search ? <Filter size={20} /> : <Users size={20} />}
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {search ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu sinh viên'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {search
                          ? `Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc`
                          : `Vui lòng chọn học phần có danh sách sinh viên đã đăng ký`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const initial = student.name ? student.name.trim().charAt(0).toUpperCase() : 'S'
                  const avatarBg = getAvatarColor(student.name || '')

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors hover:bg-blue-50/30 ${
                        student.late ? 'bg-amber-50/30' : student.present ? 'bg-emerald-50/20' : 'bg-white'
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-xs font-mono text-center text-slate-400 font-medium">
                        {index + 1}
                      </td>

                      {/* MSSV */}
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">{student.studentId}</td>

                      {/* Student info */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                          >
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm leading-snug">{student.name}</p>
                            {student.email && (
                              <p className="text-xs text-slate-400 leading-none mt-0.5">{student.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Check-in Timestamp */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs">
                        {student.checkInTime ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            <Clock size={12} className="text-slate-400" />
                            {student.checkInTime}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {student.late ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock size={12} />
                            Đi trễ
                          </span>
                        ) : student.present ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <UserCheck size={12} />
                            Có mặt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <UserX size={12} />
                            Vắng mặt
                          </span>
                        )}
                      </td>

                      {/* Manual Attendance Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (student.studentId) {
                              manualAttendance(student.studentId, !student.present)
                              showToast(
                                !student.present
                                  ? `Đã điểm danh cho SV ${student.name}`
                                  : `Đã hủy điểm danh cho SV ${student.name}`,
                              )
                            }
                          }}
                          disabled={currentSession?.status !== 'ACTIVE'}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 ${
                            student.present
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs shadow-emerald-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 border border-slate-200'
                          } ${currentSession?.status !== 'ACTIVE' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-95'}`}
                          title={
                            currentSession?.status !== 'ACTIVE'
                              ? 'Chỉ có thể điểm danh khi buổi học đang diễn ra'
                              : student.present
                                ? 'Bấm để hủy điểm danh'
                                : 'Bấm để đánh dấu có mặt'
                          }
                        >
                          <Check size={16} strokeWidth={student.present ? 3 : 2} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Hiển thị <strong className="text-slate-800">{filteredStudents.length}</strong> / {studentsWithStatus.length}{' '}
            sinh viên
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Có mặt: {countPresent + countLate}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Vắng mặt: {countAbsent}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Mark All */}
      <ConfirmModal
        isOpen={showMarkAllConfirm}
        title="Xác nhận điểm danh tất cả"
        message={`Bạn có chắc chắn muốn đánh dấu CÓ MẶT cho toàn bộ ${countAbsent} sinh viên đang vắng mặt?`}
        confirmText="Đồng ý điểm danh tất cả"
        cancelText="Hủy"
        variant="info"
        onConfirm={handleMarkAllPresent}
        onCancel={() => setShowMarkAllConfirm(false)}
      />
    </main>
  )
}
