import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

import { deleteLineItemWithToast } from "@/lib/client/cart-toasts"

const DeleteButton = ({
  id,
  children,
  className,
  onDelete,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  onDelete?: () => void | Promise<void>
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      if (onDelete) {
        await onDelete()
      }
    } catch (_) {}
    const ok = await deleteLineItemWithToast(id)
    if (!ok) {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={clx(
        "text-small-regular flex items-center justify-between",
        className
      )}
    >
      <button
        className="flex cursor-pointer gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
