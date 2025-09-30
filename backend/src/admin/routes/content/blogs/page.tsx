import { Container, Heading, Button, Table, Input, Label, Textarea, toast } from "@medusajs/ui"
import { PencilSquare, Trash, Plus } from "@medusajs/icons"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Blog = {
  id: string
  title: string
  publishedAt: string
  category: string
  image: string
  excerpt: string
  content: string
  author: string
  authorImage: string
}

const BlogsPage = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState<Partial<Blog>>({})

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ data: Blog[] }>("/admin/blogs")
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (blog: Partial<Blog>) => {
      return sdk.client.fetch("/admin/blogs", {
        method: "POST",
        body: blog,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      toast.success("Blog created successfully")
      setIsCreating(false)
      setFormData({})
    },
    onError: () => toast.error("Failed to create blog"),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Blog> }) => {
      return sdk.client.fetch(`/admin/blogs?id=${id}`, {
        method: "PUT",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      toast.success("Blog updated successfully")
      setEditingBlog(null)
      setFormData({})
    },
    onError: () => toast.error("Failed to update blog"),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch(`/admin/blogs?id=${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      toast.success("Blog deleted successfully")
    },
    onError: () => toast.error("Failed to delete blog"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData(blog)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingBlog(null)
    setFormData({})
  }

  if (isCreating || editingBlog) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{editingBlog ? "Edit Blog" : "Create Blog"}</Heading>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          <div>
            <Label htmlFor="id">ID (slug)</Label>
            <Input
              id="id"
              value={formData.id || ""}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={!!editingBlog}
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author || ""}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="authorImage">Author Image URL</Label>
            <Input
              id="authorImage"
              value={formData.authorImage || ""}
              onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Featured Image URL</Label>
            <Input
              id="image"
              value={formData.image || ""}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ""}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={10}
            />
          </div>
          <div>
            <Label htmlFor="publishedAt">Published At</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingBlog ? "Update" : "Create"}
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
        <Heading level="h2">Blogs</Heading>
        <Button onClick={() => setIsCreating(true)}>
          <Plus /> Create Blog
        </Button>
      </div>
      <div className="px-6 py-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell>Published</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.map((blog) => (
                <Table.Row key={blog.id}>
                  <Table.Cell>{blog.title}</Table.Cell>
                  <Table.Cell>{blog.category}</Table.Cell>
                  <Table.Cell>{blog.author}</Table.Cell>
                  <Table.Cell>{new Date(blog.publishedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="small" variant="secondary" onClick={() => handleEdit(blog)}>
                        <PencilSquare />
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this blog?")) {
                            deleteMutation.mutate(blog.id)
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
  label: "Blogs",
})

export default BlogsPage
