var ST=["شغالة","في الصيانة","خارج الخدمة"],OS=["صادر","منفذ","ملغي"],FD=["سلفة شخصية","إدارة المشتريات"],RS=["تحت الإصلاح","تم","في انتظار التوريد"];
var E={
v:{t:"السيارات",f:[{k:"cat",l:"الفئة"},{k:"plate",l:"رقم السيارة",r:1},{k:"type",l:"نوع السيارة"},{k:"year",l:"سنة الصنع",t:"number"},{k:"fuel",l:"نوع الوقود"},{k:"rate",l:"المعدل"},{k:"cap",l:"الحمولة (طن)"},{k:"loc",l:"مكان التواجد"},{k:"tech",l:"الصلاحية الفنية"},{k:"meter",l:"حالة العداد",o:["يعمل","لا يعمل","بدون"]},{k:"status",l:"الحالة",o:ST},{k:"lic",l:"انتهاء الترخيص",t:"date"},{k:"notes",l:"ملاحظات",full:1}]},
d:{t:"السائقين",f:[{k:"name",l:"اسم السائق",r:1},{k:"phone",l:"التليفون"},{k:"dlic",l:"انتهاء الرخصة",t:"date"},{k:"kind",l:"نوع التعيين"}]},
c:{t:"العهد",f:[{k:"drv",l:"السائق",ref:"d",r:1},{k:"veh",l:"السيارة",ref:"v",r:1},{k:"val",l:"قيمة العهدة (جنيه)",t:"number"},{k:"notes",l:"ملاحظات",full:1}]},
o:{t:"أوامر الشغل",f:[{k:"no",l:"رقم الأمر"},{k:"date",l:"التاريخ",t:"date",r:1},{k:"from",l:"من الساعة",t:"time",r:1},{k:"to",l:"إلى الساعة",t:"time",r:1},{k:"dest",l:"مكان الرحلة",r:1,full:1},{k:"who",l:"الجهة الطالبة"},{k:"drv",l:"اسم السائق",r:1},{k:"veh",l:"رقم السيارة",r:1},{k:"st",l:"الحالة",o:OS}]},
r:{t:"الإصلاحات",f:[{k:"veh",l:"السيارة",ref:"v",r:1},{k:"date",l:"التاريخ",t:"date",r:1},{k:"desc",l:"وصف العطل / الإصلاح",r:1,full:1},{k:"fund",l:"طريقة التمويل",o:FD,r:1},{k:"ref",l:"صاحب السلفة / رقم طلب الشراء"},{k:"cost",l:"التكلفة (جنيه)",t:"number"},{k:"st",l:"الحالة",o:RS}]}
};
function seed(){if(S.v.length||S.d.length||S.o.length||S.r.length)return false;S.v=SEED.map(function(s,i){return{id:"s"+i,cat:s[0],plate:s[1],type:s[2],year:s[3],fuel:s[4],rate:s[5],meter:s[6],status:"شغالة",lic:""}});return true}
function migrate(){var ch=false;if((S.ver||0)<2){
 SEEDX.v.forEach(function(x,i){var e=S.v.find(function(z){return z.plate==x.plate});
  if(e){Object.keys(x).forEach(function(k){if(k=="plate")return;if(k=="status"){if(!e.status||e.status=="شغالة")e.status=x.status;return}if(x[k]&&!e[k])e[k]=x[k]})}
  else{var o=Object.assign({status:"شغالة",id:"x"+i},x);S.v.push(o)}});
 SEEDX.d.forEach(function(n,i){if(!S.d.some(function(z){return z.name==n}))S.d.push({id:"dx"+i,name:n,phone:"",dlic:"",kind:"مؤقت"})});
 SEEDX.c.forEach(function(c,i){var d=S.d.find(function(z){return z.name==c[0]}),v=S.v.find(function(z){return z.plate==c[1]});
  if(d&&v&&!S.c.some(function(z){return z.drv==d.id&&z.veh==v.id}))S.c.push({id:"cx"+i,drv:d.id,veh:v.id,val:c[2],notes:c[3]})});
 S.ver=2;ch=true}
 if(S.ver<3){S.o.forEach(function(o){var v=S.v.find(function(z){return z.id==o.veh}),d=S.d.find(function(z){return z.id==o.drv});if(v)o.veh=v.plate;if(d)o.drv=d.name});S.ver=3;ch=true}
 return ch}
function prep(){var a=seed(),b=migrate();return a||b}
var S={v:[],d:[],o:[],r:[],c:[],ver:0},tab="home",doc=null,mute=0;
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function lab(e,id){var x=S[e].find(function(a){return a.id==id});return x?(e=="v"?x.plate+(x.type?" – "+x.type:""):x.name):"—"}
function cell(e,f,row){var v=row[f.k];if(f.ref)return esc(lab(f.ref,v));if((f.k=="cost"||f.k=="val")&&v!==""&&v!=null)return Number(v).toLocaleString("ar-EG");if((f.k=="lic"||f.k=="dlic")&&exp(v))return'<span class="bad">'+esc(v)+" ⚠</span>";if(f.k=="notes"||f.k=="desc"||f.k=="dest")return'<span style="white-space:normal;display:inline-block;min-width:150px;max-width:300px">'+esc(v)+"</span>";return esc(v)}
function exp(d){if(!d)return false;return(new Date(d)-new Date())/864e5<30}
var tmr;
function save(){try{localStorage.setItem("fleet",JSON.stringify(S))}catch(x){}
 $("sv").textContent="تم الحفظ";clearTimeout(tmr);
 if(doc){mute++;doc.set({json:JSON.stringify(S)}).catch(function(){}).then(function(){setTimeout(function(){mute--},1500)})}}
function load(o){["v","d","o","r","c"].forEach(function(k){S[k]=Array.isArray(o[k])?o[k]:[]});S.ver=o.ver||0}
try{var l=localStorage.getItem("fleet");if(l)load(JSON.parse(l))}catch(x){}
prep();
if(window.claude&&claude.use){claude.use("db").then(function(db){if(!db)return;doc=db.doc("app/state");
 doc.onSnapshot(function(s){if(mute>0)return;var d=s.exists&&s.data();if(d&&d.json){try{load(JSON.parse(d.json));if(prep())doc.set({json:JSON.stringify(S)}).catch(function(){});render()}catch(x){}}else if(S.v.length){doc.set({json:JSON.stringify(S)}).catch(function(){})}},function(){})}).catch(function(){})}
function nav(){var T=[["home","لوحة التحكم"],["v","السيارات"],["d","السائقين"],["c","العهد"],["o","أوامر الشغل"],["r","الإصلاحات"],["rep","التقارير"]];
 $("nav").innerHTML=T.map(function(t){return'<button class="'+(tab==t[0]?"on":"")+'" onclick="go(\''+t[0]+'\')">'+t[1]+"</button>"}).join("")}
function go(t){tab=t;render()}
function render(){nav();var m=$("m");if(tab=="home")m.innerHTML=home();else if(tab=="rep")m.innerHTML=rep();else m.innerHTML=list(tab)}
function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function home(){var t=today(),n=function(s){return S.v.filter(function(v){return v.status==s}).length};
 var to=S.o.filter(function(o){return o.date==t&&o.st!="ملغي"}),al=[];
 S.v.forEach(function(v){if(exp(v.lic))al.push("ترخيص السيارة "+v.plate+" ينتهي/انتهى: "+v.lic)});
 S.d.forEach(function(d){if(exp(d.dlic))al.push("رخصة السائق "+d.name+" تنتهي/انتهت: "+d.dlic)});
 var op=S.r.filter(function(r){return r.st!="تم"}).length;
 return'<div class="kp"><div><b>'+S.v.length+"</b><span>إجمالي السيارات</span></div><div><b>"+n("شغالة")+"</b><span>شغالة</span></div><div><b>"+n("في الصيانة")+"</b><span>في الصيانة</span></div><div><b>"+n("خارج الخدمة")+"</b><span>خارج الخدمة</span></div><div><b>"+to.length+"</b><span>أوامر شغل اليوم</span></div><div"+(op?' class="w"':"")+"><b>"+op+"</b><span>إصلاحات مفتوحة</span></div></div>"+
 '<div class="cols"><div><h3>أوامر شغل اليوم</h3><div class="tw">'+(to.length?"<table><tr><th>الوقت</th><th>الوجهة</th><th>السائق</th><th>السيارة</th></tr>"+to.map(function(o){return"<tr><td>"+esc(o.from)+"–"+esc(o.to)+"</td><td>"+esc(o.dest)+"</td><td>"+esc(o.drv)+"</td><td>"+esc(o.veh)+"</td></tr>"}).join("")+"</table>":'<div class="empty">مفيش أوامر شغل النهاردة.</div>')+"</div></div>"+
 "<div><h3>تنبيهات التراخيص</h3><div class=\"tw\">"+(al.length?"<table>"+al.map(function(a){return'<tr><td class="bad">'+esc(a)+"</td></tr>"}).join("")+"</table>":'<div class="empty">مفيش تراخيص قربت تنتهي.</div>')+"</div></div></div>"+
 (S.v.length?"":'<p class="empty">ابدأ بإضافة السيارات أو استيرادها من شيت Excel من تبويب «السيارات».</p>')}
function list(e){var c=E[e],f=c.f,rows=S[e].slice();
 if(e=="o"||e=="r")rows.sort(function(a,b){return(b.date||"")>(a.date||"")?1:-1});
 var h='<div class="bar"><h2>'+c.t+" ("+rows.length+')</h2><input id="q" placeholder="بحث..." oninput="flt()" style="max-width:200px">';
 if(e=="v")h+='<label class="b g">استيراد Excel<input type="file" accept=".xlsx,.xls,.csv" onchange="imp(this)" hidden></label>';
 h+='<button class="b g" onclick="csv(\''+e+'\')">تصدير</button><button class="b" onclick="edit(\''+e+'\')">+ إضافة</button></div>';
 if(!rows.length)return h+'<div class="tw"><div class="empty">لسه مفيش بيانات هنا.</div></div>';
 h+='<div class="tw"><table id="tb"><tr>'+f.map(function(x){return"<th>"+x.l+"</th>"}).join("")+"<th></th></tr>";
 rows.forEach(function(r){h+="<tr>"+f.map(function(x){return"<td>"+cell(e,x,r)+"</td>"}).join("")+'<td><button class="b g s" onclick="edit(\''+e+"','"+r.id+'\')">تعديل</button> '+(e=="o"?'<button class="b g s" onclick="pr(\''+r.id+'\')">طباعة</button> ':"")+'<button class="b g s" onclick="del(\''+e+"','"+r.id+'\')">حذف</button></td></tr>'});
 return h+"</table></div>"}
function flt(){var q=$("q").value.trim();document.querySelectorAll("#tb tr").forEach(function(r,i){if(i)r.style.display=r.textContent.indexOf(q)>-1?"":"none"})}
var cur=null;
function edit(e,id){var c=E[e],r=id?S[e].find(function(a){return a.id==id}):{};cur={e:e,id:id};
 if(!id&&e=="o")r={no:S.o.reduce(function(m,x){return Math.max(m,parseInt(x.no)||0)},0)+1,st:"صادر",date:today()};
 $("dt").textContent=(id?"تعديل – ":"إضافة – ")+c.t;
 $("ff").innerHTML=c.f.map(function(f){var v=r[f.k]==null?"":r[f.k],i;
  if(f.o)i="<select id=\"f_"+f.k+"\">"+f.o.map(function(o){return"<option"+(o==v?" selected":"")+">"+o+"</option>"}).join("")+"</select>";
  else if(f.ref)i='<select id="f_'+f.k+'"><option value="">اختر...</option>'+S[f.ref].map(function(o){return'<option value="'+o.id+'"'+(o.id==v?" selected":"")+">"+esc(lab(f.ref,o.id))+"</option>"}).join("")+"</select>";
  else i='<input id="f_'+f.k+'" type="'+(f.t||"text")+'" value="'+esc(v)+'">';
  return'<div class="'+(f.full?"full":"")+'"><label>'+f.l+(f.r?" *":"")+"</label>"+i+"</div>"}).join("");
 $("er").textContent="";if(e=="o"){var od=id?r.date:"";$("f_date").min=(od&&od<today())?od:today()}$("dl").showModal()}
$("no").onclick=function(){$("dl").close()};
$("ok").onclick=function(){var e=cur.e,c=E[e],o={};
 for(var i=0;i<c.f.length;i++){var f=c.f[i];o[f.k]=$("f_"+f.k).value.trim();if(f.r&&!o[f.k]){$("er").textContent="املأ الحقل: "+f.l;return}}
 if(e=="o"){var old=cur.id?S.o.find(function(a){return a.id==cur.id}):null;
  if(o.date<today()&&(!old||old.date!=o.date)){$("er").textContent="مينفعش تسجل أمر شغل بتاريخ قديم. التاريخ لازم يكون النهاردة أو بعده.";return}
  var nz=function(s){return String(s||"").replace(/\s+/g," ").trim()};o.drv=nz(o.drv);o.veh=nz(o.veh);var vv=S.v.find(function(a){return nz(a.plate)==o.veh}),dd=S.d.find(function(a){return nz(a.name)==o.drv});
  if(o.st!="ملغي"&&vv&&vv.status!="شغالة"&&(!old||old.veh!=o.veh)){$("er").textContent="السيارة دي حالتها «"+vv.status+"» ومينفعش يتصدر عليها أمر شغل.";return}
  if(o.st!="ملغي"&&((dd&&dd.dlic&&dd.dlic<o.date)||(vv&&vv.lic&&vv.lic<o.date))&&!confirm("تنبيه: رخصة السائق أو ترخيص السيارة منتهي في تاريخ الأمر. تكمل؟"))return;
  if(o.from>=o.to){$("er").textContent="وقت النهاية لازم يكون بعد وقت البداية.";return}
  if(o.st!="ملغي"){var cf=S.o.find(function(x){return x.id!=cur.id&&x.st!="ملغي"&&x.date==o.date&&(x.veh==o.veh||x.drv==o.drv)&&x.from<o.to&&o.from<x.to});
   if(cf){$("er").textContent="تعارض: "+(cf.veh==o.veh?"السيارة":"السائق")+" مشغول في أمر الشغل رقم "+cf.no+" ("+cf.from+"–"+cf.to+").";return}}}
 if(e=="v"&&S.v.some(function(x){return x.id!=cur.id&&x.plate==o.plate})){$("er").textContent="رقم السيارة ده موجود قبل كده.";return}
 if(cur.id){Object.assign(S[e].find(function(a){return a.id==cur.id}),o)}else{o.id=Date.now().toString(36)+Math.random().toString(36).slice(2,5);S[e].push(o)}
 save();$("dl").close();render()};
var REFS={v:[["r","veh","إصلاح"],["c","veh","عهدة"]],d:[["c","drv","عهدة"]]};
function del(e,id){var u=(REFS[e]||[]).map(function(r){var n=S[r[0]].filter(function(x){return x[r[1]]==id}).length;return n?n+" "+r[2]:""}).filter(Boolean);
 if(u.length){alert("مينفعش تحذف السجل ده لأنه مرتبط بـ: "+u.join("، ")+".\nاحذف أو عدّل السجلات المرتبطة الأول.");return}
 if(!confirm("متأكد من الحذف؟"))return;S[e]=S[e].filter(function(a){return a.id!=id});save();render()}
function pr(id){var o=S.o.find(function(a){return a.id==id});if(!o)return;
 var rows=[["رقم الأمر",o.no],["التاريخ",o.date],["الوقت","من "+o.from+" إلى "+o.to],["مكان الرحلة",o.dest],["الجهة الطالبة",o.who],["اسم السائق",o.drv],["رقم السيارة",o.veh]];
 $("pa").innerHTML='<h2>جامعة – الحملة الميكانيكية<br>أمر شغل</h2><table style="width:100%;min-width:0">'+rows.map(function(r){return"<tr><td style=\"width:30%\"><b>"+r[0]+"</b></td><td>"+esc(r[1])+"</td></tr>"}).join("")+'</table><p style="margin-top:60px;display:flex;justify-content:space-between"><span>توقيع مدير الحملة: ........</span><span>توقيع السائق: ........</span></p>';
 window.print()}
function imp(inp){var f=inp.files[0];if(!f)return;var rd=new FileReader();
 rd.onload=function(ev){try{var wb=XLSX.read(ev.target.result,{type:"array",cellDates:true}),rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:""}),cat="",M=null,a=0,u=0;
  var dv=function(v){if(v instanceof Date)return v.toISOString().slice(0,10);return String(v==null?"":v).replace(/\s+/g," ").trim()};
  var RX={plate:/رقم/,type:/نوع\s*السيارة|^نوع$/,year:/سنة|موديل/,fuel:/وقود/,rate:/معدل/,meter:/عداد/,lic:/ترخيص/};
  rows.forEach(function(r){var c0=dv(r[0]),rest=r.slice(1).some(function(x){return dv(x)});
   if(r.some(function(x){return RX.plate.test(dv(x))})&&r.some(function(x){return /نوع/.test(dv(x))})){M={};Object.keys(RX).forEach(function(k){var i=r.findIndex(function(x){return RX[k].test(dv(x))});if(i>-1)M[k]=i});return}
   if(c0&&!rest&&!/بيان|بيـ/.test(c0)){cat=c0.replace(/^(اولا|ثانيا|ثالثا|ثالثاً|رابعا)ً?\s*/,"");return}
   if(!M||M.plate==null)return;var p=dv(r[M.plate]);if(!p)return;
   var o={cat:cat,plate:p,type:dv(r[M.type]),year:dv(r[M.year]),fuel:dv(r[M.fuel]),rate:dv(r[M.rate]),meter:dv(r[M.meter]),lic:M.lic!=null?dv(r[M.lic]):""},x=S.v.find(function(z){return z.plate==p});
   if(x){Object.assign(x,o);u++}else{o.status="شغالة";o.id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);S.v.push(o);a++}});
  save();render();alert("تم الاستيراد: "+a+" سيارة جديدة، "+u+" تم تحديثها.")}
 catch(x){alert("مقدرتش أقرأ الملف. اتأكد إنه Excel أو CSV.")}inp.value=""};rd.readAsArrayBuffer(f)}
function dl(name,txt){var b="\ufeff"+txt;
 function fb(){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([b],{type:"text/csv;charset=utf-8"}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
 if(window.claude&&claude.use)claude.use("downloads").then(function(d){if(d)d.save({filename:name,data:b}).catch(function(){});else fb()},fb);else fb()}
function csv(e){var f=E[e].f,q=function(s){return'"'+String(s==null?"":s).replace(/"/g,'""')+'"'};
 dl(e+".csv",[f.map(function(x){return q(x.l)}).join(",")].concat(S[e].map(function(r){return f.map(function(x){return q(x.ref?lab(x.ref,r[x.k]):r[x.k])}).join(",")})).join("\n"))}
var ry=null,MN=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
function yr(d){return String(d||"").slice(0,4)}
function setYear(y){ry=y;render()}
function rep(){var cy=String(new Date().getFullYear()),ys={};ys[cy]=1;
 S.o.concat(S.r).forEach(function(x){var y=yr(x.date);if(/^\d{4}$/.test(y))ys[y]=1});
 var Y=Object.keys(ys).sort().reverse();if(!ry||!ys[ry])ry=cy;
 var O=S.o.filter(function(o){return yr(o.date)==ry}),R=S.r.filter(function(r){return yr(r.date)==ry}),by={},fd={},dr={},vt={},tot=0,mo=[],i;
 for(i=0;i<12;i++)mo.push({t:0,c:0,n:0});
 R.forEach(function(r){var c=Number(r.cost)||0,m=parseInt(String(r.date).slice(5,7))-1;tot+=c;by[r.veh]=(by[r.veh]||0)+c;fd[r.fund]=(fd[r.fund]||0)+c;if(mo[m]){mo[m].c+=c;mo[m].n++}});
 var trips=0;O.forEach(function(o){if(o.st=="ملغي")return;trips++;dr[o.drv]=(dr[o.drv]||0)+1;vt[o.veh]=(vt[o.veh]||0)+1;var m=parseInt(String(o.date).slice(5,7))-1;if(mo[m])mo[m].t++});
 var nf=function(x){return x.toLocaleString("ar-EG")};
 var t=function(h,o,fn,u){var k=Object.keys(o).sort(function(a,b){return o[b]-o[a]});return'<div><h3>'+h+'</h3><div class="tw">'+(k.length?"<table>"+k.map(function(i){return"<tr><td>"+esc(fn(i))+"</td><td>"+nf(o[i])+" "+u+"</td></tr>"}).join("")+"</table>":'<div class="empty">مفيش بيانات في سنة '+ry+'.</div>')+"</div></div>"};
 var chips=Y.map(function(y){return'<button class="b'+(y==ry?"":" g")+'" onclick="setYear(\''+y+'\')">'+y+"</button>"}).join(" ");
 var all=Y.map(function(y){var oo=S.o.filter(function(o){return yr(o.date)==y&&o.st!="ملغي"}).length,rr=S.r.filter(function(r){return yr(r.date)==y}),cc=rr.reduce(function(s,r){return s+(Number(r.cost)||0)},0);return"<tr><td>"+y+"</td><td>"+oo+"</td><td>"+rr.length+"</td><td>"+nf(cc)+"</td></tr>"}).join("");
 var mt=mo.map(function(m,i){return"<tr><td>"+MN[i]+"</td><td>"+m.t+"</td><td>"+m.n+"</td><td>"+nf(m.c)+"</td></tr>"}).join("");
 return'<div class="bar"><h2>التقارير</h2>'+chips+'</div><div class="kp"><div><b>'+ry+"</b><span>السنة المعروضة</span></div><div><b>"+trips+"</b><span>رحلات منفذة أو صادرة</span></div><div><b>"+R.length+"</b><span>عدد الإصلاحات</span></div><div><b>"+nf(tot)+"</b><span>مصروفات الإصلاح (جنيه)</span></div></div><div class=\"cols\">"+
 t("مصروفات الإصلاح لكل سيارة",by,function(i){return lab("v",i)},"جنيه")+t("مصروفات حسب التمويل",fd,function(i){return i||"—"},"جنيه")+t("عدد الرحلات لكل سائق",dr,function(i){return i||"—"},"رحلة")+t("عدد الرحلات لكل سيارة",vt,function(i){return i||"—"},"رحلة")+"</div>"+
 '<h3 style="margin-top:18px">تفصيل شهور '+ry+'</h3><div class="tw"><table><tr><th>الشهر</th><th>الرحلات</th><th>عدد الإصلاحات</th><th>مصروفات الإصلاح (جنيه)</th></tr>'+mt+"</table></div>"+
 '<h3 style="margin-top:18px">ملخص كل السنين</h3><div class="tw"><table><tr><th>السنة</th><th>الرحلات</th><th>عدد الإصلاحات</th><th>مصروفات الإصلاح (جنيه)</th></tr>'+all+"</table></div>"}
render();
