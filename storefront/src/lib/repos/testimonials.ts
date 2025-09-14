import { asc, desc, eq, and, or, isNull, isNotNull } from "drizzle-orm"
import { db } from "@/lib/db"
import { testimonials as testimonialsTable, type TestimonialRow, type NewTestimonialRow } from "@/lib/schema"

export type TestimonialItem = Pick<TestimonialRow, 'id' | 'quote' | 'author' | 'role' | 'image' | 'rating' | 'isFeatured'>

export async function listTestimonials(params?: {
  isFeatured?: boolean
  limit?: number
  orderBy?: 'newest' | 'rating' | 'sortOrder'
}): Promise<TestimonialItem[]> {
  const { isFeatured, limit = 50, orderBy = 'sortOrder' } = params ?? {}
  
  const where = []
  if (typeof isFeatured === 'boolean') {
    where.push(eq(testimonialsTable.isFeatured, isFeatured))
  }
  
  const orderByClause = orderBy === 'newest' 
    ? [desc(testimonialsTable.createdAt)] 
    : orderBy === 'rating' 
      ? [desc(testimonialsTable.rating), desc(testimonialsTable.createdAt)]
      : [asc(testimonialsTable.sortOrder), desc(testimonialsTable.createdAt)]

  const rows = await db
    .select({
      id: testimonialsTable.id,
      quote: testimonialsTable.quote,
      author: testimonialsTable.author,
      role: testimonialsTable.role,
      image: testimonialsTable.image,
      rating: testimonialsTable.rating,
      isFeatured: testimonialsTable.isFeatured,
    })
    .from(testimonialsTable)
    .where(where.length ? and(...where) : undefined)
    .orderBy(...orderByClause)
    .limit(limit)
    
  return rows
}

export async function getTestimonialById(id: string): Promise<TestimonialItem | null> {
  const [testimonial] = await db
    .select({
      id: testimonialsTable.id,
      quote: testimonialsTable.quote,
      author: testimonialsTable.author,
      role: testimonialsTable.role,
      image: testimonialsTable.image,
      rating: testimonialsTable.rating,
      isFeatured: testimonialsTable.isFeatured,
    })
    .from(testimonialsTable)
    .where(eq(testimonialsTable.id, id))
    .limit(1)
    
  return testimonial || null
}

export async function createTestimonial(data: Omit<NewTestimonialRow, 'id' | 'createdAt'>) {
  const [testimonial] = await db
    .insert(testimonialsTable)
    .values({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    })
    .returning()
    
  return testimonial
}

export async function updateTestimonial(id: string, data: Partial<Omit<NewTestimonialRow, 'id' | 'createdAt'>>) {
  const [testimonial] = await db
    .update(testimonialsTable)
    .set(data)
    .where(eq(testimonialsTable.id, id))
    .returning()
    
  return testimonial || null
}

export async function deleteTestimonial(id: string) {
  const [testimonial] = await db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, id))
    .returning()
    
  return testimonial || null
}
