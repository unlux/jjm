import { Container, Heading, Button, Table, Input, Label, Textarea, Switch, toast } from "@medusajs/ui"
import { PencilSquare, Trash, Plus } from "@medusajs/icons"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Testimonial = {
  id: string
  quote: string
  author: string
  role: string | null
  image: string | null
  rating: number
  isFeatured: boolean
  sortOrder: number
  createdAt: string
}

const TestimonialsPage = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    rating: 5,
    isFeatured: false,
    sortOrder: 0,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ data: Testimonial[] }>("/admin/testimonials")
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (testimonial: Partial<Testimonial>) => {
      return sdk.client.fetch("/admin/testimonials", {
        method: "POST",
        body: testimonial,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
      toast.success("Testimonial created successfully")
      setIsCreating(false)
      setFormData({ rating: 5, isFeatured: false, sortOrder: 0 })
    },
    onError: () => toast.error("Failed to create testimonial"),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Testimonial> }) => {
      return sdk.client.fetch(`/admin/testimonials?id=${id}`, {
        method: "PUT",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
      toast.success("Testimonial updated successfully")
      setEditingTestimonial(null)
      setFormData({ rating: 5, isFeatured: false, sortOrder: 0 })
    },
    onError: () => toast.error("Failed to update testimonial"),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch(`/admin/testimonials?id=${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
      toast.success("Testimonial deleted successfully")
    },
    onError: () => toast.error("Failed to delete testimonial"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData(testimonial)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingTestimonial(null)
    setFormData({ rating: 5, isFeatured: false, sortOrder: 0 })
  }

  if (isCreating || editingTestimonial) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{editingTestimonial ? "Edit Testimonial" : "Create Testimonial"}</Heading>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          <div>
            <Label htmlFor="id">ID (slug)</Label>
            <Input
              id="id"
              value={formData.id || ""}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={!!editingTestimonial}
            />
          </div>
          <div>
            <Label htmlFor="author">Author Name</Label>
            <Input
              id="author"
              value={formData.author || ""}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role/Title (optional)</Label>
            <Input
              id="role"
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value || null })}
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              value={formData.image || ""}
              onChange={(e) => setFormData({ ...formData, image: e.target.value || null })}
            />
          </div>
          <div>
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              value={formData.quote || ""}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating || 5}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              required
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
              id="isFeatured"
              checked={formData.isFeatured || false}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingTestimonial ? "Update" : "Create"}
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
        <Heading level="h2">Testimonials</Heading>
        <Button onClick={() => setIsCreating(true)}>
          <Plus /> Create Testimonial
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
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Rating</Table.HeaderCell>
                <Table.HeaderCell>Featured</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.map((testimonial) => (
                <Table.Row key={testimonial.id}>
                  <Table.Cell>{testimonial.sortOrder}</Table.Cell>
                  <Table.Cell>{testimonial.author}</Table.Cell>
                  <Table.Cell>{testimonial.role || "-"}</Table.Cell>
                  <Table.Cell>{"⭐".repeat(testimonial.rating)}</Table.Cell>
                  <Table.Cell>{testimonial.isFeatured ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="small" variant="secondary" onClick={() => handleEdit(testimonial)}>
                        <PencilSquare />
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this testimonial?")) {
                            deleteMutation.mutate(testimonial.id)
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
  label: "Testimonials",
})

export default TestimonialsPage
