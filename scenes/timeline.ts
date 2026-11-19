/** All offsets are normalized ScrollTrigger progress. Keep stages sorted. */
export const stages = [
  {start:0, label:'Ингредиенты', title:'ВКУС НАЧИНАЕТСЯ ЗДЕСЬ', description:'Каждый ролл — маленькая история.', color:'#f6f3ef'},
  {start:.12, label:'Сборка', title:'СЛОЙ ЗА СЛОЕМ', description:'Нори, рис, лосось, огурец и сливочный сыр.', color:'#eee5dd'},
  {start:.28, label:'Сворачивание', title:'ИДЕАЛЬНО В КАЖДОМ ДВИЖЕНИИ', description:'Бамбуковый коврик помогает придать роллу форму.', color:'#f1c9b7'},
  {start:.45, label:'Нарезка', title:'ВОСЕМЬ КУСОЧКОВ СЧАСТЬЯ', description:'Точный разрез открывает каждый слой.', color:'#ede0d0'},
  {start:.60, label:'Подача', title:'СОЗДАНО С ЛЮБОВЬЮ', description:'Восемь кусочков встречаются на одной тарелке.', color:'#e8e2db'},
  {start:.76, label:'Упаковка', title:'ЛЮБИМЫЙ ВКУС — РЯДОМ', description:'Ролл готов отправиться с вами.', color:'#f8d4c9'},
  {start:.90, label:'Меню', title:'ТВОЙ ЛЮБИМЫЙ РОЛЛ УЖЕ ЖДЁТ', description:'Найдите свой вкус в нашем демо-меню.', color:'#f2343d'},
] as const;
export const ease = (value:number, from:number, to:number) => {
  const t = Math.max(0,Math.min(1,(value-from)/(to-from)));
  return t*t*(3-2*t);
};
export const mix = (a:number,b:number,t:number)=>a+(b-a)*t;
