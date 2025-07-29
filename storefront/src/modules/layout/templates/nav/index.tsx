import { retrieveCart } from "@lib/data/cart"
import Nav from "@modules/layout/components/nav" // Adjust this path if your Navbar is located elsewhere

async function Navbar() {
  const cart = await retrieveCart()

  return <Nav cart={cart} />
}

export default Navbar
