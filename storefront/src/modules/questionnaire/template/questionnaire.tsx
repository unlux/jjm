"use client"

import { useState } from "react"
import Image from "next/image"

type FormState = {
  age: string
  gender: string
  trait: string[]
  skills: string[]
  happy: string
  interests: string
  struggles: string[]
  extra: string
  phone: string
  email: string
}

export default function JoyfulQuestionnaire() {
  const [form, setForm] = useState<FormState>({
    age: "",
    gender: "",
    trait: [],
    skills: [],
    happy: "",
    interests: "",
    struggles: [],
    extra: "",
    phone: "",
    email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => {
        const arr = prev[name as keyof FormState] as string[]
        if (checked) {
          return { ...prev, [name]: [...arr, value] }
        } else {
          return { ...prev, [name]: arr.filter((v) => v !== value) }
        }
      })
    } else if (type === "radio") {
      setForm((prev) => ({ ...prev, [name]: value }))
    } else {
      if (name === "phone") {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
        setForm((prev) => ({ ...prev, [name]: digitsOnly }))
      } else {
        setForm((prev) => ({ ...prev, [name]: value }))
      }
    }
  }

  function validateStep(step: number) {
    const stepErrors: Record<string, string> = {}
    if (step === 1) {
      if (!form.age) stepErrors.age = "Please tell us your kiddo's age"
      if (!form.gender) stepErrors.gender = "Please select a gender"
    }
    if (step === 2) {
      if (form.trait.length === 0)
        stepErrors.trait = "Pick at least one main trait"
    }
    if (step === 3) {
      if (!form.happy)
        stepErrors.happy = "This helps us personalize the experience"
    }
    if (step === 4) {
      if (!/^\d{10}$/.test(form.phone))
        stepErrors.phone = "Phone must be exactly 10 digits"
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailRegex.test(form.email))
        stepErrors.email = "Please enter a valid email address"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(totalSteps, s + 1))
    }
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(1, s - 1))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateStep(4)) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const resp = await fetch("/api/customkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      })
      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        throw new Error(
          data?.details?.[0] ||
            data?.error ||
            "Unable to submit. Please try again."
        )
      }
      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800 py-8 px-2">
      <div className="w-full max-w-2xl bg-blue-900/60 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-10 border-4 border-blue-200">
        {/* Header & Progress */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/questionnaire.jpg"
              alt="Character Traits"
              width={400}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
          <div className="text-center text-white">
            <p className="text-sm opacity-90">
              Step {currentStep} of {totalSteps}
            </p>
            <div className="w-full h-3 mt-2 bg-blue-200/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400 transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6 text-white">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* 1. Age */}
                <div>
                  <label className="block font-bold text-lg mb-2" htmlFor="age">
                    1. What is the age of your kiddo?{" "}
                    <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Enter Your Kiddo's age...."
                    className="w-full rounded-lg px-4 py-3 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  {errors.age && (
                    <p className="mt-1 text-pink-300 text-sm">{errors.age}</p>
                  )}
                </div>

                {/* 2. Gender */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    2. Gender <span className="text-pink-300">*</span>
                  </label>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { label: "Prince", value: "Prince" },
                      { label: "Princess", value: "Princess" },
                    ].map((g) => (
                      <label
                        key={g.value}
                        className="flex items-center bg-white/10 px-3 py-2 rounded-lg"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g.value}
                          checked={form.gender === g.value}
                          onChange={handleChange}
                          className="mr-2 accent-pink-400"
                          required
                        />
                        {g.label}
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-pink-300 text-sm">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* 3. Main Character Trait */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    3. What is the main character trait of your champ? (You can
                    refer the picture given above){" "}
                    <span className="text-pink-300">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Choleric – the dominant child",
                        value: "Choleric",
                        color: "accent-yellow-400",
                      },
                      {
                        label: "Sanguine – the expressive child",
                        value: "Sanguine",
                        color: "accent-red-400",
                      },
                      {
                        label: "Melancholic – the analytical child",
                        value: "Melancholic",
                        color: "accent-blue-400",
                      },
                      {
                        label: "Phlegmatic – the loyal child",
                        value: "Phlegmatic",
                        color: "accent-green-400",
                      },
                    ].map((t) => (
                      <label key={t.value} className="flex items-center">
                        <input
                          type="checkbox"
                          name="trait"
                          value={t.value}
                          checked={form.trait.includes(t.value)}
                          onChange={handleChange}
                          className={`mr-2 ${t.color}`}
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                  {errors.trait && (
                    <p className="mt-1 text-pink-300 text-sm">{errors.trait}</p>
                  )}
                </div>

                {/* 4. Skills to Develop */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    4. What skills do you want your little munchkin to develop?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Imagination",
                      "Narration",
                      "Social Skills",
                      "Problem Solving",
                      "Fine Motor Skills",
                      "Cognitive Skills",
                      "Others",
                    ].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          name="skills"
                          value={skill}
                          checked={form.skills.includes(skill)}
                          onChange={handleChange}
                          className="mr-2 accent-pink-400"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* 5. What makes your superkid happy? */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    5. What are some things that make your superkid happy?{" "}
                    <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    name="happy"
                    value={form.happy}
                    onChange={handleChange}
                    placeholder="Enter here...."
                    className="w-full rounded-lg px-4 py-3 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  {errors.happy && (
                    <p className="mt-1 text-pink-300 text-sm">{errors.happy}</p>
                  )}
                </div>

                {/* 6. Interests and hobbies */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    6. What are some of little pumpkin’s interests and hobbies?
                  </label>
                  <textarea
                    name="interests"
                    value={form.interests}
                    onChange={handleChange}
                    placeholder="Enter here...."
                    className="w-full rounded-lg px-4 py-3 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    rows={2}
                  />
                </div>

                {/* 7. What does your kiddo struggle with? */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    7. What does your kiddo struggle with?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Reading",
                      "Writing",
                      "Concentration",
                      "Communication",
                      "Language (English, Hindi)",
                      "Comprehension",
                      "Others",
                    ].map((struggle) => (
                      <label key={struggle} className="flex items-center">
                        <input
                          type="checkbox"
                          name="struggles"
                          value={struggle}
                          checked={form.struggles.includes(struggle)}
                          onChange={handleChange}
                          className="mr-2 accent-pink-400"
                        />
                        {struggle}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                {/* 8. Anything else? */}
                <div>
                  <label className="block font-bold text-lg mb-2">
                    8. Anything else that we should know about your champion?
                  </label>
                  <textarea
                    name="extra"
                    value={form.extra}
                    onChange={handleChange}
                    placeholder="Enter here...."
                    className="w-full rounded-lg px-4 py-3 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    rows={2}
                  />
                </div>

                {/* 9. Phone Number (Mandatory) */}
                <div>
                  <label
                    className="block font-bold text-lg mb-2"
                    htmlFor="phone"
                  >
                    9. Your Phone Number{" "}
                    <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number..."
                    className="w-full rounded-lg px-4 py-3 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-pink-300 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* 10. Email (Mandatory) */}
                <div>
                  <label
                    className="block font-bold text-lg mb-2"
                    htmlFor="email"
                  >
                    10. Your Email Address{" "}
                    <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address..."
                    className="w-full rounded-lg px-4 py-3 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-pink-300 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Summary Preview */}
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="font-semibold mb-2">Quick recap</p>
                  <div className="text-sm space-y-1 opacity-90">
                    <p>
                      Age:{" "}
                      <span className="font-medium">{form.age || "—"}</span>
                    </p>
                    <p>
                      Gender:{" "}
                      <span className="font-medium">{form.gender || "—"}</span>
                    </p>
                    <p>
                      Traits:{" "}
                      <span className="font-medium">
                        {form.trait.join(", ") || "—"}
                      </span>
                    </p>
                    <p>
                      Skills:{" "}
                      <span className="font-medium">
                        {form.skills.join(", ") || "—"}
                      </span>
                    </p>
                    <p>
                      Happy:{" "}
                      <span className="font-medium">{form.happy || "—"}</span>
                    </p>
                    <p>
                      Interests:{" "}
                      <span className="font-medium">
                        {form.interests || "—"}
                      </span>
                    </p>
                    <p>
                      Struggles:{" "}
                      <span className="font-medium">
                        {form.struggles.join(", ") || "—"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentStep === 1}
              >
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 rounded-full font-bold bg-pink-400 hover:bg-pink-500 text-white shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2 rounded-full font-bold bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg text-lg"
                >
                  {submitting ? "Sending..." : "Send"}
                </button>
              )}
            </div>
          </form>
        )}

        {submitted && (
          <div className="text-center py-12 text-white">
            <h2 className="text-2xl font-bold text-green-300 mb-4">
              Thank you!
            </h2>
            <p className="text-lg">
              Your answers have been received. Our team of learning wizards will
              get started on your Joy Box!
            </p>
            <span className="text-4xl mt-6 block">🎁✨</span>
          </div>
        )}
        {!submitted && submitError && (
          <div className="text-center py-4">
            <p className="text-sm text-red-200 bg-red-900/30 inline-block px-3 py-2 rounded-md border border-red-500/40">
              {submitError}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
