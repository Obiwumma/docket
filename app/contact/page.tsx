"use client";

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-white text-[#091540]">
      <section className="bg-[#091540] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            CONTACT US<span className="text-[#1B2CC1]">.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            Have questions or need help? Send us a message and our team will get back to you promptly.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6 bg-white p-8 border-2 border-[#091540] rounded">
            <h2 className="text-2xl font-bold text-[#091540]">
              SEND A MESSAGE
            </h2>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#091540]">YOUR NAME</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1B2CC1]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#091540]">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1B2CC1]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#091540]">SUBJECT</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1B2CC1]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#091540]">MESSAGE</label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1B2CC1]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#1B2CC1] text-white font-bold py-3 px-6 rounded mt-2 hover:bg-blue-700 transition"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="bg-[#091540] text-white p-8 rounded border-2 border-[#1B2CC1] flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white">GET IN TOUCH</h2>
              
              <div className="flex flex-col gap-1 border-b border-gray-700 pb-4">
                <span className="text-sm text-[#1B2CC1] font-bold">EMAIL US</span>
                <span className="text-lg font-semibold">support@docket.com</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-gray-700 pb-4">
                <span className="text-sm text-[#1B2CC1] font-bold">OFFICE LOCATION</span>
                <span className="text-lg font-semibold">100 Tech Plaza, Suite 400<span className="block text-gray-300 text-sm font-normal">San Francisco, CA 94107</span></span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#1B2CC1] font-bold">SUPPORT HOURS</span>
                <span className="text-lg font-semibold">Monday - Friday</span>
                <span className="text-gray-300 text-sm">9:00 AM - 6:00 PM EST</span>
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-[#091540] rounded flex flex-col gap-4">
              <h3 className="text-xl font-bold text-[#091540]">FAST SUPPORT RESPONSE</h3>
              <p className="text-gray-600 leading-relaxed">
                We prioritize clarity and speed. Most inquiries receive a response from our team within 24 hours.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-[#091540] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-2 border-white p-6 rounded bg-[#091540]">
              <h3 className="text-lg font-bold mb-2 text-white">How quickly can my team get started?</h3>
              <p className="text-gray-300">
                You can set up your team in less than 2 minutes. There is no complex installation required.
              </p>
            </div>

            <div className="border-2 border-white p-6 rounded bg-[#091540]">
              <h3 className="text-lg font-bold mb-2 text-white">Do you offer custom enterprise plans?</h3>
              <p className="text-gray-300">
                Yes! Reach out to us using the contact form above and our team will customize a plan for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
