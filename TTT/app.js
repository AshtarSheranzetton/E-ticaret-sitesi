const PRODUCTS=[
{id:1,name:"Telefon",price:5000},
{id:2,name:"Laptop",price:15000},
{id:3,name:"Kulaklık",price:500},
{id:4,name:"Mouse",price:300}
];

let cart=JSON.parse(localStorage.getItem("cart"))||[];

// INIT
window.onload=()=>{
updateCart();
loadProducts();
loadCart();
loadDetail();
loadComments();
loadUser();

if(localStorage.getItem("theme")==="true"){
document.body.classList.add("dark");
}
}


function sendMessage(){
    let name = document.getElementById("name").value;
    let mail = document.getElementById("mail").value;
    let msg = document.getElementById("msg").value;

    if(name === "" || mail === "" || msg === ""){
        alert("Tüm alanları doldur");
        return;
    }

    alert("Mesaj gönderildi ✅");

    document.getElementById("name").value="";
    document.getElementById("mail").value="";
    document.getElementById("msg").value="";
}

// CART
function addToCart(id){
let item=cart.find(x=>x.id===id);
if(item)item.qty++;
else{
let p=PRODUCTS.find(x=>x.id===id);
cart.push({...p,qty:1});
}
saveCart();
toast("Sepete eklendi");
}

function saveCart(){
localStorage.setItem("cart",JSON.stringify(cart));
updateCart();
}

function updateCart(){
let el=document.getElementById("cart-count");
if(el){
el.innerText=cart.reduce((a,b)=>a+b.qty,0);
}
}

// CART PAGE
function loadCart(){
let box=document.getElementById("cart");
if(!box)return;

box.innerHTML="";
let total=0;

cart.forEach((p,i)=>{
total+=p.price*p.qty;

box.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
<p>${p.price}₺</p>
<button onclick="change(${i},-1)">-</button>
${p.qty}
<button onclick="change(${i},1)">+</button>
</div>`;
});

let t=document.getElementById("total");
if(t)t.innerText="Toplam: "+total+"₺";
}

function change(i,val){
cart[i].qty+=val;
if(cart[i].qty<=0)cart.splice(i,1);
saveCart();
loadCart();
}

// PRODUCTS
function loadProducts(){
let box=document.getElementById("products");
if(!box)return;

box.innerHTML="";
PRODUCTS.forEach(p=>{
box.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
<p>${p.price}₺</p>
<button onclick="detail(${p.id})">Detay</button>
<button onclick="addToCart(${p.id})">Sepet</button>
</div>`;
});
}

// DETAIL
function detail(id){
localStorage.setItem("detail",id);
location.href="product-detail.html";
}

function loadDetail(){
let box=document.getElementById("detail");
if(!box)return;

let id=localStorage.getItem("detail");
let p=PRODUCTS.find(x=>x.id==id);

box.innerHTML=`
<h2>${p.name}</h2>
<p>${p.price}₺</p>
<button onclick="addToCart(${p.id})">Sepete ekle</button>`;
}

// SEARCH
function search(){
let val=document.getElementById("search").value.toLowerCase();
let filtered=PRODUCTS.filter(p=>p.name.toLowerCase().includes(val));
loadFiltered(filtered);
}

function loadFiltered(list){
let box=document.getElementById("products");
box.innerHTML="";
list.forEach(p=>{
box.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
<p>${p.price}₺</p>
<button onclick="addToCart(${p.id})">Sepet</button>
</div>`;
});
}

// USER
function register(){
let u=document.getElementById("user").value;
let p=document.getElementById("pass").value;
localStorage.setItem("user",JSON.stringify({u,p}));
alert("Kayıt başarılı");
location.href="login.html";
}

function login(){
let u=document.getElementById("user").value;
let p=document.getElementById("pass").value;
let data=JSON.parse(localStorage.getItem("user"));

if(data && data.u===u && data.p===p){
localStorage.setItem("login","true");
location.href="index.html";
}else alert("Hatalı");
}

function logout(){
localStorage.removeItem("login");
location.reload();
}

function loadUser(){
let area=document.getElementById("user-area");
if(!area)return;

if(localStorage.getItem("login")==="true"){
let u=JSON.parse(localStorage.getItem("user"));
area.innerHTML=`👤 ${u.u} <button onclick="logout()">Çıkış</button>`;
}else{
area.innerHTML=`<a href="login.html">Giriş</a>`;
}
}

// COMMENTS
function addComment(){
let txt=document.getElementById("comment").value;
let id=localStorage.getItem("detail");

let arr=JSON.parse(localStorage.getItem("c"+id))||[];
arr.push(txt);

localStorage.setItem("c"+id,JSON.stringify(arr));
loadComments();
}

function loadComments(){
let id=localStorage.getItem("detail");
let box=document.getElementById("comments");
if(!box)return;

let arr=JSON.parse(localStorage.getItem("c"+id))||[];
box.innerHTML="";
arr.forEach(c=>box.innerHTML+=`<p>⭐ ${c}</p>`);
}

// DARK
function toggleDark(){
document.body.classList.toggle("dark");
localStorage.setItem("theme",document.body.classList.contains("dark"));
}

// TOAST
function toast(msg){
let t=document.getElementById("toast");
if(!t)return;
t.innerText=msg;
t.classList.add("show");
setTimeout(()=>t.classList.remove("show"),2000);
}

// CHECKOUT
function checkout(){
if(cart.length==0){alert("Sepet boş");return;}
location.href="checkout.html";
}

function pay(){
alert("Ödeme başarılı");
cart=[];
localStorage.removeItem("cart");
location.href="index.html";
}