'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowDownRight, ShoppingBag } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { Rings, Wordmark } from '@/components/Graphic';
import { CartDrawer, MenuSection } from '@/components/MenuSection';
import { PackagingSection, SushiStory } from '@/components/SushiStory';
import { Editorial, Footer, Locations } from '@/components/Editorial';
import { useCart } from '@/lib/cart';
import { dictionary, type Locale } from '@/lib/i18n';

export default function Home() {
  const [locale,setLocale]=useState<Locale>('ru');
  const [drawer,setDrawer]=useState(false);
  const count=useCart(s=>Object.values(s.items).reduce((sum,n)=>sum+n,0));
  const t=dictionary[locale];
  const [heading,accent]=t.hero.split('|');
  useEffect(()=>{void useCart.persist.rehydrate();document.documentElement.dataset.ready='true';},[]);
  useEffect(()=>{document.documentElement.lang=locale;},[locale]);
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#menu">{t.menu}</a>
    <div id="top"/>
    <header className="site-header"><div className="frame header-inner">
      <a href="#top" aria-label="Yaponamama"><Wordmark/></a>
      <nav aria-label="Главная навигация"><a href="#story">{t.story}</a><a href="#menu">{t.menu}</a><a href="#locations">{t.locations}</a></nav>
      <div className="header-actions"><select value={locale} aria-label="Язык / Language" onChange={e=>setLocale(e.target.value as Locale)}><option value="ru">RU</option><option value="uz">UZ</option><option value="en">EN</option></select>
      <button type="button" className="header-cart" aria-label={t.cart+' '+count} onClick={()=>setDrawer(true)}><ShoppingBag size={17}/><span>{t.cart}</span><b aria-live="polite">{count}</b></button></div>
    </div></header>
    <main>
      <section className="hero">
        <Image className="hero-photo" src="/assets/hero.webp" alt="" fill preload sizes="100vw"/>
        <div className="hero-shade"/>
        <Rings className="hero-rings"/>
        <div className="hero-jp" aria-hidden="true">寿<br/>司</div>
        <div className="frame hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span/> PAN-ASIAN KITCHEN · UZBEKISTAN</p>
            <h1 key={locale}><span>{heading}</span><em>{accent}<i>.</i></em></h1>
            <p className="hero-description">{t.tagline}</p>
            <div className="hero-actions"><a className="button red" href="#story">{t.start}<ArrowDownRight size={18}/></a><a className="button ghost" href="#menu">{t.menu}</a></div>
          </div>
          <div className="hero-bottom"><a href="#story"><ArrowDown size={16}/><span>{t.story}</span></a><span>THE ART OF SUSHI</span></div>
        </div>
      </section>
      <SushiStory/>
      <MenuSection locale={locale}/>
      <Editorial/>
      <PackagingSection/>
      <Locations locale={locale}/>
      <Footer locale={locale}/>
    </main>
    {drawer&&<CartDrawer locale={locale} close={()=>setDrawer(false)}/>}
  </MotionConfig>;
}
