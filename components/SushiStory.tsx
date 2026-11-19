'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Box, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useWebGL } from '@/hooks/useWebGL';
import { stages } from '@/scenes/timeline';
import { Rings } from './Graphic';

const SushiScene=dynamic(()=>import('@/scenes/SushiScene'),{ssr:false,loading:()=> <div className="scene-loading" role="status">Загрузка 3D…</div>});
const PackageCanvas=dynamic(()=>import('@/scenes/SushiScene').then(m=>m.PackageCanvas),{ssr:false,loading:()=> <div className="scene-loading" role="status">Загрузка 3D…</div>});

class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}

export function SushiStory(){
  const enabled=useWebGL();
  const region=useRef<HTMLElement>(null);
  const pin=useRef<HTMLDivElement>(null);
  const trigger=useRef<ScrollTrigger|null>(null);
  const progress=useRef(0);
  const inspection=useRef(0);
  const meter=useRef<HTMLDivElement>(null);
  const [index,setIndex]=useState(0);
  const [angle,setAngle]=useState(0);
  const refreshRef=useRef<(()=>void) | null>(null);
  useEffect(()=>{
    if(!enabled || !region.current || !pin.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const match=gsap.matchMedia();
    match.add({desktop:'(min-width: 760px)',mobile:'(max-width: 759px)'},({conditions})=>{
      const desktop=conditions?.desktop;
      const run=ScrollTrigger.create({
        trigger:region.current,pin:pin.current,start:()=> 'top top+='+ (document.querySelector('.site-header')?.clientHeight ?? 0),
        end:()=>'+='+window.innerHeight*(desktop?5:2.75),
        scrub:true,anticipatePin:1,invalidateOnRefresh:true,
        onUpdate:self=>{
          progress.current=self.progress;
          refreshRef.current?.();
          if(meter.current)meter.current.style.transform='scaleX('+self.progress+')';
          let active=0;
          stages.forEach((stage,i)=>{if(self.progress>=stage.start)active=i;});
          setIndex(active);
        },
      });
      trigger.current=run;
      return ()=>{run.kill();trigger.current=null;};
    });
    return ()=>match.revert();
  },[enabled]);
  function jump(i:number){
    const run=trigger.current;
    if(run)window.scrollTo({top:run.start+(run.end-run.start)*(i===0?0:(stages[i].start+(stages[i+1]?.start??1))/2),behavior:'smooth'});
    else setIndex(i);
  }
  const active=stages[index];
  const fallback=<Image className="story-fallback" src="/assets/dish-0.webp" alt="Роллы с лососем на тарелке" width={500} height={350}/>;
  return <section ref={region} id="story" aria-label="История ролла" className="story">
    <div ref={pin} className="story-pin" style={{backgroundColor:active.color}}>
      <div className="frame story-layout">
        <div className="story-copy">
          <p className="eyebrow"><span/> ОТ РИСА ДО РОЛЛА</p>
          <h2 key={active.title}>{active.title}</h2>
          <p>{active.description}</p>
          {index===1 && <ul className="ingredient-list"><li>Нори</li><li>Рис</li><li>Лосось</li><li>Огурец</li><li>Сливочный сыр</li></ul>}
          {index===4 && enabled && <label className="inspect"><RotateCw size={18}/> 360° <input type="range" min="0" max="360" value={angle} aria-label="Поворот тарелки" onChange={e=>{const value=Number(e.target.value);inspection.current=value;setAngle(value);refreshRef.current?.();}}/></label>}
          {index===6 && <a className="button dark" href="#menu">Смотреть меню <ArrowRight size={18}/></a>}
        </div>
        <div className="story-visual" onPointerMove={()=>refreshRef.current?.()}>
          <Rings className="story-rings"/>
          {enabled ? <SceneBoundary fallback={fallback}><SushiScene progress={progress} inspection={inspection} refreshRef={refreshRef}/></SceneBoundary> : fallback}
        </div>
        <div className="story-controls">
          <div className="story-meter"><div ref={meter}/></div>
          <div className="story-stages" aria-label="Этапы приготовления">
            {stages.map((stage,i)=><button key={stage.start} type="button" aria-current={i===index?'step':undefined} onClick={()=>jump(i)}>{stage.label}</button>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
}

export function PackagingSection(){
  const enabled=useWebGL();
  const view=useRef<HTMLElement>(null);
  const [seen,setSeen]=useState(false);
  const [open,setOpen]=useState(false);
  const [reset,setReset]=useState(0);
  const [turn,setTurn]=useState(0);
  const [zoom,setZoom]=useState(1);
  useEffect(()=>{
    if(!view.current)return;
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setSeen(true);observer.disconnect();}},{rootMargin:'240px'});
    observer.observe(view.current);
    return ()=>observer.disconnect();
  },[]);
  const fallback=<div className={'css-box '+(open?'opened':'')} style={{scale:zoom,rotate:(turn*180/Math.PI-11)+'deg'}}><span>YAPONAMAMA.</span><div/></div>;
  return <section ref={view} className="packaging" id="packaging">
    <div className="frame packaging-layout">
      <div>
        <p className="eyebrow"><span/> УПАКОВКА</p>
        <h2>ВКУС,<br/>КОТОРЫЙ<br/>С ТОБОЙ.</h2>
        <p>{enabled?'Потяните коробку, чтобы рассмотреть её со всех сторон.':'Откройте коробку и загляните внутрь.'}</p>
        <div className="package-actions">
          <button className="button dark" type="button" aria-pressed={open} onClick={()=>setOpen(!open)}><Box size={18}/>{open?'Закрыть':'Открыть'} коробку</button>
          <button className="icon-button" type="button" aria-label="Приблизить" disabled={zoom>=1.4} onClick={()=>setZoom(v=>Math.min(1.4,v+.2))}><ZoomIn size={20}/></button>
          <button className="icon-button" type="button" aria-label="Отдалить" disabled={zoom<=.8} onClick={()=>setZoom(v=>Math.max(.8,v-.2))}><ZoomOut size={20}/></button>
          <button className="icon-button" type="button" aria-label="Повернуть коробку" onClick={()=>setTurn(v=>v+Math.PI/4)}><RotateCw size={20}/></button>
          <button className="icon-button" type="button" aria-label="Сбросить вид" onClick={()=>{setZoom(1);setTurn(0);setOpen(false);setReset(v=>v+1);}}><RotateCcw size={20}/></button>
        </div>
      </div>
      <div className="package-view"><Rings className="story-rings"/>{enabled&&seen?<SceneBoundary fallback={fallback}><PackageCanvas open={open} reset={reset} zoom={zoom} turn={turn}/></SceneBoundary>:fallback}</div>
    </div>
  </section>;
}
