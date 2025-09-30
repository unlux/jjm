import { retrieveCart } from "@lib/data/cart"
import MarqueeServer from "@modules/layout/components/MarqueeServer"
import Nav from "@modules/layout/components/nav" // Adjust this path if your Navbar is located elsewhere

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
