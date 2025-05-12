import { Cart } from '@prisma/client';

export const fetchCart = async () => {
  try {
    const cart: Cart = await fetch(`/api/booking-page`).then((res) => res.json());
    return cart;
  } catch (e) {
    console.log('error -', e)
  }
};
