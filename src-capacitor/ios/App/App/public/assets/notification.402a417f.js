import{Q as O}from"./QToolbarTitle.440d1fa8.js";import{Q as X}from"./QToolbar.f296e630.js";import{Q as B}from"./QItemLabel.04b33259.js";import{a as A,Q as D,b as G}from"./QList.49fcf7be.js";import{T as H,Q as U}from"./QPullToRefresh.dec1c06c.js";import{D as J,E as W,G as Y,a1 as K,H as q,aB as N,a4 as Z,J as $,L as tt,s as M,M as et,_ as ot,h as st,i as it,j as at,b3 as nt,b4 as rt,o as p,l as b,m as y,n as u,w as c,k as s,e as L,t as v,x as g,F as j,as as lt,q as ct,I as E,y as dt,B as ut,C as ft,R as ht}from"./index.b340747c.js";import{u as mt}from"./use-cache.bd3a070e.js";import{Q as pt,f as gt}from"./forceHttp2.94a52bc8.js";import{S as _t}from"./ScreenLoading.62a007f7.js";import{u as xt}from"./useAliveScrollBehavior.af4f2067.js";import"./touch.9d375472.js";import"./selection.b3caa21c.js";const F=[["left","center","start","width"],["right","center","end","width"],["top","start","center","height"],["bottom","end","center","height"]];var bt=J({name:"QSlideItem",props:{...W,leftColor:String,rightColor:String,topColor:String,bottomColor:String,onSlide:Function},emits:["action","top","right","bottom","left"],setup(h,{slots:a,emit:m}){const{proxy:r}=et(),{$q:k}=r,S=Y(h,k),{getCacheWithFn:w}=mt(),C=K(null);let i=null,t={},Q={},I={};const _=q(()=>k.lang.rtl===!0?{left:"right",right:"left"}:{left:"left",right:"right"}),P=q(()=>"q-slide-item q-item-type overflow-hidden"+(S.value===!0?" q-slide-item--dark q-dark":""));function R(){C.value.style.transform="translate(0,0)"}function T(e,f,n){h.onSlide!==void 0&&m("slide",{side:e,ratio:f,isReset:n})}function V(e){const f=C.value;if(e.isFirst)t={dir:null,size:{left:0,right:0,top:0,bottom:0},scale:0},f.classList.add("no-transition"),F.forEach(o=>{if(a[o[0]]!==void 0){const x=I[o[0]];x.style.transform="scale(1)",t.size[o[0]]=x.getBoundingClientRect()[o[3]]}}),t.axis=e.direction==="up"||e.direction==="down"?"Y":"X";else if(e.isFinal){f.classList.remove("no-transition"),t.scale===1?(f.style.transform=`translate${t.axis}(${t.dir*100}%)`,i!==null&&clearTimeout(i),i=setTimeout(()=>{i=null,m(t.showing,{reset:R}),m("action",{side:t.showing,reset:R})},230)):(f.style.transform="translate(0,0)",T(t.showing,0,!0));return}else e.direction=t.axis==="X"?e.offset.x<0?"left":"right":e.offset.y<0?"up":"down";if(a.left===void 0&&e.direction===_.value.right||a.right===void 0&&e.direction===_.value.left||a.top===void 0&&e.direction==="down"||a.bottom===void 0&&e.direction==="up"){f.style.transform="translate(0,0)";return}let n,d,l;t.axis==="X"?(d=e.direction==="left"?-1:1,n=d===1?_.value.left:_.value.right,l=e.distance.x):(d=e.direction==="up"?-2:2,n=d===2?"top":"bottom",l=e.distance.y),!(t.dir!==null&&Math.abs(d)!==Math.abs(t.dir))&&(t.dir!==d&&(["left","right","top","bottom"].forEach(o=>{Q[o]&&(Q[o].style.visibility=n===o?"visible":"hidden")}),t.showing=n,t.dir=d),t.scale=Math.max(0,Math.min(1,(l-40)/t.size[n])),f.style.transform=`translate${t.axis}(${l*d/Math.abs(d)}px)`,I[n].style.transform=`scale(${t.scale})`,T(n,t.scale,!1))}return N(()=>{Q={},I={}}),Z(()=>{i!==null&&clearTimeout(i)}),Object.assign(r,{reset:R}),()=>{const e=[],f={left:a[_.value.right]!==void 0,right:a[_.value.left]!==void 0,up:a.bottom!==void 0,down:a.top!==void 0},n=Object.keys(f).filter(l=>f[l]===!0);F.forEach(l=>{const o=l[0];a[o]!==void 0&&e.push($("div",{ref:x=>{Q[o]=x},class:`q-slide-item__${o} absolute-full row no-wrap items-${l[1]} justify-${l[2]}`+(h[o+"Color"]!==void 0?` bg-${h[o+"Color"]}`:"")},[$("div",{ref:x=>{I[o]=x}},a[o]())]))});const d=$("div",{key:`${n.length===0?"only-":""} content`,ref:C,class:"q-slide-item__content"},tt(a.default));return n.length===0?e.push(d):e.push(M(d,w("dir#"+n.join(""),()=>{const l={prevent:!0,stop:!0,mouse:!0};return n.forEach(o=>{l[o]=!0}),[[H,V,void 0,l]]}))),$("div",{class:P.value},e)}}}),vt="assets/img_holder_empty_style1.e47d475a.png",yt="assets/img_holder_error_style2.42d28d83.png";const z=h=>(ut("data-v-31dad632"),h=h(),ft(),h),wt={class:"fixed top-0 z-1000 w-full bg-dark-page"},kt={key:0},St={class:"text-grey"},Ct={key:0,class:"text-grey text-center mt-3 mx-2 mb-3"},Qt={key:2,class:"absolute top-0 h-full w-full pt-[50px] text-subtitle1 flex items-center justify-center"},It={class:"text-center"},$t=z(()=>y("img",{src:vt,width:"250",class:"mx-auto mb-1"},null,-1)),Rt={key:1,class:"absolute top-0 h-full w-full pt-[50px] text-subtitle1 flex items-center justify-center"},Lt={class:"text-center"},Tt=z(()=>y("img",{src:yt,width:"250",class:"mx-auto mb-1"},null,-1)),Bt=st({__name:"notification",setup(h){xt();const a=it(),{t:m}=at(),r=nt(),k=rt();async function S(w){r.items.splice(r.items.indexOf(w)>>>0,1),await r.remove(w.id)}return(w,C)=>(p(),b(j,null,[y("header",wt,[u(X,{class:"relative"},{default:c(()=>[u(O,{class:"text-center text-[16px] w-full line-clamp-1"},{default:c(()=>[v(g(s(m)("thong-bao")),1)]),_:1})]),_:1})]),s(k).isLogged?(p(),b("div",kt,[s(r).loading&&s(r).items.length>0?(p(),L(_t,{key:0,class:"absolute top-0 h-full w-full pt-[50px]"})):s(r).max>0?(p(),L(U,{key:1,onRefresh:s(r).refresh},{default:c(()=>[u(G,{class:"bg-transparent pt-[50px]"},{default:c(()=>[u(lt,{name:"notify"},{default:c(()=>[(p(!0),b(j,null,ct(s(r).items,i=>M((p(),L(bt,{key:i.id,onLeft:t=>S(i),onRight:t=>S(i),"left-color":"red","right-color":"red",clickable:"",onClick:t=>s(a).push(i.path),class:"bg-transparent"},{left:c(()=>[u(s(E),{icon:"fluent:delete-24-regular",width:"25",height:"25"})]),right:c(()=>[u(s(E),{icon:"fluent:delete-24-regular",width:"25",height:"25"})]),default:c(()=>[u(A,null,{default:c(()=>[u(D,null,{default:c(()=>[u(B,{class:"text-subtitle1 text-weight-normal"},{default:c(()=>[v(g(i.name)+" ",1),y("span",St,g(s(m)("da-cap-nhat")),1),v(" "+g(i.chap),1)]),_:2},1024),u(B,{class:"text-grey"},{default:c(()=>[v(g(i.time),1)]),_:2},1024)]),_:2},1024),u(D,{side:""},{default:c(()=>[u(s(pt),{"no-spinner":"",src:s(gt)(i.image),referrerpolicy:"no-referrer",width:"120px",ratio:120/81,class:"rounded-sm"},null,8,["src"])]),_:2},1024)]),_:2},1024)]),_:2},1032,["onLeft","onRight","onClick"])),[[ht]])),128))]),_:1})]),_:1}),s(r).items.length<s(r).max?(p(),b("div",Ct,g(s(m)("do-api-server-khong-day-du-ban-phai-xoa-nhung-thong-bao-moi-de-xem-nhung-thong-bao-cu")),1)):dt("",!0)]),_:1},8,["onRefresh"])):(p(),b("div",Qt,[y("div",It,[$t,v(" "+g(s(m)("khong-co-thong-bao-moi-nao")),1)])]))])):(p(),b("div",Rt,[y("div",Lt,[Tt,v(" "+g(s(m)("dang-nhap-de-xem-cac-thong-bao-anime-moi")),1)])]))],64))}});var Gt=ot(Bt,[["__scopeId","data-v-31dad632"]]);export{Gt as default};