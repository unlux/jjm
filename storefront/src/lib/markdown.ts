import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

/**
 * Converts Markdown to safe HTML.
 * - Supports GitHub Flavored Markdown (tables, strikethrough, task lists)
 * - Sanitizes the HTML output to prevent XSS
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Extend the default sanitize schema to allow common content
  const schema: Parameters<typeof rehypeSanitize>[0] = {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "code",
      "pre",
      "blockquote",
    ],
    attributes: {
      ...(defaultSchema.attributes || {}),
      h1: [["id"]],
      h2: [["id"]],
      h3: [["id"]],
      h4: [["id"]],
      h5: [["id"]],
      h6: [["id"]],
      a: [
        ...(defaultSchema.attributes?.a || []),
        ["href"],
        ["target"],
        ["rel"],
      ],
      img: [
        ...(defaultSchema.attributes?.img || []),
        ["src"],
        ["alt"],
        ["title"],
        ["width"],
        ["height"],
      ],
      code: [
        ...(defaultSchema.attributes?.code || []),
        ["className"],
      ],
      pre: [...(defaultSchema.attributes?.pre || []), ["className"]],
    },
    protocols: {
      ...(defaultSchema.protocols || {}),
      src: ["http", "https", "data"],
      href: ["http", "https", "mailto", "tel"],
    },
    clobberPrefix: "md-",
  }

  const file = await remark()
    .use(remarkGfm)
    // Convert to HTML, keeping raw HTML in the markdown
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    // Add useful features for headings
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    // Sanitize with our extended schema
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(markdown || "")

  return String(file)
}
