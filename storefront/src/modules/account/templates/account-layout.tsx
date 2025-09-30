import { HttpTypes } from "@medusajs/types"
import React from "react"

import AccountNav from "../components/account-nav"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      {customer ? (
        <div className="content-container mx-auto flex h-full max-w-5xl flex-1 flex-col bg-white">
          <div className="grid grid-cols-1 py-12 small:grid-cols-[240px_1fr]">
            <div>
              <AccountNav customer={customer} />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export default AccountLayout
