import { Dialog, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { getProductPrice } from "@lib/util/get-product-price"
import { isSimpleProduct } from "@lib/util/product"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"
import { Heart } from "lucide-react"
import React, { Fragment, useMemo } from "react"

import { useWishlist } from "@/lib/context/WishlistContext"

import OptionSelect from "./option-select"

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
      url: `/products/${product.handle}`,
      variantId: variant?.id,
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
        className={clx("fixed inset-x-0 bottom-0 z-50 lg:hidden", {
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
            className="flex h-full w-full flex-col gap-y-3 border-t border-gray-200 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
            data-testid="mobile-actions"
          >
            <div className="flex w-full flex-col gap-1">
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
                      <span className="text-sm text-ui-fg-muted line-through">
                        {selectedPrice.original_price}
                      </span>
                      <span className="ml-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                        -{selectedPrice.percentage_diff}%
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className={clx("grid w-full grid-cols-10 gap-x-4")}>
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
                className={clx("col-span-7 w-full")}
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
                  "col-span-3 w-full",
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

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex h-full min-h-full items-center justify-center text-center">
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
                  className="flex h-full w-full transform flex-col gap-y-3 overflow-hidden text-left"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex w-full justify-end pr-6">
                    <button
                      onClick={close}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ui-fg-base"
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
