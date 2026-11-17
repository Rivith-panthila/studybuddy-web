
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Clock3,
  Target,
  LayoutDashboard,
  GraduationCap,
  Upload,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    icon: BookOpen,
    title: "Subject Management",
    description:
      "Keep all your academic subjects organized in one simple workspace.",
    color: "blue",
  },
  {
    icon: CheckCircle2,
    title: "Assignment Tracking",
    description:
      "Manage your assignments, monitor deadlines and track completion.",
    color: "purple",
  },
  {
    icon: FileText,
    title: "AI Coursework Analysis",
    description:
      "Upload coursework PDFs and let AI identify tasks and important deadlines.",
    color: "cyan",
  },
  {
    icon: BrainCircuit,
    title: "AI Study Planner",
    description:
      "Generate personalized study schedules based on your workload and free time.",
    color: "indigo",
  },
  {
    icon: CalendarDays,
    title: "Study Calendar",
    description:
      "See your upcoming deadlines and keep your academic schedule organized.",
    color: "orange",
  },
  {
    icon: Target,
    title: "Progress Tracking",
    description:
      "Monitor your completed study tasks and stay focused on your goals.",
    color: "green",
  },
];

const steps = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Create your account",
    description: "Get started with your personal StudyBuddy workspace.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Organize your coursework",
    description: "Add subjects, manage assignments and upload coursework PDFs.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Plan smarter with AI",
    description: "Generate a personalized study plan and track your progress.",
  },
];

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center gap-2 rounded-xl border border-[#C9D7C1] bg-white px-3 py-2.5 text-sm font-medium text-[#374638] shadow-sm transition hover:bg-[#F0F4EB]"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7F0] text-[#374638]">
      <nav className="sticky top-0 z-50 border-b border-[#E5EBDD] bg-[#F5F7F0]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#718B68] text-white shadow-lg shadow-[#718B68]/20">
              <GraduationCap size={25} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#374638]">
                StudyBuddy
              </span>
              <p className="text-[10px] tracking-wider text-[#879183]">
                YOUR LEARNING PARTNER
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-9 text-sm text-[#687666] md:flex">
            <a href="#" className="transition hover:text-[#718B68]">
              Home
            </a>
            <a href="#features" className="transition hover:text-[#718B68]">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-[#718B68]">
              How It Works
            </a>
            <a href="#about" className="transition hover:text-[#718B68]">
              About
            </a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {themeButton}

            <a
              href="/login"
              className="text-sm font-medium text-[#52634F] transition hover:text-[#374638]"
            >
              Log in
            </a>
            <a
              href="/register"
              className="rounded-xl bg-[#718B68] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#718B68]/20 transition hover:-translate-y-0.5 hover:bg-[#5F7957]"
            >
              Get Started <ArrowRight className="ml-1 inline" size={16} />
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-[#DCE8D5] p-2 text-[#52634F] md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#E5EBDD] bg-[#F0F4EB] px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5 text-sm text-[#52634F]">
              <a href="#" onClick={closeMobileMenu}>Home</a>
              <a href="#features" onClick={closeMobileMenu}>Features</a>
              <a href="#how-it-works" onClick={closeMobileMenu}>How It Works</a>
              <a href="#about" onClick={closeMobileMenu}>About</a>

              <div className="border-t border-[#E5EBDD] pt-4">
                {themeButton}
              </div>

              <div className="flex gap-3">
                <a
                  href="/login"
                  className="flex-1 rounded-lg border border-[#C9D7C1] py-3 text-center"
                >
                  Log in
                </a>
                <a
                  href="/register"
                  className="flex-1 rounded-lg bg-[#718B68] py-3 text-center font-semibold text-white"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative px-6">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#718B68]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#B9CCAF]/30 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#C9D7C1] bg-[#EAF2E5] px-4 py-2 text-sm text-[#526D4D]">
              <Sparkles size={16} />
              Your smarter study companion
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.13] tracking-tight text-[#374638] sm:text-6xl lg:text-7xl">
              Study smarter.
              <span className="mt-2 block bg-gradient-to-r from-[#718B68] to-[#A1B995] bg-clip-text text-transparent">
                Achieve more.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#758172] sm:text-lg">
              Take control of your academic life. Organize subjects, manage
              assignments and create personalized study plans with the power
              of AI — all in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/register"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#718B68] px-7 py-4 font-semibold text-white shadow-xl shadow-[#718B68]/20 transition hover:-translate-y-1 hover:bg-[#5F7957]"
              >
                Get Started Free
                <ArrowRight size={19} className="transition group-hover:translate-x-1" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE8D5] bg-white px-7 py-4 font-semibold text-[#52634F] transition hover:border-[#AFC3A5] hover:bg-[#FAFBF8]"
              >
                Explore Features
                <ChevronRight size={18} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#879183]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#718B68]" />
                Simple to use
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#718B68]" />
                AI-assisted planning
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#718B68]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-[#E5EBDD] bg-white p-4 shadow-2xl shadow-[#526D4D]/10 sm:p-6">
              <div className="flex items-center justify-between border-b border-[#E5EBDD] pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#EAF2E5] p-3 text-[#718B68]">
                    <LayoutDashboard size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-[#879183]">YOUR WORKSPACE</p>
                    <h2 className="font-semibold text-[#374638]">Study Overview</h2>
                  </div>
                </div>
                <span className="rounded-full border border-[#C9D7C1] bg-[#EAF2E5] px-3 py-1 text-xs text-[#526D4D]">
                  Preview
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#879183]">Subjects</span>
                    <BookOpen size={18} className="text-[#718B68]" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-[#374638]">04</p>
                  <p className="mt-1 text-xs text-[#879183]">Organized subjects</p>
                </div>

                <div className="rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#879183]">Assignments</span>
                    <FileText size={18} className="text-[#718B68]" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-[#374638]">08</p>
                  <p className="mt-1 text-xs text-[#879183]">Tasks to manage</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#374638]">Today's Study Tasks</h3>
                  <span className="text-xs text-[#718B68]">Your plan</span>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    { task: "Review lecture notes", time: "09:00 AM", done: true },
                    { task: "Complete assignment", time: "11:00 AM", done: false },
                    { task: "Prepare for quiz", time: "02:00 PM", done: false },
                  ].map((item) => (
                    <div key={item.task} className="flex items-center gap-3">
                      <CheckCircle2
                        size={19}
                        className={item.done ? "text-[#718B68]" : "text-[#C9D7C1]"}
                      />
                      <span className={`flex-1 text-sm ${item.done ? "text-[#879183] line-through" : "text-[#52634F]"}`}>
                        {item.task}
                      </span>
                      <span className="text-xs text-[#879183]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#C9D7C1] bg-[#EAF2E5] p-4">
                <div className="rounded-lg bg-[#DCE8D5] p-2 text-[#718B68]">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#526D4D]">
                    AI Study Assistant
                  </p>
                  <p className="mt-1 text-xs text-[#758172]">
                    Your workload, organized intelligently.
                  </p>
                </div>
                <Sparkles className="ml-auto text-[#718B68]" size={19} />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-xl border border-[#E5EBDD] bg-white p-4 shadow-xl sm:flex">
              <div className="rounded-lg bg-[#EAF2E5] p-2 text-[#718B68]">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#374638]">Stay organized</p>
                <p className="text-xs text-[#879183]">One step at a time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 border-t border-[#E5EBDD] bg-[#F0F4EB] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#718B68]">
              What StudyBuddy offers
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#374638] sm:text-4xl">
              Everything you need to
              <span className="block text-[#718B68]">study with confidence.</span>
            </h2>
            <p className="mt-5 leading-7 text-[#758172]">
              Bring your academic activities together with tools designed to
              make studying simpler and more organized.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#E5EBDD] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#B9CCAF] hover:bg-[#FAFBF8]"
              >
                <div className="inline-flex rounded-xl bg-[#EAF2E5] p-3 text-[#718B68]">
                  <Icon size={25} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[#374638]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#758172]">
                  {description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#718B68] opacity-0 transition group-hover:opacity-100">
                  Learn more <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#718B68]">
              Get started in three steps
            </p>
            <h2 className="mt-5 text-3xl font-bold text-[#374638] sm:text-4xl">
              Your journey to smarter studying
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#758172]">
              A simple way to bring structure and clarity to your academic life.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative rounded-2xl border border-[#E5EBDD] bg-white p-7 shadow-sm shadow-[#526D4D]/5">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-[#EAF2E5] p-3 text-[#718B68]">
                    <Icon size={25} />
                  </div>
                  <span className="text-4xl font-bold text-[#DCE8D5]">{number}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold text-[#374638]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#758172]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#C9D7C1] bg-gradient-to-br from-[#EAF2E5] via-[#F0F4EB] to-[#DCE8D5] p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#718B68]/15 blur-[100px]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9D7C1] bg-white/70 px-4 py-2 text-sm text-[#526D4D]">
                <Sparkles size={16} />
                AI-powered learning
              </div>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-[#374638] sm:text-4xl">
                Turn your coursework into a
                <span className="text-[#718B68]"> smarter study plan.</span>
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-[#758172]">
                Upload your coursework PDF, set your study preferences and
                let AI help break your workload into manageable study tasks.
              </p>
              <a
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#718B68] px-6 py-3.5 font-semibold text-white transition hover:bg-[#5F7957]"
              >
                Try StudyBuddy <ArrowRight size={18} />
              </a>
            </div>

            <div className="rounded-2xl border border-[#E5EBDD] bg-white/80 p-6 shadow-2xl shadow-[#526D4D]/10">
              <div className="flex items-center gap-3 border-b border-[#E5EBDD] pb-5">
                <div className="rounded-xl bg-[#EAF2E5] p-3 text-[#718B68]">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="font-semibold text-[#374638]">AI Study Planner</p>
                  <p className="text-xs text-[#879183]">Personalized schedule preview</p>
                </div>
              </div>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="text-[#718B68]" size={19} />
                  <span className="text-sm text-[#52634F]">Your available study time</span>
                  <span className="ml-auto text-sm font-semibold text-[#374638]">3 hours/day</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#DCE8D5]">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#718B68] to-[#A1B995]" />
                </div>
                {["Review coursework requirements", "Work on assignment tasks", "Revise important topics"].map((task, index) => (
                  <div key={task} className="flex items-center gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] p-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF2E5] text-xs font-bold text-[#526D4D]">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[#52634F]">{task}</span>
                    <CheckCircle2 className="ml-auto text-[#718B68]" size={17} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-t border-[#E5EBDD] bg-[#F0F4EB] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2E5] text-[#718B68]">
            <GraduationCap size={30} />
          </div>
          <h2 className="mt-7 text-3xl font-bold text-[#374638] sm:text-5xl">
            Ready to take control of your studies?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-[#758172]">
            Start organizing your academic life today. Bring your subjects,
            assignments and study plans together with StudyBuddy.
          </p>
          <a
            href="/register"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#718B68] px-8 py-4 font-semibold text-white shadow-xl shadow-[#718B68]/20 transition hover:-translate-y-1 hover:bg-[#5F7957]"
          >
            Create Your Account <ArrowRight size={19} />
          </a>
        </div>
      </section>

      <footer className="border-t border-[#E5EBDD] bg-[#F5F7F0] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 sm:flex-row">
          <a href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-[#718B68] p-2 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold text-[#374638]">StudyBuddy</span>
          </a>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#879183]">
            <a href="#features" className="transition hover:text-[#718B68]">Features</a>
            <a href="#how-it-works" className="transition hover:text-[#718B68]">How It Works</a>
            <a href="/login" className="transition hover:text-[#718B68]">Log in</a>
            <a href="/register" className="transition hover:text-[#718B68]">Register</a>
          </div>

          <p className="text-center text-xs text-[#879183]">
            © {new Date().getFullYear()} StudyBuddy. Built for smarter learning.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
