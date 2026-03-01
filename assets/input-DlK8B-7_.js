import{e as i,a,b as t,c as d}from"./index-gsq--ECX.js";import{u,b as n,c}from"./query-Dt9caMt_.js";import{j as p}from"./ui-6X2NZjeB.js";import{r as g}from"./vendor-S6w1S69P.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=i("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=i("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=i("Linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=i("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=i("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=i("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=i("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=i("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]),P=(r=!1,e="en")=>u({queryKey:["hero-slides",r,e],queryFn:async()=>{const s=r?"&include_images=true":"";return await a.get(`/api/hero-slides?active_only=${!r}&lang=${e}${s}`)}}),M=()=>u({queryKey:["contact-info"],queryFn:async()=>a.get("/api/contact-info")}),S=()=>{const r=n();return c({mutationFn:async({id:e,value:s})=>a.put(`/api/contact-info/${e}?value=${encodeURIComponent(s)}`),onSuccess:()=>{r.invalidateQueries({queryKey:["contact-info"]}),t.success("Contact info updated successfully")},onError:e=>{t.error(e.message)}})},E=()=>{const r=n();return c({mutationFn:async e=>a.post("/api/contact-info",e),onSuccess:()=>{r.invalidateQueries({queryKey:["contact-info"]}),t.success("Contact info created successfully")},onError:e=>{t.error(e.message)}})},I=(r=!0,e="en")=>u({queryKey:["news-articles",r,e],queryFn:async()=>a.get(`/api/news-articles?published_only=${r}&lang=${e}`)}),Q=()=>{const r=n();return c({mutationFn:async e=>a.post("/api/news-articles",e),onSuccess:()=>{r.invalidateQueries({queryKey:["news-articles"]}),t.success("Article created successfully")},onError:e=>{t.error(e.message)}})},A=()=>{const r=n();return c({mutationFn:async({id:e,...s})=>a.put(`/api/news-articles/${e}`,s),onSuccess:()=>{r.invalidateQueries({queryKey:["news-articles"]}),t.success("Article updated successfully")},onError:e=>{t.error(e.message)}})},_=()=>{const r=n();return c({mutationFn:async e=>a.delete(`/api/news-articles/${e}`),onSuccess:()=>{r.invalidateQueries({queryKey:["news-articles"]}),t.success("Article deleted successfully")},onError:e=>{t.error(e.message)}})},L=(r=!0,e="en")=>u({queryKey:["products",r,e],queryFn:async()=>{const s=r?"":"&include_images=true";return(await a.get(`/api/products?active_only=${r}&lang=${e}${s}`)).map(o=>({...o,specifications:o.specifications||[],applications:o.applications||[],packaging:o.packaging||[],categories:o.categories||[]}))}}),R=(r="en")=>u({queryKey:["products","featured",r],queryFn:async()=>(await a.get(`/api/products?active_only=true&featured_only=true&lang=${r}`)).map(s=>({...s,specifications:s.specifications||[],applications:s.applications||[],packaging:s.packaging||[],categories:s.categories||[]}))}),U=(r,e="en")=>u({queryKey:["product",r,e],queryFn:async()=>{if(!r)return null;const s=await a.get(`/api/products/${r}?lang=${e}`);return{...s,specifications:s.specifications||[],applications:s.applications||[],packaging:s.packaging||[],categories:s.categories||[]}},enabled:!!r}),j=()=>{const r=n();return c({mutationFn:async e=>a.post("/api/products",e),onSuccess:()=>{r.invalidateQueries({queryKey:["products"]}),t.success("Product created successfully")},onError:e=>{t.error(e.message)}})},N=()=>{const r=n();return c({mutationFn:async({id:e,...s})=>a.put(`/api/products/${e}`,s),onSuccess:()=>{r.invalidateQueries({queryKey:["products"]}),t.success("Product updated successfully")},onError:e=>{t.error(e.message)}})},z=()=>{const r=n();return c({mutationFn:async e=>a.delete(`/api/products/${e}`),onSuccess:()=>{r.invalidateQueries({queryKey:["products"]}),t.success("Product deleted successfully")},onError:e=>{t.error(e.message)}})},D=(r=!0,e="en")=>u({queryKey:["product-categories",r,e],queryFn:async()=>a.get(`/api/product-categories?active_only=${r}&lang=${e}`)}),G=()=>{const r=n();return c({mutationFn:async e=>a.post("/api/product-categories",e),onSuccess:()=>{r.invalidateQueries({queryKey:["product-categories"]}),t.success("Category created successfully")},onError:e=>{t.error(e.message)}})},B=()=>{const r=n();return c({mutationFn:async({id:e,...s})=>a.put(`/api/product-categories/${e}`,s),onSuccess:()=>{r.invalidateQueries({queryKey:["product-categories"]}),t.success("Category updated successfully")},onError:e=>{t.error(e.message)}})},H=()=>{const r=n();return c({mutationFn:async e=>a.delete(`/api/product-categories/${e}`),onSuccess:()=>{r.invalidateQueries({queryKey:["product-categories"]}),t.success("Category deleted successfully")},onError:e=>{t.error(e.message)}})},T=async(r,e)=>new Promise((s,l)=>{const o=new FileReader;o.onload=()=>{const y=o.result;s(y)},o.onerror=()=>l(new Error("Failed to read file")),o.readAsDataURL(r)}),Z=(r=!0,e="en")=>u({queryKey:["sectors",r,e],queryFn:async()=>{const s=r?"":"&include_images=true";return a.get(`/api/sectors?active_only=${r}&lang=${e}${s}`)}}),J=r=>u({queryKey:["seo-page-meta",r],queryFn:async()=>{const e=await a.get(`/api/seo-page-meta/by-path?path=${encodeURIComponent(r)}`);return e.error?null:e},staleTime:5*60*1e3}),f=g.forwardRef(({className:r,type:e,...s},l)=>p.jsx("input",{type:e,className:d("flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",r),ref:l,...s}));f.displayName="Input";export{k as C,v as G,f as I,w as L,$ as M,K as P,Z as a,R as b,D as c,I as d,J as e,x as f,L as g,U as h,M as i,b as j,F as k,T as l,S as m,E as n,Q as o,A as p,_ as q,j as r,N as s,z as t,P as u,G as v,B as w,H as x};
