"use client"

const AdditionalInfo = () => {
  return (
    <div className="mt-16 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-[#1e1e3f] mb-6 font-baloo tracking-wide">
        ✨ Magical Benefits of <br />
        Joining Us ✨
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4 md:px-0">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-50">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5 text-[#262b5f] animate-pulse-slow">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21V11M4 7L12 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h4 className="font-bold text-xl text-gray-800 mb-3 font-baloo">
            Track Your Treasures 🚚
          </h4>
          <p className="text-gray-600 font-fredoka">
            Follow your toy adventures from order to delivery, all in one
            magical place!
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-pink-50">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-5 text-[#262b5f] animate-bounce-slow">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h4 className="font-bold text-xl text-gray-800 mb-3 font-baloo">
            Save Favorites ❤️
          </h4>
          <p className="text-gray-600 font-fredoka">
            Build magical wishlists and save your little one&apos;s dream toys
            for special occasions!
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-green-50">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-[#262b5f] animate-float">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h4 className="font-bold text-xl text-gray-800 mb-3 font-baloo">
            Magical Recommendations ✨
          </h4>
          <p className="text-gray-600 font-fredoka">
            Discover perfectly matched toys for your child&apos;s age,
            interests, and development stage!
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfo
