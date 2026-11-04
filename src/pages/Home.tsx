import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  BrainCircuit,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Subject Management",
    description: "Organize all your subjects in one simple workspace.",
  },
  {
    icon: CheckCircle2,
    title: "Assignment Tracking",
    description: "Keep track of deadlines and manage your tasks easily.",
  },
  {
    icon: FileText,
    title: "AI Coursework Analysis",
    description: "Upload coursework PDFs and get AI-powered insights.",
  },
  {
    icon: BrainCircuit,
    title: "AI Study Planner",
    description: "Generate personalized study plans based on your workload.",
  },
  {
    icon: CalendarDays,
    title: "Study Calendar",
    description: "View your upcoming tasks and stay on schedule.",
  },
];

function Home() {
  return (
    <main className="min-h-screen bg-[#080d1b] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="rounded-xl bg-blue-600 p-2">
            <BookOpen size={21} />
          </span>
          StudyBuddy
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm text-slate-300 hover:text-white">
            Log in
          </a>
          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
          >
            Get Started
          </a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={15} />
            Your smarter study companion
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Study smarter.
            <span className="block text-blue-400">Achieve more.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Plan your studies, organize assignments and use AI-powered tools
            to make your learning journey more productive.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/register"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold hover:bg-blue-500"
            >
              Get Started <ArrowRight size={18} />
            </a>
            <a
              href="#features"
              className="rounded-lg border border-slate-700 px-6 py-3.5 font-semibold text-slate-200 hover:bg-slate-800"
            >
              Explore Features
            </a>
          </div>

          <p className="mt-7 text-sm text-slate-500">
            Everything you need to organize your academic life.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-[#111a2d] p-5 shadow-2xl shadow-blue-950/30 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Your workspace</p>
              <h2 className="mt-1 text-xl font-semibold">Study Overview</h2>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <BrainCircuit size={24} />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-700 bg-[#0b1323] p-4">
              <p className="text-sm text-slate-400">Subjects</p>
              <p className="mt-2 text-3xl font-bold">04</p>
              <p className="mt-1 text-xs text-slate-500">Organized subjects</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-[#0b1323] p-4">
              <p className="text-sm text-slate-400">Assignments</p>
              <p className="mt-2 text-3xl font-bold">08</p>
              <p className="mt-1 text-xs text-slate-500">Tasks to manage</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-700 bg-[#0b1323] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Today's Study Tasks</h3>
              <span className="text-xs text-blue-400">Preview</span>
            </div>
            <div className="mt-5 space-y-4">
              {["Review lecture notes", "Complete assignment", "Prepare for quiz"].map(
                (task, index) => (
                  <div key={task} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-600">
                      {index === 0 && <CheckCircle2 size={15} className="text-green-400" />}
                    </div>
                    <span className="text-sm text-slate-300">{task}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
            <Sparkles className="shrink-0 text-purple-400" size={21} />
            <p className="text-sm text-slate-300">
              AI-powered planning to help organize your study routine.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-800 bg-[#0b1221] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Everything in one place
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Simple tools to help you stay organized, manage coursework and
              make the most of your study time.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-800 bg-[#111a2d] p-6 transition-colors hover:border-blue-500/50"
              >
                <div className="inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Icon size={23} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to organize your studies?</h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Bring your subjects, assignments and study plans together with StudyBuddy.
        </p>
        <a
          href="/register"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
        >
          Create Your Account <ArrowRight size={18} />
        </a>
      </section>

      <footer className="border-t border-slate-800 px-6 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} StudyBuddy. Built for smarter learning.
      </footer>
    </main>
  );
}

export default Home;