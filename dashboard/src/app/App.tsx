import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { auth } from "../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50">Đang tải...</div>;
  }

  return (
    <div className="size-full bg-gray-50 overflow-auto">
      {!user ? (
        <LoginScreen onLogin={() => {}} />
      ) : (
        <TeacherDashboard user={user} onLogout={() => auth.signOut()} />
      )}
    </div>
  );
}
