// Preview controls are separate from the TASCA product state.
(function(){
  'use strict';
  const hideButton=document.getElementById('hide-guides');
  const showButton=document.getElementById('show-guides');
  const viewHint=document.getElementById('view-hint');
  const parameters=new URLSearchParams(window.location.search);
  const savedMode=(()=>{try{return window.sessionStorage.getItem('tasca-preview-mode')}catch(e){return null}})();
  const isNarrow=()=>window.matchMedia('(max-width:820px)').matches;
  function setHidden(hidden){
    document.body.classList.toggle('hide-guides',hidden);
    const url=new URL(window.location.href);
    if(hidden)url.searchParams.set('demo','0');else url.searchParams.delete('demo');
    try{window.history.replaceState(null,'',url.pathname+url.search+url.hash)}catch(e){}
  }
  function setMode(mode){
    const next=mode==='desktop'?'desktop':'phone';
    document.body.dataset.preview=next;
    document.querySelectorAll('[data-device]').forEach(function(button){
      const selected=button.dataset.device===next;
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('selected',selected);
    });
    if(viewHint)viewHint.textContent=next==='desktop'?'Адаптивный сайт без корпуса телефона':'Мобильный сайт внутри макета телефона';
    const url=new URL(window.location.href);
    if(next==='desktop')url.searchParams.set('view','desktop');else url.searchParams.delete('view');
    try{window.history.replaceState(null,'',url.pathname+url.search+url.hash)}catch(e){}
    try{window.sessionStorage.setItem('tasca-preview-mode',next)}catch(e){}
  }
  if(parameters.get('demo')==='0')document.body.classList.add('hide-guides');
  setMode(parameters.get('view')==='desktop'?'desktop':(savedMode||'phone'));
  hideButton.addEventListener('click',function(){setHidden(true)});
  showButton.addEventListener('click',function(){setHidden(false)});
  document.querySelectorAll('[data-device]').forEach(function(button){
    button.addEventListener('click',function(){setMode(button.dataset.device)});
  });
  // On real phones the interface always uses the full available screen.
  window.addEventListener('resize',function(){document.body.classList.toggle('on-physical-mobile',isNarrow())});
  document.body.classList.toggle('on-physical-mobile',isNarrow());
})();
