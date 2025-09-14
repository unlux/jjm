import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { testimonials as testimonialsTable } from "@/lib/schema"

// Dev-only: seed sample testimonials
export async function POST() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Disabled in production" },
        { status: 403 }
      )
    }

    const now = new Date()
    const rows = [
      {
        id: "testimonial-1",
        quote: "The educational toys from The Joy Junction have been a game-changer for my classroom. The kids are more engaged than ever!",
        author: "Priya Sharma",
        role: "Preschool Teacher",
        image: "/avatars/placeholder-avatar-1.jpg",
        rating: 5,
        isFeatured: true,
        sortOrder: 1,
        createdAt: now,
      },
      {
        id: "testimonial-2",
        quote: "As a child psychologist, I highly recommend these toys. They're not just fun but also great for cognitive development.",
        author: "Dr. Arjun Patel",
        role: "Child Psychologist",
        image: "/avatars/placeholder-avatar-2.jpg",
        rating: 5,
        isFeatured: true,
        sortOrder: 2,
        createdAt: now,
      },
      {
        id: "testimonial-3",
        quote: "My daughter loves the STEM kits! She's learning so much while having fun. Worth every penny.",
        author: "Meera Krishnan",
        role: "Parent",
        image: "/avatars/placeholder-avatar-3.jpg",
        rating: 4,
        isFeatured: true,
        sortOrder: 3,
        createdAt: now,
      },
    ]

    // Insert, ignore duplicates by id
    await db
      .insert(testimonialsTable)
      .values(rows as any)
      .onConflictDoNothing()

    return NextResponse.json({ ok: true, inserted: rows.length })
  } catch (e: any) {
    console.error("POST /api/testimonials/seed error", e)
    return NextResponse.json(
      { error: "Failed to seed testimonials" },
      { status: 500 }
    )
  }
}
