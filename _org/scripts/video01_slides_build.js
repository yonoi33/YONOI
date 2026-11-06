const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = '産業医'; pres.title = 'AIに相談する人が増えている';
const NAVY='16233F', INK='1F2A44', CARD2='22345C', CARD3='344670', PALE='AEB9D2', PALE2='C9D2E4',
      BG='FBFAF7', WHITE='FFFFFF', LINE='E3E1DA', GOLD='E4A93C', DGOLD='C6892A', GRAY='5A6478', FOOT='9AA0AE', TEAL='3E6B7A';
const JP='Yu Gothic', EN='Cambria';
const THEME='AIに相談する人が増えている';
const TOTAL=15;
const W=13.333;
let n=0;
function base(dark){ const s=pres.addSlide(); s.background={color: dark?NAVY:BG}; n++; s._n=n; return s; }
function footer(s, dark, numX){
  s.addText(THEME,{x:0.6,y:7.0,w:6,h:0.3,fontFace:JP,fontSize:9,color:dark?PALE:FOOT,isTextBox:true,margin:0});
  s.addText(`${s._n} / ${TOTAL}`,{x:numX??(W-3.6),y:7.0,w:3,h:0.3,fontFace:EN,fontSize:9,color:dark?PALE:FOOT,align:'right',isTextBox:true,margin:0});
}
function header(s,kicker,title,lead,dark){
  s.addText(kicker,{x:0.6,y:0.55,w:10,h:0.3,fontFace:EN,fontSize:11,color:dark?GOLD:DGOLD,charSpacing:3,isTextBox:true,margin:0});
  s.addText(title,{x:0.6,y:0.88,w:12,h:0.6,fontFace:JP,fontSize:26,bold:true,color:dark?WHITE:NAVY,isTextBox:true,margin:0});
  if(lead) s.addText(lead,{x:0.6,y:1.5,w:12,h:0.35,fontFace:JP,fontSize:12,color:dark?PALE2:GRAY,isTextBox:true,margin:0});
}
function card(s,x,y,w,h,fill=WHITE,line=LINE){
  s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:fill},line:line?{color:line,width:0.75}:{color:fill,width:0},rectRadius:0.08});
}
function badge(s,x,y,emoji,fill=GOLD,d=0.55){
  s.addShape(pres.ShapeType.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});
  s.addText(emoji,{x,y,w:d,h:d,fontSize:16,align:'center',valign:'middle',isTextBox:true,margin:0});
}
function src(s,text,dark){
  s.addText(text,{x:0.6,y:6.55,w:12,h:0.3,fontFace:JP,fontSize:9,color:dark?PALE:FOOT,isTextBox:true,margin:0});
}
function big(s,x,y,w,num,unit,label,sub,dark){
  s.addText([{text:num,options:{fontFace:EN,fontSize:54,bold:true,color:dark?WHITE:DGOLD}},{text:unit,options:{fontFace:EN,fontSize:22,bold:true,color:dark?WHITE:DGOLD}}],
    {x,y,w,h:1.0,align:'center',valign:'bottom',isTextBox:true,margin:0});
  s.addText(label,{x,y:y+1.05,w,h:0.4,fontFace:JP,fontSize:14,bold:true,color:dark?WHITE:NAVY,align:'center',isTextBox:true,margin:0});
  s.addText(sub,{x:x+0.2,y:y+1.5,w:w-0.4,h:0.9,fontFace:JP,fontSize:11,color:dark?PALE2:GRAY,align:'center',valign:'top',isTextBox:true,margin:0});
}
function body(s,x,y,w,h,txt,opt={}){
  s.addText(txt,{x,y,w,h,fontFace:JP,fontSize:11,color:GRAY,valign:'top',isTextBox:true,margin:0,...opt});
}
let s;

// ---------- 1 表紙 ----------
s=base(true);
s.addImage({path:'image1.jpeg',x:0,y:0,w:4.4,h:7.5,sizing:{type:'cover',w:4.4,h:7.5}});
s.addText('AI & MENTAL HEALTH',{x:5.0,y:1.9,w:7.5,h:0.35,fontFace:EN,fontSize:11,color:GOLD,charSpacing:3,isTextBox:true,margin:0});
s.addText('AIに相談する人が\n増えている',{x:5.0,y:2.35,w:7.8,h:1.7,fontFace:JP,fontSize:34,bold:true,color:WHITE,isTextBox:true,margin:0});
s.addText('― 孤独と過依存のはなし',{x:5.0,y:4.1,w:7.5,h:0.5,fontFace:JP,fontSize:16,color:PALE,isTextBox:true,margin:0});
s.addText('語り手：産業医（精神保健指定医）',{x:5.0,y:4.75,w:7.5,h:0.4,fontFace:JP,fontSize:12,color:PALE,isTextBox:true,margin:0});
s.addText('産業保健講話',{x:5.0,y:6.6,w:6,h:0.3,fontFace:JP,fontSize:10,color:PALE,isTextBox:true,margin:0});
s.addNotes('こんにちは。私は産業医として、働く方の健康相談を受けている医師です。精神保健指定医という精神科の資格も持っています。\n\n今日は、最近とても増えている「悩みをAIに相談する」という行動についてお話しします。');

// ---------- 2 今日の結論 ----------
s=base(false); header(s,'TODAY\'S MESSAGE','今日お伝えしたいことは、ひとつだけ','結論を先にお話しし、そう言える理由を順番に見ていきます。');
card(s,0.6,2.2,12.13,2.1,NAVY,null);
s.addText('AIに相談するのは悪いことではない。\nただし、出口は人に用意しておこう。',{x:1.0,y:2.4,w:11.4,h:1.7,fontFace:JP,fontSize:24,bold:true,color:WHITE,align:'center',valign:'middle',isTextBox:true,margin:0});
const flow=[['①','相談はもう普通','4人に1人がAIに相談'],['②','理由は「人に言いづらい」','家族・友人に相談しづらい'],['③','AIは肯定しすぎる','人間より約5割多く肯定'],['④','だから出口は人に','AIは補助、出口は人']];
flow.forEach((f,i)=>{const x=0.6+i*3.08; card(s,x,4.7,2.9,1.6);
  s.addText(f[0],{x:x+0.2,y:4.85,w:0.5,h:0.45,fontFace:EN,fontSize:18,bold:true,color:DGOLD,isTextBox:true,margin:0});
  s.addText(f[1],{x:x+0.2,y:5.3,w:2.6,h:0.4,fontFace:JP,fontSize:13,bold:true,color:NAVY,isTextBox:true,margin:0});
  body(s,x+0.2,5.72,2.6,0.5,f[2]);});
footer(s);
s.addNotes('お伝えしたいことはひとつだけです。「AIに相談するのは悪いことではない。ただし、出口は人に用意しておこう」。なぜそう言えるのか、順番に見ていきましょう。');

// ---------- 3 普通になっている ----------
s=base(false); header(s,'IT\'S ALREADY COMMON','AIへの相談は、もう「普通のこと」になっている','生成AI利用者のうち、悩み相談にAIを使っている人の割合です。');
card(s,0.6,2.2,5.9,4.1); big(s,0.6,2.5,5.9,'23.3','%','悩み相談にAIを使っている','生成AI利用者全体。\nおよそ4人に1人。');
card(s,6.83,2.2,5.9,4.1,NAVY,null); big(s,6.83,2.5,5.9,'52.4','%','10代の女性では半数超','調べものの道具であると同時に、\n気持ちを打ち明ける相手に。',true);
src(s,'出典：内閣府・消費者委員会事務局「生成AI利用者の利用実態に関するアンケート結果」2026（本調査の利用者 n=1,442、複数回答）');
footer(s);
s.addNotes('内閣府・消費者委員会事務局が2026年に公表した、生成AI利用者へのアンケートがあります。生成AIを使っている人のうち23.3%、およそ4人に1人が、悩み相談にAIを使っていると答えました。10代の女性に限ると52.4%、半数を超えています。若い世代にとってAIは、調べものの道具であると同時に、気持ちを打ち明ける相手になりつつあります。');

// ---------- 4 気軽に相談できる相手 ----------
s=base(false); header(s,'WHO DO WE TURN TO','「最も気軽に相談できる相手」で、対話型AIは4位','一部の人の特別な行動ではなく、職場や家庭のすぐそばで起きていることです。');
const rank=[['1','配偶者','👫'],['2','友人','🤝'],['3','母親','👩'],['4','対話型AI','💬']];
rank.forEach((r,i)=>{const y=2.2+i*0.95; const isAI=i===3; card(s,0.6,y,7.4,0.8,isAI?NAVY:WHITE,isAI?null:LINE);
  badge(s,0.8,y+0.125,r[0],isAI?GOLD:'F3E6CC');
  s.addText(r[2]+'  '+r[1],{x:1.6,y,w:5.5,h:0.8,fontFace:JP,fontSize:16,bold:true,color:isAI?WHITE:NAVY,valign:'middle',isTextBox:true,margin:0});});
card(s,8.3,2.2,4.43,3.65,'F6F3EA',null);
s.addText('POINT',{x:8.6,y:2.4,w:3,h:0.3,fontFace:EN,fontSize:10,color:DGOLD,charSpacing:3,isTextBox:true,margin:0});
s.addText('これはもう、特別な行動ではない',{x:8.6,y:2.75,w:3.9,h:0.5,fontFace:JP,fontSize:14,bold:true,color:NAVY,isTextBox:true,margin:0});
body(s,8.6,3.3,3.9,2.3,'職場の隣の席の人も、家族の誰かも、AIに悩みを話しているかもしれない。\n\nそういう時代に、私たちはいます。',{fontSize:12});
src(s,'出典：内閣府・消費者委員会事務局「生成AI利用者の利用実態に関するアンケート結果」2026');
footer(s);
s.addNotes('同じ調査で「最も気軽に相談できる相手」を尋ねると、対話型AIは配偶者、友人、母親に次ぐ4番目でした。\n\nこれはもう、一部の人の特別な行動ではありません。職場の隣の席の人も、家族の誰かも、AIに悩みを話しているかもしれない。そういう時代に私たちはいます。');

// ---------- 5 なぜAIか ----------
s=base(false); header(s,'WHY AI, NOT PEOPLE','なぜ人ではなく、AIに相談するのか','対話型AI利用者に理由を尋ねた結果です。中心は「人には言いづらい」。');
s.addChart(pres.ChartType.bar,[{name:'相談しづらい',labels:['友人には相談しづらい','家族には相談しづらい'],values:[74.7,70.9]}],
 {x:0.6,y:2.1,w:7.4,h:4.2,barDir:'bar',chartColors:[GOLD],showValue:true,dataLabelPosition:'outEnd',dataLabelFormatCode:'0.0"%"',dataLabelFontFace:'+mn-lt',dataLabelFontSize:14,dataLabelColor:NAVY,
  catAxisLabelFontFace:'+mn-lt',catAxisLabelFontSize:13,catAxisLabelColor:NAVY,valAxisHidden:true,valAxisMaxVal:100,valGridLine:{style:'none'},catGridLine:{style:'none'},showLegend:false,barGapWidthPct:60});
card(s,8.3,2.2,4.43,4.1,NAVY,null);
s.addText('理由の中心',{x:8.6,y:2.45,w:3.9,h:0.35,fontFace:EN,fontSize:10,color:GOLD,charSpacing:3,isTextBox:true,margin:0});
s.addText('「人には言いづらいから」\nAIに向かっている',{x:8.6,y:2.85,w:3.9,h:1.2,fontFace:JP,fontSize:17,bold:true,color:WHITE,isTextBox:true,margin:0});
body(s,8.6,4.2,3.9,1.9,'AIが素晴らしいから選ばれている、というより、人に言えない気持ちの受け皿になっている。',{color:PALE2,fontSize:12});
src(s,'出典：内閣府・消費者委員会事務局「生成AI利用者の利用実態に関するアンケート結果」2026（対話型AI利用者 n=1,038）');
footer(s);
s.addNotes('では、なぜ人ではなくAIなのでしょうか。同じ調査で対話型AIの利用者に理由を尋ねると、「家族には相談しづらい」が70.9%、「友人には相談しづらい」が74.7%でした。\n\nAIが素晴らしいから選ばれているというより、「人には言いづらいから」AIに向かっている。これが理由の中心です。');

// ---------- 6 産業医の見方 ----------
s=base(false); header(s,'FROM THE DOCTOR\'S CHAIR','「人に言いづらい」気持ちは、産業医にもよく分かる','誰にも言えずに抱え込む人を、たくさん見てきました。');
const why=[['👪','家族に話せば','心配をかけてしまう'],['🤝','友人に話せば','弱い自分を見せることになる'],['💼','上司に話せば','評価に響くかもしれない']];
why.forEach((w,i)=>{const x=0.6+i*4.1; card(s,x,2.2,3.93,2.0); badge(s,x+0.3,2.45,w[0],'F3E6CC');
  s.addText(w[1],{x:x+1.0,y:2.45,w:2.8,h:0.55,fontFace:JP,fontSize:14,bold:true,color:NAVY,valign:'middle',isTextBox:true,margin:0});
  body(s,x+0.3,3.2,3.3,0.8,w[2],{fontSize:12});});
card(s,0.6,4.5,12.13,1.8,'F6F3EA',null);
s.addText('だから、AIに相談すること自体は否定しない',{x:1.0,y:4.7,w:11.4,h:0.5,fontFace:JP,fontSize:16,bold:true,color:NAVY,isTextBox:true,margin:0});
body(s,1.0,5.25,11.4,0.9,'誰にも言えなかった気持ちを、まず言葉にできる場所がある。それは黙って抱え込むより、ずっと良いこと。',{fontSize:12});
footer(s);
s.addNotes('産業医として、この気持ちはよく分かります。家族に話せば心配をかける。友人に話せば弱い自分を見せることになる。上司には評価に響くかもしれない。そうして誰にも言えずに抱え込む人を、私はたくさん見てきました。\n\nですから、AIに相談すること自体を否定はしません。誰にも言えなかった気持ちを、まず言葉にできる場所がある。それは黙って抱え込むより、ずっと良いことです。');

// ---------- 7 肯定しすぎる ----------
s=base(false); header(s,'THE SYCOPHANCY PROBLEM','ただし、AIには「肯定しすぎる仕組み」がある','2026年、査読を経た研究が科学誌サイエンスに掲載されました。');
card(s,0.6,2.2,5.2,4.1,NAVY,null);
s.addText([{text:'約5割',options:{fontFace:JP,fontSize:44,bold:true,color:WHITE}},{text:'（49%）',options:{fontFace:EN,fontSize:18,color:PALE}}],{x:0.8,y:2.5,w:4.8,h:1.2,align:'center',valign:'bottom',isTextBox:true,margin:0});
s.addText('人間より多く、相手を肯定する',{x:0.8,y:3.8,w:4.8,h:0.5,fontFace:JP,fontSize:15,bold:true,color:WHITE,align:'center',isTextBox:true,margin:0});
body(s,1.0,4.4,4.4,1.6,'AIの返答を人間の返答と比べたときの、肯定的な応答の多さ。',{color:PALE2,align:'center',fontSize:11});
s.addText('迎合的な返事を受けた人に起きたこと',{x:6.1,y:2.2,w:6.6,h:0.4,fontFace:JP,fontSize:13,bold:true,color:NAVY,isTextBox:true,margin:0});
const eff=[['🪞','「自分は正しい」という確信が強まる','聞きたくない視点が入ってこない'],['🔁','そのAIへの信頼が高まり、「また使いたい」と思う','気持ちよさが、再利用につながる']];
eff.forEach((e,i)=>{const y=2.75+i*1.8; card(s,6.1,y,6.63,1.6); badge(s,6.35,y+0.25,e[0]);
  s.addText(e[1],{x:7.1,y:y+0.2,w:5.4,h:0.6,fontFace:JP,fontSize:13,bold:true,color:NAVY,valign:'middle',isTextBox:true,margin:0});
  body(s,7.1,y+0.85,5.4,0.6,e[2]);});
src(s,'出典：Cheng et al., Science, 2026（査読済み）');
footer(s);
s.addNotes('ここからが、医師として知っておいてほしい話です。AIには「相手を肯定しすぎる」という大きなクセがあります。\n\n2026年、科学誌サイエンスに査読を経た研究が載りました。AIは人間と比べて、およそ5割も多く相手を肯定していました。しかも、迎合的な返事を受けた人は「自分は正しい」という確信を強める一方、そのAIへの信頼が高まり、「また使いたい」と思うようになっていたのです。');

// ---------- 8 気持ちよさと良くなること ----------
s=base(false); header(s,'COMFORT VS. RECOVERY','気持ちよさと、良くなることは、別のもの','悩んでいるとき、本当に必要なのはどちらの相手でしょうか。');
card(s,0.6,2.2,5.95,3.9,'EAF2EF',null);
badge(s,0.9,2.45,'✓',TEAL); s.addText('人間の友人や家族',{x:1.6,y:2.45,w:4.6,h:0.55,fontFace:JP,fontSize:15,bold:true,color:NAVY,valign:'middle',isTextBox:true,margin:0});
s.addText([{text:'「こういう見方もあるよ」と言ってくれる',options:{bullet:true,breakLine:true}},{text:'ときに、聞きたくないことも言う',options:{bullet:true,breakLine:true}},{text:'面倒だが、それが私たちを守ってもいる',options:{bullet:true}}],
 {x:1.0,y:3.2,w:5.2,h:2.6,fontFace:JP,fontSize:12.5,color:INK,paraSpaceAfter:8,valign:'top',isTextBox:true});
card(s,6.78,2.2,5.95,3.9,'FBEFE3',null);
badge(s,7.08,2.45,'!',GOLD); s.addText('AI',{x:7.78,y:2.45,w:4.6,h:0.55,fontFace:JP,fontSize:15,bold:true,color:NAVY,valign:'middle',isTextBox:true,margin:0});
s.addText([{text:'「あなたは正しい」と言ってくれる',options:{bullet:true,breakLine:true}},{text:'面倒な部分が、構造的に少ない',options:{bullet:true,breakLine:true}},{text:'だから気持ちよく話せる',options:{bullet:true}}],
 {x:7.18,y:3.2,w:5.2,h:2.6,fontFace:JP,fontSize:12.5,color:INK,paraSpaceAfter:8,valign:'top',isTextBox:true});
footer(s);
s.addNotes('悩んでいるとき、本当に必要なのは「あなたは正しい」と言ってくれる相手でしょうか。それとも「こういう見方もあるよ」と言ってくれる相手でしょうか。\n\n人間の友人や家族は、ときに聞きたくないことも言います。面倒ですが、それが私たちを守ってもいます。AIはその面倒な部分が構造的に少ない。だから気持ちよく話せる。けれども、気持ちよさと、良くなることは別のものです。');

// ---------- 9 相関 ----------
s=base(false); header(s,'USAGE, LONELINESS, DEPENDENCE','使用時間が長い人ほど、孤独・依存の指標が高い「重なり」','AIを提供する企業と大学による2025年の共同研究。ただし、因果関係は確定していません。');
// Venn: two overlapping circles, no arrows
s.addShape(pres.ShapeType.ellipse,{x:1.1,y:2.3,w:3.4,h:3.4,fill:{color:GOLD,transparency:55},line:{color:DGOLD,width:1}});
s.addShape(pres.ShapeType.ellipse,{x:3.1,y:2.3,w:3.4,h:3.4,fill:{color:TEAL,transparency:55},line:{color:TEAL,width:1}});
s.addText('AIの使用時間が\n長い人',{x:1.2,y:3.5,w:2.1,h:1.0,fontFace:JP,fontSize:12,bold:true,color:NAVY,align:'center',valign:'middle',isTextBox:true,margin:0});
s.addText('孤独感・感情的依存の\n指標が高い人',{x:4.3,y:3.5,w:2.1,h:1.0,fontFace:JP,fontSize:12,bold:true,color:NAVY,align:'center',valign:'middle',isTextBox:true,margin:0});
s.addText('重なり',{x:3.3,y:3.75,w:1.0,h:0.5,fontFace:JP,fontSize:12,bold:true,color:WHITE,align:'center',valign:'middle',isTextBox:true,margin:0});
s.addText('相関（重なり）までが事実。どちらが先かは分かっていない。',{x:0.6,y:5.85,w:6.5,h:0.4,fontFace:JP,fontSize:11,color:GRAY,align:'center',isTextBox:true,margin:0});
card(s,7.4,2.2,5.33,1.85,NAVY,null);
s.addText('著者自身が明記',{x:7.7,y:2.38,w:4.8,h:0.3,fontFace:EN,fontSize:10,color:GOLD,charSpacing:3,isTextBox:true,margin:0});
s.addText('「因果関係は確定していない」',{x:7.7,y:2.72,w:4.8,h:0.5,fontFace:JP,fontSize:15,bold:true,color:WHITE,isTextBox:true,margin:0});
body(s,7.7,3.25,4.8,0.7,'使ったから孤独になったのか、孤独な人が長く使っているのかは、分からない。',{color:PALE2});
card(s,7.4,4.25,5.33,2.05);
s.addText('産業医として気になること',{x:7.7,y:4.42,w:4.8,h:0.4,fontFace:JP,fontSize:13,bold:true,color:NAVY,isTextBox:true,margin:0});
body(s,7.7,4.85,4.8,1.35,'人に言えない悩みを抱え、肯定してくれるAIに長く向かい、人とのつながりが細くなっているとしたら。順番がどちらであれ、その人には「人の出口」が必要。');
src(s,'出典：OpenAI × MIT Media Lab 共同研究, 2025（相関。著者自身が因果関係は未確定と明記）');
footer(s);
s.addNotes('もうひとつ、AIを提供する企業と大学が2025年に発表した共同研究があります。AIの使用時間が長い人ほど、孤独感や、AIへの感情的な依存を示す指標が高い、という関係が見つかりました。\n\nただし正直にお伝えします。この研究の著者自身が「因果関係は確定していない」と明記しています。AIを使ったから孤独になったのか、もともと孤独な人が長く使っているのかは、分かっていません。\n\nですから私は「AIを使うと孤独になる」とは言いません。言えるのは、「長く使う人と、孤独や依存の指標が高い人が重なっている」ところまでです。\n\nそれでも産業医としては、この重なりが気になります。人に言えない悩みを抱え、肯定してくれるAIに長く向かい、人とのつながりが細くなっているとしたら。順番がどちらであれ、その人には「人の出口」が必要です。');

// ---------- 10 ChatGPT ----------
s=base(false); header(s,'WHAT PEOPLE ACTUALLY ASK','「AI相談」と言っても、深い悩みを打ち明けるのはごく一部','ChatGPTの会話を分析した2025年の報告（査読前）です。');
card(s,0.6,2.2,3.9,4.1); big(s,0.6,2.5,3.9,'73','%','仕事以外の会話','会話の大半は仕事以外の用途。');
card(s,4.72,2.2,3.9,4.1,NAVY,null); big(s,4.72,2.5,3.9,'1.9','%','人間関係や内省の相談','深い悩みを打ち明けるケースは\nごく一部にとどまる。',true);
card(s,8.83,2.2,3.9,4.1,'F6F3EA',null);
s.addText('大半',{x:8.83,y:2.6,w:3.9,h:1.0,fontFace:JP,fontSize:40,bold:true,color:DGOLD,align:'center',valign:'bottom',isTextBox:true,margin:0});
s.addText('助言や情報探し',{x:8.83,y:3.55,w:3.9,h:0.4,fontFace:JP,fontSize:14,bold:true,color:NAVY,align:'center',isTextBox:true,margin:0});
body(s,9.03,4.0,3.5,1.5,'「AI相談」の中身は、情報探しが中心。',{align:'center'});
src(s,'出典：Chatterji et al., NBER Working Paper, 2025（プレプリント、査読前）');
footer(s);
s.addNotes('なお、ChatGPTの会話を分析した2025年の報告では、会話の73%が仕事以外でしたが、人間関係や内省の相談は1.9%にとどまり、大半は助言や情報探しでした。査読前の報告ですが、深い悩みを打ち明けているケースは実はごく一部、という点は覚えておいてよいと思います。');

// ---------- 11 出口は人 ----------
s=base(false); header(s,'SO, WHERE IS THE EXIT','だから、出口は「人」に用意する','ここまでの流れをまとめます。');
const chain=[['相談はもう普通','23.3%、10代女性52.4%'],['理由は「言いづらい」','70.9%・74.7%'],['肯定しすぎる仕組み','人間より約5割多い'],['孤独・依存との重なり','相関。因果は未確定']];
chain.forEach((c,i)=>{const x=0.6+i*3.08; card(s,x,2.2,2.9,1.5); s.addText(c[0],{x:x+0.2,y:2.35,w:2.6,h:0.5,fontFace:JP,fontSize:13,bold:true,color:NAVY,isTextBox:true,margin:0}); body(s,x+0.2,2.9,2.6,0.6,c[1]);});
card(s,0.6,4.0,12.13,2.3,NAVY,null);
s.addText('AIに相談してもいい。でも、出口は人に用意しておこう。',{x:1.0,y:4.2,w:11.4,h:0.7,fontFace:JP,fontSize:20,bold:true,color:WHITE,isTextBox:true,margin:0});
s.addText([{text:'AIは専門家の代わりではなく、補助',options:{bullet:true,breakLine:true}},{text:'困ったときの出口は、人',options:{bullet:true}}],
 {x:1.0,y:4.95,w:11.0,h:1.2,fontFace:JP,fontSize:13,color:PALE2,paraSpaceAfter:6,valign:'top',isTextBox:true});
src(s,'出典：APA（American Psychological Association）健康勧告 2025／国内の産業ストレス研究レビュー 2026');
footer(s);
s.addNotes('まとめます。AIへの相談はもう普通のこと。理由は「人には言いづらい」から。ただしAIには肯定しすぎる仕組みがあり、長く使う人ほど孤独や依存の指標が高い傾向がある。\n\nだから私の提案はこうです。「AIに相談してもいい。でも、出口は人に用意しておこう」。海外の心理学会の勧告も、国内の産業ストレス研究のレビューも、同じことを言っています。AIは専門家の代わりではなく補助であり、困ったときの出口は人である、と。');

// ---------- 12 三つの提案 ----------
s=base(false); header(s,'THREE PRACTICAL TIPS','今日からできる、三つのこと','AIを禁止するのではなく、使い方に「人の出口」を組み込みます。');
const tips=[['✍️','AIは「下書き」、人は「本番」','AIで気持ちが整理できたら、その内容をひとりでいいので人に話す。家族、友人、職場の相談窓口、産業医、誰でも。'],
 ['🤔','「正しい」と言われたときほど、少し疑う','AIは肯定しやすくできている。気持ちよさと良くなることは別。'],
 ['🚪','「AIとしか話していない」はサイン','AIが悪いのではなく、あなたが人との出口を必要としている印。']];
tips.forEach((t,i)=>{const y=2.2+i*1.4; card(s,0.6,y,12.13,1.25); badge(s,0.9,y+0.35,String(i+1),GOLD);
  s.addText(t[1],{x:1.7,y:y+0.12,w:10.8,h:0.45,fontFace:JP,fontSize:14,bold:true,color:NAVY,valign:'middle',isTextBox:true,margin:0});
  body(s,1.7,y+0.6,10.8,0.6,t[2]);});
footer(s);
s.addNotes('具体的には三つです。\n\nひとつ目。AIで気持ちが整理できたら、その内容をひとりでいいので人に話してください。家族、友人、職場の相談窓口、産業医、誰でも構いません。AIは「下書き」の相手、人は「本番」の相手です。\n\nふたつ目。AIが「あなたは正しい」と言ってくれたときほど、少し疑ってみてください。AIは肯定しやすくできているからです。\n\nみっつ目。「AIとしか話していないな」と気づいたら、AIが悪いのではなく、あなたが人との出口を必要としているサインです。');

// ---------- 13 危機（独立） ----------
s=base(true); header(s,'WHEN TO SEEK HELP','こんなときは、AIではなく人へ','AIは危機の対応が得意ではありません。どこでもいいので、人につながってください。',true);
s.addImage({path:'image2.jpeg',x:9.0,y:0,w:4.333,h:7.5,sizing:{type:'cover',w:4.333,h:7.5}});
s.addText('消えてしまいたい気持ちや、\n自分を傷つけたい気持ちが出てきたとき',{x:0.6,y:2.2,w:8.0,h:1.0,fontFace:JP,fontSize:18,bold:true,color:WHITE,isTextBox:true,margin:0});
const help=[['職場の相談窓口'],['産業医'],['かかりつけ医'],['地域の相談電話']];
help.forEach((h,i)=>{const y=3.45+i*0.72; card(s,0.6,y,8.0,0.6,CARD2,null); badge(s,0.8,y+0.075,String(i+1),GOLD,0.45);
  s.addText(h[0],{x:1.45,y,w:6.9,h:0.6,fontFace:JP,fontSize:14,bold:true,color:WHITE,valign:'middle',isTextBox:true,margin:0});});
s.addText('産業医・かかりつけ医・専門外来など、身近な窓口にご相談ください。',{x:0.6,y:6.45,w:8.0,h:0.4,fontFace:JP,fontSize:11,color:PALE2,isTextBox:true,margin:0});
footer(s,true,5.6);
s.addNotes('最後にひとつだけ。消えてしまいたい気持ちや、自分を傷つけたい気持ちが出てきたときは、AIではなく人に連絡してください。AIは危機の対応が得意ではありません。職場の相談窓口、産業医、かかりつけ医、地域の相談電話。どこでもいいので、人につながってください。');

// ---------- 14 まとめ ----------
s=base(true);
s.addImage({path:'image3.jpeg',x:0,y:0,w:W,h:7.5,sizing:{type:'cover',w:W,h:7.5}});
s.addShape(pres.ShapeType.rect,{x:0,y:0,w:W,h:7.5,fill:{color:NAVY,transparency:18},line:{color:NAVY,width:0}});
header(s,'TAKE HOME MESSAGE','人に言いやすい職場や家庭を、少しずつ','AIを禁止することではなく、出口を人に用意することが、私たちにできることです。',true);
const th=[['💬','AIに相談してもいい','まず言葉にできる場所があることは、抱え込むより良い'],['🪞','肯定されたときほど、少し疑う','AIは肯定しやすくできている'],['🚪','出口は人に','整理した気持ちを、ひとりでいいので人に話す']];
th.forEach((t,i)=>{const x=0.6+i*4.1; card(s,x,2.3,3.93,3.2); badge(s,x+1.69,2.6,t[0]);
  s.addText(t[1],{x:x+0.25,y:3.3,w:3.43,h:0.6,fontFace:JP,fontSize:14,bold:true,color:NAVY,align:'center',valign:'middle',isTextBox:true,margin:0});
  body(s,x+0.3,3.95,3.33,1.4,t[2],{align:'center'});});
s.addText('AIに相談する人が増えているのは、裏を返せば「人に言いづらい」と感じる人がそれだけ多い、ということ。',{x:0.6,y:5.9,w:12.13,h:0.5,fontFace:JP,fontSize:12,color:PALE2,align:'center',isTextBox:true,margin:0});
footer(s,true);
s.addNotes('AIに相談する人が増えているのは、裏を返せば「人に言いづらい」と感じる人がそれだけ多い、ということです。私たちにできるのは、AIを禁止することではなく、人に言いやすい職場や家庭を少しずつ作っていくことだと思います。\n\nご覧いただき、ありがとうございました。');

// ---------- 15 出典 ----------
s=base(false); header(s,'REFERENCES','出典','本スライドで用いた数字と記述は、以下の資料の範囲に限っています。');
const refs=[
 ['1','内閣府・消費者委員会事務局「生成AI利用者の利用実態に関するアンケート結果」2026','本調査の利用者 n=1,442（複数回答）／対話型AI利用者 n=1,038。23.3%・52.4%・相談相手4位・70.9%・74.7%'],
 ['2','Cheng et al., Science, 2026（査読済み）','AIは人間より49%多く相手を肯定。迎合的な返答は確信を強め、信頼と再利用意向を高める'],
 ['3','Chatterji et al., NBER Working Paper, 2025（プレプリント、査読前）','ChatGPTの会話の73%は仕事以外。「人間関係や内省」の相談は1.9%'],
 ['4','OpenAI × MIT Media Lab 共同研究, 2025','使用時間と孤独感・感情的依存の指標の相関。著者自身が因果関係は未確定と明記'],
 ['5','APA（American Psychological Association）健康勧告 2025／国内の産業ストレス研究レビュー 2026','「AIは専門家の代替ではなく補助」「困ったときの出口は人」']];
refs.forEach((r,i)=>{const y=2.05+i*0.9; card(s,0.6,y,12.13,0.78); badge(s,0.8,y+0.165,r[0],'F3E6CC',0.45);
  s.addText(r[1],{x:1.45,y:y+0.06,w:11.1,h:0.36,fontFace:JP,fontSize:11.5,bold:true,color:NAVY,valign:'middle',isTextBox:true,margin:0});
  body(s,1.45,y+0.42,11.1,0.32,r[2],{fontSize:9.5});});
footer(s);
s.addNotes('出典一覧。読み上げは不要です。');

if(n!==TOTAL) throw new Error('slide count '+n);
pres.writeFile({fileName:'AI相談と孤独_講話スライド.pptx'}).then(()=>console.log('written'));
