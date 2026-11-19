'use client';
import {useSyncExternalStore} from 'react';

const query='(prefers-reduced-motion: reduce)';
function subscribe(change:()=>void){
  const media=window.matchMedia(query);
  media.addEventListener('change',change);
  return ()=>media.removeEventListener('change',change);
}
let available:boolean|undefined;
function read(){
  if(window.matchMedia(query).matches)return false;
  if(available===undefined){
    try{
      const gl=document.createElement('canvas').getContext('webgl2');
      available=!!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    }catch{available=false;}
  }
  return available;
}
export const useWebGL=()=>useSyncExternalStore(subscribe,read,()=>false);
