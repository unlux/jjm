"use client"

import { sdk } from "@lib/config"
import {
  getCacheTag,
  revalidateCustomerCache,
  setAuthToken,
} from "@lib/data/cookies"
import { login, signup, transferCart } from "@lib/data/customer"
import { Google } from "@medusajs/icons"
import { Checkbox, Text } from "@medusajs/ui"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"

import { track } from "@/lib/analytics"

import AdditionalInfo from "./additional-info"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  currentView: LOGIN_VIEW
}

const AccountPage = ({ setCurrentView, currentView }: Props) => {
  const [isLogin, setIsLogin] = useState(currentView === LOGIN_VIEW.SIGN_IN)
  const [showPassword, setShowPassword] = useState(false)
  const [isExchanging, setIsExchanging] = useState(false)

  const [loginMessage, loginAction] = useActionState(login, null)
  const [signupMessage, signupAction] = useActionState(signup, null)

  // Initialize form data state for registration
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")
    const state = urlParams.get("state")
    if (code) {
      setIsExchanging(true)
      sdk.auth
        .callback("customer", "custom-google", {
          code: code,
          state: state,
        })
        .then(async (token) => {
          setAuthToken(token as string)
          const cacheTag = await getCacheTag("customers")
          await revalidateCustomerCache(cacheTag)
          await transferCart()
          try {
            track("user_signed_in" as any, { method: "google_oauth" })
          } catch {}
        })
        .catch((error) => {
          console.error("Error during Google authentication callback:", error)
        })
        .finally(() => setIsExchanging(false))
    }
  }, [])

  const loginWithGoogle = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/google`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      ).then((res) => res.json())

      if (result.location) {
        window.location.href = result.location
        return
      }
    } catch (error) {
      console.error("Error during login with Google:", error)
    }
  }

  const toggleForm = (isLoginView: boolean) => {
    setIsLogin(isLoginView)
    setCurrentView(isLoginView ? LOGIN_VIEW.SIGN_IN : LOGIN_VIEW.REGISTER)
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)

  return (
    <div className="mx-4 min-h-screen bg-gray-50 px-4">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {/* TOP TEXT */}
        <div className="mb-10 text-center">
          <h1 className="font-baloo mb-3 text-3xl font-bold leading-tight tracking-wide text-[#1e1e3f] md:text-5xl">
            {isLogin ? "Welcome Back! 👋" : "Join The Joy Junction! 🎈"}
          </h1>
          <p className="font-fredoka mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
            {isLogin
              ? "Sign in to your magical toy box and continue your adventure!"
              : "Create an account and start your joyful journey into our toy wonderland!"}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="md:flex">
              <div className="relative hidden bg-gradient-to-br from-[#262b5f] to-[#3a4183] md:block md:w-1/2">
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  <div className="relative z-10">
                    <h3 className="font-baloo mb-3 text-3xl font-bold leading-tight tracking-wide text-white drop-shadow-md">
                      {isLogin
                        ? "Welcome back to our toy wonderland! 🎉"
                        : "Join our happy playground! 🧸"}
                    </h3>
                    <p className="text-lg leading-relaxed text-blue-100">
                      {isLogin
                        ? "Access your wishlist, track orders, and discover perfect toys for your little ones!"
                        : "Create an account for magical toy suggestions, exclusive offers, and more fun!"}
                    </p>
                  </div>

                  <div className="relative z-10 rounded-xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-sm">
                    <p className="text-base font-medium italic leading-relaxed text-white/95">
                      &ldquo;Play is the highest form of research.&rdquo;
                    </p>
                    <p className="mt-2 text-sm font-semibold text-blue-200">
                      ~ Albert Einstein
                    </p>
                  </div>

                  <div className="animate-float absolute bottom-0 right-0 h-72 w-72 opacity-20">
                    <Image
                      src="/card-tastic-fun.png"
                      alt="Toy illustration"
                      width={300}
                      height={300}
                      className="rounded-full object-cover shadow-2xl"
                    />
                  </div>
                </div>

                <div className="animate-pulse-slow absolute left-5 top-5 h-24 w-24 rounded-full bg-pink-500/15"></div>
                <div className="animate-bounce-slow absolute right-10 top-1/4 h-16 w-16 rounded-full bg-yellow-500/20"></div>
                <div className="animate-pulse-slow absolute bottom-10 left-10 h-20 w-20 rounded-full bg-blue-500/15"></div>

                <div className="animate-spin-slow absolute left-20 top-1/3 h-10 w-10 rotate-12 rounded-md bg-red-400/10"></div>
                <div className="animate-bounce-slow absolute bottom-32 right-32 h-12 w-12 rotate-45 transform bg-green-400/10"></div>
              </div>

              <div className="p-6 sm:p-8 md:w-1/2 md:p-10">
                <div className="mb-8 flex border-b border-gray-200">
                  <button
                    className={`px-4 pb-4 text-base font-medium transition-colors ${
                      isLogin
                        ? "border-b-2 border-[#262b5f] text-[#262b5f]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => toggleForm(true)}
                  >
                    Sign In
                  </button>
                  <button
                    className={`px-4 pb-4 text-base font-medium transition-colors ${
                      !isLogin
                        ? "border-b-2 border-[#262b5f] text-[#262b5f]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => toggleForm(false)}
                  >
                    Sign Up
                  </button>
                </div>

                {isLogin ? (
                  <form
                    action={loginAction}
                    onSubmit={(e) => {
                      try {
                        const email = (
                          e.currentTarget.elements.namedItem(
                            "email"
                          ) as HTMLInputElement
                        )?.value
                        const email_domain = email?.split("@")[1]
                        track("user_signed_in" as any, {
                          method: "password",
                          email_domain,
                        })
                      } catch {}
                    }}
                  >
                    <div className="space-y-5">
                      <div className="mt-0">
                        <button
                          type="button"
                          onClick={loginWithGoogle}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#262b5f] focus:ring-offset-2"
                        >
                          <Google />
                          Continue with Google
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-4 text-sm text-gray-500">
                            Or sign in with email
                          </span>
                        </div>
                      </div>
                      {isExchanging && (
                        <div className="flex items-center gap-2 rounded-md bg-neutral-100 p-3 text-neutral-900">
                          <Spinner />
                          <span>Signing you in with Google…</span>
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Mail size={18} />
                          </div>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                            label=""
                            autoComplete="email"
                            data-testid="email-input"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          {/* <Link
                            href="/account/reset-password"
                            className="text-xs text-[#262b5f] hover:underline"
                          >
                            Forgot password?
                          </Link> */}
                        </div>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Lock size={18} />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                            label=""
                            autoComplete={
                              isLogin ? "current-password" : "new-password"
                            }
                            data-testid="password-input"
                          />
                          <div
                            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </div>
                        </div>
                      </div>

                      <ErrorMessage
                        error={loginMessage}
                        data-testid="login-error-message"
                      />
                      <SubmitButton className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#262b5f] px-4 py-3 text-white transition-colors hover:bg-opacity-90">
                        Sign In <ArrowRight size={16} />
                      </SubmitButton>
                    </div>
                  </form>
                ) : (
                  <form
                    action={signupAction}
                    onSubmit={(e) => {
                      try {
                        const email = (
                          e.currentTarget.elements.namedItem(
                            "email"
                          ) as HTMLInputElement
                        )?.value
                        const email_domain = email?.split("@")[1]
                        track("user_signed_up" as any, {
                          method: "password",
                          email_domain,
                        })
                      } catch {}
                    }}
                  >
                    <input
                      type="hidden"
                      name="first_name"
                      value={formData.first_name}
                    />
                    <input
                      type="hidden"
                      name="last_name"
                      value={formData.last_name}
                    />
                    <input type="hidden" name="email" value={formData.email} />
                    <input type="hidden" name="phone" value={formData.phone} />
                    <input
                      type="hidden"
                      name="password"
                      value={formData.password}
                    />
                    <div className="space-y-5">
                      <div className="mt-0">
                        <button
                          type="button"
                          onClick={loginWithGoogle}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#262b5f] focus:ring-offset-2"
                        >
                          <Google />
                          Continue with Google
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-4 text-sm text-gray-500">
                            Or sign up with email
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="first_name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            First Name
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <User size={18} />
                            </div>
                            <Input
                              type="text"
                              name="first_name"
                              id="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-gray-300 px-4 py-3 !pl-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                              label=""
                              autoComplete="given-name"
                              required
                              data-testid="first-name-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="last_name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Last Name
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="last_name"
                              id="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-gray-300 px-4 py-3 !pl-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                              label=""
                              autoComplete="family-name"
                              required
                              data-testid="last-name-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="signup-email"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Mail size={18} />
                          </div>
                          <Input
                            type="email"
                            name="email"
                            id="signup-email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 !pl-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                            label=""
                            autoComplete="email"
                            required
                            data-testid="email-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Phone size={18} />
                          </div>
                          <Input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 !pl-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                            label=""
                            autoComplete="tel"
                            data-testid="phone-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="signup-password"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Lock size={18} />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="signup-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 !pl-10 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#262b5f]"
                            label=""
                            autoComplete="new-password"
                            required
                            data-testid="password-input"
                          />
                          <div
                            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Please set a strong password.
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-700">
                          By creating an account, you agree to Joy
                          Junction&apos;s{" "}
                          <LocalizedClientLink
                            href="/tnc"
                            className="text-[#262b5f] hover:underline"
                          >
                            Terms of Use
                          </LocalizedClientLink>{" "}
                          and{" "}
                          <LocalizedClientLink
                            href="/privacy-policy"
                            className="text-[#262b5f] hover:underline"
                          >
                            Privacy Policy
                          </LocalizedClientLink>
                          .
                        </p>
                      </div>
                      <ErrorMessage
                        error={signupMessage}
                        data-testid="register-error"
                      />
                      <SubmitButton className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#262b5f] px-4 py-3 text-white transition-colors hover:bg-opacity-90">
                        Create Account <ArrowRight size={16} />
                      </SubmitButton>
                    </div>
                  </form>
                )}

                {/* Removed bottom Google button; moved above email */}

                <div className="mt-8 text-center text-sm">
                  <p className="text-gray-600">
                    {isLogin
                      ? "New to The Joy Junction? "
                      : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => toggleForm(!isLogin)}
                      className="font-medium text-[#262b5f] hover:underline focus:outline-none"
                    >
                      {isLogin ? "Create an account" : "Sign in"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdditionalInfo />
      </div>
    </div>
  )
}

export default AccountPage
