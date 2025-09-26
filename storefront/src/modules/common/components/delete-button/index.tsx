import { deleteLineItem } from "@lib/data/cart"
import { deleteLineItemWithToast } from "@/lib/client/cart-toasts"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

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
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
