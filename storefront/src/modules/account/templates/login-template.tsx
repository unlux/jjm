"use client"

import { useState } from "react"
import AccountPage from "../components/unified-login"

export enum LOGIN_VIEW {
  SIGN_IN,
  REGISTER,
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN)

  return (
    <AccountPage currentView={currentView} setCurrentView={setCurrentView} />
  )
}

export default LoginTemplate
