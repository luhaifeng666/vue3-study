import{_ as w,r as P,o as n,c as i,b as $,f as S,i as E,j as h,k as _e,h as t,F as M,l as F,m as C,a as g,t as B,n as z,p as J,q as T,w as x,s as ve,v as k,d as j,x as X,y as Te,z as xe,A as Be,B as Q,C as Z,D as q,E as pe,G as he,H as A,u as me,g as I,T as fe,I as R,J as be,K,L as G,M as Ne,N as Ie,O as ee,P as ge,Q as ke,e as Me,R as Y,S as He,U as V,V as te,W as De,X as Pe,Y as Ee,Z as Ae,$ as Re}from"./app.2eb16e8b.js";const Fe={},Oe={class:"theme-default-content"};function ze(c,a){const e=P("Content");return n(),i("div",Oe,[$(e)])}var We=w(Fe,[["render",ze],["__file","HomeContent.vue"]]);const Ue={key:0,class:"features"},Ve=S({__name:"HomeFeatures",setup(c){const a=E(),e=h(()=>_e(a.value.features)?a.value.features:[]);return(l,o)=>t(e).length?(n(),i("div",Ue,[(n(!0),i(M,null,F(t(e),d=>(n(),i("div",{key:d.title,class:"feature"},[g("h2",null,B(d.title),1),g("p",null,B(d.details),1)]))),128))])):C("",!0)}});var je=w(Ve,[["__file","HomeFeatures.vue"]]);const qe=["innerHTML"],Ke=["textContent"],Ge=S({__name:"HomeFooter",setup(c){const a=E(),e=h(()=>a.value.footer),l=h(()=>a.value.footerHtml);return(o,d)=>t(e)?(n(),i(M,{key:0},[t(l)?(n(),i("div",{key:0,class:"footer",innerHTML:t(e)},null,8,qe)):(n(),i("div",{key:1,class:"footer",textContent:B(t(e))},null,8,Ke))],64)):C("",!0)}});var Xe=w(Ge,[["__file","HomeFooter.vue"]]);const Ye=["href","rel","target","aria-label"],Je=S({inheritAttrs:!1}),Qe=S({...Je,__name:"AutoLink",props:{item:{type:Object,required:!0}},setup(c){const a=c,e=z(),l=Be(),{item:o}=J(a),d=h(()=>X(o.value.link)),m=h(()=>Te(o.value.link)||xe(o.value.link)),v=h(()=>{if(!m.value){if(o.value.target)return o.value.target;if(d.value)return"_blank"}}),r=h(()=>v.value==="_blank"),s=h(()=>!d.value&&!m.value&&!r.value),u=h(()=>{if(!m.value){if(o.value.rel)return o.value.rel;if(r.value)return"noopener noreferrer"}}),_=h(()=>o.value.ariaLabel||o.value.text),p=h(()=>{const y=Object.keys(l.value.locales);return y.length?!y.some(f=>f===o.value.link):o.value.link!=="/"}),b=h(()=>p.value?e.path.startsWith(o.value.link):!1),L=h(()=>s.value?o.value.activeMatch?new RegExp(o.value.activeMatch).test(e.path):b.value:!1);return(y,f)=>{const N=P("RouterLink"),H=P("AutoLinkExternalIcon");return t(s)?(n(),T(N,ve({key:0,class:{"router-link-active":t(L)},to:t(o).link,"aria-label":t(_)},y.$attrs),{default:x(()=>[k(y.$slots,"before"),j(" "+B(t(o).text)+" ",1),k(y.$slots,"after")]),_:3},16,["class","to","aria-label"])):(n(),i("a",ve({key:1,class:"external-link",href:t(o).link,rel:t(u),target:t(v),"aria-label":t(_)},y.$attrs),[k(y.$slots,"before"),j(" "+B(t(o).text)+" ",1),t(r)?(n(),T(H,{key:0})):C("",!0),k(y.$slots,"after")],16,Ye))}}});var D=w(Qe,[["__file","AutoLink.vue"]]);const Ze={class:"hero"},et={key:0,id:"main-title"},tt={key:1,class:"description"},at={key:2,class:"actions"},nt=S({__name:"HomeHero",setup(c){const a=E(),e=Q(),l=Z(),o=h(()=>l.value&&a.value.heroImageDark!==void 0?a.value.heroImageDark:a.value.heroImage),d=h(()=>a.value.heroText===null?null:a.value.heroText||e.value.title||"Hello"),m=h(()=>a.value.heroAlt||d.value||"hero"),v=h(()=>a.value.tagline===null?null:a.value.tagline||e.value.description||"Welcome to your VuePress site"),r=h(()=>_e(a.value.actions)?a.value.actions.map(({text:u,link:_,type:p="primary"})=>({text:u,link:_,type:p})):[]),s=()=>{if(!o.value)return null;const u=q("img",{src:pe(o.value),alt:m.value});return a.value.heroImageDark===void 0?u:q(he,()=>u)};return(u,_)=>(n(),i("header",Ze,[$(s),t(d)?(n(),i("h1",et,B(t(d)),1)):C("",!0),t(v)?(n(),i("p",tt,B(t(v)),1)):C("",!0),t(r).length?(n(),i("p",at,[(n(!0),i(M,null,F(t(r),p=>(n(),T(D,{key:p.text,class:A(["action-button",[p.type]]),item:p},null,8,["class","item"]))),128))])):C("",!0)]))}});var ot=w(nt,[["__file","HomeHero.vue"]]);const rt={class:"home"},st=S({__name:"Home",setup(c){return(a,e)=>(n(),i("main",rt,[$(ot),$(je),$(We),$(Xe)]))}});var lt=w(st,[["__file","Home.vue"]]);const ut=S({__name:"NavbarBrand",setup(c){const a=me(),e=Q(),l=I(),o=Z(),d=h(()=>l.value.home||a.value),m=h(()=>e.value.title),v=h(()=>o.value&&l.value.logoDark!==void 0?l.value.logoDark:l.value.logo),r=()=>{if(!v.value)return null;const s=q("img",{class:"logo",src:pe(v.value),alt:m.value});return l.value.logoDark===void 0?s:q(he,()=>s)};return(s,u)=>{const _=P("RouterLink");return n(),T(_,{to:t(d)},{default:x(()=>[$(r),t(m)?(n(),i("span",{key:0,class:A(["site-name",{"can-hide":t(v)}])},B(t(m)),3)):C("",!0)]),_:1},8,["to"])}}});var it=w(ut,[["__file","NavbarBrand.vue"]]);const ct=S({__name:"DropdownTransition",setup(c){const a=l=>{l.style.height=l.scrollHeight+"px"},e=l=>{l.style.height=""};return(l,o)=>(n(),T(fe,{name:"dropdown",onEnter:a,onAfterEnter:e,onBeforeLeave:a},{default:x(()=>[k(l.$slots,"default")]),_:3}))}});var $e=w(ct,[["__file","DropdownTransition.vue"]]);const vt=["aria-label"],dt={class:"title"},_t=g("span",{class:"arrow down"},null,-1),pt=["aria-label"],ht={class:"title"},mt={class:"navbar-dropdown"},ft={class:"navbar-dropdown-subtitle"},bt={key:1},gt={class:"navbar-dropdown-subitem-wrapper"},kt=S({__name:"NavbarDropdown",props:{item:{type:Object,required:!0}},setup(c){const a=c,{item:e}=J(a),l=h(()=>e.value.ariaLabel||e.value.text),o=R(!1),d=z();be(()=>d.path,()=>{o.value=!1});const m=r=>{r.detail===0?o.value=!o.value:o.value=!1},v=(r,s)=>s[s.length-1]===r;return(r,s)=>(n(),i("div",{class:A(["navbar-dropdown-wrapper",{open:o.value}])},[g("button",{class:"navbar-dropdown-title",type:"button","aria-label":t(l),onClick:m},[g("span",dt,B(t(e).text),1),_t],8,vt),g("button",{class:"navbar-dropdown-title-mobile",type:"button","aria-label":t(l),onClick:s[0]||(s[0]=u=>o.value=!o.value)},[g("span",ht,B(t(e).text),1),g("span",{class:A(["arrow",o.value?"down":"right"])},null,2)],8,pt),$($e,null,{default:x(()=>[K(g("ul",mt,[(n(!0),i(M,null,F(t(e).children,u=>(n(),i("li",{key:u.text,class:"navbar-dropdown-item"},[u.children?(n(),i(M,{key:0},[g("h4",ft,[u.link?(n(),T(D,{key:0,item:u,onFocusout:_=>v(u,t(e).children)&&u.children.length===0&&(o.value=!1)},null,8,["item","onFocusout"])):(n(),i("span",bt,B(u.text),1))]),g("ul",gt,[(n(!0),i(M,null,F(u.children,_=>(n(),i("li",{key:_.link,class:"navbar-dropdown-subitem"},[$(D,{item:_,onFocusout:p=>v(_,u.children)&&v(u,t(e).children)&&(o.value=!1)},null,8,["item","onFocusout"])]))),128))])],64)):(n(),T(D,{key:1,item:u,onFocusout:_=>v(u,t(e).children)&&(o.value=!1)},null,8,["item","onFocusout"]))]))),128))],512),[[G,o.value]])]),_:1})],2))}});var $t=w(kt,[["__file","NavbarDropdown.vue"]]);const de=c=>decodeURI(c).replace(/#.*$/,"").replace(/(index)?\.(md|html)$/,""),Lt=(c,a)=>{if(a.hash===c)return!0;const e=de(a.path),l=de(c);return e===l},Le=(c,a)=>c.link&&Lt(c.link,a)?!0:c.children?c.children.some(e=>Le(e,a)):!1,ye=c=>!X(c)||/github\.com/.test(c)?"GitHub":/bitbucket\.org/.test(c)?"Bitbucket":/gitlab\.com/.test(c)?"GitLab":/gitee\.com/.test(c)?"Gitee":null,yt={GitHub:":repo/edit/:branch/:path",GitLab:":repo/-/edit/:branch/:path",Gitee:":repo/edit/:branch/:path",Bitbucket:":repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default"},wt=({docsRepo:c,editLinkPattern:a})=>{if(a)return a;const e=ye(c);return e!==null?yt[e]:null},St=({docsRepo:c,docsBranch:a,docsDir:e,filePathRelative:l,editLinkPattern:o})=>{if(!l)return null;const d=wt({docsRepo:c,editLinkPattern:o});return d?d.replace(/:repo/,X(c)?c:`https://github.com/${c}`).replace(/:branch/,a).replace(/:path/,Ne(`${Ie(e)}/${l}`)):null},Ct={key:0,class:"navbar-items"},Tt=S({__name:"NavbarItems",setup(c){const a=()=>{const s=ee(),u=me(),_=Q(),p=I();return h(()=>{var N,H;const b=Object.keys(_.value.locales);if(b.length<2)return[];const L=s.currentRoute.value.path,y=s.currentRoute.value.fullPath;return[{text:(N=p.value.selectLanguageText)!=null?N:"unknown language",ariaLabel:(H=p.value.selectLanguageAriaLabel)!=null?H:"unkown language",children:b.map(O=>{var oe,re,se,le,ue,ie;const W=(re=(oe=_.value.locales)==null?void 0:oe[O])!=null?re:{},ae=(le=(se=p.value.locales)==null?void 0:se[O])!=null?le:{},ne=`${W.lang}`,Se=(ue=ae.selectLanguageName)!=null?ue:ne;let U;if(ne===_.value.lang)U=y;else{const ce=L.replace(u.value,O);s.getRoutes().some(Ce=>Ce.path===ce)?U=ce:U=(ie=ae.home)!=null?ie:O}return{text:Se,link:U}})}]})},e=()=>{const s=I(),u=h(()=>s.value.repo),_=h(()=>u.value?ye(u.value):null),p=h(()=>u.value&&!X(u.value)?`https://github.com/${u.value}`:u.value),b=h(()=>p.value?s.value.repoLabel?s.value.repoLabel:_.value===null?"Source":_.value:null);return h(()=>!p.value||!b.value?[]:[{text:b.value,link:p.value}])},l=s=>ge(s)?ke(s):s.children?{...s,children:s.children.map(l)}:s,d=(()=>{const s=I();return h(()=>(s.value.navbar||[]).map(l))})(),m=a(),v=e(),r=h(()=>[...d.value,...m.value,...v.value]);return(s,u)=>t(r).length?(n(),i("nav",Ct,[(n(!0),i(M,null,F(t(r),_=>(n(),i("div",{key:_.text,class:"navbar-item"},[_.children?(n(),T($t,{key:0,item:_},null,8,["item"])):(n(),T(D,{key:1,item:_},null,8,["item"]))]))),128))])):C("",!0)}});var we=w(Tt,[["__file","NavbarItems.vue"]]);const xt=["title"],Bt={class:"icon",focusable:"false",viewBox:"0 0 32 32"},Nt=Me('<path d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6z" fill="currentColor"></path><path d="M5.394 6.813l1.414-1.415l3.506 3.506L8.9 10.318z" fill="currentColor"></path><path d="M2 15.005h5v2H2z" fill="currentColor"></path><path d="M5.394 25.197L8.9 21.691l1.414 1.415l-3.506 3.505z" fill="currentColor"></path><path d="M15 25.005h2v5h-2z" fill="currentColor"></path><path d="M21.687 23.106l1.414-1.415l3.506 3.506l-1.414 1.414z" fill="currentColor"></path><path d="M25 15.005h5v2h-5z" fill="currentColor"></path><path d="M21.687 8.904l3.506-3.506l1.414 1.415l-3.506 3.505z" fill="currentColor"></path><path d="M15 2.005h2v5h-2z" fill="currentColor"></path>',9),It=[Nt],Mt={class:"icon",focusable:"false",viewBox:"0 0 32 32"},Ht=g("path",{d:"M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3z",fill:"currentColor"},null,-1),Dt=[Ht],Pt=S({__name:"ToggleColorModeButton",setup(c){const a=I(),e=Z(),l=()=>{e.value=!e.value};return(o,d)=>(n(),i("button",{class:"toggle-color-mode-button",title:t(a).toggleColorMode,onClick:l},[K((n(),i("svg",Bt,It,512)),[[G,!t(e)]]),K((n(),i("svg",Mt,Dt,512)),[[G,t(e)]])],8,xt))}});var Et=w(Pt,[["__file","ToggleColorModeButton.vue"]]);const At=["title"],Rt=g("div",{class:"icon","aria-hidden":"true"},[g("span"),g("span"),g("span")],-1),Ft=[Rt],Ot=S({__name:"ToggleSidebarButton",emits:["toggle"],setup(c){const a=I();return(e,l)=>(n(),i("div",{class:"toggle-sidebar-button",title:t(a).toggleSidebar,"aria-expanded":"false",role:"button",tabindex:"0",onClick:l[0]||(l[0]=o=>e.$emit("toggle"))},Ft,8,At))}});var zt=w(Ot,[["__file","ToggleSidebarButton.vue"]]);const Wt=S({__name:"Navbar",emits:["toggle-sidebar"],setup(c){const a=I(),e=R(null),l=R(null),o=R(0),d=h(()=>o.value?{maxWidth:o.value+"px"}:{});Y(()=>{const r=m(e.value,"paddingLeft")+m(e.value,"paddingRight"),s=()=>{var u;window.innerWidth<=719?o.value=0:o.value=e.value.offsetWidth-r-(((u=l.value)==null?void 0:u.offsetWidth)||0)};s(),window.addEventListener("resize",s,!1),window.addEventListener("orientationchange",s,!1)});function m(v,r){var _,p,b;const s=(b=(p=(_=v==null?void 0:v.ownerDocument)==null?void 0:_.defaultView)==null?void 0:p.getComputedStyle(v,null))==null?void 0:b[r],u=Number.parseInt(s,10);return Number.isNaN(u)?0:u}return(v,r)=>{const s=P("NavbarSearch");return n(),i("header",{ref_key:"navbar",ref:e,class:"navbar"},[$(zt,{onToggle:r[0]||(r[0]=u=>v.$emit("toggle-sidebar"))}),g("span",{ref_key:"navbarBrand",ref:l},[$(it)],512),g("div",{class:"navbar-items-wrapper",style:He(t(d))},[k(v.$slots,"before"),$(we,{class:"can-hide"}),k(v.$slots,"after"),t(a).colorModeSwitch?(n(),T(Et,{key:0})):C("",!0),$(s)],4)],512)}}});var Ut=w(Wt,[["__file","Navbar.vue"]]);const Vt={class:"page-meta"},jt={key:0,class:"meta-item edit-link"},qt={key:1,class:"meta-item last-updated"},Kt={class:"meta-item-label"},Gt={class:"meta-item-info"},Xt={key:2,class:"meta-item contributors"},Yt={class:"meta-item-label"},Jt={class:"meta-item-info"},Qt=["title"],Zt=j(", "),ea=S({__name:"PageMeta",setup(c){const a=()=>{const r=I(),s=V(),u=E();return h(()=>{var H,O,W;if(!((O=(H=u.value.editLink)!=null?H:r.value.editLink)!=null?O:!0))return null;const{repo:p,docsRepo:b=p,docsBranch:L="main",docsDir:y="",editLinkText:f}=r.value;if(!b)return null;const N=St({docsRepo:b,docsBranch:L,docsDir:y,filePathRelative:s.value.filePathRelative,editLinkPattern:(W=u.value.editLinkPattern)!=null?W:r.value.editLinkPattern});return N?{text:f!=null?f:"Edit this page",link:N}:null})},e=()=>{const r=I(),s=V(),u=E();return h(()=>{var b,L,y,f;return!((L=(b=u.value.lastUpdated)!=null?b:r.value.lastUpdated)!=null?L:!0)||!((y=s.value.git)!=null&&y.updatedTime)?null:new Date((f=s.value.git)==null?void 0:f.updatedTime).toLocaleString()})},l=()=>{const r=I(),s=V(),u=E();return h(()=>{var p,b,L,y;return((b=(p=u.value.contributors)!=null?p:r.value.contributors)!=null?b:!0)&&(y=(L=s.value.git)==null?void 0:L.contributors)!=null?y:null})},o=I(),d=a(),m=e(),v=l();return(r,s)=>{const u=P("ClientOnly");return n(),i("footer",Vt,[t(d)?(n(),i("div",jt,[$(D,{class:"meta-item-label",item:t(d)},null,8,["item"])])):C("",!0),t(m)?(n(),i("div",qt,[g("span",Kt,B(t(o).lastUpdatedText)+": ",1),$(u,null,{default:x(()=>[g("span",Gt,B(t(m)),1)]),_:1})])):C("",!0),t(v)&&t(v).length?(n(),i("div",Xt,[g("span",Yt,B(t(o).contributorsText)+": ",1),g("span",Jt,[(n(!0),i(M,null,F(t(v),(_,p)=>(n(),i(M,{key:p},[g("span",{class:"contributor",title:`email: ${_.email}`},B(_.name),9,Qt),p!==t(v).length-1?(n(),i(M,{key:0},[Zt],64)):C("",!0)],64))),128))])])):C("",!0)])}}});var ta=w(ea,[["__file","PageMeta.vue"]]);const aa={key:0,class:"page-nav"},na={class:"inner"},oa={key:0,class:"prev"},ra={key:1,class:"next"},sa=S({__name:"PageNav",setup(c){const a=r=>r===!1?null:ge(r)?ke(r):De(r)?r:!1,e=(r,s,u)=>{const _=r.findIndex(p=>p.link===s);if(_!==-1){const p=r[_+u];return p!=null&&p.link?p:null}for(const p of r)if(p.children){const b=e(p.children,s,u);if(b)return b}return null},l=E(),o=te(),d=z(),m=h(()=>{const r=a(l.value.prev);return r!==!1?r:e(o.value,d.path,-1)}),v=h(()=>{const r=a(l.value.next);return r!==!1?r:e(o.value,d.path,1)});return(r,s)=>t(m)||t(v)?(n(),i("nav",aa,[g("p",na,[t(m)?(n(),i("span",oa,[$(D,{item:t(m)},null,8,["item"])])):C("",!0),t(v)?(n(),i("span",ra,[$(D,{item:t(v)},null,8,["item"])])):C("",!0)])])):C("",!0)}});var la=w(sa,[["__file","PageNav.vue"]]);const ua={class:"page"},ia={class:"theme-default-content"},ca=S({__name:"Page",setup(c){return(a,e)=>{const l=P("Content");return n(),i("main",ua,[k(a.$slots,"top"),g("div",ia,[k(a.$slots,"content-top"),$(l),k(a.$slots,"content-bottom")]),$(ta),$(la),k(a.$slots,"bottom")])}}});var va=w(ca,[["__file","Page.vue"]]);const da={class:"sidebar-item-children"},_a=S({__name:"SidebarItem",props:{item:{type:Object,required:!0},depth:{type:Number,required:!1,default:0}},setup(c){const a=c,{item:e,depth:l}=J(a),o=z(),d=ee(),m=h(()=>Le(e.value,o)),v=h(()=>({"sidebar-item":!0,"sidebar-heading":l.value===0,active:m.value,collapsible:e.value.collapsible})),r=R(!0),s=R(void 0);return e.value.collapsible&&(r.value=m.value,s.value=()=>{r.value=!r.value},d.afterEach(()=>{r.value=m.value})),(u,_)=>{var b;const p=P("SidebarItem",!0);return n(),i("li",null,[t(e).link?(n(),T(D,{key:0,class:A(t(v)),item:t(e)},null,8,["class","item"])):(n(),i("p",{key:1,tabindex:"0",class:A(t(v)),onClick:_[0]||(_[0]=(...L)=>s.value&&s.value(...L)),onKeydown:_[1]||(_[1]=Pe((...L)=>s.value&&s.value(...L),["enter"]))},[j(B(t(e).text)+" ",1),t(e).collapsible?(n(),i("span",{key:0,class:A(["arrow",r.value?"down":"right"])},null,2)):C("",!0)],34)),(b=t(e).children)!=null&&b.length?(n(),T($e,{key:2},{default:x(()=>[K(g("ul",da,[(n(!0),i(M,null,F(t(e).children,L=>(n(),T(p,{key:`${t(l)}${L.text}${L.link}`,item:L,depth:t(l)+1},null,8,["item","depth"]))),128))],512),[[G,r.value]])]),_:1})):C("",!0)])}}});var pa=w(_a,[["__file","SidebarItem.vue"]]);const ha={key:0,class:"sidebar-items"},ma=S({__name:"SidebarItems",setup(c){const a=z(),e=te();return Y(()=>{be(()=>a.hash,l=>{const o=document.querySelector(".sidebar");if(!o)return;const d=document.querySelector(`.sidebar a.sidebar-item[href="${a.path}${l}"]`);if(!d)return;const{top:m,height:v}=o.getBoundingClientRect(),{top:r,height:s}=d.getBoundingClientRect();r<m?d.scrollIntoView(!0):r+s>m+v&&d.scrollIntoView(!1)})}),(l,o)=>t(e).length?(n(),i("ul",ha,[(n(!0),i(M,null,F(t(e),d=>(n(),T(pa,{key:d.link||d.text,item:d},null,8,["item"]))),128))])):C("",!0)}});var fa=w(ma,[["__file","SidebarItems.vue"]]);const ba={class:"sidebar"},ga=S({__name:"Sidebar",setup(c){return(a,e)=>(n(),i("aside",ba,[$(we),k(a.$slots,"top"),$(fa),k(a.$slots,"bottom")]))}});var ka=w(ga,[["__file","Sidebar.vue"]]);const $a=S({__name:"Layout",setup(c){const a=V(),e=E(),l=I(),o=h(()=>e.value.navbar!==!1&&l.value.navbar!==!1),d=te(),m=R(!1),v=f=>{m.value=typeof f=="boolean"?f:!m.value},r={x:0,y:0},s=f=>{r.x=f.changedTouches[0].clientX,r.y=f.changedTouches[0].clientY},u=f=>{const N=f.changedTouches[0].clientX-r.x,H=f.changedTouches[0].clientY-r.y;Math.abs(N)>Math.abs(H)&&Math.abs(N)>40&&(N>0&&r.x<=80?v(!0):v(!1))},_=h(()=>[{"no-navbar":!o.value,"no-sidebar":!d.value.length,"sidebar-open":m.value},e.value.pageClass]);let p;Y(()=>{p=ee().afterEach(()=>{v(!1)})}),Ee(()=>{p()});const b=Ae(),L=b.resolve,y=b.pending;return(f,N)=>(n(),i("div",{class:A(["theme-container",t(_)]),onTouchstart:s,onTouchend:u},[k(f.$slots,"navbar",{},()=>[t(o)?(n(),T(Ut,{key:0,onToggleSidebar:v},{before:x(()=>[k(f.$slots,"navbar-before")]),after:x(()=>[k(f.$slots,"navbar-after")]),_:3})):C("",!0)]),g("div",{class:"sidebar-mask",onClick:N[0]||(N[0]=H=>v(!1))}),k(f.$slots,"sidebar",{},()=>[$(ka,null,{top:x(()=>[k(f.$slots,"sidebar-top")]),bottom:x(()=>[k(f.$slots,"sidebar-bottom")]),_:3})]),k(f.$slots,"page",{},()=>[t(e).home?(n(),T(lt,{key:0})):(n(),T(fe,{key:1,name:"fade-slide-y",mode:"out-in",onBeforeEnter:t(L),onBeforeLeave:t(y)},{default:x(()=>[(n(),T(va,{key:t(a).path},{top:x(()=>[k(f.$slots,"page-top")]),"content-top":x(()=>[k(f.$slots,"page-content-top")]),"content-bottom":x(()=>[k(f.$slots,"page-content-bottom")]),bottom:x(()=>[k(f.$slots,"page-bottom")]),_:3}))]),_:3},8,["onBeforeEnter","onBeforeLeave"]))])],34))}});var La=w($a,[["__file","Layout.vue"]]);const ya=S({__name:"Layout",setup(c){const a=R(!0);let e;return Y(()=>{const l=document.querySelector("html");a.value=l.classList.contains("dark"),e=new MutationObserver(()=>{a.value=l.classList.contains("dark")}),e.observe(l,{attributeFilter:["class"],attributes:!0})}),Re(()=>{e.disconnect()}),(l,o)=>{const d=P("CommentService");return n(),T(La,null,{"page-bottom":x(()=>[$(d,{darkmode:a.value},null,8,["darkmode"])]),_:1})}}});var Sa=w(ya,[["__file","Layout.vue"]]);export{Sa as default};
