
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarDays,
  GraduationCap,
  UserRound,
  LogOut,
  Menu,
  X,
  GraduationCap as Logo,
  AlertCircle,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutSuccess } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Subjects", path: "/subjects", icon: BookOpen },
  { name: "Assignments", path: "/assignments", icon: ClipboardList },
  { name: "Calendar", path: "/calendar", icon: CalendarDays },
  { name: "Study Planner", path: "/study-planner", icon: GraduationCap },
  { name: "Discussion", path: "/discussion", icon: MessageSquare },
  { name: "Profile", path: "/profile", icon: UserRound },
];

function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    dispatch(logoutSuccess());
    setMobileMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const sidebarContent = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-[#E5EBDD] px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCE8D5] text-[#718B68]">
          <Logo size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#374638]">StudyBuddy</h1>
          <p className="text-xs text-[#879183]">Your learning partner</p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-[#879183]">
          Main Menu
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#DCE8D5] text-[#4F7049]"
                      : "text-[#697566] hover:bg-[#F0F4EB] hover:text-[#374638]"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-[#E5EBDD] p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F0F4EB] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCE8D5] font-semibold text-[#4F7049]">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#374638]">
              {user?.name || "Student"}
            </p>
            <p className="truncate text-xs text-[#879183]">
              {user?.email || "StudyBuddy User"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="mb-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#526052] transition hover:bg-[#F0F4EB]"
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#B56D62] transition hover:bg-[#F9EEEA]"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F0]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-[#E5EBDD] bg-white lg:flex">
        {sidebarContent}
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5EBDD] bg-white px-5 lg:hidden">
        <div className="flex items-center gap-2 text-[#374638]">
          <Logo className="text-[#718B68]" />
          <span className="font-bold">StudyBuddy</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-[#374638] hover:bg-[#F0F4EB]"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          />

          <aside className="relative flex h-full w-72 flex-col bg-white">
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="min-h-screen min-w-0 lg:ml-72">
        <Outlet />
      </main>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl border border-[#E5EBDD] bg-white p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F9EEEA] text-[#B56D62]">
              <AlertCircle size={28} />
            </div>

            <h2
              id="logout-title"
              className="text-center text-xl font-bold text-[#374638]"
            >
              Confirm Logout
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-[#879183]">
              Are you sure you want to logout from your StudyBuddy account?
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-[#E5EBDD] bg-[#F5F7F0] px-4 py-3 text-sm font-semibold text-[#526052] transition hover:bg-[#F0F4EB]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-[#B56D62] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#A75B50]"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
