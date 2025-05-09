import { create } from 'zustand'
import axios from 'axios'
import { RouteDto } from '@/types/SearchResult'

interface CartItem {
  id: string
  routeId: string
  passengers: number
  route: RouteDto
}

interface CartState {
  items: CartItem[]
  addToCart: (route: RouteDto, passengers: number) => Promise<void>
  removeFromCart: (routeId: string) => Promise<void>
  isInCart: (routeId: string) => boolean
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: async (route, passengers) => {
    try {
      const { data } = await axios.post('/api/cart', {
        routeId: route.id,
        passengersCount: passengers
      })
      
      set(state => ({
        items: [...state.items, ...data.items.map((item: any) => ({
          id: item.id,
          routeId: item.routeId,
          passengers,
          route
        }))]
      }))
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  },

  removeFromCart: async (routeId) => {
    try {
      await axios.delete('/api/cart', { data: { routeId } })
      
      set(state => ({
        items: state.items.filter(item => item.routeId !== routeId)
      }))
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  },

  isInCart: (routeId) => {
    return get().items.some(item => item.routeId === routeId)
  }
}))