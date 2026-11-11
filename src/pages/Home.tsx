
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
} from "lucide-react";

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d1b] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080d1b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <GraduationCap size={25} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">
                StudyBuddy
              </span>
              <p className="text-[10px] tracking-wider text-slate-500">
                YOUR LEARNING PARTNER
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-9 text-sm text-slate-400 md:flex">
            <a href="#" className="transition hover:text-blue-400">
              Home
            </a>
            <a href="#features" className="transition hover:text-blue-400">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-blue-400">
              How It Works
            </a>
            <a href="#about" className="transition hover:text-blue-400">
              About
            </a>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <a
              href="/login"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </a>
            <a
              href="/register"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Get Started <ArrowRight className="ml-1 inline" size={16} />
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-700 p-2 text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0d1528] px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5 text-sm text-slate-300">
              <a href="#" onClick={closeMobileMenu}>Home</a>
              <a href="#features" onClick={closeMobileMenu}>Features</a>
              <a href="#how-it-works" onClick={closeMobileMenu}>How It Works</a>
              <a href="#about" onClick={closeMobileMenu}>About</a>
              <div className="flex gap-3 border-t border-white/10 pt-4">
                <a href="/login" className="flex-1 rounded-lg border border-slate-700 py-3 text-center">
                  Log in
                </a>
                <a href="/register" className="flex-1 rounded-lg bg-blue-600 py-3 text-center font-semibold">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative px-6">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles size={16} />
              Your smarter study companion
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.13] tracking-tight sm:text-6xl lg:text-7xl">
              Study smarter.
              <span className="mt-2 block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Achieve more.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Take control of your academic life. Organize subjects, manage
              assignments and create personalized study plans with the power
              of AI — all in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/register"
                className="group inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold shadow-xl shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Get Started Free
                <ArrowRight size={19} className="transition group-hover:translate-x-1" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-white/[0.03] px-7 py-4 font-semibold text-slate-200 transition hover:border-blue-500/50 hover:bg-white/[0.06]"
              >
                Explore Features
                <ChevronRight size={18} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-400" />
                Simple to use
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-400" />
                AI-assisted planning
              </span>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[#111a2d] p-4 shadow-2xl shadow-blue-950/50 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                    <LayoutDashboard size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">YOUR WORKSPACE</p>
                    <h2 className="font-semibold">Study Overview</h2>
                  </div>
                </div>
                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  Preview
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-700/70 bg-[#0b1323] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Subjects</span>
                    <BookOpen size={18} className="text-blue-400" />
                  </div>
                  <p className="mt-3 text-3xl font-bold">04</p>
                  <p className="mt-1 text-xs text-slate-500">Organized subjects</p>
                </div>

                <div className="rounded-xl border border-slate-700/70 bg-[#0b1323] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Assignments</span>
                    <FileText size={18} className="text-purple-400" />
                  </div>
                  <p className="mt-3 text-3xl font-bold">08</p>
                  <p className="mt-1 text-xs text-slate-500">Tasks to manage</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-700/70 bg-[#0b1323] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Today's Study Tasks</h3>
                  <span className="text-xs text-blue-400">Your plan</span>
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
                        className={item.done ? "text-green-400" : "text-slate-600"}
                      />
                      <span className={`flex-1 text-sm ${item.done ? "text-slate-500 line-through" : "text-slate-300"}`}>
                        {item.task}
                      </span>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="rounded-lg bg-blue-500/15 p-2 text-blue-400">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-200">
                    AI Study Assistant
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Your workload, organized intelligently.
                  </p>
                </div>
                <Sparkles className="ml-auto text-blue-400" size={19} />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-xl border border-slate-700 bg-[#17243a] p-4 shadow-xl sm:flex">
              <div className="rounded-lg bg-green-500/15 p-2 text-green-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">Stay organized</p>
                <p className="text-xs text-slate-400">One step at a time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-24 border-t border-slate-800/80 bg-[#0b1221] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              What StudyBuddy offers
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to
              <span className="block text-blue-400">study with confidence.</span>
            </h2>
            <p className="mt-5 leading-7 text-slate-400">
              Bring your academic activities together with tools designed to
              make studying simpler and more organized.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-800 bg-[#111a2d] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-[#142039]"
              >
                <div className={`inline-flex rounded-xl p-3 ${
                  color === "purple" ? "bg-purple-500/10 text-purple-400" :
                  color === "cyan" ? "bg-cyan-500/10 text-cyan-400" :
                  color === "indigo" ? "bg-indigo-500/10 text-indigo-400" :
                  color === "orange" ? "bg-orange-500/10 text-orange-400" :
                  color === "green" ? "bg-green-500/10 text-green-400" :
                  "bg-blue-500/10 text-blue-400"
                }`}>
                  <Icon size={25} />
                </div>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-400 opacity-0 transition group-hover:opacity-100">
                  Learn more <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              Get started in three steps
            </p>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Your journey to smarter studying
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              A simple way to bring structure and clarity to your academic life.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative rounded-2xl border border-slate-800 bg-[#111a2d] p-7">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                    <Icon size={25} />
                  </div>
                  <span className="text-4xl font-bold text-slate-800">{number}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI HIGHLIGHT */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#12254a] via-[#101c37] to-[#11152a] p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-blue-500/15 blur-[100px]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
                <Sparkles size={16} />
                AI-powered learning
              </div>
              <h2 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
                Turn your coursework into a
                <span className="text-blue-400"> smarter study plan.</span>
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-slate-400">
                Upload your coursework PDF, set your study preferences and
                let AI help break your workload into manageable study tasks.
              </p>
              <a
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
              >
                Try StudyBuddy <ArrowRight size={18} />
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#080f20]/70 p-6 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="rounded-xl bg-purple-500/15 p-3 text-purple-300">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="font-semibold">AI Study Planner</p>
                  <p className="text-xs text-slate-500">Personalized schedule preview</p>
                </div>
              </div>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="text-blue-400" size={19} />
                  <span className="text-sm text-slate-300">Your available study time</span>
                  <span className="ml-auto text-sm font-semibold">3 hours/day</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                </div>
                {["Review coursework requirements", "Work on assignment tasks", "Revise important topics"].map((task, index) => (
                  <div key={task} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-xs font-bold text-blue-400">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-300">{task}</span>
                    <CheckCircle2 className="ml-auto text-green-400" size={17} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / CTA */}
      <section id="about" className="scroll-mt-24 border-t border-slate-800 bg-[#0b1221] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <GraduationCap size={30} />
          </div>
          <h2 className="mt-7 text-3xl font-bold sm:text-5xl">
            Ready to take control of your studies?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-400">
            Start organizing your academic life today. Bring your subjects,
            assignments and study plans together with StudyBuddy.
          </p>
          <a
            href="/register"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
          >
            Create Your Account <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#080d1b] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 sm:flex-row">
          <a href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold">StudyBuddy</span>
          </a>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="#features" className="transition hover:text-blue-400">Features</a>
            <a href="#how-it-works" className="transition hover:text-blue-400">How It Works</a>
            <a href="/login" className="transition hover:text-blue-400">Log in</a>
            <a href="/register" className="transition hover:text-blue-400">Register</a>
          </div>

          <p className="text-center text-xs text-slate-600">
            © {new Date().getFullYear()} StudyBuddy. Built for smarter learning.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
