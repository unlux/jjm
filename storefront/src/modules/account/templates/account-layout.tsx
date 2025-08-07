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
        <div className="grid lg:-ml-48 grid-cols-1 small:grid-cols-[240px_1fr] py-12">
          <div className="mb-8 lg:mb-0">{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
    </div>
  )
}

export default AccountLayout
