'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Minus, Plus, Search, ShoppingBag, Trash2, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { categories, orderUrl, products, type Product } from '@/data/menu';
import { dictionary, formatPrice, type Locale } from '@/lib/i18n';
import { useCart } from '@/lib/cart';

const nameOf=(product:Product,locale:Locale)=>locale==='ru'?product.name:product[locale];
function Photo({product,className='',locale='ru'}:{product:Product;className?:string;locale?:Locale}){
  return <Image className={className} src={'/assets/'+product.image+'.webp'} alt={nameOf(product,locale)} width={510} height={338}/>;
}

function Modal({children,title,close,className='',locale}:{children:ReactNode;title:string;close:()=>void;className?:string;locale:Locale}){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const node=dialog.current;
    node?.showModal();
    return ()=>node?.close();
  },[]);
  return <dialog ref={dialog} aria-label={title} className={'modal '+className} onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    <div className="modal-content">
      <button type="button" className="icon-button modal-close" aria-label={dictionary[locale].close} onClick={close}><X size={22}/></button>
      {children}
    </div>
  </dialog>;
}

function Quantity({quantity,onChange,locale}:{quantity:number;onChange:(value:number)=>void;locale:Locale}){
  const labels={ru:['Уменьшить количество','Увеличить количество'],en:['Decrease quantity','Increase quantity'],uz:['Miqdorni kamaytirish','Miqdorni oshirish']}[locale];
  return <div className="quantity">
    <button type="button" aria-label={labels[0]} disabled={quantity<=1} onClick={()=>onChange(quantity-1)}><Minus size={17}/></button><output aria-live="polite">{quantity}</output>
    <button type="button" aria-label={labels[1]} disabled={quantity>=99} onClick={()=>onChange(quantity+1)}><Plus size={17}/></button>
  </div>;
}

function ProductDialog({product,locale,close}:{product:Product;locale:Locale;close:()=>void}){
  const [quantity,setQuantity]=useState(1);
  const add=useCart(s=>s.add);
  const t=dictionary[locale];
  return <Modal title={nameOf(product,locale)} close={close} locale={locale}>
    <Photo product={product} className="dialog-photo" locale={locale}/>
    <div className="dialog-copy">
      <h3>{nameOf(product,locale)}</h3>
      {locale==='ru' && <p>{product.description}</p>}
      <p className="subtle">{t.sample}</p>
      <div className="dialog-order">
        <Quantity quantity={quantity} onChange={setQuantity} locale={locale}/>
        <button className="button red" type="button" onClick={()=>{add(product.id,quantity);close();}}>{t.add} · {formatPrice(product.price*quantity,locale)}</button>
      </div>
    </div>
  </Modal>;
}

export function CartDrawer({locale,close}:{locale:Locale;close:()=>void}){
  const items=useCart(s=>s.items);
  const set=useCart(s=>s.setQuantity);
  const rows=products.filter(p=>items[p.id]>0);
  const total=rows.reduce((sum,p)=>sum+p.price*items[p.id],0);
  const t=dictionary[locale];
  return <Modal title={t.cart} close={close} className="drawer" locale={locale}>
    <div className="cart-header"><h2>{t.cart}</h2><p className="subtle">{t.demo}</p></div>
    {rows.length===0?<div className="cart-empty"><ShoppingBag size={42}/><p>{t.empty}</p><a className="button dark" href="#menu" onClick={close}>{t.menu}</a></div>:
    <>
      <ul className="cart-items">{rows.map(p=><li key={p.id}>
        <Photo product={p} locale={locale}/>
        <div><strong>{nameOf(p,locale)}</strong><p>{formatPrice(p.price,locale)}</p><Quantity locale={locale} quantity={items[p.id]} onChange={value=>set(p.id,value)}/></div>
        <button className="icon-button" type="button" aria-label={nameOf(p,locale)+({ru:' — удалить',en:' — remove',uz:' — olib tashlash'}[locale])} onClick={()=>set(p.id,0)}><Trash2 size={17}/></button>
      </li>)}</ul>
      <div className="cart-total"><div><span>{t.subtotal}</span><strong>{formatPrice(total,locale)}</strong></div><a className="button red" href={orderUrl} target="_blank" rel="noreferrer">{t.order}<ArrowUpRight size={18}/></a></div>
    </>}
  </Modal>;
}

function ProductCard({product,locale,details}:{product:Product;locale:Locale;details:()=>void}){
  const add=useCart(s=>s.add);
  const reduce=useReducedMotion();
  return <motion.article className="product-card" whileHover={reduce?undefined:{y:-5}} transition={{duration:.22}}>
    <button className="product-photo" type="button" onClick={details} aria-label={nameOf(product,locale)}>
      <Photo product={product} locale={locale}/>
      {locale==='ru' && <span>{product.detail}</span>}
    </button>
    <div className="product-copy">
      <button className="product-title" type="button" onClick={details}>{nameOf(product,locale)}</button>
      {locale==='ru' && <p>{product.description}</p>}
      <div className="product-price"><strong>{formatPrice(product.price,locale)}</strong><button className="add-button" type="button" aria-label={dictionary[locale].add+' '+nameOf(product,locale)} onClick={()=>add(product.id)}><Plus size={21}/></button></div>
    </div>
  </motion.article>;
}

export function MenuSection({locale}:{locale:Locale}){
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<Product|null>(null);
  const t=dictionary[locale];
  const localeIndex={ru:1,en:2,uz:3}[locale];
  const needle=query.trim().toLowerCase();
  const filtered=products.filter(p=>(category==='all'||p.category===category)&&[p.name,p.en,p.uz,p.description].some(s=>s.toLowerCase().includes(needle)));
  return <section id="menu" className="menu-section">
    <div className="frame">
      <div className="section-top">
        <div><p className="eyebrow"><span/> YAPONAMAMA</p><h2>{t.menu}</h2></div>
        <p className="subtle">{t.sample}</p>
      </div>
      <div className="menu-controls">
        <div className="filters" aria-label={t.menu}>{categories.map(c=><button key={c[0]} type="button" aria-pressed={c[0]===category} onClick={()=>setCategory(c[0])}>{c[localeIndex]}</button>)}</div>
        <div className="menu-search"><Search size={20}/><input type="search" aria-label={t.search} placeholder={t.search} value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button type="button" aria-label={t.clear} onClick={()=>setQuery('')}><X size={17}/></button>}</div>
      </div>
      <p className="sr-only" aria-live="polite">{filtered.length}</p>
      {filtered.length?<div className="products">{filtered.map(product=><ProductCard key={product.id} product={product} locale={locale} details={()=>setSelected(product)}/>)}</div>:<p className="no-results">{t.noResults}</p>}
    </div>
    {selected&&<ProductDialog key={selected.id} product={selected} locale={locale} close={()=>setSelected(null)}/>}
  </section>;
}
