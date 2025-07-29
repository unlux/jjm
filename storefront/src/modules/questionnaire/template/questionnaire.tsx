"use client";

import { useState } from "react";
import Image from "next/image";

type FormState = {
  age: string;
  gender: string;
  trait: string[];
  skills: string[];
  happy: string;
  interests: string;
  struggles: string[];
  extra: string;
};

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
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => {
        const arr = prev[name as keyof FormState] as string[];
        if (checked) {
          return { ...prev, [name]: [...arr, value] };
        } else {
          return { ...prev, [name]: arr.filter((v) => v !== value) };
        }
      });
    } else if (type === "radio") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 py-8 px-2">
      <div className="w-full max-w-lg bg-blue-900 rounded-2xl shadow-2xl p-6 md:p-10 border-4 border-blue-200">
        {/* Character trait image */}
        <div className="flex justify-center mb-6">
          <Image src="/questionnaire.jpg" alt="Character Traits" width={260} height={260} className="rounded-lg" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          {/* 1. Age */}
          <div>
            <label className="block font-bold text-lg mb-2" htmlFor="age">
              1. What is the age of your kiddo? <span className="text-pink-300">*</span>
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
          </div>

          {/* 2. Gender */}
          <div>
            <label className="block font-bold text-lg mb-2">2. Gender <span className="text-pink-300">*</span></label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Prince"
                  checked={form.gender === "Prince"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-400"
                  required
                />
                Prince
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Princess"
                  checked={form.gender === "Princess"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-400"
                  required
                />
                Princess
              </label>
            </div>
          </div>

          {/* 3. Main Character Trait */}
          <div>
            <label className="block font-bold text-lg mb-2">
              3. What is the main character trait of your champ? (You can refer the picture given above) <span className="text-pink-300">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="trait"
                  value="Choleric"
                  checked={form.trait.includes("Choleric")}
                  onChange={handleChange}
                  className="mr-2 accent-yellow-400"
                />
                Choleric – the dominant child
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="trait"
                  value="Sanguine"
                  checked={form.trait.includes("Sanguine")}
                  onChange={handleChange}
                  className="mr-2 accent-red-400"
                />
                Sanguine – the expressive child
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="trait"
                  value="Melancholic"
                  checked={form.trait.includes("Melancholic")}
                  onChange={handleChange}
                  className="mr-2 accent-blue-400"
                />
                Melancholic – the analytical child
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="trait"
                  value="Phlegmatic"
                  checked={form.trait.includes("Phlegmatic")}
                  onChange={handleChange}
                  className="mr-2 accent-green-400"
                />
                Phlegmatic – the loyal child
              </label>
            </div>
          </div>

          {/* 4. Skills to Develop */}
          <div>
            <label className="block font-bold text-lg mb-2">
              4. What skills do you want your little munchkin to develop?
            </label>
            <div className="space-y-2">
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

          {/* 5. What makes your superkid happy? */}
          <div>
            <label className="block font-bold text-lg mb-2">
              5. What are some things that make your superkid happy? <span className="text-pink-300">*</span>
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
            <div className="space-y-2">
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

          {/* Send Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-full shadow-lg text-lg"
            >
              Send
            </button>
          </div>
        </form>
        {submitted && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-green-300 mb-4">Thank you!</h2>
            <p className="text-lg text-white">Your answers have been received. Our team of learning wizards will get started on your Joy Box!</p>
            <span className="text-4xl mt-6 block">🎁✨</span>
          </div>
        )}
      </div>
    </div>
  );
}
