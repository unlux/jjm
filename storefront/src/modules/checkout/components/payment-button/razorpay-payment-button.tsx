"use client"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"

export const RazorpayPaymentButton = ({
  session,
  notReady,
  cart,
}: {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
}) => {
  const { Razorpay } = useRazorpay()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [orderData, setOrderData] = useState({ razorpayOrder: { id: "" } })

  const razorpayKey = useMemo(
    () =>
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
      process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID ??
      "",
    []
  )
  const callbackUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""}/razorpay/hooks`,
    []
  )

  useEffect(() => {
    setOrderData(session.data as { razorpayOrder: { id: string } })
  }, [session.data])

  const onPaymentCompleted = async () => {
    await placeOrder().catch((e) => {
      console.error("[RazorpayPaymentButton] placeOrder failed", e)
      setErrorMessage("An error occurred, please try again.")
      setSubmitting(false)
    })
  }

  const handlePayment = useCallback(async () => {
    setSubmitting(true)
    setErrorMessage(undefined)

    const onPaymentCancelled = async () => {
      setErrorMessage("Payment cancelled")
      setSubmitting(false)
    }

    const options: RazorpayOrderOptions = {
      key: razorpayKey || "your_key_id",
      callback_url: callbackUrl,
      amount: session.amount * 100, // amount in paise
      order_id: orderData.razorpayOrder.id,
      currency: cart.currency_code.toUpperCase() as CurrencyCode,
      name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "your company name",
      description: `Order number ${orderData.razorpayOrder.id}`,
      remember_customer: true,
      image:
        process.env.NEXT_PUBLIC_COMPANY_LOGO_URL ||
        "https://example.com/your_logo",
      modal: {
        backdropclose: true,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: async () => {
          setSubmitting(false)
          setErrorMessage("Payment cancelled")
          await onPaymentCancelled()
        },
        animation: true,
      },
      handler: async () => {
        onPaymentCompleted()
      },
      prefill: {
        name:
          (cart.billing_address?.first_name || "") +
          " " +
          (cart?.billing_address?.last_name || ""),
        email: cart?.email || undefined,
        contact: cart?.shipping_address?.phone || undefined,
      },
    }

    console.log("[RazorpayPaymentButton] options", {
      hasKey: Boolean(options.key),
      callback_url: options.callback_url,
      amount: options.amount,
      order_id: options.order_id,
      currency: options.currency,
      provider_id: session?.provider_id,
    })

    try {
      const razorpay = new Razorpay(options)

      if (orderData.razorpayOrder.id) {
        try {
          razorpay.open()
        } catch (e) {
          console.error("[RazorpayPaymentButton] open() failed", e)
          setErrorMessage("Failed to open Razorpay checkout")
          setSubmitting(false)
        }
      } else {
        console.warn("[RazorpayPaymentButton] missing order id, skipping open")
        setSubmitting(false)
      }

      ;(razorpay as any).on("payment.failed", function (response: any) {
        try {
          console.error("[RazorpayPaymentButton] payment.failed", response)
          setErrorMessage(
            response?.error?.description ||
              response?.error?.reason ||
              "Payment failed"
          )
        } catch {
          setErrorMessage("Payment failed")
        }
        setSubmitting(false)
      })
      ;(razorpay as any).on(
        "payment.authorized" as any,
        function (response: any) {
          console.log("[RazorpayPaymentButton] payment.authorized", response)
          placeOrder()
            .then((authorizedCart) => {
              console.log(
                "[RazorpayPaymentButton] order placed",
                authorizedCart
              )
            })
            .catch((e) => {
              console.error(
                "[RazorpayPaymentButton] placeOrder after authorize failed",
                e
              )
              setErrorMessage("Order placement failed after authorization")
            })
            .finally(() => setSubmitting(false))
        }
      )
    } catch (e) {
      console.error("[RazorpayPaymentButton] init/open error", e)
      setErrorMessage(
        e instanceof Error ? e.message : "Failed to initialize Razorpay"
      )
      setSubmitting(false)
    }
  }, [
    Razorpay,
    razorpayKey,
    callbackUrl,
    cart.billing_address?.first_name,
    cart.billing_address?.last_name,
    cart.currency_code,
    cart?.email,
    cart?.shipping_address?.phone,
    orderData.razorpayOrder.id,
    session.amount,
    session.provider_id,
  ])

  console.log("[RazorpayPaymentButton] orderData", orderData)

  return (
    <div data-ph-no-capture>
      <Button
        data-testid="razorpay-payment-button"
        disabled={
          submitting ||
          notReady ||
          !orderData?.razorpayOrder?.id ||
          orderData?.razorpayOrder?.id === ""
        }
        onClick={() => {
          console.log(
            `[RazorpayPaymentButton] processing order id: ${orderData.razorpayOrder.id}`
          )
          handlePayment()
        }}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </Button>
      {errorMessage && (
        <div className="text-small-regular mt-2 text-red-500">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
