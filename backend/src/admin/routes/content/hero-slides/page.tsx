import { Container, Heading, Button, Table, Input, Label, Switch, toast } from "@medusajs/ui"
import { PencilSquare, Trash, Plus } from "@medusajs/icons"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type HeroSlide = {
  id: string
  src: string
  alt: string
  href: string | null
  isForMobile: boolean
  sortOrder: number
  duration: number | null
  createdAt: string
}

const HeroSlidesPage = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    isForMobile: false,
    sortOrder: 0,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ data: HeroSlide[] }>("/admin/hero-slides")
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (slide: Partial<HeroSlide>) => {
      return sdk.client.fetch("/admin/hero-slides", {
        method: "POST",
        body: slide,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] })
      toast.success("Hero slide created successfully")
      setIsCreating(false)
      setFormData({ isForMobile: false, sortOrder: 0 })
    },
    onError: () => toast.error("Failed to create hero slide"),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HeroSlide> }) => {
      return sdk.client.fetch(`/admin/hero-slides?id=${id}`, {
        method: "PUT",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] })
      toast.success("Hero slide updated successfully")
      setEditingSlide(null)
      setFormData({ isForMobile: false, sortOrder: 0 })
    },
    onError: () => toast.error("Failed to update hero slide"),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch(`/admin/hero-slides?id=${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] })
      toast.success("Hero slide deleted successfully")
    },
    onError: () => toast.error("Failed to delete hero slide"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData(slide)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingSlide(null)
    setFormData({ isForMobile: false, sortOrder: 0 })
  }

  if (isCreating || editingSlide) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{editingSlide ? "Edit Hero Slide" : "Create Hero Slide"}</Heading>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          <div>
            <Label htmlFor="id">ID (slug)</Label>
            <Input
              id="id"
              value={formData.id || ""}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={!!editingSlide}
            />
          </div>
          <div>
            <Label htmlFor="src">Image URL</Label>
            <Input
              id="src"
              value={formData.src || ""}
              onChange={(e) => setFormData({ ...formData, src: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={formData.alt || ""}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
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
          <div>
            <Label htmlFor="duration">Duration (seconds, optional)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration || ""}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value ? parseInt(e.target.value) : null })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="isForMobile"
              checked={formData.isForMobile || false}
              onCheckedChange={(checked) => setFormData({ ...formData, isForMobile: checked })}
            />
            <Label htmlFor="isForMobile">Mobile Only</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingSlide ? "Update" : "Create"}
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
        <Heading level="h2">Hero Slides</Heading>
        <Button onClick={() => setIsCreating(true)}>
          <Plus /> Create Slide
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
                <Table.HeaderCell>Alt Text</Table.HeaderCell>
                <Table.HeaderCell>Mobile</Table.HeaderCell>
                <Table.HeaderCell>Duration</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.map((slide) => (
                <Table.Row key={slide.id}>
                  <Table.Cell>{slide.sortOrder}</Table.Cell>
                  <Table.Cell>{slide.alt}</Table.Cell>
                  <Table.Cell>{slide.isForMobile ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>{slide.duration ? `${slide.duration}s` : "Auto"}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="small" variant="secondary" onClick={() => handleEdit(slide)}>
                        <PencilSquare />
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this slide?")) {
                            deleteMutation.mutate(slide.id)
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
  label: "Hero Slides",
})

export default HeroSlidesPage
