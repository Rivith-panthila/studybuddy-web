
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
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutSuccess } from "../features/auth/authSlice";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Subjects", path: "/subjects", icon: BookOpen },
  { name: "Assignments", path: "/assignments", icon: ClipboardList },
  { name: "Calendar", path: "/calendar", icon: CalendarDays },
  { name: "Study Planner", path: "/study-planner", icon: GraduationCap },
  { name: "Profile", path: "/profile", icon: UserRound },
];

function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch(logoutSuccess());
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const sidebarContent = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <Logo size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">StudyBuddy</h1>
          <p className="text-xs text-gray-500">Your learning partner</p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
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
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
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

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 font-semibold text-blue-400">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Student"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email || "StudyBuddy User"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#080d1b]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-[#0d1528] lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0d1528] px-5 lg:hidden">
        <div className="flex items-center gap-2 text-white">
          <Logo className="text-blue-400" />
          <span className="font-bold">StudyBuddy</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#0d1528]">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Page Content */}
      <main className="min-h-screen min-w-0 lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
