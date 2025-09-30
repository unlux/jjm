import { Container, Heading, Button, Table, Input, Label, toast } from "@medusajs/ui"
import { PencilSquare, Trash, Plus } from "@medusajs/icons"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type AffiliateCoupon = {
  code: string
  timesUsed: number
  createdAt: string
  updatedAt: string
}

const AffiliateCouponsPage = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<AffiliateCoupon | null>(null)
  const [formData, setFormData] = useState<{ code: string; delta: number }>({
    code: "",
    delta: 0,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["affiliate-coupons"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ data: AffiliateCoupon[] }>("/admin/affiliate-coupons")
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (coupon: { code: string; delta: number }) => {
      return sdk.client.fetch("/admin/affiliate-coupons", {
        method: "POST",
        body: coupon,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-coupons"] })
      toast.success("Affiliate coupon created successfully")
      setIsCreating(false)
      setFormData({ code: "", delta: 0 })
    },
    onError: () => toast.error("Failed to create affiliate coupon"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setFormData({ code: "", delta: 0 })
  }

  if (isCreating) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Create/Update Affiliate Coupon</Heading>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          <div>
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              placeholder="Enter coupon code"
            />
            <p className="text-sm text-gray-500 mt-1">Will be converted to lowercase</p>
          </div>
          <div>
            <Label htmlFor="delta">Usage Count to Add</Label>
            <Input
              id="delta"
              type="number"
              min="1"
              value={formData.delta}
              onChange={(e) => setFormData({ ...formData, delta: parseInt(e.target.value) })}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              If coupon exists, this will be added to current usage count
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={createMutation.isPending}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Affiliate Coupons</Heading>
        <Button onClick={() => setIsCreating(true)}>
          <Plus /> Add/Update Coupon
        </Button>
      </div>
      <div className="px-6 py-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Times Used</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Last Updated</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.map((coupon) => (
                <Table.Row key={coupon.code}>
                  <Table.Cell className="font-mono">{coupon.code}</Table.Cell>
                  <Table.Cell>{coupon.timesUsed}</Table.Cell>
                  <Table.Cell>{new Date(coupon.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{new Date(coupon.updatedAt).toLocaleDateString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Affiliate Coupons",
})

export default AffiliateCouponsPage
