'use strict';
let swipeNavigationRoot=null;
function initSwipeNavigation(){
 const view=document.querySelector('#view');if(!view||swipeNavigationRoot===view)return;swipeNavigationRoot=view;
 const dirtyForms=new WeakSet();let gesture=null,lastSwipe=0,animation=null;
 const excluded='input,textarea,select,button,a,label,form,details,summary,[contenteditable],[role="slider"],[data-no-swipe],canvas,video,.water-chart,.bar,.ring';
 const blocked=target=>!!document.querySelector('dialog[open]')||!!document.querySelector('#modal')?.open||!!target?.closest?.(excluded)||!!document.activeElement?.matches?.('input,textarea,select,[contenteditable]')||[...view.querySelectorAll('form')].some(f=>dirtyForms.has(f))||!!window.getSelection?.()?.toString();
 const viewportWidth=()=>window.innerWidth||document.documentElement?.clientWidth||390;
 const markDirty=e=>{const f=e.target?.closest?.('form');if(f)dirtyForms.add(f)};
 view.addEventListener('input',markDirty,true);view.addEventListener('change',markDirty,true);view.addEventListener('reset',e=>dirtyForms.delete(e.target),true);
 view.addEventListener('touchstart',e=>{
  gesture=null;if(e.touches.length!==1||blocked(e.target))return;const t=e.touches[0],width=viewportWidth();
  // Reserve screen edges for the browser and Android back gestures.
  if(t.clientX<24||t.clientX>width-24)return;
  for(let n=e.target;n&&n!==view;n=n.parentElement)if(n.clientWidth>0&&n.scrollWidth>n.clientWidth+4)return;
  gesture={x:t.clientX,y:t.clientY,at:Date.now(),tab,locked:false};
 },{passive:true});
 view.addEventListener('touchmove',e=>{
  if(!gesture)return;if(e.touches.length!==1||blocked(e.target)){gesture=null;return}const t=e.touches[0],dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;
  if(!gesture.locked&&Math.abs(dy)>12&&Math.abs(dy)>=Math.abs(dx)*.7){gesture=null;return}
  if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.6)gesture.locked=true;
  if(gesture.locked&&e.cancelable)e.preventDefault();
 },{passive:false});
 view.addEventListener('touchend',e=>{
  const g=gesture;gesture=null;if(!g||e.touches.length||!e.changedTouches.length||blocked(e.target)||tab!==g.tab)return;
  const t=e.changedTouches[0],dx=t.clientX-g.x,dy=t.clientY-g.y,threshold=Math.max(64,Math.min(120,viewportWidth()*.18));
  if(Date.now()-g.at>900||Math.abs(dx)<threshold||Math.abs(dx)<Math.abs(dy)*1.8)return;
  const screens=[...document.querySelectorAll('nav button[data-tab]')].map(b=>b.dataset.tab),index=screens.indexOf(tab),next=index+(dx<0?1:-1);
  if(index<0||next<0||next>=screens.length)return;
  if(e.cancelable)e.preventDefault();lastSwipe=Date.now();if(animation)animation.cancel();navigate(screens[next]);window.scrollTo?.(0,0);
  if(typeof view.animate==='function'&&!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){try{animation=view.animate([{transform:`translateX(${dx<0?18:-18}px)`,opacity:.85},{transform:'translateX(0)',opacity:1}],{duration:160,easing:'ease-out'})}catch{}}
 },{passive:false});
 view.addEventListener('touchcancel',()=>{gesture=null},{passive:true});
 // Prevent a completed swipe from also activating a link under the release point.
 view.addEventListener('click',e=>{if(e.detail>0&&Date.now()-lastSwipe<400){e.preventDefault();e.stopPropagation()}},true);
}
