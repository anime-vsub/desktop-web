import{h as p,j as u,a as f,s as h,R as x,o,e as k,w as r,m as t,n as y,k as s,ag as g,x as a,l as c,F as v,t as i,y as n}from"./index.b340747c.js";import{Q as _,f as C}from"./forceHttp2.94a52bc8.js";const w={class:"flex-1 h-full overflow-hidden pl-3 py-[3px] text-[#9a9a9a]"},B={class:"text-[16px] line-clamp-2 text-[#eee] leading-snug"},V={class:"mt-2"},N=t("span",{class:"mx-1"},"|",-1),F={key:0,class:"text-grey mt-2 line-clamp-2"},b=p({__name:"CardVertical",props:{data:null},setup(e){const{t:l}=u();function Q(){}return(d,T)=>{const m=f("router-link");return h((o(),k(m,{to:e.data.path,class:"relative flex flex-nowrap"},{default:r(()=>[t("div",null,[y(s(_),{"no-spinner":"",src:s(C)(e.data.image),ratio:280/400,width:"110px",class:"rounded-lg",referrerpolicy:"no-referrer"},{default:r(()=>[g(d.$slots,"img-content")]),_:3},8,["src"])]),t("div",w,[t("div",B,a(e.data.name),1),t("div",V,[e.data.year?(o(),c(v,{key:0},[i(a(e.data.year)+" ",1),N],64)):n("",!0),i(" "+a(s(l)("tap-_chap",[e.data.process])),1)]),e.data.description?(o(),c("p",F,a(e.data.description),1)):n("",!0),n("",!0)])]),_:3},8,["to"])),[[x]])}}});export{b as _};