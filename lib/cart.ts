import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface Cart {
  items: Record<string,number>;
  setQuantity: (id:string, quantity:number) => void;
  add: (id:string, quantity?:number) => void;
}
export const useCart = create<Cart>()(persist((set,get)=>({
  items: {},
  setQuantity: (id,quantity) => set(({items})=>{
    const next = {...items};
    if (quantity <= 0) delete next[id];
    else next[id] = Math.min(99,quantity);
    return {items:next};
  }),
  add: (id, quantity = 1) => get().setQuantity(id,(get().items[id] ?? 0) + quantity),
}),{name:'yaponamama-demo-cart',skipHydration:true}));
