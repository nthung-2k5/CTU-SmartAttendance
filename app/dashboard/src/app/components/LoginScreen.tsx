import { api } from '@dashboard/config/api'
import ctuLogo from '@dashboard/imports/GenerateWireframeDesign/97e3160c170c3b0c0e2ef6fc17335bd1e23871d5.png'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [teacherId, setTeacherId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: apiError } = await api.login.teacher.post({
        teacherId,
        password,
      })

      if (apiError || !data || !data.success) {
        throw new Error((data as any)?.message || 'Đăng nhập thất bại')
      }

      onLogin()
    } catch (err: any) {
      setError(err.message || 'Tài khoản hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="teacherId">
          Mã Giảng Viên
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={18} />
          </div>
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            placeholder="GV001"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
          Mật khẩu
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-linear-to-r from-blue-700 to-blue-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  )

  return (
    <>
      {/* ── Mobile: full-gradient layout ── */}
      <div className="md:hidden min-h-screen bg-linear-to-br from-blue-700 via-blue-600 to-blue-500 flex flex-col items-center justify-center p-6">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 mb-4">
            <img src={ctuLogo} alt="CTU Logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">CTU-SmartAttendance</h1>
          <p className="text-blue-200 text-sm mt-1">Hệ thống điểm danh thông minh</p>
        </div>

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-gray-800 text-xl font-bold mb-1">Đăng nhập</h2>
          <p className="text-gray-500 text-sm mb-6">Dành cho Giảng viên CTU</p>
          {form}
        </div>

        <p className="text-blue-200 text-xs mt-6">Đại học Cần Thơ © 2026</p>
      </div>

      {/* ── Desktop: two-column layout ── */}
      <div className="hidden md:flex min-h-screen">
        {/* Left branding panel */}
        <div className="relative flex flex-col items-center justify-center p-12 bg-linear-to-br from-blue-800 via-blue-700 to-blue-500 w-2/5 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white opacity-5 rounded-full" />
          <div className="absolute bottom-10 -right-10 w-48 h-48 bg-white opacity-5 rounded-full" />
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white opacity-5 rounded-full" />

          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-6">
              <img src={ctuLogo} alt="CTU Logo" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
            <h1 className="text-white text-3xl font-bold tracking-wide mb-2">CTU-SmartAttendance</h1>
            <p className="text-blue-200 text-base">Hệ thống điểm danh thông minh</p>

            <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
              {['Điểm danh nhanh chóng, chính xác', 'Quản lý lớp học dễ dàng', 'Báo cáo tức thời'].map((feat) => (
                <div key={feat} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-white text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="absolute bottom-6 text-blue-300 text-xs">Đại học Cần Thơ © 2026</p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white">
          <div className="w-full max-w-sm">
            <h2 className="text-gray-800 text-2xl font-bold mb-1">Đăng nhập</h2>
            <p className="text-gray-500 text-sm mb-8">Dành cho Giảng viên CTU</p>
            {form}
          </div>
        </div>
      </div>
    </>
  )
}
