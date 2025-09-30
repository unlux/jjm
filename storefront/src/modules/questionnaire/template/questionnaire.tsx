"use client"

import Image from "next/image"
import { useState } from "react"

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
    <div className="flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800 px-2 py-8">
      <div className="w-full max-w-2xl rounded-2xl border-4 border-blue-200 bg-blue-900/60 p-6 shadow-2xl backdrop-blur md:p-10">
        {/* Header & Progress */}
        <div className="mb-6">
          <div className="mb-4 flex justify-center">
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
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-blue-200/30">
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
              <div className="animate-fade-in space-y-6">
                {/* 1. Age */}
                <div>
                  <label className="mb-2 block text-lg font-bold" htmlFor="age">
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
                    className="w-full rounded-lg bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-pink-300">{errors.age}</p>
                  )}
                </div>

                {/* 2. Gender */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
                    2. Gender <span className="text-pink-300">*</span>
                  </label>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { label: "Prince", value: "Prince" },
                      { label: "Princess", value: "Princess" },
                    ].map((g) => (
                      <label
                        key={g.value}
                        className="flex items-center rounded-lg bg-white/10 px-3 py-2"
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
                    <p className="mt-1 text-sm text-pink-300">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in space-y-6">
                {/* 3. Main Character Trait */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
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
                    <p className="mt-1 text-sm text-pink-300">{errors.trait}</p>
                  )}
                </div>

                {/* 4. Skills to Develop */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
                    4. What skills do you want your little munchkin to develop?
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
              <div className="animate-fade-in space-y-6">
                {/* 5. What makes your superkid happy? */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
                    5. What are some things that make your superkid happy?{" "}
                    <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    name="happy"
                    value={form.happy}
                    onChange={handleChange}
                    placeholder="Enter here...."
                    className="w-full rounded-lg bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  {errors.happy && (
                    <p className="mt-1 text-sm text-pink-300">{errors.happy}</p>
                  )}
                </div>

                {/* 6. Interests and hobbies */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
                    6. What are some of little pumpkin’s interests and hobbies?
                  </label>
                  <textarea
                    name="interests"
                    value={form.interests}
                    onChange={handleChange}
                    placeholder="Enter here...."
                    className="w-full rounded-lg bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    rows={2}
                  />
                </div>

                {/* 7. What does your kiddo struggle with? */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
                    7. What does your kiddo struggle with?
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
              <div className="animate-fade-in space-y-6">
                {/* 8. Anything else? */}
                <div>
                  <label className="mb-2 block text-lg font-bold">
                    8. Anything else that we should know about your champion?
                  </label>
                  <textarea
                    name="extra"
                    value={form.extra}
                    onChange={handleChange}
                    placeholder="Enter here...."
                    className="w-full rounded-lg bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    rows={2}
                  />
                </div>

                {/* 9. Phone Number (Mandatory) */}
                <div>
                  <label
                    className="mb-2 block text-lg font-bold"
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
                    className="w-full rounded-lg bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-pink-300">{errors.phone}</p>
                  )}
                </div>

                {/* 10. Email (Mandatory) */}
                <div>
                  <label
                    className="mb-2 block text-lg font-bold"
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
                    className="w-full rounded-lg bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-pink-300">{errors.email}</p>
                  )}
                </div>

                {/* Summary Preview */}
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="mb-2 font-semibold">Quick recap</p>
                  <div className="space-y-1 text-sm opacity-90">
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
                className="rounded-full bg-white/10 px-5 py-2 font-semibold text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentStep === 1}
              >
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full bg-pink-400 px-6 py-2 font-bold text-white shadow-lg hover:bg-pink-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-cyan-400 px-8 py-2 text-lg font-bold text-white shadow-lg hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send"}
                </button>
              )}
            </div>
          </form>
        )}

        {submitted && (
          <div className="py-12 text-center text-white">
            <h2 className="mb-4 text-2xl font-bold text-green-300">
              Thank you!
            </h2>
            <p className="text-lg">
              Your answers have been received. Our team of learning wizards will
              get started on your Joy Box!
            </p>
            <span className="mt-6 block text-4xl">🎁✨</span>
          </div>
        )}
        {!submitted && submitError && (
          <div className="py-4 text-center">
            <p className="inline-block rounded-md border border-red-500/40 bg-red-900/30 px-3 py-2 text-sm text-red-200">
              {submitError}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
