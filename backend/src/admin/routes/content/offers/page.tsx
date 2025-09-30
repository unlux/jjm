import { Container, Heading, Button, Table, Input, Label, Switch, toast } from "@medusajs/ui"
import { PencilSquare, Trash, Plus } from "@medusajs/icons"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Offer = {
  id: string
  message: string
  href: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
}

const OffersPage = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [formData, setFormData] = useState<Partial<Offer>>({
    isActive: true,
    sortOrder: 0,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ data: Offer[] }>("/admin/offers")
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (offer: Partial<Offer>) => {
      return sdk.client.fetch("/admin/offers", {
        method: "POST",
        body: offer,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] })
      toast.success("Offer created successfully")
      setIsCreating(false)
      setFormData({ isActive: true, sortOrder: 0 })
    },
    onError: () => toast.error("Failed to create offer"),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Offer> }) => {
      return sdk.client.fetch(`/admin/offers?id=${id}`, {
        method: "PUT",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] })
      toast.success("Offer updated successfully")
      setEditingOffer(null)
      setFormData({ isActive: true, sortOrder: 0 })
    },
    onError: () => toast.error("Failed to update offer"),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch(`/admin/offers?id=${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] })
      toast.success("Offer deleted successfully")
    },
    onError: () => toast.error("Failed to delete offer"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData(offer)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingOffer(null)
    setFormData({ isActive: true, sortOrder: 0 })
  }

  if (isCreating || editingOffer) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{editingOffer ? "Edit Offer" : "Create Offer"}</Heading>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          <div>
            <Label htmlFor="id">ID (slug)</Label>
            <Input
              id="id"
              value={formData.id || ""}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={!!editingOffer}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={formData.message || ""}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="href">Link URL (optional)</Label>
            <Input
              id="href"
              value={formData.href || ""}
              onChange={(e) => setFormData({ ...formData, href: e.target.value || null })}
            />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder || 0}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive !== false}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingOffer ? "Update" : "Create"}
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
        <Heading level="h2">Marquee Offers</Heading>
        <Button onClick={() => setIsCreating(true)}>
          <Plus /> Create Offer
        </Button>
      </div>
      <div className="px-6 py-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.map((offer) => (
                <Table.Row key={offer.id}>
                  <Table.Cell>{offer.sortOrder}</Table.Cell>
                  <Table.Cell>{offer.message}</Table.Cell>
                  <Table.Cell>
                    <span className={offer.isActive ? "text-green-600" : "text-gray-400"}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="small" variant="secondary" onClick={() => handleEdit(offer)}>
                        <PencilSquare />
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this offer?")) {
                            deleteMutation.mutate(offer.id)
                          }
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </Table.Cell>
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
  label: "Offers",
})

export default OffersPage
