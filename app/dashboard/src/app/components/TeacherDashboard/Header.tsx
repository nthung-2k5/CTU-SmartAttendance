import ctuLogo from '@dashboard/imports/GenerateWireframeDesign/97e3160c170c3b0c0e2ef6fc17335bd1e23871d5.png'
import { LogOut, User as UserIcon } from 'lucide-react'
import type { User } from '../../App'

export function DashboardHeader({ user, onLogout }: { user: User; onLogout: () => void }) {
  const teacherName = user.name
  const teacherId = user.teacherId

  return (
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
  )
}
