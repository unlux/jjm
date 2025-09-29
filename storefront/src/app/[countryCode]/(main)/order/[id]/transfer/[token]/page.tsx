import { Heading, Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="mx-auto mb-20 mt-10 flex w-2/5 flex-col items-start gap-y-4">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Transfer request for order {id}
        </Heading>
        <Text className="text-zinc-600">
          You&#39;ve received a request to transfer ownership of your order (
          {id}). If you agree to this request, you can approve the transfer by
          clicking the button below.
        </Text>
        <div className="h-px w-full bg-zinc-200" />
        <Text className="text-zinc-600">
          If you accept, the new owner will take over all responsibilities and
          permissions associated with this order.
        </Text>
        <Text className="text-zinc-600">
          If you do not recognize this request or wish to retain ownership, no
          further action is required.
        </Text>
        <div className="h-px w-full bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
