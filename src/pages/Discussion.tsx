
import { MessageSquare } from "lucide-react";

function Discussion() {
  return (
    <div className="min-h-screen bg-[#F5F7F0] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#374638]">
            Discussion
          </h1>
          <p className="mt-2 text-[#879183]">
            Share ideas, ask questions and connect with other students.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5EBDD] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DCE8D5] text-[#718B68]">
            <MessageSquare size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#374638]">
            Student Community
          </h2>
          <p className="mt-2 text-sm text-[#879183]">
            Your discussion feed will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Discussion;
