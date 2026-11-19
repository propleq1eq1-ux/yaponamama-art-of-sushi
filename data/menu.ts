export const orderUrl = 'https://yaponamama.uz/brand/yaponamama';
export const locationsUrl = 'https://yaponamama.uz/where-to-go';
export const locations = [
  {name: 'Tashkent City', id: 'tashkent-siti'},
  {name: 'Seoul Mun', id: 'seul-mun'},
  {name: 'Samarkand Family Park', id: 'samarkand-family-park'},
];
export const categories = [
  ['all','Всё меню','All','Barchasi'],
  ['rolls','Роллы и суши','Rolls & sushi','Roll va sushi'],
  ['sets','Сеты','Sets','Setlar'],
  ['soups','Супы','Soups','Sho‘rvalar'],
  ['wok','WOK','WOK','WOK'],
  ['salads','Салаты','Salads','Salatlar'],
  ['desserts','Десерты','Desserts','Desertlar'],
  ['drinks','Напитки','Drinks','Ichimliklar'],
] as const;

export const products = [
  {id:'phila',category:'rolls',name:'Филадельфия',en:'Philadelphia',uz:'Filadelfiya',description:'Лосось, огурец и сливочный сыр в нежном ролле.',price:89000,detail:'8 шт.',image:'dish-0'},
  {id:'crunch',category:'rolls',name:'Кранч Кунсей',en:'Crunch Kunsei',uz:'Kranch Kunsey',description:'Ролл с хрустящей корочкой и сливочной начинкой.',price:79000,detail:'8 шт.',image:'dish-1',official:'crunch-kunsei'},
  {id:'mamba',category:'rolls',name:'Блэк Мамба',en:'Black Mamba',uz:'Blek Mamba',description:'Пикантный ролл с чёрным кунжутом.',price:85000,detail:'8 шт.',image:'dish-2',official:'black-mamba'},
  {id:'tsuki',category:'sets',name:'Сет Цуки',en:'Tsuki set',uz:'Tsuki seti',description:'Ассорти роллов для компании.',price:239000,detail:'Сет',image:'dish-3',official:'set-tsuki'},
  {id:'soup',category:'soups',name:'Сливочный суп с лососем',en:'Creamy salmon soup',uz:'Lososli qaymoqli sho‘rva',description:'Тёплый сливочный суп с лососем.',price:69000,detail:'Суп',image:'dish-4',official:'creamy-salmon-soup'},
  {id:'udon',category:'wok',name:'Удон с овощами',en:'Vegetable udon',uz:'Sabzavotli udon',description:'Пшеничная лапша и хрустящие овощи.',price:64000,detail:'WOK',image:'dish-5'},
  {id:'chuka',category:'salads',name:'Чука Сарада',en:'Chuka Sarada',uz:'Chuka Sarada',description:'Салат из водорослей с кунжутом.',price:49000,detail:'Салат',image:'dish-6',official:'chuka-sarada'},
  {id:'cake',category:'desserts',name:'Яблочный чизкейк',en:'Apple cheesecake',uz:'Olmali chizkeyk',description:'Сливочный десерт с яблоком.',price:46000,detail:'Десерт',image:'dish-7',official:'apple-cheesecake-in-a-jar'},
  {id:'matcha',category:'drinks',name:'Айс матча латте',en:'Iced matcha latte',uz:'Muzli matcha latte',description:'Холодная матча с молоком.',price:39000,detail:'Напиток',image:'dish-8'},
] as const;
export type Product = (typeof products)[number];
