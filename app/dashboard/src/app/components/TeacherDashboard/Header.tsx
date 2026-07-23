import ctuLogo from '@dashboard/imports/GenerateWireframeDesign/97e3160c170c3b0c0e2ef6fc17335bd1e23871d5.png'
import { LogOut, Radio, ShieldCheck, User as UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User } from '../../App'
import { useTeacherStore } from './store'

export function DashboardHeader({ user, onLogout }: { user: User; onLogout: () => void }) {
  const teacherName = user.name
  const teacherId = user.teacherId
  const { sessions, selectedSessionId } = useTeacherStore()
  const activeSession = sessions.find((s) => s.id === selectedSessionId && s.status === 'ACTIVE')

  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const dateStr = now.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      // Capitalize first letter of weekday
      const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
      setCurrentDate(formattedDate)
      setCurrentTime(timeStr)
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white relative shadow-md z-30 shrink-0">
      {/* Decorative gradient overlay line */}
      <div className="h-1 w-full bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
            <div className="relative w-10 h-10 bg-slate-800/90 rounded-xl p-1.5 border border-slate-700 flex items-center justify-center">
              <img src={ctuLogo} alt="CTU Logo" className="w-full h-full object-contain drop-shadow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-linear-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                CTU SmartAttendance
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                Giảng viên
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Trường Đại học Cần Thơ • Hệ thống điểm danh tự động</p>
          </div>
        </div>

        {/* Middle: Active Session Live Pill (If active) */}
        {activeSession ? (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium animate-pulse">
            <Radio size={14} className="text-emerald-400 animate-spin" />
            <span>Đang điểm danh trực tiếp tại phòng {activeSession.room.name}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>Phiên làm việc bảo mật</span>
          </div>
        )}

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Live Date Time display */}
          <div className="hidden md:flex flex-col items-end text-xs text-slate-300 border-r border-slate-800 pr-4">
            <span className="font-mono font-semibold text-slate-200 text-sm tracking-wide">{currentTime}</span>
            <span className="text-slate-400 text-[11px]">{currentDate}</span>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white shadow-inner text-sm border border-white/10">
              {teacherName ? teacherName.charAt(0).toUpperCase() : <UserIcon size={16} />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-100 tracking-wide line-clamp-1">{teacherName}</p>
              <p className="text-[11px] text-blue-300 font-mono">MSGV: {teacherId}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-600/90 text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-rose-500 transition-all duration-200 text-xs font-semibold shadow-sm group"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  )
}
