'use strict';
const photoURLs = {"imagebakes.jpg": "imagebakes.jpg", "imagechai.jpg": "imagechai.jpg", "imagecookies.jpg": "imagecookies.jpg", "imageegg.jpg": "imageegg.jpg", "imageinterior-brick.jpg": "imageinterior-brick.jpg", "imageinterior-wood.jpg": "imageinterior-wood.jpg", "imagecake.jpg": "imagecake.jpg", "imagecoffee.jpg": "imagecoffee.jpg", "imagecroissant.jpg": "imagecroissant.jpg", "imagesandwich.jpg": "imagesandwich.jpg"};
const iconPaths={arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',cup:'<path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm12 1h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3"/>',user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',orders:'<path d="M8 3h8l2 3v15H6V6l2-3Z"/><path d="M9 10h6m-6 4h6"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',chart:'<path d="M4 3v18h17M8 17v-5m5 5V8m5 9V4"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[n]||iconPaths.cup}</svg>`;
const $=s=>document.querySelector(s);
const money=n=>'₹'+n.toLocaleString('en-IN');
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menu=[
{id:0,name:'Irani Chai',category:'Chai & Coffee',price:60,tag:'The house ritual',desc:'Slow-brewed tea, creamy milk, and a little everyday comfort.',photo:'imagechai.jpg',available:true},
{id:1,name:'Fresh Cupcakes',category:'Fresh Bakes',price:90,tag:'A canteen classic',desc:'Soft sponge, swirls of frosting, and a freshly baked little treat.',photo:'imagebakes.jpg',available:true},
{id:2,name:'Eggs on Toast',category:'All-day Breakfast',price:180,tag:'Morning favourite',desc:'Sunny-side eggs on crisp toast. Simple, satisfying, familiar.',photo:'imageegg.jpg',available:true},
{id:3,name:'Chocolate Cookies',category:'Something Sweet',price:110,tag:'Fresh from the oven',desc:'Golden edges, soft centres, and generous chunks of chocolate.',photo:'imagecookies.jpg',available:true},
{id:4,name:'Chai & Cookies',category:'Chai & Coffee',price:150,tag:'Better together',desc:'Your favourite warm cup with two cookies on the side.',photo:'imagechai.jpg',available:true},
{id:5,name:'Cupcake Selection',category:'Fresh Bakes',price:220,tag:'Made for sharing',desc:'An assortment of freshly frosted cupcakes to share at your table.',photo:'imagebakes.jpg',available:true},
{id:6,name:'Breakfast Toast',category:'All-day Breakfast',price:210,tag:'Slow morning special',desc:'Golden toast, eggs, and fresh greens. A good start to your day.',photo:'imageegg.jpg',available:true},
{id:7,name:'Cookie Box',category:'Something Sweet',price:280,tag:'Take a little home',desc:'Six freshly baked chocolate cookies. A sweet little keepsake.',photo:'imagecookies.jpg',available:true},
{id:8,name:'Butter Croissant',category:'Fresh Bakes',price:140,tag:'Flaky & golden',desc:'A buttery, layered croissant, baked golden and served fresh.',photo:'imagecroissant.jpg',available:true},
{id:9,name:'Café Latte',category:'Chai & Coffee',price:160,tag:'A softer start',desc:'Fresh espresso with steamed milk and a smooth, silky finish.',photo:'imagecoffee.jpg',available:true},
{id:10,name:'Grilled Sandwich',category:'All-day Breakfast',price:190,tag:'Toasted comfort',desc:'Golden grilled bread with a savoury filling and chutney on the side.',photo:'imagesandwich.jpg',available:true},
{id:11,name:'Chocolate Cake',category:'Something Sweet',price:230,tag:'A slice of happiness',desc:'Rich chocolate sponge, creamy frosting, and a glossy chocolate finish.',photo:'imagecake.jpg',available:true}
];
let cart={},orders=[],reservations=[],category='All',mode='website',tab='Overview',toastTimer,restoreFocus;
let sequence=1000;
function hydrateIcons(){document.querySelectorAll('[data-icon]').forEach(e=>{e.innerHTML=icon(e.dataset.icon)})}
function getPhoto(n){return photoURLs[n]||n}
function renderMenu(){
 $('.filters').innerHTML=['All','Chai & Coffee','Fresh Bakes','All-day Breakfast','Something Sweet'].map(c=>`<button class="filter ${category===c?'active':''}" data-category="${c}" aria-pressed="${category===c}">${c}</button>`).join('');
 $('#menuGrid').innerHTML=menu.filter(m=>category==='All'||m.category===category).map(m=>`<article class="dish"><div class="dish-image"><img src="${getPhoto(m.photo)}" alt="${m.name}" data-photo="${m.photo}" loading="lazy"><span class="dish-badge">${m.tag}</span></div><div class="dish-body"><div class="dish-title"><h3>${m.name}</h3><span class="price">${money(m.price)}</span></div><p>${m.desc}</p><button class="btn outline" data-add="${m.id}" ${m.available?'':'disabled'}>${m.available?'+ Add to table order':'Currently unavailable'}</button></div></article>`).join('');
}
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3200)}
function cartTotal(){return Object.entries(cart).reduce((s,[id,q])=>s+menu[Number(id)].price*q,0)}
function renderCart(){
 $('#count').textContent=Object.values(cart).reduce((s,q)=>s+q,0);$('#total').textContent=money(cartTotal());
 $('#cartItems').innerHTML=Object.keys(cart).length?Object.entries(cart).map(([id,q])=>`<div class="cart-item"><div><h3>${menu[Number(id)].name}</h3><small>${money(menu[Number(id)].price)} each</small></div><div class="qty"><button data-change="${id}" data-delta="-1" aria-label="Remove one ${menu[Number(id)].name}">−</button><span>${q}</span><button data-change="${id}" data-delta="1" aria-label="Add one ${menu[Number(id)].name}">+</button></div></div>`).join(''):'<p class="empty">Your table order is empty.<br>Let’s find you something delicious.</p>';
 $('#checkout').disabled=!Object.keys(cart).length;
}
function openCart(){restoreFocus=document.activeElement;$('#cart').hidden=false;$('#backdrop').hidden=false;document.body.style.overflow='hidden';$('#closeCart').focus()}
function closeCart(){ $('#cart').hidden=true;$('#backdrop').hidden=true;document.body.style.overflow='';restoreFocus?.focus() }
function placeOrder(){
 if(!Object.keys(cart).length)return;
 const table=$('#tableNumber').value.trim();if(!table){$('#tableNumber').focus();toast('Please enter your table number.');return}
 const items=Object.entries(cart).map(([id,q])=>({id:Number(id),name:menu[Number(id)].name,qty:q,price:menu[Number(id)].price}));
 orders.unshift({id:'IC-'+(++sequence),table,items,total:cartTotal(),status:'Received',time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
 cart={};renderCart();closeCart();toast('Demo order received — '+orders[0].id);if(mode!=='website')renderDashboard();
}
function showWebsite(anchor='home'){mode='website';$('#dashboard').hidden=true;$('#website').hidden=false;$('#reserveNav').hidden=false;window.scrollTo(0,0);if(anchor!=='home')document.getElementById(anchor)?.scrollIntoView()}
function showDashboard(kind){mode=kind;tab='Overview';$('#website').hidden=true;$('#dashboard').hidden=false;$('#reserveNav').hidden=true;renderDashboard();window.scrollTo(0,0)}
function tabs(){return mode==='staff'?['Overview','Orders','Reservations','Menu items','Reports']:['Overview','My orders','My reservations']}
const tabIcon=t=>({'Overview':'grid','Orders':'orders','My orders':'orders','Reservations':'calendar','My reservations':'calendar','Menu items':'cup','Reports':'chart'}[t]);
function orderTable(staff){if(!orders.length)return '<p class="empty">No orders yet. Choose something from the menu to start.</p>';return `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>${orders.map(o=>`<tr><td>${o.id}<br><small>${o.time}</small></td><td>${escapeHTML(o.table)}</td><td>${o.items.map(i=>`${i.qty} × ${i.name}`).join('<br>')}</td><td>${money(o.total)}</td><td>${staff?`<select class="field" data-order-status="${o.id}" aria-label="Status for ${o.id}">${['Received','Preparing','Ready','Served','Cancelled'].map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select>`:`<span class="status">${o.status}</span>`}</td></tr>`).join('')}</tbody></table></div>`}
function reservationTable(staff){if(!reservations.length)return '<p class="empty">No reservations yet. We’d love to save you a seat.</p>';return `<div class="table-wrap"><table><thead><tr><th>Guest</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th></tr></thead><tbody>${reservations.map(r=>`<tr><td>${escapeHTML(r.name)}<br><small>${escapeHTML(r.phone)}</small></td><td>${r.date}</td><td>${r.time}</td><td>${r.guests}</td><td>${staff?`<select class="field" data-reservation-status="${r.id}" aria-label="Reservation status for ${escapeHTML(r.name)}">${['Requested','Confirmed','Seated','Cancelled'].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}</select>`:`<span class="status">${r.status}</span>`}</td></tr>`).join('')}</tbody></table></div>`}
function renderDashboard(){
 const staff=mode==='staff';const revenue=orders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0);
 const headings={'Overview':staff?'Today at the canteen':'Your canteen moments','Orders':'Table orders','My orders':'Your table orders','Reservations':'Reservations','My reservations':'Your reservations','Menu items':'From the kitchen','Reports':'The day in numbers'};
 $('#dashboard').innerHTML=`<div class="dashboard"><aside class="sidebar"><div class="eyebrow">${staff?'Staff demo':'Customer preview'}</div><nav aria-label="Dashboard navigation">${tabs().map(t=>`<button data-tab="${t}" class="${tab===t?'active':''}">${icon(tabIcon(t))}${t}</button>`).join('')}<button data-return>${icon('arrow')}Back to the canteen</button></nav></aside><main class="dash-main"><div class="dash-top"><div><div class="eyebrow">${staff?'Restaurant operations':'Welcome back'}</div><h1>${headings[tab]}</h1><p>Public demo · Activity lasts for this page session only</p></div><button class="btn" ${staff?'data-seed':'data-menu'}>${staff?'＋ Load sample activity':'Explore the menu '+icon('arrow')}</button></div><div class="stats"><div class="stat"><small>${staff?'Demo sales':'Your order total'}</small><strong>${money(revenue)}</strong></div><div class="stat"><small>${staff?'Table orders':'Your orders'}</small><strong>${orders.length}</strong></div><div class="stat"><small>${staff?'Reservations':'Your reservations'}</small><strong>${reservations.length}</strong></div><div class="stat"><small>${staff?'Average order':'Items ordered'}</small><strong>${staff?money(orders.length?Math.round(revenue/orders.filter(o=>o.status!=='Cancelled').length)||0:0):orders.reduce((s,o)=>s+o.items.reduce((x,i)=>x+i.qty,0),0)}</strong></div></div><div class="dash-section" id="dashContent"></div></main></div>`;
 const content=$('#dashContent');
 if(tab==='Overview')content.innerHTML='<h2>Recent table orders</h2>'+orderTable(staff)+'<h2>Upcoming reservations</h2>'+reservationTable(staff);
 else if(tab.includes('orders')||tab==='Orders')content.innerHTML='<h2>All table orders</h2>'+orderTable(staff);
 else if(tab.includes('reservations')||tab==='Reservations')content.innerHTML='<h2>Table reservations</h2>'+reservationTable(staff);
 else if(tab==='Menu items')content.innerHTML=`<h2>Menu availability & pricing</h2><div class="table-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Price (₹)</th><th>Available</th></tr></thead><tbody>${menu.map(m=>`<tr><td>${m.name}</td><td>${m.category}</td><td><input class="field" type="number" min="1" max="9999" step="1" value="${m.price}" data-price="${m.id}" aria-label="Price for ${m.name}"></td><td><input type="checkbox" ${m.available?'checked':''} data-available="${m.id}" aria-label="${m.name} available"></td></tr>`).join('')}</tbody></table></div>`;
 else {const mix=menu.map(m=>({name:m.name,qty:orders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.items.filter(i=>i.id===m.id).reduce((x,i)=>x+i.qty,0),0)})).filter(m=>m.qty>0).sort((a,b)=>b.qty-a.qty);content.innerHTML='<h2>Items ordered</h2>'+(mix.length?mix.map(m=>`<div class="report-row"><span>${m.name}</span><strong>${m.qty} sold</strong></div>`).join(''):'<p class="empty">Place a demo order or load sample activity to see reports.</p>')}
}
function seed(){if(orders.some(o=>o.sample)){toast('Sample activity is already loaded.');return}orders.push({id:'IC-'+(++sequence),table:'T-04',items:[{id:0,name:'Irani Chai',qty:2,price:60},{id:1,name:'Fresh Cupcakes',qty:2,price:90}],total:300,status:'Preparing',time:'10:15 AM',sample:true},{id:'IC-'+(++sequence),table:'T-02',items:[{id:2,name:'Eggs on Toast',qty:1,price:180},{id:0,name:'Irani Chai',qty:1,price:60}],total:240,status:'Served',time:'9:45 AM',sample:true});reservations.push({id:'sample-1',name:'Aarav Mehta',phone:'Sample guest',date:new Date().toISOString().slice(0,10),time:'12:00 PM',guests:2,status:'Confirmed'},{id:'sample-2',name:'Riya Shah',phone:'Sample guest',date:new Date().toISOString().slice(0,10),time:'4:00 PM',guests:4,status:'Requested'});renderDashboard();toast('Sample café activity loaded.')}
function closeWelcome(){$('#welcome').hidden=true;document.body.style.overflow='';$('#staffBtn').focus()}
document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');if(!el)return;
 if(el.dataset.category){category=el.dataset.category;renderMenu()}
 if(el.hasAttribute('data-add')){const id=Number(el.dataset.add);if(!menu[id].available)return;cart[id]=(cart[id]||0)+1;renderCart();toast(menu[id].name+' added to your table order.')}
 if(el.hasAttribute('data-change')){const id=el.dataset.change;cart[id]+=Number(el.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart()}
 if(el.dataset.tab){tab=el.dataset.tab;renderDashboard()}
 if(el.hasAttribute('data-return'))showWebsite();if(el.hasAttribute('data-menu'))showWebsite('menu');if(el.hasAttribute('data-seed'))seed();
 if(el.closest('.nav')&&el.tagName==='A'){e.preventDefault();showWebsite(el.getAttribute('href').slice(1))}
});
document.addEventListener('change',e=>{const el=e.target;
 if(el.dataset.orderStatus){const o=orders.find(o=>o.id===el.dataset.orderStatus);if(o)o.status=el.value;renderDashboard();toast('Demo order status updated.')}
 if(el.dataset.reservationStatus){const r=reservations.find(r=>r.id===el.dataset.reservationStatus);if(r)r.status=el.value;renderDashboard();toast('Demo reservation updated.')}
 if(el.hasAttribute('data-available')){menu[Number(el.dataset.available)].available=el.checked;renderMenu();toast('Menu availability updated.')}
 if(el.hasAttribute('data-price')){const value=Number(el.value);if(!Number.isInteger(value)||value<1||value>9999){el.value=menu[Number(el.dataset.price)].price;toast('Enter a whole price between ₹1 and ₹9,999.');return}menu[Number(el.dataset.price)].price=value;renderMenu();renderCart();toast('Demo menu price updated.')}
});
$('#reservationForm').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));reservations.unshift({...data,id:'R-'+(++sequence),status:'Requested'});e.target.reset();toast('Demo table request received. View it in your customer dashboard.');});
const DEMO_LOGIN={username:'admin',password:'canteen123'};
$('#staffBtn').onclick=()=>{$('#welcome').hidden=false;$('#loginError').hidden=true;document.body.style.overflow='hidden';$('#staffLogin [name=username]').focus()};$('#closeWelcome').onclick=closeWelcome;$('#welcome').onclick=e=>{if(e.target===$('#welcome'))closeWelcome()};
$('#staffLogin').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));if(data.username.trim().toLowerCase()===DEMO_LOGIN.username&&data.password===DEMO_LOGIN.password){e.target.reset();$('#loginError').hidden=true;closeWelcome();showDashboard('staff')}else{$('#loginError').hidden=false}});
$('#customerBtn').onclick=()=>showDashboard('customer');$('#bagBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#backdrop').onclick=closeCart;$('#checkout').onclick=placeOrder;
document.addEventListener('keydown',e=>{const panel=!$('#cart').hidden?$('#cart'):!$('#welcome').hidden?$('#welcome'):null;if(!panel)return;if(e.key==='Escape'){closeCart();closeWelcome()}if(e.key==='Tab'){const focusables=Array.from(panel.querySelectorAll('button:not(:disabled),input,a,select'));const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}});
hydrateIcons();document.querySelectorAll('[data-photo]').forEach(img=>{img.src=getPhoto(img.dataset.photo)});renderMenu();renderCart();
