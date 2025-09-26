"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useState } from "react"

const JoyfulQuestionnaire = dynamic(
  () => import("@/modules/questionnaire/template/questionnaire"),
  { ssr: false }
)

const CustomLearningKits = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  if (showQuestionnaire) {
    return <JoyfulQuestionnaire />
  }
  return (
    <section className="bg-gray-50 px-4 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Main Header */}
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-900 md:text-4xl">
          Let&apos;s Make Learning a Blast with Joy Box - JJ&apos;s Custom
          Learning Kits!
        </h1>

        {/* Introduction Text */}
        <p className="mx-auto mb-10 max-w-4xl text-center text-gray-700">
          Hey parents! Want to make learning super fun for your kiddos? At The
          Joy Junction, we create awesome game kits just for your child, based
          on what they love and what you want to teach them!
        </p>

        {/* Full Width Image */}
        <div className="mb-12">
          <Image
            src="/customkit-pic.jpg"
            alt="Kids excited about receiving a custom learning box"
            width={900}
            height={600}
            className="mx-auto h-auto w-full max-w-4xl rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Content Below Image */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 md:text-2xl">
            How It Works:
          </h2>

          <ol className="mb-8 space-y-6">
            <li className="flex items-start">
              <span className="mr-3 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                1
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Tell Us About Your Kiddo
                </p>
                <p className="text-gray-600">
                  Fill out our questionnaire. Tell us all about your
                  child&apos;s favorite things and what they love to learn.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="mr-3 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                2
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  We Create the Perfect Kit
                </p>
                <p className="text-gray-600">
                  Our team of learning wizards lol will put together a special
                  kit full of games and activities just for your child.
                  It&apos;s like magic!
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="mr-3 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                3
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Delivered Right to You
                </p>
                <p className="text-gray-600">
                  Sit back and relax! We&apos;ll send the kit straight to your
                  door, ready for your child to dive into learning fun.
                </p>
              </div>
            </li>
          </ol>

          <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">
            Why Choose Custom Edu-Kits?
          </h2>

          <ul className="mb-10 space-y-3">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <p className="text-gray-700">
                <span className="font-semibold">Totally Personalized:</span>{" "}
                Each kit is made just for your child, with their favorite things
                in mind.
              </p>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <p className="text-gray-700">
                <span className="font-semibold">Fun Learning:</span> Our games
                make learning super exciting and awesome.
              </p>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <p className="text-gray-700">
                <span className="font-semibold">Easy Peasy:</span> Simple to
                order and delivered right to your home.
              </p>
            </li>
          </ul>

          <p className="text-justify text-sm italic text-gray-500">
            NOTE: These boxes take more time than our regular kits.
          </p>
        </div>
      </div>

      {/* Joy Box Strip Section */}
      <div className="mt-20 w-full bg-pink-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center space-y-6 px-4 py-10 md:flex-row md:space-x-10 md:space-y-0">
          {/* Image */}
          <div className="flex h-[220px] w-[220px] flex-shrink-0 items-center justify-center">
            <Image
              src="/joybox.jpg"
              alt="Joy Box"
              width={220}
              height={220}
              className="h-full w-full rounded-md object-contain"
            />
          </div>

          {/* Text + Button */}
          <div className="flex h-[220px] w-full max-w-xl flex-col justify-center rounded-md bg-purple-900 p-8 text-center md:text-left">
            <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">
              Get your Joy Kits Today!
            </h3>
            <p className="mb-4 text-white">
              Ready to see your child smile with joy? Click below to get started
              with our questionnaire and let the fun begin!
            </p>
            <button
              className="rounded bg-green-300 px-6 py-2 font-bold text-white shadow hover:bg-green-400"
              onClick={() => setShowQuestionnaire(true)}
            >
              JOY BOX
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomLearningKits
