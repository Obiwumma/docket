export default function Home() {
  return (
    <div className="w-full">
      <section className="bg-[#091540] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              PROJECT MANAGEMENT. WITHOUT THE NOISE.
            </h1>
            <p className="text-lg text-gray-300">
              Plan work, assign tasks, and keep your team moving without unnecessary complexity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="bg-[#1B2CC1] text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition">
                START NOW
              </button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded hover:bg-white hover:text-[#091540] transition">
                LEARN MORE
              </button>
            </div>
          </div>

          <div className="w-full max-w-md bg-white p-4 rounded flex items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4lJdm61EALXDV-L0G5NqPjYhaY9IhNOJlBK3-non43bL74VoMw3UGl1TsTcsghFW-ziG0kmPoVmaMtlOzjnkJ-lggk-JO9Y4Fub-Gxx0up9_eM8KBZnTFafz5zyUiNqTyN6k6l5cRYQ2kxQG7gVutS72Pp9r87lAxLLCsdyhAsJjyHqMzU2NhSPQGlkGh0up83I9_LKPIC0XA5C_Qi9GJr1RzTizbYayY3R5zQ14izt6aYIYuea5J"
              alt="Project management illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white text-[#091540] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            EVERYTHING YOUR TEAM NEEDS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-[#091540] p-6 rounded bg-white hover:bg-[#091540] hover:text-white transition group cursor-pointer">
              <h3 className="text-xl font-bold mb-2">ASSIGN WORK</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                Give every task a clear owner and keep responsibilities organized.
              </p>
            </div>

            <div className="border-2 border-[#091540] p-6 rounded bg-white hover:bg-[#091540] hover:text-white transition group cursor-pointer">
              <h3 className="text-xl font-bold mb-2">TEAM VIEW</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                See upcoming work and understand what your team is working on.
              </p>
            </div>

            <div className="border-2 border-[#091540] p-6 rounded bg-white hover:bg-[#091540] hover:text-white transition group cursor-pointer">
              <h3 className="text-xl font-bold mb-2">CRUSH ITEMS</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                Track progress, complete tasks, and keep projects moving forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#091540] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            FROM IDEA TO DONE.
          </h2>

          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 border-b border-gray-700 pb-6">
              <span className="text-2xl font-bold text-[#1B2CC1]">01</span>
              <div>
                <h3 className="text-xl font-bold">CREATE</h3>
                <p className="text-gray-300">Create a task and define what needs to be done.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-gray-700 pb-6">
              <span className="text-2xl font-bold text-[#1B2CC1]">02</span>
              <div>
                <h3 className="text-xl font-bold">ASSIGN</h3>
                <p className="text-gray-300">Assign the work to the appropriate team member.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#1B2CC1]">03</span>
              <div>
                <h3 className="text-xl font-bold">COMPLETE</h3>
                <p className="text-gray-300">Track progress and mark the work complete.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1B2CC1] text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            DITCH THE NOISE.<br />GET WORK DONE.
          </h2>
          <p className="text-lg text-gray-200">
            Give your team a simpler way to manage work.
          </p>
          <button className="bg-white text-[#091540] font-bold py-3 px-8 rounded mt-4 hover:bg-gray-100 transition">
            START NOW
          </button>
        </div>
      </section>
    </div>
  );
}