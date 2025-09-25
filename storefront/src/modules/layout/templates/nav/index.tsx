import { retrieveCart } from "@lib/data/cart"
import Nav from "@modules/layout/components/nav" // Adjust this path if your Navbar is located elsewhere
import MarqueeServer from "@modules/layout/components/MarqueeServer"

async function Navbar() {
  const cart = await retrieveCart()

  return (
    <>
      <MarqueeServer />
      <Nav cart={cart} />
    </>
  )
}

export default Navbar
