"use client"

const AdditionalInfo = () => {
  return (
    <div className="mt-16 text-center">
      <h3 className="font-baloo mb-6 text-2xl font-bold tracking-wide text-[#1e1e3f] md:text-3xl">
        ✨ Magical Benefits of <br />
        Joining Us ✨
      </h3>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-0">
        <div className="transform rounded-xl border border-blue-50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="animate-pulse-slow mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-[#262b5f]">
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
          <h4 className="font-baloo mb-3 text-xl font-bold text-gray-800">
            Track Your Treasures 🚚
          </h4>
          <p className="font-fredoka text-gray-600">
            Follow your toy adventures from order to delivery, all in one
            magical place!
          </p>
        </div>

        <div className="transform rounded-xl border border-pink-50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="animate-bounce-slow mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-[#262b5f]">
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
          <h4 className="font-baloo mb-3 text-xl font-bold text-gray-800">
            Save Favorites ❤️
          </h4>
          <p className="font-fredoka text-gray-600">
            Build magical wishlists and save your little one&apos;s dream toys
            for special occasions!
          </p>
        </div>

        <div className="transform rounded-xl border border-green-50 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="animate-float mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-[#262b5f]">
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
          <h4 className="font-baloo mb-3 text-xl font-bold text-gray-800">
            Magical Recommendations ✨
          </h4>
          <p className="font-fredoka text-gray-600">
            Discover perfectly matched toys for your child&apos;s age,
            interests, and development stage!
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfo
