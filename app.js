const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const data = [
 {id:1,cat:'ПРИРОДА',title:'Горы, которые хочется увидеть своими глазами',text:'Дикие пейзажи и места, где человек остаётся гостем.',img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80'},
 {id:2,cat:'ОКЕАН',title:'Там, где суша встречается с океаном',text:'Береговая линия, ветер и бесконечный горизонт.',img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80'},
 {id:3,cat:'ЖИВОТНЫЕ',title:'Жизнь дикой природы крупным планом',text:'Удивительные обитатели нашей планеты.',img:'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=700&q=80'},
 {id:4,cat:'ПУТЕШЕСТВИЯ',title:'Места, которые выглядят нереально',text:'Природные чудеса со всех уголков Земли.',img:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80'},
 {id:5,cat:'КОСМОС',title:'Ночь, когда небо становится главным',text:'Звёзды, тишина и бесконечность над головой.',img:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=80'},
 {id:6,cat:'АРХИТЕКТУРА',title:'Человек и ландшафт',text:'Необычные места, где история встречается с природой.',img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'}
];
const cats=[
 ['ПРИРОДА','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80'],
 ['ЖИВОТНЫЕ','https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=700&q=80'],
 ['ОКЕАН','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80'],
 ['ПУТЕШЕСТВИЯ','https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=700&q=80'],
 ['КОСМОС','https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=700&q=80'],
 ['ФОТО ДНЯ','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80']
];

let favorites = JSON.parse(localStorage.getItem('ng_favorites') || '[]');

function card(item){
 const saved=favorites.includes(item.id);
 return `<article class="card"><img src="${item.img}" alt=""><div class="card-body"><button class="heart ${saved?'saved':''}" onclick="toggleFav(${item.id})">${saved?'♥':'♡'}</button><div class="tag">${item.cat}</div><h3>${item.title}</h3><p>${item.text}</p></div></article>`;
}
function render(){
 document.getElementById('latest').innerHTML=data.slice(0,4).map(card).join('');
 document.getElementById('popular').innerHTML=data.slice(2,6).map(x=>`<div class="mini"><img src="${x.img}"><span>${x.title}</span></div>`).join('');
 document.getElementById('categoryGrid').innerHTML=cats.map(c=>`<button class="category" onclick="filterCat('${c[0]}')"><img src="${c[1]}"><strong>${c[0]}</strong></button>`).join('');
 renderFav();
}
function toggleFav(id){ favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id]; localStorage.setItem('ng_favorites',JSON.stringify(favorites)); render(); }
function renderFav(){const a=data.filter(x=>favorites.includes(x.id));document.getElementById('favoritesList').innerHTML=a.map(card).join('');document.getElementById('emptyFav').style.display=a.length?'none':'block';}
function show(page){
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
 document.getElementById(page).classList.add('active');
 document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===page));
 window.scrollTo(0,0);
}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.page)));
document.getElementById('searchBtn').onclick=()=>show('search');
document.getElementById('searchInput').oninput=e=>{
 const q=e.target.value.toLowerCase().trim();
 document.getElementById('searchResults').innerHTML=data.filter(x=>(x.title+x.text+x.cat).toLowerCase().includes(q)).map(card).join('');
};
function filterCat(cat){show('search');document.getElementById('searchInput').value=cat;document.getElementById('searchResults').innerHTML=data.filter(x=>x.cat===cat).map(card).join('');}
document.getElementById('shareBtn').onclick=()=>{const u='https://t.me/national2026geographic'; if(tg?.openTelegramLink) tg.openTelegramLink(u); else navigator.clipboard?.writeText(u);};
document.getElementById('themeBtn').onclick=()=>tg?.showPopup?.({title:'Тема',message:'Приложение автоматически использует тему Telegram.',buttons:[{type:'ok'}]});
render();
