



export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
      
      

      {/* Main Content */}
      <main className="flex-1">
        {/* Tagline Section */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl bg-white border border-blue-100 shadow-md rounded-2xl p-8 md:p-12 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 tracking-wide">
              INFORMATION AND SERVICES TO MAKE YOUR GLOBAL TRAVEL CONVENIENT
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Explore step-by-step visa guidance, documentation support, and expert consultancy for your global
              journey. Simplify your travel process with Rahvana — your trusted visa partner.
            </p>
            <div className="flex justify-center pt-4">
              <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </section>

      

        {/* Additional Info Section (Optional - adds visual balance) */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Easy Navigation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clean and simple interface designed to help you find visa information quickly.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Verified Data</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All visa and service details are regularly verified for accuracy and reliability.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Step-by-Step Help</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Follow simple instructions and video guides to complete your forms with confidence.
              </p>
            </div>
        
   
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-white/70 backdrop-blur py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-blue-700">Rahvana</span>. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">Designed to simplify your global travel experience.</p>
        </div>
      </footer>
    </div>
  )
}
