'use client';

import { forwardRef, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import { CanvasTexture, Group, SRGBColorSpace } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { mix } from './timeline';

export const PackagingModel = forwardRef<Group, {opening:()=>number}>(
  function PackagingModel({opening}, ref) {
    const base = useRef<Group>(null!);
    const hinge = useRef<Group>(null!);
    const side = useRef<Group>(null!);
    useImperativeHandle(ref,()=>base.current,[]);
    const print = useMemo(()=>{
      const canvas=document.createElement('canvas');
      canvas.width=1024;
      canvas.height=512;
      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#ef303a';
      ctx.fillRect(0,0,1024,512);
      ctx.strokeStyle='#ff7278';
      ctx.lineWidth=3;
      for(let r=60;r<580;r+=46){
        ctx.beginPath();ctx.arc(965,495,r,Math.PI,Math.PI*2);ctx.stroke();
      }
      ctx.fillStyle='#fff8ef';
      ctx.font='900 104px sans-serif';
      ctx.fillText('YAPONAMAMA',66,258);
      ctx.font='600 28px sans-serif';
      ctx.fillText('T H E   A R T   O F   S U S H I',73,323);
      const texture=new CanvasTexture(canvas);
      texture.colorSpace=SRGBColorSpace;
      texture.anisotropy=4;
      return texture;
    },[]);
    useEffect(()=>()=>print.dispose(),[print]);
    useFrame(()=>{
      const open=opening();
      hinge.current.rotation.x=-open*2.12;
      side.current.rotation.x=open*.95;
    });
    return <group ref={base}>
      <mesh receiveShadow position={[0,.04,0]}><boxGeometry args={[4,.105,2.55]}/><meshStandardMaterial color="#273749"/></mesh>
      <mesh position={[0,.104,0]}><boxGeometry args={[3.86,.045,2.40]}/><meshStandardMaterial color="#ead4b8"/></mesh>
      {[-1,1].map(sign=><mesh key={sign} position={[sign*1.97,.34,0]} castShadow><boxGeometry args={[.075,.54,2.55]}/><meshStandardMaterial color="#ed353e"/></mesh>)}
      <mesh position={[0,.34,-1.25]} castShadow><boxGeometry args={[4,.54,.075]}/><meshStandardMaterial color="#ed353e"/></mesh>
      <group ref={side} position={[0,.1,1.24]}><mesh position={[0,.25,0]}><boxGeometry args={[4,.49,.075]}/><meshStandardMaterial color="#ed353e"/></mesh></group>
      <group ref={hinge} position={[0,.624,-1.26]}>
        <mesh castShadow position={[0,.035,1.26]}><boxGeometry args={[4,.075,2.55]}/><meshStandardMaterial color="#ef303a"/></mesh>
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,.075,1.26]}><planeGeometry args={[3.98,2.52]}/><meshStandardMaterial map={print} roughness={.65}/></mesh>
        <mesh position={[0,-.035,1.26]}><boxGeometry args={[3.92,.025,2.44]}/><meshStandardMaterial color="#f0dcc2"/></mesh>
        <mesh position={[0,-.075,2.53]}><boxGeometry args={[3.85,.2,.075]}/><meshStandardMaterial color="#ed353e"/></mesh>
      </group>
    </group>;
  }
);

export function ViewerBox({open,turn}:{open:boolean;turn:number}) {
  const current=useRef(0);
  const group=useRef<Group>(null!);
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>invalidate(),[open,turn,invalidate]);
  useFrame((_,delta)=>{
    const blend=Math.min(1,Math.max(.05,delta*7));
    current.current=mix(current.current,Number(open),blend);
    group.current.rotation.y=mix(group.current.rotation.y,turn,blend);
    if(Math.abs(current.current-Number(open))>.001 || Math.abs(group.current.rotation.y-turn)>.001)invalidate();
  });
  return <PackagingModel ref={group} opening={()=>current.current}/>;
}
