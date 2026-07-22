import { useEffect, useState } from 'react'
import { api } from '../config/api'
import { LoginScreen } from './components/LoginScreen'
import { TeacherDashboard } from './components/TeacherDashboard'

export interface User {
  id: string
  teacherId: string
  email: string
  role: string
  name: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await api.teacher.me.get()

        if (data?.user) {
          setUser(data.user as User)
        }
      } catch (e) {
        // error handling
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50">Đang tải...</div>
  }

  const handleLogin = () => {
    window.location.reload() // Reload to fetch user
  }

  const handleLogout = async () => {
    await api.logout.teacher.post()
    setUser(null)
  }

  return (
    <div className="size-full bg-gray-50 overflow-auto">
      {!user ? <LoginScreen onLogin={handleLogin} /> : <TeacherDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}
