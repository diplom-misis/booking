import { Cart } from '@prisma/client';

export const fetchCart = async () => {
  try {
    const carts: Cart[] = await fetch(`/api/cart`).then((res) => res.json());
    return carts;
  } catch (e) {
    console.log('error -', e)
  }
};
