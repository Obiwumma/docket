import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-white text-[#091540]">
      <section className="bg-[#091540] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            ABOUT DOCKET<span className="text-[#1B2CC1]">.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            We are building project management tools without unnecessary noise, bloat, or complexity.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4 max-w-xl">
            <h2 className="text-3xl font-bold text-[#091540]">
              OUR MISSION
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Most project management software has become slow, cluttered, and overwhelming. Teams spend more time managing their tools than actually getting work done.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Docket was created to change that. Our mission is to provide a clean, modern, and ultra-fast workspace that keeps your team focused on what truly matters.
            </p>
          </div>

          <div className="w-full max-w-md bg-[#091540] text-white p-8 rounded border-2 border-[#1B2CC1] flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-white">By The Numbers</h3>
            
            <div className="flex flex-col gap-1 border-b border-gray-700 pb-4">
              <span className="text-4xl font-bold text-[#1B2CC1]">100+</span>
              <span className="text-gray-300 text-sm">Active Teams</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-gray-700 pb-4">
              <span className="text-4xl font-bold text-[#1B2CC1]">99.9%</span>
              <span className="text-gray-300 text-sm">Uptime Guaranteed</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-4xl font-bold text-[#1B2CC1]">0%</span>
              <span className="text-gray-300 text-sm">Unnecessary Noise</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#091540] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            OUR GUIDING PRINCIPLES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-2 border-white p-8 rounded bg-[#091540] hover:border-[#1B2CC1] transition">
              <h3 className="text-xl font-bold mb-3 text-white">SIMPLICITY FIRST</h3>
              <p className="text-gray-300 leading-relaxed">
                If a feature doesn't make work clearer or faster, it doesn't belong in Docket.
              </p>
            </div>

            <div className="border-2 border-white p-8 rounded bg-[#091540] hover:border-[#1B2CC1] transition">
              <h3 className="text-xl font-bold mb-3 text-white">LIGHTNING FAST</h3>
              <p className="text-gray-300 leading-relaxed">
                Speed is a core feature. We optimize every pixel and interaction for zero latency.
              </p>
            </div>

            <div className="border-2 border-white p-8 rounded bg-[#091540] hover:border-[#1B2CC1] transition">
              <h3 className="text-xl font-bold mb-3 text-white">TEAM CENTERED</h3>
              <p className="text-gray-300 leading-relaxed">
                Built to bring clarity to ownership so everyone knows who is responsible for what.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1B2CC1] text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            READY TO SIMPLIFY YOUR WORKFLOW?
          </h2>
          <p className="text-lg text-gray-200">
            Join thousands of teams getting work done with Docket.
          </p>
          <Link href="/login" className="bg-white text-[#091540] font-bold py-3 px-8 rounded hover:bg-gray-100 transition">
            GET STARTED NOW
          </Link>
        </div>
      </section>
    </div>
  );
}
