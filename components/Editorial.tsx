'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'motion/react';
import { locations, locationsUrl, orderUrl } from '@/data/menu';
import { Rings, Wordmark } from './Graphic';
import { dictionary, type Locale } from '@/lib/i18n';

const flavors=[['Лосось','dish-0'],['Сеты','dish-3'],['Горячее','dish-4'],['Лапша','dish-5'],['Десерты','dish-7']] as const;

export function Editorial(){
  const rail=useRef<HTMLDivElement>(null);
  const reduce=useReducedMotion();
  function move(direction:number){
    const node=rail.current;
    if(node)node.scrollBy({left:direction*node.clientWidth*.68,behavior:reduce?'instant':'smooth'});
  }
  useEffect(()=>{
    if (reduce||!rail.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const media=gsap.matchMedia();
    media.add('(min-width: 900px)',()=>{
      const cards=rail.current?.querySelectorAll('img');
      if(!cards?.length)return;
      gsap.fromTo(cards,{scale:1.15,yPercent:-5},{yPercent:5,scale:1.15,ease:'none',scrollTrigger:{trigger:rail.current,start:'top bottom',end:'bottom top',scrub:true}});
    });
    return ()=>media.revert();
  },[reduce]);
  return <>
    <section id="gallery" className="gallery">
      <div className="frame">
        <p className="eyebrow"><span/> ГАЛЕРЕЯ</p>
        <h2>ВКУС ВБЛИЗИ.</h2>
        <div className="gallery-grid">
          {([['dish-1','Хрустящие роллы'],['dish-6','Салат чука'],['dish-8','Айс матча']] as const).map(([image,title])=>
            <motion.figure key={image} whileHover={reduce?undefined:{rotateY:4,rotateX:-4,y:-5}}>
              <div><Image src={'/assets/'+image+'.webp'} alt={title} width={510} height={338}/></div><figcaption>{title}</figcaption>
            </motion.figure>
          )}
        </div>
      </div>
    </section>
    <section className="flavors">
      <div className="frame">
        <div className="section-top"><div><p className="eyebrow"><span/> ПАНАЗИАТСКАЯ КУХНЯ</p><h2>ОТКРОЙТЕ<br/>НОВЫЙ ВКУС.</h2></div>
          <div className="rail-controls"><button type="button" className="icon-button" aria-label="Предыдущие блюда" onClick={()=>move(-1)}><ArrowLeft/></button><button type="button" className="icon-button" aria-label="Следующие блюда" onClick={()=>move(1)}><ArrowRight/></button></div>
        </div>
        <div className="flavor-rail" ref={rail} tabIndex={0} aria-label="Галерея блюд">{flavors.map(([title,image])=><motion.figure key={title} whileHover={reduce?undefined:{rotate:-1,y:-4}}><div><Image src={'/assets/'+image+'.webp'} width={510} height={338} alt={title}/></div><figcaption>{title}</figcaption></motion.figure>)}</div>
      </div>
    </section>
    <section className="experience">
      <div className="frame experience-layout">
        <Image src="/assets/dish-0.webp" alt="Крупный план роллов с лососем" width={510} height={338}/>
        <motion.div initial={reduce?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}}>
          <p className="eyebrow"><span/> ИСКУССТВО СУШИ</p>
          <h2>МАЛЕНЬКИЕ ДЕТАЛИ.<br/>БОЛЬШОЙ ВКУС.</h2>
          <p>Хруст огурца. Нежность лосося. Тёплая встреча за одним столом. Иногда для хорошего вечера достаточно любимого ролла и компании друзей.</p>
        </motion.div>
      </div>
    </section>
  </>;
}

export function Locations({locale}:{locale:Locale}){
  return <section className="locations" id="locations"><div className="frame">
    <div className="section-top"><div><p className="eyebrow"><span/> УЗБЕКИСТАН</p><h2>{dictionary[locale].locations}</h2></div><a className="button outline" href={locationsUrl} target="_blank" rel="noreferrer">Все рестораны <ArrowUpRight size={17}/></a></div>
    <div className="location-grid">{locations.map(branch=><a className="location-card" href={orderUrl+'/reserve?branch_id='+branch.id} key={branch.id} target="_blank" rel="noreferrer"><MapPin size={24}/><strong>{branch.name}</strong><ArrowUpRight size={19}/></a>)}</div>
  </div></section>;
}

export function Footer({locale}:{locale:Locale}){
  const t=dictionary[locale];
  return <>
    <section className="final"><Rings className="final-rings"/><div className="frame"><p className="eyebrow"><span/> YAPONAMAMA</p><h2>ВКУС, КОТОРЫЙ<br/>ХОЧЕТСЯ ПОВТОРИТЬ.</h2><div className="actions"><a className="button dark" href="#menu">Посмотреть меню</a><a className="button light" href={orderUrl} target="_blank" rel="noreferrer">Заказать на официальном сайте <ArrowUpRight size={17}/></a></div></div></section>
    <footer><div className="frame footer-inner"><a href="#top"><Wordmark/></a><nav aria-label="Навигация в подвале"><a href="#story">{t.story}</a><a href="#menu">{t.menu}</a><a href="#locations">{t.locations}</a><a href={locationsUrl} target="_blank" rel="noreferrer">Официальные контакты <ArrowUpRight size={14}/></a></nav><p>Неофициальный концепт. Заказы оформляются на официальном сайте.</p></div></footer>
  </>;
}
