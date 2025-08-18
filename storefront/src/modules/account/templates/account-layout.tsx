import React from "react"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

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
        <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
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
