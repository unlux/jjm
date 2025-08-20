// data/products.ts
export type Product = {
  id: number
  name: string
  category: string
  ageGroup: string
  price: number
  discount: number
  image: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Dino Color Match Game",
    category: "Card-Tastic Fun",
    ageGroup: "2-4",
    price: 499,
    discount: 15,
    image: "/age-2-4.png",
  },
  {
    id: 2,
    name: "Wooden Mosaic Puzzle",
    category: "Kid's Development Games",
    ageGroup: "4-6",
    price: 649,
    discount: 20,
    image: "/age-4-6.png",
  },
  {
    id: 3,
    name: "Balancing Rabbit",
    category: "Wooden Wonders",
    ageGroup: "4-6",
    price: 399,
    discount: 25,
    image: "/card-tastic-fun.png",
  },
  {
    id: 4,
    name: "Alphabet Flash Cards",
    category: "Flashcard Fun",
    ageGroup: "2-4",
    price: 299,
    discount: 10,
    image: "/flashcard-fun.png",
  },
  {
    id: 5,
    name: "Number Memory Game",
    category: "Card-Tastic Fun",
    ageGroup: "6-8",
    price: 349,
    discount: 15,
    image: "/age-6-8.png",
  },
  {
    id: 6,
    name: "Science Experiment Kit",
    category: "Kid's Development Games",
    ageGroup: "8+",
    price: 799,
    discount: 20,
    image: "/age-8-plus.png",
  },
  {
    id: 7,
    name: "Wooden Building Blocks",
    category: "Wooden Wonders",
    ageGroup: "2-4",
    price: 599,
    discount: 12,
    image: "/wooden-wonders.png",
  },
  {
    id: 8,
    name: "Solar System Cards",
    category: "Flashcard Fun",
    ageGroup: "6-8",
    price: 329,
    discount: 18,
    image: "/kids-development-games.png",
  },
]
