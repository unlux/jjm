"use client"

import { useActionState, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from "lucide-react"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { Checkbox, Text } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { login, signup, transferCart } from "@lib/data/customer"
import Button from "@modules/common/components/button"
import { Google } from "@medusajs/icons"
import { sdk } from "@lib/config"
import {
  getCacheTag,
  revalidateCustomerCache,
  setAuthToken,
} from "@lib/data/cookies"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AdditionalInfo from "./additional-info"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  currentView: LOGIN_VIEW
}

const AccountPage = ({ setCurrentView, currentView }: Props) => {
  const [isLogin, setIsLogin] = useState(currentView === LOGIN_VIEW.SIGN_IN)
  const [showPassword, setShowPassword] = useState(false)

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
        })
        .catch((error) => {
          console.error("Error during Google authentication callback:", error)
        })
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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* TOP TEXT */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1e1e3f] mb-3 font-baloo tracking-wide leading-tight">
            {isLogin ? "Welcome Back! 👋" : "Join The Joy Junction! 🎈"}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-fredoka max-w-2xl mx-auto">
            {isLogin
              ? "Sign in to your magical toy box and continue your adventure!"
              : "Create an account and start your joyful journey into our toy wonderland!"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-[#262b5f] to-[#3a4183]">
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="relative z-10">
                    <h3 className="text-white text-3xl font-bold mb-3 font-baloo tracking-wide leading-tight drop-shadow-md">
                      {isLogin
                        ? "Welcome back to our toy wonderland! 🎉"
                        : "Join our happy playground! 🧸"}
                    </h3>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {isLogin
                        ? "Access your wishlist, track orders, and discover perfect toys for your little ones!"
                        : "Create an account for magical toy suggestions, exclusive offers, and more fun!"}
                    </p>
                  </div>

                  <div className="relative z-10 rounded-xl bg-white/10 backdrop-blur-sm p-5 border border-white/20 shadow-lg">
                    <p className="italic text-white/95 text-base font-medium leading-relaxed">
                      &ldquo;Play is the highest form of research.&rdquo;
                    </p>
                    <p className="text-blue-200 text-sm mt-2 font-semibold">
                      ~ Albert Einstein
                    </p>
                  </div>

                  <div className="absolute bottom-0 right-0 w-72 h-72 opacity-20 animate-float">
                    <Image
                      src="/category1.jpg"
                      alt="Toy illustration"
                      width={300}
                      height={300}
                      className="object-cover rounded-full shadow-2xl"
                    />
                  </div>
                </div>

                <div className="absolute top-5 left-5 w-24 h-24 rounded-full bg-pink-500/15 animate-pulse-slow"></div>
                <div className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-yellow-500/20 animate-bounce-slow"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-blue-500/15 animate-pulse-slow"></div>

                <div className="absolute top-1/3 left-20 w-10 h-10 rounded-md bg-red-400/10 rotate-12 animate-spin-slow"></div>
                <div className="absolute bottom-32 right-32 w-12 h-12 bg-green-400/10 transform rotate-45 animate-bounce-slow"></div>
              </div>

              <div className="p-8 md:p-10 md:w-1/2">
                <div className="flex border-b border-gray-200 mb-8">
                  <button
                    className={`pb-4 px-4 text-base font-medium transition-colors ${
                      isLogin
                        ? "border-b-2 border-[#262b5f] text-[#262b5f]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => toggleForm(true)}
                  >
                    Sign In
                  </button>
                  <button
                    className={`pb-4 px-4 text-base font-medium transition-colors ${
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
                  <form action={loginAction}>
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Mail size={18} />
                          </div>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-colors"
                            label=""
                            autoComplete="email"
                            data-testid="email-input"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
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
                          <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Lock size={18} />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            required
                            className="pl-10 pr-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-colors"
                            label=""
                            autoComplete={
                              isLogin ? "current-password" : "new-password"
                            }
                            data-testid="password-input"
                          />
                          <div
                            className="absolute right-0 inset-y-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600"
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
                      <SubmitButton className="w-full bg-[#262b5f] text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                        Sign In <ArrowRight size={16} />
                      </SubmitButton>
                    </div>
                  </form>
                ) : (
                  <form action={signupAction}>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="first_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name
                          </label>
                          <div className="relative">
                            <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <User size={18} />
                            </div>
                            <Input
                              type="text"
                              name="first_name"
                              id="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="!pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-all duration-200"
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
                            className="block text-sm font-medium text-gray-700 mb-1"
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
                              className="!pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-all duration-200"
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
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Mail size={18} />
                          </div>
                          <Input
                            type="email"
                            name="email"
                            id="signup-email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="!pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-all duration-200"
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
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Phone size={18} />
                          </div>
                          <Input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="!pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-all duration-200"
                            label=""
                            autoComplete="tel"
                            data-testid="phone-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="signup-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Lock size={18} />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="signup-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="!pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#262b5f] focus:border-[#262b5f] outline-none transition-all duration-200"
                            label=""
                            autoComplete="new-password"
                            required
                            data-testid="password-input"
                          />
                          <div
                            className="absolute right-0 inset-y-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600"
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
                      <SubmitButton className="w-full bg-[#262b5f] text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                        Create Account <ArrowRight size={16} />
                      </SubmitButton>
                    </div>
                  </form>
                )}

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={loginWithGoogle}
                      className="w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#262b5f] flex items-center justify-center gap-2"
                    >
                      <Google />
                      Continue with Google
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center text-sm">
                  <p className="text-gray-600">
                    {isLogin
                      ? "New to The Joy Junction? "
                      : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => toggleForm(!isLogin)}
                      className="text-[#262b5f] font-medium hover:underline focus:outline-none"
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
