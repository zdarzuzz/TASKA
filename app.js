(function(){
"use strict";
var KEY='taska-mvp02';
var DIRS=['Дизайн','Разработка','Тексты','Маркетинг','Фото и видео','Аналитика'];
var S,ui={};
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var validHttp=function(s){try{var u=new URL(s);return u.protocol==='http:'||u.protocol==='https:'}catch(e){return false}};
var safeUrl=function(s){return validHttp(s)?esc(new URL(s).href):'#'};
var rub=function(n){return Number(n).toLocaleString('ru-RU')+' ₽'};
var plural=function(n,f){var a=Math.abs(n)%100,b=a%10;return a>10&&a<20?f[2]:b>1&&b<5?f[1]:b===1?f[0]:f[2]};
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function day(n){var d=new Date();d.setDate(d.getDate()+n);return iso(d)}
function fmt(s){return new Date(s+'T00:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}
function daysLeft(s){return Math.round((new Date(s+'T00:00:00')-new Date(day(0)+'T00:00:00'))/864e5)}
function leftTxt(s){var n=daysLeft(s);return n<0?'срок прошёл':n===0?'сегодня':n+' '+plural(n,['день','дня','дней'])}
function nowT(){return new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}
function uid(p){return p+(++S.seq)}
function stars(n){var r=Math.round(n);return '★★★★★'.slice(0,r)+'☆☆☆☆☆'.slice(0,5-r)}
function toast(t){var el=document.createElement('div');el.textContent=t;$('toast').appendChild(el);setTimeout(function(){el.remove()},2600)}

/* ---------- data ---------- */
function seed(){
  var users={
    c1:{id:'c1',role:'customer',seed:1,name:'Студия «Пиксель»',about:'Дизайн-студия из шести человек. Берём студентов на лендинги и аналитику, платим сразу после приёмки.',reviews:[]},
    c2:{id:'c2',role:'customer',seed:1,name:'Кофейня «Зерно»',about:'Три точки у метро. Ищем студентов для контента, дизайна и съёмки. Всегда на связи в чате.',reviews:[]},
    c3:{id:'c3',role:'customer',seed:1,name:'Магазин «Ход конём»',about:'Магазин настольных игр и клуб с турнирами по выходным. Нужны тексты, боты и небольшие автоматизации.',reviews:[]},
    s1:{id:'s1',role:'student',seed:1,name:'Алина Крылова',direction:'Дизайн',skills:['Figma','Айдентика','Иллюстрация'],about:'3 курс, дизайн. Делаю логотипы и фирменный стиль для небольших проектов.',portfolio:[{title:'Айдентика кофейни «Бублик»',url:''},{title:'Набор иконок для приложения',url:''}],reviews:[{from:'Кофейня «Зерно»',rating:5,text:'Логотип сделала за три дня и сразу учла правки.',task:'Логотип для зала'}]},
    s2:{id:'s2',role:'student',seed:1,name:'Максим Ребров',direction:'Разработка',skills:['JavaScript','React','Telegram-боты'],about:'4 курс, программная инженерия. Пишу ботов, лендинги и небольшие сервисы.',portfolio:[{title:'Бот записи в барбершоп',url:''},{title:'Лендинг для автошколы',url:''}],reviews:[{from:'Студия «Пиксель»',rating:4,text:'Бот работает, были мелкие правки по текстам.',task:'Бот для записи'},{from:'Магазин «Ход конём»',rating:5,text:'Всё чётко и в срок.',task:'Парсер цен'}]},
    s3:{id:'s3',role:'student',seed:1,name:'Софья Тарасова',direction:'Тексты',skills:['Копирайтинг','SEO','Редактура'],about:'Филфак, пишу тексты для сайтов и соцсетей. Объясняю сложное простыми словами.',portfolio:[{title:'Серия статей о кофе',url:''}],reviews:[{from:'Студия «Пиксель»',rating:5,text:'Тексты для лендинга пришли с первого раза без правок.',task:'Тексты для сайта'}]}
  };
  var tasks=[],n=0;
  function T(title,cat,budget,days,owner,desc,terms,mat){n++;tasks.push({id:'t'+n,title:title,cat:cat,budget:budget,deadline:day(days),owner:owner,desc:desc,terms:terms,mat:mat||'',status:'open',responses:[],chosen:null,reserved:false,result:null,proposal:null})}
  T('Логотип и фирменные цвета для кофейни','Дизайн',6000,7,'c2','Нужен логотип для кофейни у метро: знак и вариант с названием. Три цвета, версии на светлом и тёмном фоне, форматы SVG и PNG. Стиль тёплый, без шрифтов с засечками.','Два круга правок включены. Приёмка по макету в Figma и выгрузке файлов.','Фото интерьера и референсы пришлём в чате');
  T('Лендинг для школы танцев','Разработка',15000,14,'c1','Одностраничный сайт: программа занятий, расписание, цены, форма записи. Тексты и фото предоставим. Нужна адаптивная вёрстка и форма, которая присылает заявки на почту.','Сайт открывается на телефоне и компьютере, заявки приходят на почту.','Тексты и фото в общей папке');
  T('Описания для 10 карточек настольных игр','Тексты',4000,5,'c3','Нужны описания для карточек товаров: по 600–800 знаков, без воды, с правилами в двух предложениях и пометкой, для кого игра. Список игр и характеристики пришлём.','Уникальность от 90%, один круг правок.','');
  T('Telegram-бот для записи на турниры','Разработка',12000,10,'c3','Бот принимает заявки на турниры по настольным играм: имя, игра, дата. Заявки уходят в Google-таблицу, организатору приходит уведомление. Хостинг предоставим.','Код в репозитории, инструкция по запуску на одной странице.','');
  T('12 постов для соцсетей кофейни','Маркетинг',5000,6,'c2','Контент-план и 12 постов для ВКонтакте и Telegram на две недели: тексты и подбор фото из нашей съёмки. Тон дружелюбный, без шаблонных фраз.','Сначала согласуем план, потом тексты. Один круг правок.','Фото из последней съёмки');
  T('Фотосъёмка нового меню','Фото и видео',8000,9,'c2','Нужно снять 14 позиций меню: напитки и десерты. Свет естественный, обработка в едином стиле, по 3 кадра на позицию.','Сдача: 42 обработанных кадра в JPG, исходники по запросу.','');
  T('Собрать данные о конкурентах в таблицу','Аналитика',3500,4,'c1','Нужно собрать в одну таблицу цены, ассортимент и условия доставки пяти конкурентов с их сайтов. Столбцы согласуем заранее, источники укажите рядом с данными.','Таблица Excel или Google, у каждой ячейки указан источник, пропусков нет.','Список конкурентов пришлём в чате');
  T('Подготовить презентацию для питча','Дизайн',7000,8,'c1','Нужна презентация на 12 слайдов для питча перед инвесторами: структура у нас готова, нужен чистый дизайн, графики и аккуратные иконки. Шрифты и цвета бренда дадим.','Файлы PPTX и PDF, правки по комментариям в одном круге.','Структура и брендбук в общей папке');
  T('Внести правки на сайт магазина','Разработка',3000,5,'c3','В списке 14 мелких правок: поменять тексты на главной, исправить кнопку «В корзину» на телефоне, обновить подвал и подключить счётчик аналитики. Доступ к админке дадим после выбора исполнителя.','Все пункты из списка выполнены и проверены на телефоне и компьютере.','Список правок по ссылке в чате');
  return {v:1,role:null,me:{student:null,customer:null},users:users,tasks:tasks,notifs:[],msgs:[],tickets:[],dismissed:[],filters:{q:'',dir:'',min:'',days:''},seq:100,view:{n:'auth'},prev:null};
}
function load(){try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);if(o&&o.v===1)return o}}catch(e){}return null}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
S=load()||seed();

var U=function(id){return S.users[id]||{name:'—',reviews:[],skills:[],portfolio:[]}};
var meId=function(){return S.me[S.role]};
var task=function(id){return S.tasks.filter(function(t){return t.id===id})[0]};
function avg(u){var r=u.reviews||[];return r.length?r.reduce(function(a,b){return a+b.rating},0)/r.length:0}
function blank(role,id){return role==='student'?{id:id,role:role,name:'',direction:'Дизайн',skills:[],about:'',portfolio:[],reviews:[]}:{id:id,role:role,name:'',about:'',reviews:[]}}
function demoUser(role){
  var u=blank(role,role==='student'?'me_s':'me_c');
  if(role==='student'){u.name='Демо Студент';u.direction='Разработка';u.skills=['HTML','CSS','JavaScript'];u.about='3 курс. Беру небольшие задачи по вёрстке и сайтам.';u.portfolio=[{title:'Сайт-визитка для курсовой',url:''}]}
  else{u.name='Демо-заказчик';u.about='Небольшой бренд. Ищем студентов на разовые задачи.'}
  return u;
}
function notify(to,text,tid){S.notifs.unshift({id:uid('n'),to:to,text:text,tid:tid,read:false,time:nowT()});S.notifs=S.notifs.slice(0,100)}

/* ---------- status ---------- */
var ST={draft:['Черновик','neutral'],moderation:['На модерации','warn'],rejected:['Не прошла модерацию','bad'],open:['Принимает отклики','ok'],offer:['Ждём подтверждения студента','warn'],confirmed:['Готово к старту','warn'],work:['В работе','role'],review:['На проверке','warn'],revision:['На доработке','bad'],accepted:['Ждёт оплаты','warn'],done:['Завершена','ok']};
function pill(p){return '<span class="pill '+p[1]+'">'+esc(p[0])+'</span>'}
function sResp(t){return t.responses.filter(function(r){return r.studentId===meId()})[0]}
function sStatus(t){
  var me=meId(),r=sResp(t);
  if(t.chosen===me){return {offer:['Вас выбрали','warn'],confirmed:['Ждём старта','warn'],work:['В работе','role'],revision:['Нужны правки','bad'],review:['На проверке','warn'],accepted:['Принято, ждём оплату','warn'],done:['Завершена','ok']}[t.status]||ST[t.status]}
  if(!r)return ST[t.status];
  if(t.chosen&&r.status==='sent')return ['Выбран другой исполнитель','neutral'];
  return {sent:['Отклик отправлен','neutral'],rejected:['Отклик отклонён','bad'],declined:['Вы отказались','neutral'],selected:['Вас выбрали','warn']}[r.status];
}
function cHint(t){
  var n=t.responses.filter(function(r){return r.status==='sent'}).length;
  if(t.status==='open')return n?n+' '+plural(n,['отклик ждёт','отклика ждут','откликов ждут'])+' решения':'Пока нет откликов';
  if(t.status==='review')return 'Ждёт вашей проверки';
  if(t.status==='accepted')return 'Подтвердите оплату';
  if(t.status==='confirmed')return 'Подтвердите условия и начните работу';
  if(t.status==='rejected')return 'Исправьте и отправьте повторно';
  if(t.status==='done'&&!t.studentRated)return 'Оставьте отзыв о студенте';
  return '';
}

/* ---------- moderation ---------- */
function checkTask(t){
  var e=[];
  if((t.title||'').trim().length<8)e.push('Название слишком короткое: нужно не меньше 8 символов.');
  if((t.desc||'').trim().length<40)e.push('ТЗ слишком короткое: опишите задачу подробнее, минимум 40 символов.');
  if(!(t.budget>=500))e.push('Бюджет должен быть не меньше 500 ₽.');
  if(!t.deadline||t.deadline<=day(0))e.push('Дедлайн должен быть в будущем.');
  if(!(t.terms||'').trim())e.push('Добавьте условия приёмки.');
  if(/(t\.me\/|wa\.me|\+7[\s\d(-]{6,}|@[a-z0-9_]{4,})/i.test(t.title+' '+t.desc+' '+t.terms))e.push('Уберите контакты из текста: общение идёт в чате задачи.');
  return e;
}
function moderate(id){
  var t=task(id);if(!t||t.status!=='moderation')return;
  var e=checkTask(t);
  if(e.length){t.status='rejected';t.reject=e;notify(t.owner,'Задача «'+t.title+'» не прошла модерацию',t.id)}
  else{t.status='open';t.reject=null;notify(t.owner,'Задача «'+t.title+'» опубликована',t.id);setTimeout(function(){seedResponses(t.id)},2500)}
  render();
}
var MSG={s1:'Здравствуйте! Делала похожие задачи, примеры в профиле. Готова обсудить детали в чате.',s2:'Привет! Вижу задачу целиком, могу взяться. Пару моментов уточню в чате.',s3:'Добрый день! Есть время на этой неделе, первый вариант пришлю в течение двух дней.'};
function seedResponses(id){
  var t=task(id);if(!t||t.status!=='open')return;
  var used=t.responses.map(function(r){return r.studentId});
  var pool=['s1','s2','s3'].filter(function(s){return used.indexOf(s)<0}).sort(function(a,b){return (U(b).direction===t.cat)-(U(a).direction===t.cat)}).slice(0,2);
  pool.forEach(function(s,i){setTimeout(function(){
    var t2=task(id);if(!t2||t2.status!=='open')return;
    t2.responses.push({id:uid('r'),studentId:s,message:MSG[s],link:'',status:'sent',time:nowT()});
    notify(t2.owner,U(s).name+' откликнулся на «'+t2.title+'»',id);render();
  },i*1600)});
}

/* ---------- transitions ---------- */
function chosenResp(t){return t.responses.filter(function(r){return r.studentId===t.chosen})[0]}
function doChoose(t,r){r.status='selected';t.chosen=r.studentId;t.status='offer';t.declinedNote=null;notify(r.studentId,'Вас выбрали исполнителем: «'+t.title+'». Подтвердите готовность.',t.id)}
function doConfirm(t){t.status='confirmed';notify(t.owner,U(t.chosen).name+' подтвердил готовность: «'+t.title+'»',t.id)}
function doDecline(t){var r=chosenResp(t),n=U(t.chosen).name;if(r)r.status='declined';t.declinedNote=n;t.chosen=null;t.status='open';notify(t.owner,n+' отказался от предложения: «'+t.title+'»',t.id)}
function doStart(t,reserve){t.status='work';t.reserved=reserve;notify(t.chosen,'Работа началась: «'+t.title+'». Задача в разделе «Мои задачи».',t.id)}
function doSubmit(t,link,comment){t.result={link:link,comment:comment,v:(t.result?t.result.v:0)+1};t.status='review';t.revisionNote=null;notify(t.owner,U(t.chosen).name+' отправил результат на проверку: «'+t.title+'»',t.id)}
function doAccept(t){t.status='accepted';notify(t.chosen,'Заказчик принял работу: «'+t.title+'»',t.id)}
function doRevise(t,note){t.status='revision';t.revisionNote=note;notify(t.chosen,'Заказчик запросил правки: «'+t.title+'»',t.id)}
function doPropose(t,b,d){t.proposal={budget:b,deadline:d,state:'pending'};notify(t.chosen,'Заказчик предлагает новые условия: «'+t.title+'»',t.id)}
function doAnswer(t,ok){var p=t.proposal;if(!p)return;if(ok){t.budget=p.budget;t.deadline=p.deadline}p.state=ok?'accepted':'declined';notify(t.owner,U(t.chosen).name+(ok?' согласился на новые условия':' не согласился на новые условия')+': «'+t.title+'»',t.id)}
function doPay(t){t.status='done';t.paid=true;notify(t.chosen,'Оплата подтверждена в демо: '+rub(t.budget)+' за «'+t.title+'»',t.id)}

/* ---------- view helpers ---------- */
function al(kind,title,text){return '<div class="al '+kind+'"><b>'+esc(title)+'</b>'+(text?'<span>'+text+'</span>':'')+'</div>'}
function demo(label,btns){
  return '<details class="demo-helper"><summary><span class="demo-symbol">↔</span><span><b>Продолжить тест</b><small>Действия другой стороны · демо</small></span></summary><div class="demo-actions">'+btns.map(function(b){return '<button class="btn sm" data-a="'+b[0]+'" data-id="'+b[2]+'"'+(b[3]?' data-x="'+b[3]+'"':'')+'>'+esc(b[1])+'</button>'}).join('')+'</div></details>';
}
function profileCard(u,compact){
  var rv=u.reviews||[],h='<div class="stack"><div class="row between"><h3>'+esc(u.name||'Без имени')+'</h3>'+(rv.length?'<span class="starline" title="Средняя оценка">'+stars(avg(u))+' <span class="muted small">'+avg(u).toFixed(1)+' ('+rv.length+')</span></span>':'<span class="muted small">Отзывов пока нет</span>')+'</div>';
  if(u.role==='student'){
    h+='<div class="row"><span class="pill role">'+esc(u.direction||'Направление не указано')+'</span>'+(u.skills||[]).map(function(s){return '<span class="chip">'+esc(s)+'</span>'}).join('')+'</div>';
  }
  if(u.about)h+='<p class="muted">'+esc(u.about)+'</p>';
  if(u.role==='student'&&(u.portfolio||[]).length){h+='<div><h4>Примеры работ</h4><ul style="margin:4px 0 0;padding-left:18px">'+u.portfolio.map(function(p){return '<li>'+esc(p.title)+(p.url?' · <a href="'+safeUrl(p.url)+'" target="_blank" rel="noopener">ссылка</a>':'')+'</li>'}).join('')+'</ul></div>'}
  if(rv.length&&!compact){h+='<div><h4>Отзывы</h4><div class="stack" style="margin-top:6px">'+rv.slice(0,4).map(function(r){return '<div class="small"><span class="starline">'+stars(r.rating)+'</span> '+esc(r.from)+(r.task?' · <span class="muted">'+esc(r.task)+'</span>':'')+'<br>'+esc(r.text)+'</div>'}).join('')+'</div></div>'}
  return h+'</div>';
}
function taskBody(t){
  return '<div class="task-facts"><div><small>Оплата</small><strong>'+rub(t.budget)+'</strong></div><div><small>Срок</small><strong>'+fmt(t.deadline)+'</strong></div></div>'
  +'<div class="task-copy"><h3>Что нужно сделать</h3><p class="pre">'+esc(t.desc||'Описание ещё не добавлено')+'</p></div>'
  +'<details class="disclosure"><summary>Условия приёмки и материалы</summary><div class="disclosure-body"><h4>Как примут работу</h4><p class="pre">'+esc(t.terms||'Не указано')+'</p>'+(t.mat?'<h4>Материалы</h4><p>'+esc(t.mat)+'</p>':'')+'</div></details>';
}
function chat(t,sid){
  var me=meId(),other=me===t.owner?sid:t.owner;
  var ms=S.msgs.filter(function(m){return m.tid===t.id&&m.sid===sid});
  return '<details class="disclosure chat-disclosure"'+(ui.chatExpanded?' open':'')+'><summary>Переписка с '+esc(U(other).name)+(ms.length?' <span class="count">'+ms.length+'</span>':'')+'</summary><div class="disclosure-body"><div class="msgs">'+(ms.length?ms.map(function(m){return '<div class="m'+(m.from===me?' me':'')+'"><p>'+esc(m.text)+'</p><small>'+m.time+'</small></div>'}).join(''):'<p class="muted small">Сообщений пока нет</p>')+'</div>'
  +'<form id="f-chat" class="chatf" data-tid="'+t.id+'" data-sid="'+sid+'"><input type="text" id="chat-in" required placeholder="Ваше сообщение" autocomplete="off" aria-label="Сообщение"><button class="btn primary sm" aria-label="Отправить сообщение">➤</button></form></div></details>';
}
function supportBox(t){
  if(ui.support)return '<form id="f-sup" class="card stack" data-tid="'+t.id+'"><h4>Обращение в поддержку (демо)</h4><label class="f">Что произошло<textarea id="sup-text" required placeholder="Опишите спор или задержку оплаты"></textarea></label><div class="row"><button class="btn primary">Отправить</button><button type="button" class="btn ghost" data-a="support-off">Отмена</button></div></form>';
  return '<p class="small"><button class="btn sm ghost" data-a="support">Возник спор? Создать демо-обращение</button></p>';
}
function rateForm(t,whom){
  var r=ui.rating||5;
  return '<form id="f-rate" class="card stack" data-tid="'+t.id+'" data-whom="'+whom+'"><h3>Отзыв о '+(whom==='student'?'студенте':'заказчике')+'</h3><div class="stars" role="group" aria-label="Оценка">'+[1,2,3,4,5].map(function(i){return '<button type="button" class="'+(i<=r?'on':'')+'" data-a="star" data-x="'+i+'" aria-label="'+i+' из 5">★</button>'}).join('')+'</div><label class="f">Комментарий<textarea id="rate-text" required placeholder="Что получилось, как шла работа"></textarea></label><div><button class="btn primary">Оставить отзыв</button></div></form>';
}
function proposalBox(t,side){
  var p=t.proposal;if(!p)return '';
  if(p.state==='pending'){
    if(side==='student')return al('warn','Заказчик предлагает новые условия','Бюджет: '+rub(p.budget)+' (было '+rub(t.budget)+'), дедлайн: '+fmt(p.deadline)+' (было '+fmt(t.deadline)+').')+'<div class="row"><button class="btn primary" data-a="prop" data-id="'+t.id+'" data-x="1">Принять условия</button><button class="btn danger" data-a="prop" data-id="'+t.id+'" data-x="0">Не согласен</button></div>';
    return al('warn','Новые условия отправлены студенту','Бюджет '+rub(p.budget)+', дедлайн '+fmt(p.deadline)+'. Ждём ответа.')+(U(t.chosen).seed?demo(U(t.chosen).name,[['prop','Студент согласен',t.id,'1'],['prop','Студент не согласен',t.id,'0']]):'');
  }
  return al(p.state==='accepted'?'ok':'bad',p.state==='accepted'?'Новые условия приняты':'Студент не согласился на новые условия',p.state==='accepted'?'Бюджет '+rub(t.budget)+', дедлайн '+fmt(t.deadline)+'.':'Остаются прежние условия: '+rub(t.budget)+', до '+fmt(t.deadline)+'.');
}

/* ---------- screens ---------- */
function authScreen(){
 return '<header class="top"><div class="wrap bar"><span class="logo">ТАСКА <span class="logo-mark">✳</span></span><span class="demo-tag">ДЕМО</span></div></header><main class="wrap app-content">'
 +'<section class="hero-intro"><span class="hero-kicker">Задачи для студентов</span><h1>Начни с <em>маленького.</em></h1><p>Находи проекты, получай опыт и оплату. Или найди исполнителя для своей задачи.</p></section>'
 +'<form id="f-auth" class="onboarding-form"><h2>Как вы хотите начать?</h2><div class="tiles" role="radiogroup" aria-label="Выберите роль"><label class="tile stu"><input type="radio" name="role" id="r-student" value="student" checked><span class="tile-icon">↗</span><b>Я студент</b><span class="small">Ищу подработку</span></label><label class="tile cus"><input type="radio" name="role" id="r-customer" value="customer"><span class="tile-icon">＋</span><b>Я заказчик</b><span class="small">Размещаю задачу</span></label></div>'
 +'<label class="f"><span id="a-lab">Имя и фамилия</span><input type="text" id="a-name" required minlength="2" autocomplete="name" placeholder="Например, Анна Смирнова"></label>'
 +'<button class="btn primary btn-wide">Продолжить <span aria-hidden="true">→</span></button><p class="fine-print">Тестовая версия · без реальных оплат и регистраций</p></form>'
 +'<details class="disclosure intro-how"><summary>Как работает TASCA?</summary><div class="disclosure-body"><ol class="simple-steps"><li>Заказчик публикует задачу</li><li>Студент откликается</li><li>Заказчик выбирает исполнителя</li><li>Результат проверяют и завершают работу</li></ol></div></details></main>';
}
function shell(){
  var me=meId(),unread=S.notifs.filter(function(n){return n.to===me&&!n.read}).length,v=S.view.n;
  var tabs=S.role==='student'?[['feed','Лента','⌕'],['my','Мои','▣'],['notifs','События','♧'],['profile','Профиль','◯']]:[['my','Задачи','▣'],['create','Создать','＋'],['notifs','События','♧'],['profile','Профиль','◯']];
  var cur=v==='task'?(S.role==='student'?(S.prev&&S.prev.n==='my'?'my':'feed'):'my'):v;
  return '<header class="top"><div class="wrap bar"><button class="logo" data-a="home" aria-label="На главную">ТАСКА <span class="logo-mark">✳</span></button><button class="role-switch" data-a="switch" aria-label="Сменить роль">'+(S.role==='student'?'Студент':'Заказчик')+' <span>⌄</span></button></div></header>'
  +'<main class="wrap app-content">'+screen()+'</main>'
  +'<nav class="tabs" aria-label="Разделы">'+tabs.map(function(t){return '<button data-a="go" data-x="'+t[0]+'"'+(cur===t[0]?' class="on" aria-current="page"':'')+'><span class="tab-icon" aria-hidden="true">'+t[2]+'</span><span>'+t[1]+'</span>'+(t[0]==='notifs'&&unread?'<span class="badge">'+unread+'</span>':'')+'</button>'}).join('')+'</nav>';
}
function screen(){
  var v=S.view;
  if(v.n==='profile')return profileScreen();
  if(v.n==='feed'&&S.role==='student')return feedScreen();
  if(v.n==='task')return taskScreen(v.id);
  if(v.n==='create'&&S.role==='customer')return createScreen(v.id);
  if(v.n==='notifs')return notifScreen();
  return S.role==='student'?(v.n==='my'?myScreen():feedScreen()):myScreen();
}
function profileScreen(){
 var u=U(meId()),st=S.role==='student',first=S.view.first;
 var h='<div class="page-heading"><span class="eyebrow-in">'+(first?'ШАГ 1 ИЗ 2':'ЛИЧНЫЙ КАБИНЕТ')+'</span><h1>'+(first?'Ваш профиль':'Профиль')+'</h1>'+(first?'<p>Добавьте главное. Остальное можно заполнить позже.</p>':'')+'</div>';
 h+='<form id="f-profile" class="sheet stack"><label class="f">'+(st?'Имя и фамилия':'Название компании')+'<input type="text" id="p-name" required value="'+esc(u.name)+'"></label>';
 if(st)h+='<label class="f">Специализация<select id="p-dir">'+DIRS.map(function(d){return '<option'+(d===u.direction?' selected':'')+'>'+d+'</option>'}).join('')+'</select></label><label class="f">Навыки <span class="hint">через запятую</span><input type="text" id="p-skills" value="'+esc((u.skills||[]).join(', '))+'" placeholder="Figma, дизайн, HTML"></label>';
 h+='<label class="f">'+(st?'О себе':'О компании')+'<textarea id="p-about" placeholder="Пара предложений">'+esc(u.about||'')+'</textarea></label>';
 if(st){h+='<details class="disclosure"><summary>Добавить работы в портфолио</summary><div class="disclosure-body stack">';for(var i=0;i<3;i++){var p=(u.portfolio||[])[i]||{title:'',url:''};h+='<div class="portfolio-fields"><input type="text" id="p-pt'+i+'" value="'+esc(p.title)+'" placeholder="Название работы" aria-label="Название работы '+(i+1)+'"><input type="text" id="p-pu'+i+'" value="'+esc(p.url)+'" placeholder="Ссылка на работу" aria-label="Ссылка на работу '+(i+1)+'"></div>'}h+='</div></details>'}
 h+='<button class="btn primary btn-wide">'+(first?(st?'Перейти к задачам':'Создать первую задачу'):'Сохранить изменения')+' →</button></form>';
 if(!first)h+='<details class="disclosure"><summary>Как видят мой профиль</summary><div class="disclosure-body">'+profileCard(u)+'</div></details>';
 return h;
}
function feedScreen(){
 var f=S.filters,me=meId();
 var list=S.tasks.filter(function(t){return t.status==='open'&&S.dismissed.indexOf(t.id)<0});
 if(f.q)list=list.filter(function(t){return (t.title+' '+t.desc).toLowerCase().indexOf(f.q.toLowerCase())>=0});
 if(f.dir)list=list.filter(function(t){return t.cat===f.dir});
 if(f.min)list=list.filter(function(t){return t.budget>=Number(f.min)});
 if(f.days)list=list.filter(function(t){return daysLeft(t.deadline)<=Number(f.days)});
 list=list.slice().reverse();
 var active=Boolean(f.dir||f.min||f.days),hidden=S.dismissed.filter(function(id){var t=task(id);return t&&t.status==='open'}).length;
 var h='<div class="page-heading"><span class="eyebrow-in">ВАКАНСИИ И ПОДРАБОТКА</span><h1>Найди задачу</h1><p>Небольшие проекты с понятной оплатой</p></div>';
 h+='<div class="search-line"><label class="search-box"><span aria-hidden="true">⌕</span><input type="text" id="f-q" data-f="q" value="'+esc(f.q)+'" placeholder="Дизайн, тексты, разработка…" aria-label="Поиск задач"></label><button class="filter-button'+(active?' is-active':'')+'" data-a="toggle-filters" aria-expanded="'+(Boolean(ui.filtersOpen))+'">☷ <span class="sr-only">Фильтры</span>'+(active?' •':'')+'</button></div>';
 if(ui.filtersOpen)h+='<div class="filter-panel stack"><div class="filter-panel-head"><b>Фильтры</b><button class="text-button" data-a="clear-f">Сбросить</button></div><label class="f">Направление<select id="f-dir" data-f="dir"><option value="">Любое</option>'+DIRS.map(function(d){return '<option'+(f.dir===d?' selected':'')+'>'+d+'</option>'}).join('')+'</select></label><div class="filter-columns"><label class="f">Бюджет от, ₽<input type="number" id="f-min" data-f="min" min="0" step="500" value="'+esc(f.min)+'" placeholder="Любой"></label><label class="f">Срок<select id="f-days" data-f="days">'+[['','Любой'],['3','До 3 дней'],['7','До 7 дней'],['14','До 14 дней']].map(function(o){return '<option value="'+o[0]+'"'+(f.days===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label></div></div>';
 h+='<div class="section-heading"><b>'+list.length+' '+plural(list.length,['задача','задачи','задач'])+'</b>'+(active?'<button class="text-button" data-a="clear-f">Очистить фильтры</button>':'')+'</div>';
 if(!list.length)h+='<div class="empty-quiet"><span>⌕</span><h3>Пока ничего не нашли</h3><p>Попробуйте изменить запрос или фильтры</p><button class="btn" data-a="clear-f">Сбросить фильтры</button></div>';
 else h+='<div class="task-list">'+list.map(function(t){var r=t.responses.filter(function(r){return r.studentId===me})[0];return '<article class="job-card" data-a="go" data-x="task" data-id="'+t.id+'" role="button" tabindex="0"><div class="job-card-top"><span class="category-pill">'+esc(t.cat)+'</span><b class="job-price">'+rub(t.budget)+'</b></div><h3>'+esc(t.title)+'</h3><div class="job-card-bottom"><span>'+esc(U(t.owner).name)+'</span><span>· до '+fmt(t.deadline)+'</span></div>'+(r?'<span class="applied-note">✓ Вы откликнулись</span>':'')+'<span class="job-arrow" aria-hidden="true">↗</span></article>'}).join('')+'</div>';
 if(hidden)h+='<button class="text-button" data-a="undismiss">Показать скрытые ('+hidden+')</button>';
 return h;
}
function myScreen(){
 var me=meId(),h;
 if(S.role==='student'){
  var mine=S.tasks.filter(function(t){return sResp(t)}),act=mine.filter(function(t){return t.chosen===me&&t.status!=='done'}),done=mine.filter(function(t){return t.chosen===me&&t.status==='done'}),rest=mine.filter(function(t){return t.chosen!==me});
  h='<div class="page-heading"><span class="eyebrow-in">МОЯ АКТИВНОСТЬ</span><h1>Мои задачи</h1></div>';
  if(!mine.length)return h+'<div class="empty-quiet"><span>▣</span><h3>Здесь появятся отклики</h3><p>Найдите первую задачу и откликнитесь</p><button class="btn primary" data-a="go" data-x="feed">Найти задачу</button></div>';
  var sec=function(title,arr){return arr.length?'<section class="my-group"><h2>'+title+' <span>'+arr.length+'</span></h2>'+arr.map(function(t){return '<article class="my-card" data-a="go" data-x="task" data-id="'+t.id+'" role="button" tabindex="0"><div class="my-top">'+pill(sStatus(t))+'<strong>'+rub(t.budget)+'</strong></div><h3>'+esc(t.title)+'</h3><span class="muted small">'+esc(U(t.owner).name)+' · до '+fmt(t.deadline)+'</span><span class="job-arrow" aria-hidden="true">↗</span></article>'}).join('')+'</section>':''};
  return h+sec('Требуют внимания',act)+sec('Отклики',rest)+sec('Завершено',done);
 }
 var my=S.tasks.filter(function(t){return t.owner===me}).slice().reverse();
 h='<div class="page-heading"><span class="eyebrow-in">КАБИНЕТ ЗАКАЗЧИКА</span><h1>Мои задачи</h1><p>Управляйте заданиями и откликами</p></div><button class="btn primary btn-wide" data-a="go" data-x="create">＋ Разместить задачу</button>';
 if(!my.length)return h+'<div class="empty-quiet"><span>＋</span><h3>Пока нет заданий</h3><p>Создайте первую задачу за несколько минут</p></div>';
 return h+'<div class="task-list">'+my.map(function(t){var hint=cHint(t);return '<article class="my-card" data-a="go" data-x="task" data-id="'+t.id+'" role="button" tabindex="0"><div class="my-top">'+pill(ST[t.status])+'<strong>'+(t.budget?rub(t.budget):'—')+'</strong></div><h3>'+esc(t.title||'Новая задача')+'</h3>'+(hint?'<span class="next-step">'+esc(hint)+'</span>':'<span class="muted small">до '+(t.deadline?fmt(t.deadline):'—')+'</span>')+'<span class="job-arrow" aria-hidden="true">↗</span></article>'}).join('')+'</div>';
}
function notifScreen(){
 var me=meId(),ns=S.notifs.filter(function(n){return n.to===me});
 var h='<div class="page-heading"><span class="eyebrow-in">ОБНОВЛЕНИЯ</span><h1>События</h1></div>'+(ns.some(function(n){return !n.read})?'<button class="text-button" data-a="readall">Отметить всё прочитанным</button>':'');
 if(!ns.length)return h+'<div class="empty-quiet"><span>♧</span><h3>Пока событий нет</h3><p>Здесь появятся новости по вашим заданиям</p></div>';
 return h+'<div class="notifications">'+ns.map(function(n){return '<article class="notification'+(n.read?'':' unread')+'" data-a="open-n" data-id="'+n.id+'" role="button" tabindex="0"><span class="notification-dot"></span><div>'+esc(n.text)+'<small>'+n.time+'</small></div><span>›</span></article>'}).join('')+'</div>';
}
/* student task view */
function studentTask(t){
  var me=meId(),r=sResp(t),owner=U(t.owner),h='';
  var backTo='<button class="back-link" data-a="back">← Назад к задачам</button>';
  h+=backTo+'<div class="task-head"><span class="eyebrow-in">'+esc(t.cat)+'</span><h1>'+esc(t.title)+'</h1>'+pill(sStatus(t)||ST[t.status])+'</div><section class="sheet stack">'+taskBody(t)+'</section>';
  h+='<details class="disclosure"><summary>О заказчике · '+esc(owner.name)+'</summary><div class="disclosure-body">'+profileCard(owner)+'</div></details>';
  var p='';
  if(t.chosen===me){
    p+=proposalBox(t,'student');
    if(t.status==='offer'){p+=al('role','Заказчик выбрал вас','Задача закрепится за вами после подтверждения. Если условия не подходят, откажитесь до начала работы.')+'<div class="row"><button class="btn primary" data-a="s-confirm" data-id="'+t.id+'">Подтвердить готовность</button><button class="btn danger" data-a="s-decline" data-id="'+t.id+'">Отказаться до начала работы</button></div>'+(owner.seed?'':'')+chat(t,me)}
    else if(t.status==='confirmed'){p+=al('ok','Вы подтвердили готовность','Ждём, когда заказчик подтвердит условия и запустит работу. Придёт уведомление.')+(owner.seed?demo(owner.name,[['d-start','Заказчик начал работу',t.id]]):'')+chat(t,me)}
    else if(t.status==='work'||t.status==='revision'){
      if(t.status==='revision')p+=al('bad','Нужны правки',esc(t.revisionNote||'Заказчик запросил доработку.'));
      else p+=al('role','Задача в работе','Она в разделе «Мои задачи» со статусом «В работе». Уточняйте детали в чате.');
      p+=chat(t,me)+'<form id="f-submit" class="card stack" data-tid="'+t.id+'"><h3>'+(t.status==='revision'?'Повторно отправить на проверку':'Сдача')+'</h3><label class="f">Ссылка на результат<span class="hint">Диск, Figma, GitHub или другой источник</span><input type="text" id="sub-link" required placeholder="https://"></label><label class="f">Комментарий<textarea id="sub-note" placeholder="Что сделано, что приложено"></textarea></label><div><button class="btn primary">Отправить на проверку</button></div></form>';
    }
    else if(t.status==='review'){p+=al('warn','Работа на проверке','Заказчик смотрит результат'+(t.result?' (версия '+t.result.v+')':'')+'. Вы получите подтверждение или запрос на доработку.')+(owner.seed?demo(owner.name,[['d-accept','Принять работу',t.id],['d-revise','Запросить правки',t.id],['d-scope','Изменить объём задачи',t.id]]):'')+chat(t,me)+supportBox(t)}
    else if(t.status==='accepted'){p+=al('ok','Работа принята','Ждём подтверждения оплаты от заказчика.')+(owner.seed?demo(owner.name,[['d-pay','Заказчик подтвердил оплату',t.id]]):'')+supportBox(t)}
    else if(t.status==='done'){p+=al('ok','Оплата подтверждена в демо: '+rub(t.budget),'Завершённая задача появилась в вашем профиле.')+(t.customerRated?al('role','Ваш отзыв отправлен',esc(t.customerRated.text)):rateForm(t,'customer'))}
  }else if(r){
    if(t.chosen&&r.status==='sent')p+=al('','Заказчик выбрал другого исполнителя','Эта задача больше не принимает отклики.')+'<div><button class="btn" data-a="go" data-x="feed">Продолжить поиск</button></div>';
    else if(r.status==='rejected')p+=al('bad','Заказчик отклонил отклик','Не расстраивайтесь, в ленте есть другие задачи.')+'<div><button class="btn primary" data-a="go" data-x="feed">Продолжить поиск</button></div>';
    else if(r.status==='declined')p+=al('','Вы отказались от этой задачи','Она возвращена в ленту для других студентов.')+'<div><button class="btn" data-a="go" data-x="feed">Продолжить поиск</button></div>';
    else{p+=al('role','Отклик отправлен','Заказчик получил ваше сообщение. Решение придёт уведомлением.')+(owner.seed?demo(owner.name,[['d-select','Заказчик выбрал вас',t.id],['d-reject','Заказчик отклонил отклик',t.id]]):'')+chat(t,me)}
  }else if(t.status==='open'){
    p+='<div class="row"><button class="btn primary" data-a="resp-on">Откликнуться</button><button class="btn" data-a="dismiss" data-id="'+t.id+'">Не подходит</button></div>';
    if(ui.respond)p+='<form id="f-resp" class="card stack" data-tid="'+t.id+'"><h3>Отклик</h3><label class="f">Сообщение заказчику<span class="hint">Почему вы подходите и когда сможете начать</span><textarea id="resp-msg" required minlength="10"></textarea></label><label class="f">Ссылка на работу<span class="hint">Необязательно</span><input type="text" id="resp-link" placeholder="https://"></label><div><button class="btn primary">Отправить отклик</button></div></form>';
  }else p+=al('','Задача не принимает отклики','Статус: '+esc(ST[t.status][0])+'.');
  return h+(p?'<section class="stack">'+p+'</section>':'');
}
/* customer task view */
function customerTask(t){
  var h='<button class="back-link" data-a="back">← Мои задачи</button><div class="task-head"><span class="eyebrow-in">'+esc(t.cat)+'</span><h1>'+esc(t.title||'Новая задача')+'</h1>'+pill(ST[t.status])+'</div><section class="sheet stack">'+(t.status==='draft'&&!t.desc?'<p class="muted">Заполните информацию о задаче</p>':taskBody(t))+'</section>';
  var p='',st=t.status,chosenU=t.chosen?U(t.chosen):null;
  if(st==='draft')p+='<div><button class="btn primary" data-a="go" data-x="create" data-id="'+t.id+'">Продолжить редактирование</button></div>';
  if(st==='moderation')p+=al('warn','Проверяем задачу','Модерация обычно занимает несколько секунд. После одобрения задача появится в ленте.');
  if(st==='rejected')p+=al('bad','Задача не прошла модерацию','<ul>'+(t.reject||[]).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>')+'<div><button class="btn primary" data-a="go" data-x="create" data-id="'+t.id+'">Исправить задачу</button></div>';
  if(st==='open'){
    if(t.declinedNote)p+=al('warn',esc(t.declinedNote)+' отказался от предложения','Выберите другого кандидата из откликов.');
    var rs=t.responses,act=rs.filter(function(r){return r.status==='sent'});
    p+='<h2>Отклики'+(rs.length?' · '+rs.length:'')+'</h2>';
    if(!rs.length)p+=al('role','Пока нет откликов','Студенты видят задачу в ленте. Первые отклики обычно приходят быстро.');
    else{p+='<div class="stack">'+rs.map(function(r){
      var u=U(r.studentId),lab={sent:null,rejected:['Отклонён','bad'],declined:['Отказался','neutral'],selected:['Выбран','ok']}[r.status];
      return '<article class="card stack"><div class="row between"><span></span>'+(lab?pill(lab):'')+'</div>'+profileCard(u,true)+'<details class="disclosure mini-disclosure"><summary>Сообщение студента</summary><div class="disclosure-body">'+esc(r.message)+(r.link?'<br><a href="'+safeUrl(r.link)+'" target="_blank" rel="noopener">Работа по ссылке</a>':'')+'</div></details>'
      +(r.status==='sent'?'<div class="row"><button class="btn primary" data-a="choose" data-id="'+t.id+'" data-x="'+r.id+'">Выбрать исполнителя</button><button class="btn" data-a="chat-open" data-x="'+r.studentId+'">Написать</button><button class="btn danger" data-a="rej" data-id="'+t.id+'" data-x="'+r.id+'">Отклонить</button></div>':'')
      +(ui.chat===r.studentId&&r.status==='sent'?chat(t,r.studentId):'')+'</article>'}).join('')+'</div>'}
    if(rs.length&&!act.length)p+=al('warn','Нет подходящих откликов','Уточните ТЗ, бюджет или сроки и обновите публикацию: так задачу заметят другие студенты.');
    p+='<div><button class="btn'+(rs.length&&!act.length?' primary':'')+'" data-a="go" data-x="create" data-id="'+t.id+'">Уточнить ТЗ, бюджет или сроки</button></div>';
  }
  if(st==='offer')p+=al('warn','Предложение отправлено','Ждём, пока '+esc(chosenU.name)+' подтвердит готовность.')+(chosenU.seed?demo(chosenU.name,[['s-confirm','Студент подтверждает',t.id],['s-decline','Студент отказывается',t.id]]):'')+chat(t,t.chosen);
  if(st==='confirmed')p+=al('ok',esc(chosenU.name)+' подтвердил готовность','Подтвердите условия и выберите, как будет проходить оплата.')+'<form id="f-start" class="card stack" data-tid="'+t.id+'"><h3>Начало работы</h3><label class="check"><input type="checkbox" id="st-ok" required><span>Условия согласованы: '+rub(t.budget)+', дедлайн '+fmt(t.deadline)+'</span></label><div class="stack"><label class="check"><input type="radio" name="pay" id="st-res" value="1" checked><span><b>Имитировать резерв суммы</b><br><span class="muted small">В демо студент увидит статус «Оплата зарезервирована». Реальные деньги не переводятся и не хранятся.</span></span></label><label class="check"><input type="radio" name="pay" id="st-late" value="0"><span><b>Оплату согласуем после приёмки</b><br><span class="muted small">В демо это второй вариант сценария. Оплата вне приложения.</span></span></label></div><div><button class="btn primary">Начать работу</button></div><p class="small muted">Демо: деньги не списываются.</p></form>'+chat(t,t.chosen);
  if(st==='work'||st==='revision'||st==='review'){
    var P=t.proposal&&t.proposal.state==='pending';
    if(st==='work')p+=al('role',esc(chosenU.name)+' выполняет задачу','Переписка и договорённости сохраняются в чате.')+(chosenU.seed?demo(chosenU.name,[['d-submit','Студент сдал работу',t.id]]):'');
    if(st==='revision')p+=al('bad','Правки отправлены студенту',esc(t.revisionNote||''))+(chosenU.seed?demo(chosenU.name,[['d-submit','Студент прислал новую версию',t.id]]):'');
    if(st==='review'){
      p+='<div class="card stack"><h3>Результат'+(t.result?' · версия '+t.result.v:'')+'</h3><p>'+(t.result&&t.result.link?'<a href="'+safeUrl(t.result.link)+'" target="_blank" rel="noopener">'+esc(t.result.link)+'</a>':'Ссылка не указана')+'</p>'+(t.result&&t.result.comment?'<p class="muted">'+esc(t.result.comment)+'</p>':'')+'<p class="small muted">Сверьте с условиями приёмки: '+esc(t.terms)+'</p><div class="row"><button class="btn primary" data-a="accept" data-id="'+t.id+'">Принять работу</button><button class="btn" data-a="rev-on">Запросить правки</button></div></div>';
      if(ui.rev)p+='<form id="f-rev" class="card stack" data-tid="'+t.id+'"><h3>Описать доработки</h3><label class="f">Что исправить<span class="hint">В рамках ТЗ</span><textarea id="rev-note" required></textarea></label><div><button class="btn primary">Отправить студенту</button></div></form>';
    }
    p+=proposalBox(t,'customer');
    if(!P)p+='<div><button class="btn sm" data-a="scope-on">Изменился объём задачи</button></div>';
    if(ui.scope&&!P)p+='<form id="f-scope" class="card stack" data-tid="'+t.id+'"><h3>Согласовать новую стоимость и сроки</h3><div class="two"><label class="f">Бюджет, ₽<input type="number" id="sc-b" required min="500" step="100" value="'+t.budget+'"></label><label class="f">Дедлайн<input type="date" id="sc-d" required min="'+day(1)+'" value="'+(t.deadline>day(0)?t.deadline:day(3))+'"></label></div><div><button class="btn primary">Предложить студенту</button></div></form>';
    p+=chat(t,t.chosen);
  }
  if(st==='accepted')p+=al('ok','Работа принята','Осталось подтвердить оплату.')+'<div class="card stack"><h3>Оплата и завершение</h3><p>'+(t.reserved?'В демо отмечен резерв '+rub(t.budget)+'. Подтвердите завершение без перевода денег.':'Отметьте оплату '+rub(t.budget)+' как выполненную в демо. Денежный перевод не происходит.')+'</p><div><button class="btn primary" data-a="pay" data-id="'+t.id+'">'+(t.reserved?'Подтвердить выплату (демо)':'Отметить оплату (демо)')+'</button></div><p class="small muted">Демо: деньги не списываются.</p></div>'+supportBox(t);
  if(st==='done')p+=al('ok','Задача завершена','Демо-оплата отмечена. Перевода денег не было.')+(t.studentRated?al('role','Ваш отзыв опубликован',esc(t.studentRated.text)+'<br><span class="muted small">Он виден в профиле исполнителя.</span>'):rateForm(t,'student'));
  return h+(p?'<section class="stack">'+p+'</section>':'');
}
function taskScreen(id){var t=task(id);if(!t)return myScreen();return S.role==='student'?studentTask(t):customerTask(t)}

function createScreen(id){
 var t=task(id);if(!t)return myScreen();
 var isDraft=t.status==='draft',btn=isDraft?'Отправить на проверку':t.status==='rejected'?'Отправить повторно':'Сохранить и отправить';
 var h='<button class="back-link" data-a="back">← Мои задачи</button><div class="page-heading"><span class="eyebrow-in">'+(isDraft?'НОВОЕ ЗАДАНИЕ':'РЕДАКТИРОВАНИЕ')+'</span><h1>'+(isDraft?'Создать задачу':'Изменить задачу')+'</h1><p>Чем точнее описание, тем проще найти исполнителя</p></div>';
 if(t.status==='rejected'&&t.reject)h+=al('bad','Исправьте перед публикацией','<ul>'+(t.reject||[]).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>');
 h+='<form id="f-task" class="sheet stack" data-tid="'+t.id+'"><label class="f">Что нужно сделать?<input type="text" id="c-title" required value="'+esc(t.title||'')+'" placeholder="Например, дизайн презентации"></label>'
 +'<label class="f">Направление<select id="c-cat">'+DIRS.map(function(d){return '<option'+(d===t.cat?' selected':'')+'>'+d+'</option>'}).join('')+'</select></label>'
 +'<div class="form-divider">Условия</div><div class="form-grid"><label class="f">Оплата, ₽<input type="number" id="c-budget" required min="500" step="100" value="'+(t.budget||'')+'" placeholder="5000"></label><label class="f">Сдать до<input type="date" id="c-deadline" required min="'+day(1)+'" value="'+esc(t.deadline||'')+'"></label></div>'
 +'<div class="form-divider">Подробности</div><label class="f">Описание задачи<textarea id="c-desc" required placeholder="Что нужно сделать и какой результат вы ждёте?">'+esc(t.desc||'')+'</textarea></label>'
 +'<label class="f">Как принять результат?<textarea id="c-terms" required placeholder="Например: файл Figma и исходники">'+esc(t.terms||'')+'</textarea></label>'
 +'<details class="disclosure"><summary>Добавить материалы</summary><div class="disclosure-body"><label class="f">Ссылка на материалы<input type="text" id="c-mat" value="'+esc(t.mat||'')+'" placeholder="https://..."></label></div></details>'
 +'<button class="btn primary btn-wide" data-act="publish">'+btn+' →</button>'+(isDraft?'<button class="text-button" data-act="draft" formnovalidate>Сохранить черновик</button>':'')+'<p class="fine-print" id="saved">'+(isDraft?'Черновик сохраняется автоматически':'Перед публикацией задание пройдёт проверку')+'</p></form>';
 return h;
}
/* ---------- render ---------- */
function snap(){
  var o={};document.querySelectorAll('#app [id]').forEach(function(el){if(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))o[el.id]={v:el.value,c:el.checked}});
  var a=document.activeElement;o.__f=a&&a.id&&o[a.id]?{id:a.id,s:a.selectionStart,e:a.selectionEnd}:null;return o;
}
function restore(o){
  for(var id in o){if(id==='__f')continue;var el=$(id);if(!el)continue;if(el.type==='checkbox'||el.type==='radio')el.checked=o[id].c;else el.value=o[id].v}
  if(o.__f){var el2=$(o.__f.id);if(el2){el2.focus();try{el2.setSelectionRange(o.__f.s,o.__f.e)}catch(e){}}}
}
function render(fresh){
  var o=fresh?null:snap();
  document.body.dataset.role=S.role||'student';
  $('app').innerHTML=S.role?shell():authScreen();
  if(o)restore(o);
  var m=document.querySelector('.msgs');if(m)m.scrollTop=m.scrollHeight;
  save();
}
function go(v){S.prev=S.view;S.view=v;ui={};render(true);var main=document.querySelector('#app .app-content');if(main)main.scrollTop=0}
function newDraft(){
  var me=meId(),ex=S.tasks.filter(function(t){return t.owner===me&&t.status==='draft'&&!t.title&&!t.desc})[0];
  if(ex)return ex.id;
  var t={id:uid('t'),title:'',cat:DIRS[0],budget:'',deadline:'',owner:me,desc:'',terms:'',mat:'',status:'draft',responses:[],chosen:null,reserved:false,result:null,proposal:null};
  S.tasks.push(t);return t.id;
}
function readTask(t){
  t.title=$('c-title').value.trim();t.cat=$('c-cat').value;t.budget=Number($('c-budget').value)||'';t.deadline=$('c-deadline').value;
  t.mat=$('c-mat').value.trim();t.desc=$('c-desc').value.trim();t.terms=$('c-terms').value.trim();
}
function v(id){var e=$(id);return e?e.value:''}

/* ---------- actions ---------- */
var H={
  home:function(){go(S.role==='student'?{n:'feed'}:{n:'my'})},
  go:function(id,x){if(x==='create'&&!id)id=newDraft();go({n:x,id:id})},
  back:function(){var p=S.prev;go(p&&p.n!=='task'&&p.n!=='auth'?p:(S.role==='student'?{n:'feed'}:{n:'my'}))},
  'switch':function(){
    var tgt=S.role==='student'?'customer':'student';
    if(!S.me[tgt]){var d=demoUser(tgt);S.users[d.id]=d;S.me[tgt]=d.id}
    S.role=tgt;go(tgt==='student'?{n:'feed'}:{n:'my'});toast('Вы вошли как '+(tgt==='student'?'студент':'заказчик')+': '+U(meId()).name);
  },
  reset:function(){try{localStorage.removeItem(KEY)}catch(e){}S=seed();ui={};render(true);var main=document.querySelector('#app .app-content');if(main)main.scrollTop=0},
  'clear-f':function(){S.filters={q:'',dir:'',min:'',days:''};render(true)},
  'toggle-filters':function(){ui.filtersOpen=!ui.filtersOpen;render(true)},
  dismiss:function(id){if(S.dismissed.indexOf(id)<0)S.dismissed.push(id);go({n:'feed'});toast('Задача скрыта из ленты')},
  undismiss:function(){S.dismissed=[];render(true)},
  'resp-on':function(){ui.respond=true;render()},
  'chat-open':function(id,x){ui.chat=x;ui.chatExpanded=true;render()},
  choose:function(id,x){var t=task(id),r=t.responses.filter(function(r){return r.id===x})[0];doChoose(t,r);ui={};render(true);toast('Предложение отправлено студенту')},
  rej:function(id,x){var t=task(id),r=t.responses.filter(function(r){return r.id===x})[0];r.status='rejected';notify(r.studentId,'Заказчик отклонил отклик: «'+t.title+'»',t.id);ui.chat=null;render();toast('Отклик отклонён')},
  's-confirm':function(id){var t=task(id);doConfirm(t);render(true);toast('Готовность подтверждена')},
  's-decline':function(id){var t=task(id);doDecline(t);if(S.role==='student')go({n:'feed'});else render(true)},
  'rev-on':function(){ui.rev=true;render()},
  'scope-on':function(){ui.scope=true;render()},
  accept:function(id){doAccept(task(id));ui={};render(true);toast('Работа принята')},
  pay:function(id){doPay(task(id));ui={};render(true);toast('Оплата подтверждена')},
  prop:function(id,x){doAnswer(task(id),x==='1');render(true)},
  star:function(id,x){ui.rating=Number(x);render()},
  support:function(){ui.support=true;render()},
  'support-off':function(){ui.support=false;render()},
  readall:function(){S.notifs.forEach(function(n){if(n.to===meId())n.read=true});render(true)},
  'open-n':function(id){var n=S.notifs.filter(function(n){return n.id===id})[0];if(n){n.read=true;if(n.tid&&task(n.tid))go({n:'task',id:n.tid});else render(true)}},
  /* demo: the other side acts */
  'd-select':function(id){var t=task(id),r=sResp(t);doChoose(t,r);render(true);toast('Заказчик выбрал вас')},
  'd-reject':function(id){var t=task(id),r=sResp(t);r.status='rejected';notify(meId(),'Заказчик отклонил отклик: «'+t.title+'»',t.id);render(true)},
  'd-start':function(id){doStart(task(id),true);render(true);toast('Работа началась')},
  'd-accept':function(id){doAccept(task(id));render(true)},
  'd-revise':function(id){doRevise(task(id),'Добавьте исходники и поправьте отступы по ТЗ, затем отправьте результат повторно.');render(true)},
  'd-scope':function(id){var t=task(id);doPropose(t,Math.round(t.budget*1.2/100)*100,day(Math.max(daysLeft(t.deadline),0)+4));render(true)},
  'd-pay':function(id){doPay(task(id));render(true);toast('Оплата отмечена в демо')},
  'd-submit':function(id){doSubmit(task(id),'https://disk.example/result','Сделано по ТЗ, исходники приложены.');render(true);toast('Студент отправил результат')}
};
var F={
  'f-auth':function(){
    var role=document.querySelector('input[name=role]:checked').value,key=role==='student'?'me_s':'me_c';
    var nm=v('a-name').trim().replace(/\s+/g,' ');if(role==='student'&&nm.split(' ').length<2){toast('Укажите имя и фамилию');return}
    var u=S.users[key]||(S.users[key]=blank(role,key));u.name=nm;
    S.me[role]=key;S.role=role;go({n:'profile',first:true});
  },
  'f-profile':function(){
    var u=U(meId());u.name=v('p-name').trim();u.about=v('p-about').trim();
    if(S.role==='student'){
      u.direction=v('p-dir');u.skills=v('p-skills').split(',').map(function(s){return s.trim()}).filter(Boolean).slice(0,8);
      u.portfolio=[0,1,2].map(function(i){return{title:v('p-pt'+i).trim(),url:v('p-pu'+i).trim()}}).filter(function(p){return p.title});
    }
    var first=S.view.first;save();toast('Профиль сохранён');
    if(first)go(S.role==='student'?{n:'feed'}:{n:'create',id:newDraft()});else render(true);
  },
  'f-task':function(f,e){
    var t=task(f.dataset.tid),act=e.submitter&&e.submitter.dataset.act;readTask(t);
    if(act==='draft'){save();toast('Черновик сохранён');return}
    t.status='moderation';t.reject=null;setTimeout(function(){moderate(t.id)},1500);go({n:'task',id:t.id});toast('Задача отправлена на модерацию');
  },
  'f-resp':function(f){
    if(v('resp-link').trim()&&!validHttp(v('resp-link').trim())){toast('Проверьте ссылку: нужен адрес с https://');return}
    var t=task(f.dataset.tid);t.responses.push({id:uid('r'),studentId:meId(),message:v('resp-msg').trim(),link:v('resp-link').trim(),status:'sent',time:nowT()});
    notify(t.owner,U(meId()).name+' откликнулся на «'+t.title+'»',t.id);ui={};render(true);toast('Отклик отправлен');
  },
  'f-chat':function(f){
    ui.chatExpanded=true;
    var t=task(f.dataset.tid),sid=f.dataset.sid,me=meId(),text=v('chat-in').trim();if(!text)return;
    S.msgs.push({id:uid('m'),tid:t.id,sid:sid,from:me,text:text,time:nowT()});$('chat-in').value='';
    var other=me===t.owner?sid:t.owner;
    if(U(other).seed){setTimeout(function(){
      var R={student:['Да, понимаю. Могу начать сразу после подтверждения.','Уточню пару деталей и вернусь с ответом сегодня.','Хорошо, учту. Успею в срок.'],customer:['Спасибо, всё верно. Материалы лежат по ссылке в задаче.','Дедлайн жёсткий, но детали можем обсудить.','Принято, жду результат.']}[U(other).role];
      var n=S.msgs.filter(function(m){return m.tid===t.id&&m.sid===sid}).length;
      S.msgs.push({id:uid('m'),tid:t.id,sid:sid,from:other,text:R[n%3],time:nowT()});
      if(!(S.view.n==='task'&&S.view.id===t.id))notify(me,U(other).name+' ответил в чате: «'+t.title+'»',t.id);
      render();
    },1200)}
    render();
  },
  'f-submit':function(f){if(!validHttp(v('sub-link').trim())){toast('Добавьте корректную ссылку с https://');return}var t=task(f.dataset.tid);doSubmit(t,v('sub-link').trim(),v('sub-note').trim());ui={};render(true);toast('Результат отправлен на проверку')},
  'f-start':function(f){var t=task(f.dataset.tid);doStart(t,$('st-res').checked);ui={};render(true);toast('Работа началась')},
  'f-rev':function(f){var t=task(f.dataset.tid);doRevise(t,v('rev-note').trim());ui={};render(true);toast('Правки отправлены студенту')},
  'f-scope':function(f){var t=task(f.dataset.tid);doPropose(t,Number(v('sc-b')),v('sc-d'));ui={};render(true);toast('Предложение отправлено студенту')},
  'f-sup':function(f){var t=task(f.dataset.tid);S.tickets.push({id:uid('k'),tid:t.id,from:meId(),text:v('sup-text').trim()});ui={};render(true);toast('Обращение отправлено в поддержку')},
  'f-rate':function(f){
    var t=task(f.dataset.tid),whom=f.dataset.whom,rev={rating:ui.rating||5,text:v('rate-text').trim(),task:t.title};
    if(whom==='student'){rev.from=U(t.owner).name;U(t.chosen).reviews.push(rev);t.studentRated=rev;notify(t.chosen,'Заказчик оставил отзыв о вашей работе: «'+t.title+'»',t.id)}
    else{rev.from=U(t.chosen).name;U(t.owner).reviews.push(rev);t.customerRated=rev;notify(t.owner,'Студент оставил отзыв: «'+t.title+'»',t.id)}
    ui={};render(true);toast('Отзыв опубликован');
  }
};
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-a]');if(!b)return;
  var h=H[b.dataset.a];if(h){e.preventDefault();h(b.dataset.id,b.dataset.x,b)}
});
document.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role=button][data-a]')){e.preventDefault();e.target.click()}
});
document.addEventListener('submit',function(e){
  e.preventDefault();var f=e.target,h=F[f.id];if(h)h(f,e);
});
document.addEventListener('change',function(e){
  if(e.target.name==='role'){var c=e.target.value==='customer';document.body.dataset.role=c?'customer':'student';var l=$('a-lab'),i=$('a-name');if(l)l.textContent=c?'Название компании или заказчика':'Имя и фамилия';if(i){i.placeholder=c?'Кофейня «Зерно»':'Анна Смирнова';i.autocomplete=c?'organization':'name'}}
});
document.addEventListener('input',function(e){
  var el=e.target;
  if(el.dataset&&el.dataset.f){S.filters[el.dataset.f]=el.value;render();return}
  var f=el.form;
  if(f&&f.id==='f-task'){
    var t=task(f.dataset.tid);
    if(t&&t.status==='draft'){readTask(t);save();var s=$('saved');if(s)s.textContent='Черновик сохранён в '+nowT()}
  }
});

render(true);
S.tasks.forEach(function(t){if(t.status==='moderation')setTimeout(function(){moderate(t.id)},800)});
})();
