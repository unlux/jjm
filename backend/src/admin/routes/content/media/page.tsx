import { Container, Heading, Button, Table, Input, toast, Badge } from "@medusajs/ui"
import { Trash, Plus, SquareTwoStack } from "@medusajs/icons"
import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type MediaUpload = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string | null
  createdAt: string
}

const MediaPage = () => {
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ data: MediaUpload[] }>("/admin/media")
      return response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/admin/media", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Upload failed" }))
        throw new Error(error.error || "Upload failed")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      toast.success("File uploaded successfully")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch(`/admin/media?id=${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      toast.success("Media deleted successfully")
    },
    onError: () => toast.error("Failed to delete media"),
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    try {
      await uploadMutation.mutateAsync(file)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Media Library</Heading>
          <p className="text-sm text-gray-600 mt-1">
            Upload and manage images for hero slides, blogs, and other content
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button onClick={handleUploadClick} isLoading={isUploading}>
            <Plus /> Upload Image
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Preview</Table.HeaderCell>
                  <Table.HeaderCell>File Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Size</Table.HeaderCell>
                  <Table.HeaderCell>Uploaded</Table.HeaderCell>
                  <Table.HeaderCell>URL</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((media) => (
                  <Table.Row key={media.id}>
                    <Table.Cell>
                      <img
                        src={media.url}
                        alt={media.originalName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="max-w-xs truncate" title={media.originalName}>
                        {media.originalName}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge size="small">{media.mimeType.split("/")[1]}</Badge>
                    </Table.Cell>
                    <Table.Cell>{formatFileSize(media.size)}</Table.Cell>
                    <Table.Cell>
                      {new Date(media.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                          {media.url}
                        </code>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => copyToClipboard(media.url)}
                        >
                          <SquareTwoStack />
                        </Button>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this image?")) {
                            deleteMutation.mutate(media.id)
                          }
                        }}
                      >
                        <Trash />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No images uploaded yet</p>
            <Button onClick={handleUploadClick}>
              <Plus /> Upload Your First Image
            </Button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 How to use uploaded images
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Click "Upload Image" to select and upload an image file</li>
            <li>Copy the URL by clicking the copy button</li>
            <li>Paste the URL in Hero Slides, Blogs, or Testimonials forms</li>
            <li>Supported formats: JPG, PNG, GIF, WebP (max 10MB)</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Media Library",
})

export default MediaPage
