'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { BoxGeometry, Color, CylinderGeometry, DoubleSide, Group, InstancedMesh, Mesh, MeshStandardMaterial, Object3D, PlaneGeometry, SphereGeometry, Vector3 } from 'three';
import { PackagingModel, ViewerBox } from './PackagingModel';
import { ease, mix } from './timeline';

const tau = Math.PI*2;
const random = (n:number)=>{const x=Math.sin(n*197.93+31.54)*43758.5453;return x-Math.floor(x);};
const grains = Array.from({length:660},(_,i)=>({
  x:(random(i*7)-.5)*3.85,z:(random(i*7+1)-.5)*2.65,y:random(i*7+2)*.07,
  yaw:random(i*7+3)*tau,scatter:(random(i*7+4)-.5)*2.3,
}));
const fillings = [
  {color:'#fa775d',size:[3.85,.23,.35],offset:-.22},
  {color:'#57934a',size:[3.82,.17,.18],offset:.14},
  {color:'#fff3d9',size:[3.83,.20,.25],offset:.37},
] as const;

function bend(z:number, curvature:number, height:number) {
  const theta=z*curvature;
  return {
    y:curvature < .001 ? height : (1-Math.cos(theta))/curvature+height*Math.cos(theta),
    z:curvature < .001 ? z : Math.sin(theta)*(1/curvature-height),
    theta,
  };
}

function Layers({progress}:{progress:RefObject<number>}) {
  const sheet = useMemo(()=>{
    const geo=new PlaneGeometry(4,2.83,20,56);
    geo.rotateX(-Math.PI/2);
    return geo;
  },[]);
  const slat=useMemo(()=>new BoxGeometry(4.39,.053,.075),[]);
  const scratch=useMemo(()=>new Object3D(),[]);
  const surface=useRef<Mesh>(null!);
  const sheetBase=useMemo(()=>Array.from(sheet.attributes.position.array),[sheet]);
  useEffect(()=>()=>{sheet.dispose();slat.dispose();},[sheet,slat]);
  const rice=useRef<InstancedMesh>(null!);
  const bamboo=useRef<InstancedMesh>(null!);
  const root=useRef<Group>(null!);
  const ingredients=useRef<Group>(null!);
  useFrame(({pointer})=>{
    const p=progress.current;
    root.current.visible=p<.451;
    if(!root.current.visible)return;
    const assemble=ease(p,.02,.25);
    const wrap=ease(p,.275,.45);
    const curvature=.001+wrap*2.211;
    const lift=(1-assemble);
    root.current.rotation.y=.12+wrap*.28+pointer.x*.13*lift;
    root.current.rotation.x=pointer.y*.12*lift;
    root.current.position.y=.12+lift*.36;
    const geometry=surface.current.geometry;
    const attr=geometry.attributes.position;
    for(let i=0;i<attr.count;i++){
      const x=sheetBase[i*3],z=sheetBase[i*3+2];
      const wave=Math.sin(x*1.6+z*2.2)*.14*lift;
      const next=bend(z,curvature,wave);
      attr.setXYZ(i,x,next.y,next.z);
    }
    attr.needsUpdate=true;
    geometry.computeVertexNormals();
    for(let i=0;i<grains.length;i++){
      const grain=grains[i];
      const gather=ease(p,.01+random(i)*.09,.17+random(i)*.08);
      const next=bend(grain.z,curvature,.031+grain.y);
      scratch.position.set(grain.x+grain.scatter*(1-gather),next.y+(1-gather)*(.33+random(i)*1.1),next.z+grain.scatter*(1-gather)*.72);
      scratch.rotation.set(-next.theta,grain.yaw,0);
      scratch.scale.set(.068,.035,.042);
      scratch.updateMatrix();
      rice.current.setMatrixAt(i,scratch.matrix);
    }
    rice.current.instanceMatrix.needsUpdate=true;
    const matIn=ease(p,.128,.25)*(1-ease(p,.424,.45));
    for(let i=0;i<42;i++){
      const z=(i-20.5)*.083;
      const mat=bend(z,curvature*.87,-.074);
      scratch.position.set(0,mat.y-.72*(1-matIn),mat.z);
      scratch.rotation.set(-mat.theta,0,0);
      scratch.scale.setScalar(Math.max(.001,matIn));
      scratch.updateMatrix();
      bamboo.current.setMatrixAt(i,scratch.matrix);
    }
    bamboo.current.instanceMatrix.needsUpdate=true;
    ingredients.current.children.forEach((item,i)=>{
      const settled=ease(p,.10+i*.025,.244+i*.008);
      const filling=fillings[i];
      const z=filling.offset;
      item.position.set((1-settled)*(.3-i*.5),mix(1.05+i*.44,.17+i*.035,settled)+wrap*.23,z+(1-settled)*(-.5+i*.64));
      item.rotation.set(wrap*.3,(1-settled)*(.28-i*.53)+wrap*.03,(1-settled)*(.07+i*.04));
    });
  });
  return <group ref={root}>
    <mesh ref={surface} geometry={sheet} frustumCulled={false} castShadow receiveShadow>
      <meshStandardMaterial color="#192924" roughness={.88} side={DoubleSide}/>
    </mesh>
    <instancedMesh ref={rice} frustumCulled={false} args={[undefined,undefined,grains.length]}>
      <sphereGeometry args={[1,7,5]}/><meshStandardMaterial color="#fff4d9" roughness={.72}/>
    </instancedMesh>
    <instancedMesh ref={bamboo} geometry={slat} frustumCulled={false} args={[undefined,undefined,42]} receiveShadow>
      <meshStandardMaterial color="#bc864e" roughness={.8}/>
    </instancedMesh>
    <group ref={ingredients}>{fillings.map(({color,size},i)=><group key={color}>
      <RoundedBox args={[...size]} radius={.065} smoothness={3} castShadow><meshStandardMaterial color={color} roughness={.44}/></RoundedBox>
      {i===0 && Array.from({length:11},(_,j)=><mesh key={j} position={[-1.66+j*.33,.115,0]} rotation={[0,.5,0]}>
        <boxGeometry args={[.024,.009,.31]}/><meshStandardMaterial color="#ffb19b"/>
      </mesh>)}
    </group>)}</group>
  </group>;
}

function RollPieces({progress,inspection}:{progress:RefObject<number>,inspection:RefObject<number>}) {
  const group=useRef<Group>(null!);
  const knife=useRef<Group>(null!);
  const plate=useRef<Group>(null!);
  const riceMesh=useRef<InstancedMesh>(null!);
  const materials=useMemo(()=>({
    nori:new MeshStandardMaterial({color:'#23372d',roughness:.85}),
    rice:new MeshStandardMaterial({color:'#fff1d9',roughness:.75}),
    salmon:new MeshStandardMaterial({color:'#fd765e',roughness:.51}),
    cucumber:new MeshStandardMaterial({color:'#52984b',roughness:.64}),
    cheese:new MeshStandardMaterial({color:'#fff4d8',roughness:.58}),
  }),[]);
  const shell=useMemo(()=>new CylinderGeometry(.446,.446,.485,36,1,true),[]);
  const riceCore=useMemo(()=>new CylinderGeometry(.410,.410,.488,32),[]);
  const fillingGeo=useMemo(()=>new CylinderGeometry(1,1,.493,19),[]);
  const dummy=useMemo(()=>new Object3D(),[]);
  const point=useMemo(()=>new Vector3(),[]);
  const particleGeo=useMemo(()=>new SphereGeometry(1,6,4),[]);
  useEffect(()=>()=> {
    [shell,riceCore,fillingGeo,particleGeo].forEach(geometry=>geometry.dispose());
    Object.values(materials).forEach(material=>material.dispose());
  },[shell,riceCore,fillingGeo,particleGeo,materials]);
  const particleCount=144;
  useLayoutEffect(()=>{
    const palette=['#e7cfaa','#fff9e9','#f7e5c8','#283b2c','#3b4b35'].map(c=>new Color(c));
    for(let i=0;i<8*particleCount;i++) riceMesh.current.setColorAt(i,palette[Math.floor(random(i)*palette.length)]);
    if(riceMesh.current.instanceColor)riceMesh.current.instanceColor.needsUpdate=true;
  },[]);
  useFrame(()=>{
    const p=progress.current;
    const visible=p>=.451 && p<.91;
    group.current.visible=visible;
    riceMesh.current.visible=visible;
    const cut=ease(p,.456,.60);
    const float=ease(p,.595,.665);
    const arranged=ease(p,.655,.74);
    const pack=ease(p,.769,.853);
    const inspect=inspection.current*Math.PI/180*(1-pack);
    group.current.rotation.y=inspect*float;
    if(visible){
      group.current.children.forEach((piece,i)=>{
        const split=ease(p,.466+i*.010,.535+i*.008);
        const x=i-3.5;
        const row=Math.floor(i/4)-.5;
        const column=i%4-1.5;
        piece.position.set(mix(mix(x*(.487+split*.135),column*.83,arranged),column*.83,pack),mix(mix(.566+Math.sin(i*.9)*.13*float+float*.82,.36,ease(p,.694,.744)),.363,pack),mix((i%2-.5)*.19*cut,row*.93,arranged));
        piece.rotation.set(mix(0,Math.sin(i)*.17,float)*(1-pack)*(.96-arranged*.84),mix(.04,Math.sin(i*1.7)*.44+.44,float)*(1-pack),mix(Math.PI/2,0,arranged));
      });
      group.current.updateMatrixWorld(true);
      for(let i=0;i<8;i++){
        const parent=group.current.children[i];
        for(let j=0;j<particleCount;j++){
          const t=i*particleCount+j;
          const angle=random(t*4+1)*tau;
          const rim=j<70;
          const radius=rim?.445:.21+random(t*4+2)*.18;
          point.set(Math.cos(angle)*radius,rim?(random(t*4+3)-.5)*.47:(j%2?-.248:.248),Math.sin(angle)*radius);
          parent.localToWorld(point);
          dummy.position.copy(point);
          dummy.rotation.set(0,angle,0);
          dummy.scale.set(.043,.025,.033);
          dummy.updateMatrix();
          riceMesh.current.setMatrixAt(t,dummy.matrix);
        }
      }
      riceMesh.current.instanceMatrix.needsUpdate=true;
    }
    const bladeProgress=Math.max(0,Math.min(.999,(p-.454)/.132))*7;
    const chop=Math.abs(Math.cos((bladeProgress%1)*Math.PI));
    knife.current.visible=p>.451 && p<.587;
    knife.current.position.set((Math.floor(bladeProgress)-3)*.49,.69+chop*1.33,-.02);
    knife.current.rotation.z=-.11+chop*.13;
    const plateIn=ease(p,.597,.677)*(1-ease(p,.755,.818));
    plate.current.visible=plateIn>.001;
    plate.current.scale.setScalar(Math.max(.001,plateIn));
    plate.current.position.y=-.13+(plateIn*.16);
  });
  return <>
    <group ref={group}>{Array.from({length:8},(_,i)=><group key={i}>
      <mesh geometry={shell} material={materials.nori} castShadow/>
      <mesh geometry={riceCore} material={materials.rice}/>
      <mesh geometry={fillingGeo} material={materials.salmon} position={[-.102,0,.073]} scale={[.16,1,.13]}/>
      <mesh geometry={fillingGeo} material={materials.cucumber} position={[.127,0,.025]} scale={[.08,1,.115]}/>
      <mesh geometry={fillingGeo} material={materials.cheese} position={[-.023,0,-.135]} scale={[.127,1,.085]}/>
    </group>)}</group>
    <instancedMesh ref={riceMesh} args={[particleGeo,undefined,particleCount*8]} frustumCulled={false}><meshStandardMaterial roughness={.82}/></instancedMesh>
    <group ref={knife} rotation={[0,.19,0]}>
      <RoundedBox args={[.055,.42,2.05]} position={[0,.16,.07]} radius={.025} smoothness={3} castShadow><meshStandardMaterial color="#d3e2e8" metalness={.69} roughness={.23}/></RoundedBox>
      <mesh position={[0,-.05,.05]}><boxGeometry args={[.033,.027,1.99]}/><meshStandardMaterial color="#fbf5e9" metalness={.4} roughness={.24}/></mesh>
      <RoundedBox args={[.19,.20,.87]} position={[0,.22,-1.26]} radius={.06} smoothness={3}><meshStandardMaterial color="#273749" roughness={.57}/></RoundedBox>
    </group>
    <group ref={plate}>
      <mesh receiveShadow scale={[1.17,1,.8]}><cylinderGeometry args={[2.01,1.86,.13,64]}/><meshStandardMaterial color="#b72632" roughness={.46}/></mesh>
      <mesh receiveShadow position={[0,.067,0]} scale={[1.17,.8,1]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.87,.078,10,72]}/><meshStandardMaterial color="#dd3c46" roughness={.46}/></mesh>
    </group>
  </>;
}

function StoryWorld({progress,inspection}:{progress:RefObject<number>,inspection:RefObject<number>}) {
  const pkg=useRef<Group>(null!);
  const key=useRef<import('three').DirectionalLight>(null!);
  const sesame=useRef<InstancedMesh>(null!);
  const dummy=useMemo(()=>new Object3D(),[]);
  useFrame(({camera,pointer})=>{
    const p=progress.current;
    const wrap=ease(p,.15,.44);
    const cut=ease(p,.445,.58);
    const plate=ease(p,.59,.74);
    const order=ease(p,.9,1);
    camera.position.set(mix(3.7,2.85,wrap)-cut*1.6+plate*1.4+pointer.x*.25,mix(3.7,2.5,wrap)+plate*1.05,mix(6.7,5.7,wrap)+cut*.3-order*1.65);
    camera.lookAt(0,.46+order*.16,0);
    const pack=ease(p,.759,.809);
    pkg.current.position.set((1-pack)*3.7,.012+(1-pack)*-.3,0);
    pkg.current.scale.setScalar(Math.max(.001,pack)*(1+order*.14));
    pkg.current.rotation.y=-order*.3;
    pkg.current.visible=pack>.001;
    key.current.position.x=2+Math.sin(p*12)*2.1;
    const show=ease(p,.595,.66)*(1-ease(p,.738,.785));
    sesame.current.visible=show>.001;
    if(sesame.current.visible){
      for(let i=0;i<45;i++){
        const a=i*2.399+p*7;
        dummy.position.set(Math.cos(a)*(1+random(i)*2.2),.2+show*random(i+26)*2,Math.sin(a)*1.4);
        dummy.rotation.set(a,a*.4,0);
        dummy.scale.set(.045*show,.018*show,.025*show);
        dummy.updateMatrix();
        sesame.current.setMatrixAt(i,dummy.matrix);
      }
      sesame.current.instanceMatrix.needsUpdate=true;
    }
  });
  return <>
    <ambientLight intensity={1.45}/>
    <hemisphereLight args={['#fff4e7','#9a725c',1.4]}/>
    <directionalLight ref={key} position={[3,6,3]} intensity={3}/>
    <directionalLight position={[-4,2,-3]} intensity={1.9} color="#ffc5b3"/>
    <Layers progress={progress}/>
    <RollPieces progress={progress} inspection={inspection}/>
    <PackagingModel ref={pkg} opening={()=>ease(progress.current,.763,.811)*(1-ease(progress.current,.851,.9))}/>
    <instancedMesh ref={sesame} args={[undefined,undefined,45]} frustumCulled={false}><sphereGeometry args={[1,7,5]}/><meshStandardMaterial color="#f1c68b"/></instancedMesh>
    <mesh position={[0,-.05,0]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[7.8,5]}/>
      <shaderMaterial transparent depthWrite={false}
        vertexShader="varying vec2 uvPoint; void main(){uvPoint=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"
        fragmentShader="varying vec2 uvPoint; void main(){float radius=length((uvPoint-.5)*2.);float shadow=1.-smoothstep(.13,.9,radius);gl_FragColor=vec4(.11,.08,.065,.38*shadow*shadow);}"
      />
    </mesh>
  </>;
}

type Refresh = RefObject<(() => void) | null>;

function RegisterRefresh({refreshRef}:{refreshRef:Refresh}) {
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>{
    refreshRef.current=invalidate;
    invalidate();
    return ()=>{refreshRef.current=null;};
  },[invalidate,refreshRef]);
  return null;
}

export default function SushiScene({progress,inspection,refreshRef}:{progress:RefObject<number>,inspection:RefObject<number>,refreshRef:Refresh}) {
  return <Canvas frameloop="demand" dpr={[1,1.5]} gl={{alpha:true,antialias:true}} camera={{fov:39,position:[3,4,7]}}>
    <RegisterRefresh refreshRef={refreshRef}/>
    <StoryWorld progress={progress} inspection={inspection}/>
  </Canvas>;
}

export function PackageCanvas({open,reset,zoom,turn}:{open:boolean,reset:number,zoom:number,turn:number}) {
  return <Canvas key={reset} frameloop="demand" dpr={[1,1.45]} camera={{position:[4,3.5,5.6],fov:40}}>
    <ambientLight intensity={1.8}/>
    <directionalLight intensity={3} position={[3,6,2]}/>
    <directionalLight intensity={1.5} color="#ffc1ac" position={[-3,2,-4]}/>
    <PerspectiveCamera makeDefault position={[4,3.5,5.6]} fov={40} zoom={zoom}/><ViewerBox open={open} turn={turn}/>
    <OrbitControls enablePan={false} minDistance={4.1} maxDistance={9.5} maxPolarAngle={Math.PI*.49} target={[0,.36,0]}/>
    <ContactShadows position={[0,-.035,0]} scale={7} resolution={128} opacity={.58} blur={3} far={3}/>
  </Canvas>;
}
