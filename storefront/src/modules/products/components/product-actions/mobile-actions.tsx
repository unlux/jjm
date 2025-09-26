import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"
import { useWishlist } from "@/lib/context/WishlistContext"
import { Heart } from "lucide-react"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)
  const wishlistSelected = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    const item = {
      id: product.id,
      name: product.title ?? "",
      image: product.thumbnail ?? undefined,
    }
    if (wishlistSelected) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(item)
    }
  }

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white flex flex-col gap-y-3 p-4 h-full w-full border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
            data-testid="mobile-actions"
          >
            <div className="w-full flex flex-col gap-1">
              <h3
                className="text-base font-medium text-ui-fg-base"
                data-testid="mobile-title"
              >
                {product.title}
              </h3>
              {selectedPrice && (
                <div className="flex items-baseline gap-2">
                  <span
                    className={clx("text-lg font-semibold", {
                      "text-red-600": selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                  {selectedPrice.price_type === "sale" && (
                    <>
                      <span className="line-through text-ui-fg-muted text-sm">
                        {selectedPrice.original_price}
                      </span>
                      <span className="ml-1 bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        -{selectedPrice.percentage_diff}%
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className={clx("grid w-full gap-x-4 grid-cols-10")}>
              <Button
                onClick={() => {
                  if (!variant) {
                    open()
                    return
                  }
                  handleAddToCart()
                }}
                // If no variant selected, open options on tap
                disabled={!inStock}
                className={clx("w-full col-span-7")}
                isLoading={isAdding}
                data-testid="mobile-cart-button"
                title={
                  !variant
                    ? "Select options"
                    : inStock
                    ? "Add to cart"
                    : "Out of stock"
                }
              >
                {!variant
                  ? "Select options"
                  : !inStock
                  ? "Out of stock"
                  : "Add to cart"}
              </Button>
              <Button
                onClick={handleToggleWishlist}
                variant="secondary"
                className={clx(
                  "w-full col-span-3",
                  wishlistSelected
                    ? "border-pink-500 text-pink-600"
                    : "text-ui-fg-muted"
                )}
                aria-label={
                  wishlistSelected ? "Remove from wishlist" : "Add to wishlist"
                }
                title={
                  wishlistSelected ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={18}
                  className={
                    wishlistSelected ? "fill-pink-500 text-pink-500" : ""
                  }
                />
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
