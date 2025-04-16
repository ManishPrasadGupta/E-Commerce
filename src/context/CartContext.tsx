'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  quantity: number
  variant: {
    type: string
    price: number
  }
  // image?: string
}

type CartContextType = {
  cartItems: CartItem[]
  fetchCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart")
      const data = await res.json()
      setCartItems(data.item || [])
    } catch (err) {
      console.error("Error fetching cart", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
