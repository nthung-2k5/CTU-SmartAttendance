import { Check, Clock, RefreshCw, Search } from 'lucide-react'
import { useState } from 'react'
import { type Student, useTeacherStore } from './store'

export function AttendanceTable() {
  const { enrolledStudents, checkIns, sessions, selectedSessionId, manualAttendance, refreshActiveSession } =
    useTeacherStore()
  const [search, setSearch] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const currentSession = sessions.find((s) => s.id === selectedSessionId)

  const students: (Student & {
    present: boolean
    late: boolean
  })[] = enrolledStudents
    .toSorted((a, b) => a.studentId!.localeCompare(b.studentId!))
    .map((s, index) => {
      const checkRecord = checkIns.find((c) => c.studentId === s.studentId)

      let isLate = false
      if (checkRecord && currentSession) {
        const lateThreshold = new Date(currentSession.sessionStartTime).getTime() + 15 * 60 * 1000
        if (new Date(checkRecord.checkInTimestamp).getTime() > lateThreshold) {
          isLate = true
        }
      }

      return {
        ...s,
        present: !!checkRecord,
        late: isLate,
      }
    })

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 gap-4">
      <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              Danh sách điểm danh
              {currentSession?.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={async () => {
                    setIsRefreshing(true)
                    await refreshActiveSession()
                    setTimeout(() => setIsRefreshing(false), 500) // slight delay for visual feedback
                  }}
                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                  title="Làm mới"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              )}
            </h3>
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
          {filtered.map((student, index) => (
            <div
              key={student.id}
              className={`grid grid-cols-12 px-5 py-3.5 items-center transition-colors hover:bg-gray-50/50 ${student.present ? '' : 'bg-red-50/40'}`}
            >
              <div className="col-span-1 text-xs text-gray-400 font-medium">{index}</div>
              <div className="col-span-3 text-xs font-mono text-gray-600">{student.studentId}</div>
              <div className="col-span-5 text-sm text-gray-800 font-medium">{student.name}</div>
              <div className="col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => manualAttendance(student.studentId!, !student.present)}
                  disabled={currentSession?.status !== 'ACTIVE'}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    student.present
                      ? 'bg-green-500 shadow-md shadow-green-200 hover:bg-green-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } ${currentSession?.status !== 'ACTIVE' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                >
                  {student.present && <Check size={14} color="white" strokeWidth={3} />}
                </button>
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  disabled={true}
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
    </main>
  )
}
