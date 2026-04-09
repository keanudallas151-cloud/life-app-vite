import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  skin:"#f5f0e8", white:"#ffffff", green:"#4a8c5c", greenLt:"#eaf3ec",
  ink:"#141414", mid:"#3a3a3a", muted:"#8a8070", border:"#ddd5c4",
  light:"#ede8de", gold:"#b8975a", red:"#c0392b",
};

if(typeof document!=="undefined"){
  document.body.style.background="#f5f0e8";
  document.documentElement.style.background="#f5f0e8";
  const style=document.createElement("style");
  style.textContent=`button:active{filter:brightness(0.82)!important;transform:scale(0.97)!important;}button{transition:filter 0.15s,transform 0.15s,background 0.12s;}`;
  document.head.appendChild(style);
}

const LS={
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

// ─────────────────────────────────────────────────────────
// SVG ICON LIBRARY (Phosphor-style, inline, no imports)
// ─────────────────────────────────────────────────────────
const Ic={
  // Finance
  bank:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 10V21"/><path d="M19 10V21"/><path d="M12 3L3 10h18L12 3z"/><line x1="9" y1="14" x2="9" y2="17"/><line x1="15" y1="14" x2="15" y2="17"/></svg>,
  creditCard:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
  trending:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/></svg>,
  barChart:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  moon:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  shield:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  globe:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  scales:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M4 21h16"/><path d="M7 3H5l-2 7c0 2.2 1.8 4 4 4s4-1.8 4-4L9 3H7z"/><path d="M17 3h-2l-2 7c0 2.2 1.8 4 4 4s4-1.8 4-4l-2-7h-2z"/></svg>,
  home:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  wallet:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/><circle cx="16" cy="14" r="1.5" fill={s}/></svg>,
  lock:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>,
  bolt:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
  trendDown:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,17 13.5,8.5 8.5,13.5 2,7"/><polyline points="16,17 22,17 22,11"/></svg>,
  box:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  robot:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/><line x1="12" y1="3" x2="12" y2="7"/><circle cx="9" cy="16" r="1.2" fill={s}/><circle cx="15" cy="16" r="1.2" fill={s}/><line x1="9" y1="20" x2="15" y2="20"/></svg>,
  // Psychology
  brain:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a4.5 4.5 0 000 9"/><path d="M14.5 2a4.5 4.5 0 010 9"/><path d="M5 11a4 4 0 004 4v5h6v-5a4 4 0 004-4"/><path d="M9 15v-4"/><path d="M15 15v-4"/><path d="M9 11H5"/><path d="M15 11h4"/></svg>,
  eye:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  flask:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M10 3v6l-4 8h12l-4-8V3"/></svg>,
  microscope:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M12 12v9"/><path d="M6 21h12"/><path d="M8 4l-2-3"/><path d="M16 4l2-3"/></svg>,
  book:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  telescope:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="8" x2="8" y2="20"/><path d="M22 5L2 11l4 2.5"/><line x1="6" y1="13.5" x2="12" y2="8"/><path d="M14 7l4-4 2 2-4 4"/></svg>,
  candle:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="5"/><path d="M12 5c-1 1.5-1 3 0 4s1 2.5 0 4"/><rect x="8" y="13" width="8" height="9" rx="1"/></svg>,
  puzzle:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3c0 1.7-1.3 3-3 3S3 4.7 3 3m6 0c0 1.7 1.3 3 3 3s3-1.3 3-3M3 9v10a2 2 0 002 2h4m-6-12c1.7 0 3 1.3 3 3s-1.3 3-3 3m6-6h10a2 2 0 012 2v10a2 2 0 01-2 2H9m0 0c0-1.7-1.3-3-3-3s-3 1.3-3 3m6 0c0-1.7 1.3-3 3-3s3 1.3 3 3"/></svg>,
  tv:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17,2 12,7 7,2"/></svg>,
  // Navigation / UI
  compass:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/></svg>,
  question:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  pin:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  users:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  leaf:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 014 13c0-5 4-9 9-11 0 5 2 9 2 11a4 4 0 01-4 7z"/><path d="M11 20c0-5.5 5-9 7-9"/></svg>,
  lightbulb:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>,
  chat:(c="none",s="#6b7c6e",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  star:(c="none",s="#b8975a",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
  starFilled:(c="#b8975a",s="#b8975a",w=22)=><svg width={w} height={w} viewBox="0 0 24 24" fill={c} stroke={s} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
};


function useSound(){
  const ctx=useRef(null);
  const play=useCallback((type)=>{
    try{
      if(!ctx.current)ctx.current=new(window.AudioContext||window.webkitAudioContext)();
      const ac=ctx.current;
      if(type==="star"){
        [0,0.06,0.12].forEach((t,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.setValueAtTime([600,750,900][i],ac.currentTime+t);g.gain.setValueAtTime(0.06,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+t+0.15);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.15);});return;
      }
      if(type==="pageturn"){
        const now=ac.currentTime;
        const bufLen=ac.sampleRate*0.18;
        [0.18,0.12].forEach((vol,idx)=>{
          const buf=ac.createBuffer(1,bufLen,ac.sampleRate);const d=buf.getChannelData(0);
          for(let i=0;i<bufLen;i++)d[i]=(Math.random()*2-1)*vol;
          const src=ac.createBufferSource();src.buffer=buf;
          const bp=ac.createBiquadFilter();bp.type="bandpass";bp.frequency.value=idx===0?3200:2000;bp.Q.value=idx===0?0.7:0.5;
          const g=ac.createGain();const t0=now+idx*0.06;
          g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(idx===0?0.55:0.3,t0+0.03);g.gain.exponentialRampToValueAtTime(0.001,t0+0.2);
          src.connect(bp);bp.connect(g);g.connect(ac.destination);src.start(t0);src.stop(t0+0.25);
        });return;
      }
      if(type==="correct"){[0,0.08].forEach((t,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.setValueAtTime([520,660][i],ac.currentTime+t);g.gain.setValueAtTime(0.08,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+t+0.18);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.2);});return;}
      if(type==="wrong"){const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.type="sawtooth";o.frequency.setValueAtTime(220,ac.currentTime);o.frequency.exponentialRampToValueAtTime(140,ac.currentTime+0.25);g.gain.setValueAtTime(0.07,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.25);o.start();o.stop(ac.currentTime+0.25);return;}
      const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);
      const m={tap:[520,380,0.1,0.07],open:[340,560,0.18,0.06],back:[420,260,0.12,0.05],err:[220,180,0.2,0.07],ok:[480,640,0.18,0.06]}[type]||[520,380,0.1,0.07];
      o.frequency.setValueAtTime(m[0],ac.currentTime);o.frequency.exponentialRampToValueAtTime(m[1],ac.currentTime+m[2]);
      g.gain.setValueAtTime(m[3],ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+m[2]);
      o.start();o.stop(ac.currentTime+m[2]);
    }catch(_){}
  },[]);
  return play;
}

const QUIZ_QUESTIONS={
  finance:{
    easy:[
      {q:"What does inflation mean?",opts:["Prices rise over time","Stock market crashes","Banks print less money","Interest rates fall"],a:0},
      {q:"What is a credit score?",opts:["Your bank balance","A rating of your creditworthiness","Interest on savings","How much tax you pay"],a:1},
      {q:"What is a budget?",opts:["A type of credit card","A plan for spending money","A government tax","A savings account"],a:1},
      {q:"What is interest?",opts:["A fee for borrowing money","Free money from government","A type of insurance","The price of gold"],a:0},
      {q:"What does net worth mean?",opts:["Your annual salary","Assets minus liabilities","How much you owe","Your credit limit"],a:1},
      {q:"What is a mortgage?",opts:["A car loan","A government grant","A loan to buy property","A savings account"],a:2},
      {q:"What does ETF stand for?",opts:["Every Tax Free","Exchange Traded Fund","Equity Transfer Fund","External Trading Fee"],a:1},
      {q:"What is passive income?",opts:["Earning nothing","Money earned without active work","Government welfare","Part-time wages"],a:1},
    ],
    medium:[
      {q:"What is fractional reserve banking?",opts:["Banks keep 100% of deposits","Banks lend out more than they hold","Banks only lend gold","Banks charge no fees"],a:1},
      {q:"What is compound interest?",opts:["Interest only on original amount","Interest earned on previous interest","A government loan","A flat bank fee"],a:1},
      {q:"What does negative gearing mean?",opts:["Borrowing at negative rates","Investment losses offset taxable income","Selling shares at a loss","A type of mortgage"],a:1},
      {q:"What is the S&P 500?",opts:["500 richest people","An index of 500 large US companies","A savings plan","A government bond"],a:1},
      {q:"What is a bear market?",opts:["Market rising 20%+ from low","Market falling 20%+ from high","A flat market","A crypto crash"],a:1},
      {q:"What does liquidity mean?",opts:["How much cash a company has","How easily an asset converts to cash","The value of gold","A type of loan"],a:1},
      {q:"What is dollar cost averaging?",opts:["Buying all at once","Investing fixed amounts regularly","Selling in small amounts","A currency strategy"],a:1},
      {q:"What is a P/E ratio?",opts:["Profit to Equity","Price to Earnings","Principal to Expense","Payment to Earnings"],a:1},
    ],
    hard:[
      {q:"What is the Cantillon Effect?",opts:["Inflation hits all equally","Early recipients of new money benefit more","Banks control oil prices","Gold backs currency"],a:1},
      {q:"Who owns the Federal Reserve?",opts:["The US government","Private member banks","The Treasury","US citizens"],a:1},
      {q:"What is a dark pool?",opts:["A secret bank account","Private exchange for large institutional trades","Offshore tax haven","Underground crypto exchange"],a:1},
      {q:"What does the petrodollar system mean?",opts:["Oil priced in gold","Global oil trades settled in USD","OPEC controls printing","Russia owns oil rights"],a:1},
      {q:"What is the Buy Borrow Die strategy?",opts:["Buy assets borrow against them heirs inherit tax-free","Buy cheap borrow to reinvest sell before death","A day trading strategy","Real estate flipping"],a:0},
      {q:"What is a Structural Adjustment Program?",opts:["IMF loan conditions requiring privatisation and cuts","A US budget plan","A company restructure","A tax reform"],a:0},
      {q:"What is the money multiplier?",opts:["How many banks exist","How deposits expand money supply through lending","Interest rate formula","Central bank printing rate"],a:1},
      {q:"What percentage of day traders profit after 5 years?",opts:["50%","25%","10%","About 3%"],a:3},
    ],
  },
  psychology:{
    easy:[
      {q:"What is confirmation bias?",opts:["Believing what matches existing views","Always trusting experts","Ignoring all information","Changing your mind constantly"],a:0},
      {q:"What does loss aversion mean?",opts:["Avoiding all risk","Losses feel more painful than equal gains feel good","Loving to lose money","Being risk-neutral"],a:1},
      {q:"What is dopamine?",opts:["A stress hormone","A neurotransmitter linked to wanting and reward","A sleeping drug","A memory chemical"],a:1},
      {q:"What is present bias?",opts:["Valuing the present over the future","Ignoring the past","Planning ahead carefully","A type of anxiety"],a:0},
      {q:"What is the sunk cost fallacy?",opts:["Continuing because of past investment","Counting profits early","Ignoring future costs","Saving too much"],a:0},
      {q:"What is learned helplessness?",opts:["Being naturally lazy","Giving up because past actions had no effect","Learning slowly","Helping others too much"],a:1},
      {q:"What is the availability heuristic?",opts:["Judging likelihood by how easily examples come to mind","Always using available data","Choosing the cheapest option","A memory technique"],a:0},
      {q:"Who conducted the Milgram experiment?",opts:["Philip Zimbardo","Stanley Milgram","Sigmund Freud","Carl Jung"],a:1},
    ],
    medium:[
      {q:"What did the Milgram experiment find?",opts:["People always disobey authority","65% gave maximum shocks when instructed","Nobody obeyed","Only soldiers obey"],a:1},
      {q:"What is the Stanford Prison Experiment key finding?",opts:["A study on learning","Roles shape behaviour within days","Prisons improve character","Guards always rebel"],a:1},
      {q:"What is the arrival fallacy?",opts:["Goals are never reached","Reaching a goal does not feel as good as expected","Travelling is overrated","Planning fails"],a:1},
      {q:"What is the variable reward mechanism?",opts:["Fixed rewards every time","Unpredictable rewards drive more dopamine and habit","Giving cash prizes","A teaching technique"],a:1},
      {q:"What does Plato's Cave represent?",opts:["Ancient Greek politics","Mistaking shadows of reality for truth","Underground living","Fear of the dark"],a:1},
      {q:"What is stoicism's core idea?",opts:["Control everything","Focus only on what you can control","Avoid all emotions","Pursue pleasure"],a:1},
      {q:"What is nihilism?",opts:["Life has objective meaning","Life has no inherent meaning","Everything is spiritual","Science explains all"],a:1},
      {q:"What is existentialism's key claim?",opts:["You are born with a purpose","Existence comes before essence","God defines your role","Nature determines all"],a:1},
    ],
    hard:[
      {q:"What are Chomsky's five media filters?",opts:["Ownership advertising sourcing flak ideology","TV radio print internet social","Bias censorship spin lies control","Fear greed power money ego"],a:0},
      {q:"What reversed learned helplessness in Seligman's research?",opts:["Medication","Shock therapy","Small wins that rebuild sense of agency","Talking therapy alone"],a:2},
      {q:"What mechanism makes social media addictive?",opts:["Pretty colours","Variable reward loops triggering dopamine","Peer pressure only","FOMO"],a:1},
      {q:"Why was the Stanford Prison Experiment stopped?",opts:["Funding ran out","Guards abused prisoners within 6 days","Prisoners escaped","Media exposed it"],a:1},
      {q:"What does Chomsky argue about the free press?",opts:["It is truly free","It self-censors through structural filters","Governments control it directly","It is totally biased"],a:1},
      {q:"What is cognitive dissonance?",opts:["Having two personalities","Mental discomfort from holding conflicting beliefs","A memory disorder","Extreme confidence"],a:1},
      {q:"What did Zimbardo do during the Stanford study?",opts:["Stopped it early","Became absorbed in his role as superintendent","Protected prisoners","Wrote his book"],a:1},
      {q:"What is Plato's solution to seeing beyond shadows?",opts:["Watch more news","Travel more","Examine where your beliefs came from","Trust authority"],a:2},
    ],
  },
  money:{
    easy:[
      {q:"What is the 50/30/20 rule?",opts:["50 stocks 30 bonds 20 cash","50% needs 30% wants 20% savings","Save 50% always","50% tax 30% spend 20% invest"],a:1},
      {q:"What is superannuation in Australia?",opts:["A pension from government","Employer-paid retirement fund","A type of insurance","A tax credit"],a:1},
      {q:"What is an index fund?",opts:["A book of investments","A fund tracking a market index","A government bond","A savings account"],a:1},
      {q:"What is an emergency fund?",opts:["Money for holidays","3 to 6 months of expenses for unexpected events","Your entire savings","A loan backup"],a:1},
      {q:"Why automate savings?",opts:["Banks require it","Removes willpower from the equation","You earn more interest","It is required by law"],a:1},
      {q:"What is a dividend?",opts:["A stock split","A share of company profits paid to shareholders","A type of loan","A tax refund"],a:1},
      {q:"What does diversification mean?",opts:["Investing in one stock","Spreading investments to reduce risk","All money in property","Borrowing to invest"],a:1},
      {q:"What is an asset?",opts:["Something you owe","Something that puts money in your pocket","A bank loan","Your salary"],a:1},
    ],
    medium:[
      {q:"What is leverage in investing?",opts:["Owning property","Borrowing to invest more than you have","A hedge strategy","Day trading"],a:1},
      {q:"What is tax-loss harvesting?",opts:["Avoiding all taxes","Selling losing investments to offset gains","Hiding income","A government program"],a:1},
      {q:"What is the CGT 50% discount in Australia?",opts:["No tax on assets","Assets held 12+ months taxed on 50% of gain","Tax-free threshold","GST exemption"],a:1},
      {q:"What is dollar cost averaging?",opts:["Buying the dip","Investing fixed amounts at regular intervals","Currency hedging","Timing the market"],a:1},
      {q:"What is a 401k?",opts:["A US tax code section","US employer retirement savings account","A credit score","A mortgage type"],a:1},
      {q:"What does time in market beat?",opts:["All strategies","Timing the market","Property investment","Crypto trading"],a:1},
      {q:"What is the compounding effect?",opts:["Flat returns over time","Growth on growth returns generating more returns","A banking fee","Tax calculation"],a:1},
      {q:"What backs the US dollar since 1971?",opts:["Gold","Silver","Confidence and oil demand","US military alone"],a:2},
    ],
    hard:[
      {q:"What is the Cantillon Effect in simple terms?",opts:["Inflation is random","New money benefits those who receive it first","Everyone is affected equally","Banks lose money"],a:1},
      {q:"What is Buy Borrow Die?",opts:["Speculation","Hold assets borrow against them heirs inherit tax-free","Buy low sell high","Dividend investing"],a:1},
      {q:"What does negative gearing allow Australian investors to do?",opts:["Avoid all tax","Offset investment losses against taxable income","Get government grants","Borrow at zero interest"],a:1},
      {q:"What backs the US dollar since 1971?",opts:["Gold in Fort Knox","Silver reserves","Confidence and oil demand via petrodollar","US military alone"],a:2},
      {q:"What is the main risk of leverage?",opts:["Slower returns","Losses are amplified just like gains","Higher tax","Losing liquidity"],a:1},
      {q:"What do IMF loans typically require?",opts:["Nothing","Privatisation spending cuts and market deregulation","Military cooperation","Population reduction"],a:1},
      {q:"What is dark pool trading?",opts:["Illegal insider trading","Private institutional trades away from public markets","Crypto trading","Offshore banking"],a:1},
      {q:"What percentage of day traders are profitable after 5 years?",opts:["50%","25%","10%","About 3%"],a:3},
    ],
  },
};

const CONTENT={
  fractional:{label:"Fractional Reserve Lending",icon:"bank",related:["inflation","federal_reserve","petrodollar"],content:{title:"Fractional Reserve Lending",readTime:"8 min",level:"Intermediate",emoji:"🏛️",text:"Banks do not lend money they have. That is the first thing to understand.\n\nWhen you deposit $1,000, the bank keeps around 10% sitting there. The other $900 gets lent out to someone else. That person deposits it somewhere, and their bank lends out 90% of it again. This keeps going.\n\nBy the end of this chain, your original $1,000 has become roughly $10,000 circulating in the economy. That is the money multiplier at work.\n\n**What this means in practice:** Every loan a bank makes creates new money that did not exist before. Banks are not lending you someone else's savings. They are creating money through an accounting entry. Most people go their whole lives without knowing this.\n\n**Where it breaks down:** If enough people want their money back at the same time, the bank cannot pay. That is a bank run. The whole system depends on people not asking for their money all at once."}},
  federal_reserve:{label:"The Federal Reserve",icon:"bank",related:["fractional","petrodollar","imf_world_bank"],content:{title:"The Federal Reserve: Who Actually Owns It",readTime:"10 min",level:"Intermediate",emoji:"🏦",text:"Most people assume the Federal Reserve is a government institution. It is not. It is privately owned.\n\nIn 1913, a group of America's most powerful bankers took a secret trip to Jekyll Island, a private resort off the coast of Georgia. They travelled under fake names. The meeting was kept hidden for years. What they designed in those nine days became the Federal Reserve System.\n\nThe Fed is owned by its member banks. JPMorgan Chase, Citibank, and other private institutions hold shares in the New York Fed, which is the most powerful branch. These are not government employees making decisions about your money. They are private bankers.\n\nThe Fed controls interest rates and money supply. When it raises rates, borrowing becomes expensive and the economy slows. When it cuts rates, money flows freely. Every major economic event of the past century has this institution somewhere in the background.\n\nThe question worth sitting with: should a private institution control a nation's money? America made its choice in 1913. Most people still do not know it happened."}},
  credit_cards:{label:"How Credit Cards Really Work",icon:"creditCard",related:["fractional","billionaire_tax","housing_trap"],content:{title:"How Credit Card Companies Make Money Off You",readTime:"7 min",level:"Beginner",emoji:"💳",text:"Paying your credit card on time every month and thinking you beat the system? The card company is still profiting from you.\n\nEvery time you tap your card, the merchant quietly pays 1.5 to 3.5% of the sale to Visa, Mastercard or whoever issued your card. That cost gets baked into their prices. So you pay it anyway, whether you use a card or cash.\n\nHere is the part that stings: your cashback and rewards points are funded by those merchant fees, which are disproportionately paid by people buying groceries with debit or cash. The rewards programme is essentially a transfer from lower-income shoppers to higher-income cardholders.\n\nAnd then there is the other side of the business. Around 55% of cardholders carry a balance month to month. For them, the average interest rate is sitting around 21%. That is where the card companies make most of their money."}},
  inflation:{label:"Inflation Explained",icon:"trending",related:["fractional","petrodollar","billionaire_tax"],content:{title:"Inflation Explained",readTime:"6 min",level:"Beginner",emoji:"📈",text:"Inflation just means prices go up over time. Your $10 today buys less than $10 did ten years ago. That gap is inflation doing its work.\n\nCentral banks actually aim for around 2% inflation a year. Their logic is that if money slowly loses value, people spend and invest rather than hoard. A slowly deflating currency keeps the economy moving.\n\nBut here is the uncomfortable part: inflation quietly moves wealth from people who hold cash to people who hold assets. If your savings account earns 1% interest and inflation runs at 3%, you are losing 2% of your purchasing power every year. It does not feel like losing money but it is.\n\nPeople with property, shares and businesses watch their assets grow alongside inflation or faster. People with savings accounts watch their money quietly shrink in real terms. This is not an accident. It is how the system works."}},
  dark_pools:{label:"Dark Pools",icon:"moon",related:["federal_reserve","billionaire_tax","trading"],content:{title:"Dark Pools: The Stock Market the Public Cannot See",readTime:"9 min",level:"Advanced",emoji:"🌑",text:"When you buy shares on the stock market, you assume you are seeing the real market. You are not seeing all of it.\n\nAround 40% of US stock trades happen in dark pools, which are private exchanges that big institutions use to trade with each other away from public view. When a hedge fund needs to offload 10 million shares, it does not do it on the open market. That would crash the price before it finished selling. Instead it goes to a dark pool and finds a private buyer.\n\nThe problem is that stock prices are supposed to reflect reality. They do that through transparent trading where buyers and sellers set prices in the open. When nearly half of all trades happen in private, the price you see may not reflect what the market actually thinks a stock is worth.\n\nBig institutions get better prices by avoiding the public market. Regular investors trade on the public price, absorbing the impact that institutions sidestep. Same market, different rules."}},
  super:{label:"Superannuation",icon:"shield",related:["personal_finance","adv_finance","gen_income"],content:{title:"Superannuation: Australia's Retirement System",readTime:"7 min",level:"Beginner",emoji:"🦘",text:"Every Australian employer is legally required to put 11% of your salary into a super fund on your behalf. You cannot touch it until around age 60. That is the deal.\n\nFor most people this feels invisible, which is exactly why most people ignore it. But compounding over 40 years is not something you want to ignore.\n\nThe single most important super decision you will make is choosing a low-fee fund. The average Australian pays around 1.2% in annual fees. Moving to a fund charging 0.2% sounds like nothing. Over 40 years on a typical salary it is the difference of more than $200,000 sitting in your account or sitting in someone else's. Check what your fund charges. If it is over 0.5%, you should probably switch."}},
  petrodollar:{label:"The Petrodollar",icon:"globe",related:["federal_reserve","imf_world_bank","billionaire_tax"],content:{title:"The Petrodollar: Why Oil Is Priced in USD",readTime:"11 min",level:"Advanced",emoji:"🛢️",text:"In 1971, Nixon took the US dollar off the gold standard. The dollar was no longer backed by anything physical. Within a few years, the US made a deal with Saudi Arabia: all oil sales would happen in US dollars only. In exchange, America offered military protection.\n\nThat deal changed everything. Because oil runs the global economy, every country on earth suddenly needed US dollars to buy it. That created permanent artificial demand for the currency. The US could print dollars and other countries had to absorb them to keep trading.\n\nThis is why America can spend more than it earns year after year without the currency collapsing. Other nations hold dollars as reserves because they need them for oil. The dollar is backed not by gold, but by oil.\n\nIn recent years China, Russia and increasingly Saudi Arabia have started settling oil trades in other currencies. If that trend continues, the demand that props up the US dollar starts to erode. This is arguably the most significant financial shift happening right now and almost nobody is talking about it."}},
  imf_world_bank:{label:"IMF and World Bank",icon:"globe",related:["petrodollar","federal_reserve","billionaire_tax"],content:{title:"The IMF and World Bank: Aid or Control",readTime:"12 min",level:"Advanced",emoji:"🌍",text:"The IMF and World Bank are presented as charities for struggling nations. The money comes with strings.\n\nWhen a country is in financial trouble and asks the IMF for help, it receives a loan with conditions attached. These conditions almost always include the same things: privatise government-owned assets, cut public spending, open the market to foreign investment and deregulate the financial sector. This package is called a Structural Adjustment Program.\n\nThe same story plays out across Argentina, Greece, Zambia, Pakistan and dozens of others. A country takes the loan. It cuts hospitals, schools and subsidies. Poverty climbs. State assets get sold cheaply to foreign corporations. The debt often grows rather than shrinks.\n\nWho designed these institutions? Mostly wealthy Western governments and private financial interests. Who benefits from the conditions? Foreign investors who get access to newly privatised assets at low prices."}},
  billionaire_tax:{label:"How Billionaires Pay Almost Zero Tax",icon:"scales",related:["federal_reserve","dark_pools","housing_trap"],content:{title:"How Billionaires Pay Almost Zero Tax Legally",readTime:"10 min",level:"Intermediate",emoji:"🤑",text:"In 2021 ProPublica got hold of IRS data and published what it found. The 25 wealthiest Americans had paid an effective federal tax rate of 3.4% over several years. A nurse or a teacher was paying more than that.\n\nNone of it was illegal. That is the point.\n\nHere is how it works. Billionaires hold their wealth in shares and property. These assets appreciate in value but are not taxed until they are sold. So instead of selling, they borrow money using those assets as collateral. A bank will happily lend hundreds of millions to someone who owns billions in shares. Borrowed money is not income. It is not taxed.\n\nThey live off those loans. When they die, their assets transfer to their heirs at the current market value, wiping out all the unrealised gains that were never taxed. The strategy is sometimes called Buy, Borrow, Die.\n\nEven when they do sell, long-term capital gains are taxed at 20% maximum. Someone earning a salary pays up to 37%. The tax code treats money made from owning things more generously than money made from working."}},
  housing_trap:{label:"Why Housing Is Designed to Keep You Renting",icon:"home",related:["billionaire_tax","imf_world_bank","credit_cards"],content:{title:"Why the Housing Market Is Designed to Keep You Renting",readTime:"9 min",level:"Intermediate",emoji:"🏠",text:"Every generation gets told the same thing: buy a home, it is the foundation of financial security. What they are not told is that the market is set up to keep prices high on purpose.\n\nZoning laws decide what can be built and where. In most major cities, enormous areas are zoned for single-family houses only. You cannot build apartments or townhouses there. This keeps supply low. Low supply means high prices. Existing homeowners do not hate this. Higher prices mean their asset is worth more. They vote accordingly.\n\nIn Australia, negative gearing lets property investors offset losses against their income tax. This makes buying an investment property more attractive to high earners who already own one home and want a second. They bid against first home buyers who have no tax advantage.\n\nThe housing crisis is not a shortage of houses. It is a shortage of houses available to people who actually want to live in them."}},
  personal_finance:{label:"Personal Finance Fundamentals",icon:"barChart",related:["super","adv_finance","gen_income"],content:{title:"Personal Finance: The Foundation",readTime:"10 min",level:"Beginner",emoji:"📊",text:"The basics of personal finance are not complicated. The hard part is actually doing them consistently over years.\n\nSpend less than you earn. Put the difference somewhere it grows. Do not touch it. That is most of it.\n\nThe 50/30/20 rule is a reasonable starting point. Take your income after tax. Put 50% toward things you need, rent, food, transport. Put 30% toward things you want. Put 20% toward savings and paying off debt.\n\nBefore investing anything, build a cash buffer covering three to six months of expenses. Not in shares, not in crypto, in a savings account you can access tomorrow.\n\nAutomate your savings. Set up a transfer to move money into savings the same day your pay arrives. Remove the decision entirely.\n\nOn compounding: $500 a month from age 25 at 8% annual returns grows to $1.75 million by age 65. The same amount starting at 35 grows to $680,000. Ten years of delay costs you over a million dollars."}},
  psych_money:{label:"The Psychological Game of Money",icon:"puzzle",related:["secrets","money","bias"],content:{title:"The Psychological Game of Money",readTime:"11 min",level:"Intermediate",emoji:"🎭",text:"You think your financial decisions are rational. They are not. They feel rational because you construct reasons for them after the fact.\n\nLosing $100 hurts about twice as much as gaining $100 feels good. This is loss aversion. It is why ordinary people sell their shares when markets fall, which is the worst time to sell.\n\nYou have probably noticed that reaching a goal does not feel the way you expected it to. New job, new car, new relationship — there is a rush, and then your sense of normal recalibrates. Psychologists call this the arrival fallacy.\n\nPresent bias is the reason you spend instead of save. Money now feels more real and valuable than money later. Automating savings is the most effective known solution because it removes the choice from the moment when bias is strongest."}},
  money:{label:"Money",icon:"wallet",related:["super","adv_finance","gen_income"],content:{title:"Money: What Nobody Taught You",readTime:"14 min",level:"Beginner",emoji:"💰",text:"Most people spend their life working for money without ever understanding what money actually is. School teaches you to earn it. Nobody teaches you the rest.\n\nMoney started as a solution to a practical problem. If you grew wheat and needed shoes, you had to find a shoemaker who also happened to need wheat, at the exact same time. Money replaced that coincidence with a universal token anyone would accept.\n\nHere is what most people never find out: modern money is created by debt. When a bank approves your loan, it does not hand over money sitting in a vault. It types a number into a computer and your account balance goes up. That number did not exist before. When you repay the loan, that money stops existing again.\n\nBefore you look at any investment strategy or savings plan, look at your beliefs about money first. Were you raised to think money was scarce? These beliefs run in the background of every financial decision you make."}},
  basics_au2:{label:"Finance Basics — Australia",icon:"shield",related:["basics_us","money","adv_finance"],content:{title:"Finance Basics — Australia",readTime:"10 min",level:"Beginner",emoji:"🦘",text:"Australia has built a personal finance system that benefits ordinary people if they understand how to use it. Most Australians do not.\n\nSuper is the obvious starting point. Your employer is legally required to pay 11% of your salary into a fund that compounds tax-advantaged for decades. High fees quietly drain that number. Choose a low-fee fund.\n\nNegative gearing lets property investors deduct losses from their investment property against their other income. This is one reason property investment is so popular among higher earners.\n\nAssets you hold for more than 12 months before selling are only taxed on 50% of the capital gain. Hold your investments long enough and the tax system rewards you for the patience."}},
  basics_us:{label:"Finance Basics — America",icon:"bolt",related:["basics_au2","money","adv_finance"],content:{title:"Finance Basics — America",readTime:"10 min",level:"Beginner",emoji:"🦅",text:"The American financial system rewards people who understand its tools. Most people do not use them to their full advantage.\n\nThe 401(k) and IRA are retirement accounts where your money grows either tax-free or tax-deferred depending on which type you use. If your employer matches contributions to your 401(k), that is free money sitting on the table.\n\nYour credit score in America is not just a number. It determines your mortgage rate, which can mean tens of thousands of dollars difference over a loan's life. Build it deliberately by paying on time and keeping your credit utilisation below 30%.\n\nOn investing: the S&P 500 has returned around 10% per year on average over the past century. The vast majority of professional fund managers do not beat that index consistently over time, especially after their fees."}},
  adv_finance:{label:"Advanced Finance",icon:"telescope",related:["money","secrets","psych_money"],content:{title:"Advanced Finance: Beyond the Basics",readTime:"16 min",level:"Advanced",emoji:"🔭",text:"There is a layer of finance most people never get to. Not because it is hidden, but because they stop before they reach it.\n\nOptions and derivatives are financial instruments that get their value from something else. Used well they let you hedge your risk. Used carelessly they can wipe out far more than you put in.\n\nLeverage is borrowing money to invest more than you have. If you put in $10,000 and borrow another $10,000 to invest $20,000, a 10% gain gives you $2,000 profit. A 10% loss gives you a $2,000 loss, and you still owe the borrowed money. Leverage accelerates everything in both directions.\n\nTax-loss harvesting means selling an investment that is down so you can use that loss to offset a capital gain elsewhere. It is a legal way to reduce your tax bill.\n\nOn compounding and fees: $10,000 growing at 10% for 40 years becomes $452,000. The same amount growing at 12% becomes $930,000. A 2% fee makes that difference — it costs you more than double the outcome."}},
  secrets:{label:"Secrets About Money",icon:"lock",related:["psych_money","money","adv_finance"],content:{title:"Secrets About Money",readTime:"12 min",level:"Intermediate",emoji:"🔐",text:"Nobody sits you down and explains these things. But they are not hidden. They operate right in front of you.\n\nWhen a central bank creates new money, it does not reach everyone at the same time. It goes first to banks, then to large borrowers, then to corporations, and eventually to ordinary people. By the time it filters down, prices have already adjusted upward. This is the Cantillon Effect.\n\nInflation moves wealth from people holding cash to people holding assets. If you own property or shares, inflation pushes their value up. If you hold savings, inflation eats away at what those savings can actually buy.\n\nThe tax system charges the highest rates on wages. Income you earn from working is taxed harder than income you earn from owning things. The wealthy earn capital income. Workers earn labour income."}},
  gen_income:{label:"Generating Income",icon:"bolt",related:["trading","ai_services","psych_money"],content:{title:"Generating Income: The Honest Framework",readTime:"13 min",level:"Beginner",emoji:"⚡",text:"Strip away all the noise and there are really only three ways to earn money.\n\nThe first is trading your time. Employment, freelancing, consulting — any kind of work where you show up and get paid for the hours. The ceiling here is real. You only have so many hours and a human body that needs rest.\n\nThe second is deploying capital. You put money into something that generates a return while you are not working. Property, shares, a business you do not run day to day.\n\nThe third is building a system. A business, a piece of software, a content platform — something that can serve a thousand people without requiring a proportional increase in your time. This is where the real leverage is.\n\nThe sequence that works: trade time aggressively while young to build savings. Put savings to work. Use the returns and the knowledge gained to build something that operates without you."}},
  trading:{label:"Trading",icon:"trendDown",related:["dark_pools","ai_services","gen_income"],content:{title:"Trading: The Honest Truth",readTime:"12 min",level:"Advanced",emoji:"📉",text:"Most people who trade lose money. Around 80% of day traders are unprofitable within their first year. By five years, the number who are still consistently profitable drops to around 3%.\n\nThe ones who make it treat trading like a craft that takes years to learn. They do not wing it. They have a system, they track every trade, and they know their edge with statistical precision.\n\nIf you want to start, paper trade first. That means trading with fake money in a real market simulator for at least three months. If you cannot profit in a simulator, you will not profit when real money is on the line.\n\nAn edge in trading means you have a strategy where the expected outcome across hundreds of trades is positive. Most retail traders do not have an edge. They have a feeling. Feelings are not an edge."}},
  dropship:{label:"Dropshipping",icon:"box",related:["trading","ai_services","gen_income"],content:{title:"Dropshipping: What They Don't Tell You",readTime:"8 min",level:"Beginner",emoji:"📦",text:"Dropshipping means you sell a product online without ever touching it. A customer places an order on your store. You forward the order to a supplier. The supplier ships it directly to the customer. You keep the difference.\n\nMargins typically sit between 10 and 30%. That sounds reasonable until you look at what it actually costs to get customers. A paid ad on Facebook or Google that drives one sale might cost you more than your margin.\n\nThe honest picture: it works, but not easily. Most beginner-friendly niches are saturated. To make it work you need to find a product with real demand, build a brand around it, and get good enough at paid advertising to make the numbers profitable."}},
  ai_services:{label:"Selling AI Services",icon:"robot",related:["trading","gen_income","adv_finance"],content:{title:"Selling AI Services in 2025",readTime:"7 min",level:"Beginner",emoji:"🤖",text:"Right now there is a gap between what AI can do and what most businesses actually use it for. Most business owners know AI is a thing. Very few know how to apply it to their specific operation. That gap is the opportunity.\n\nYou do not need to be a programmer to sell AI services. You need to understand a handful of tools well enough to apply them to real business problems.\n\nThe services that attract real money right now: helping businesses automate their customer communications, building custom internal tools using no-code platforms, creating consistent content pipelines.\n\nA realistic starting point is one client at $500 to $1,000 a month for an ongoing automation or content service. That is achievable within 90 days."}},
  bias:{label:"Cognitive Biases",icon:"eye",related:["stoicism","psych_money","milgram"],content:{title:"Cognitive Biases: How Your Mind Tricks You",readTime:"9 min",level:"Intermediate",emoji:"🧠",text:"Your brain is not trying to think clearly. It is trying to think fast. The shortcuts it uses worked well for survival on the savannah. In modern life they cause real problems.\n\nConfirmation bias means you pay attention to information that agrees with what you already believe and quietly tune out what contradicts it.\n\nThe sunk cost fallacy keeps people in bad investments, bad jobs and bad relationships. You have already put in money or time, and leaving means accepting those resources were wasted. The resources are gone either way.\n\nThe availability heuristic makes you judge how likely something is by how easily an example comes to mind. Plane crashes get covered by every outlet for days. Car accidents barely make the news. So flying feels dangerous and driving feels normal, even though statistically it is the other way around."}},
  stoicism:{label:"Stoicism",icon:"scales",related:["bias","psych_money","nihilism"],content:{title:"Stoicism: The Philosophy of Control",readTime:"10 min",level:"Beginner",emoji:"⚖️",text:"Stoicism is built on one idea: separate what you control from what you do not, and stop spending energy on the second category.\n\nYour thoughts are yours. Your effort is yours. How you respond to things is yours. The weather, other people's behaviour, what happens in the economy — none of that is yours.\n\nMarcus Aurelius was the most powerful man in the Roman Empire and he wrote private notes to himself every night reminding himself of this. The notes were not meant to be published. They were a practice.\n\nEpictetus was born a slave. He had no political power, no property, no freedom of movement. He became one of the most influential philosophers in history. His argument was that his inner life was always his, regardless of external circumstances.\n\nThe daily practice is simple: in the morning, ask what you can control today. In the evening, ask whether you acted in line with your values."}},
  milgram:{label:"The Milgram Experiment",icon:"bolt",related:["bias","stanford_prison","learned_helpless"],content:{title:"The Milgram Experiment: Why Ordinary People Obey",readTime:"9 min",level:"Intermediate",emoji:"⚡",text:"In 1961, Stanley Milgram set up an experiment at Yale. Participants were told they were helping test whether punishment improved learning. They sat at a control panel and administered electric shocks to another person whenever that person got a question wrong. The shocks increased from 15 volts up to 450 volts.\n\nThe person in the other room was an actor. The shocks were not real. The participants did not know any of this.\n\nWhenever a participant hesitated, the experimenter calmly said: please continue. Nothing more.\n\n65% of participants administered the maximum shock.\n\nMost people, when placed inside a system with clear authority and diffused responsibility, will do things they would never do on their own. This experiment has implications for every institution humans build."}},
  stanford_prison:{label:"The Stanford Prison Experiment",icon:"🏫",related:["milgram","bias","learned_helpless"],content:{title:"The Stanford Prison Experiment: The Corruption of Power",readTime:"10 min",level:"Intermediate",emoji:"🏫",text:"Philip Zimbardo took 24 ordinary college students, flipped a coin to assign half as guards and half as prisoners, and put them in a mock prison. The plan was to run the study for two weeks.\n\nIt was shut down after six days.\n\nWithin 36 hours, one prisoner had a breakdown and had to leave. Guards began using psychological humiliation as standard practice. None of this was instructed. It emerged from the roles themselves.\n\nZimbardo himself became so absorbed in his role as prison superintendent that a visiting colleague had to point out to him that what he was watching was abuse, not an experiment.\n\nNormal people, randomly assigned to a role, began acting in accordance with that role within hours. Not because they were bad people. Because the system created expectations and the expectations shaped behaviour."}},
  learned_helpless:{label:"Learned Helplessness",icon:"🔒",related:["milgram","bias","dopamine"],content:{title:"Learned Helplessness: Why People Stop Trying",readTime:"8 min",level:"Beginner",emoji:"🔒",text:"Martin Seligman started with dogs. He put them in a situation where they received mild electric shocks they could not escape. After a while, he changed the situation so that escaping was possible. The dogs did not try. They had learned that their actions had no effect, and they stopped acting.\n\nThe same pattern shows up in humans. People who grow up in chaotic environments where what they do has no reliable effect on what happens to them often develop the belief that their actions do not matter. That belief persists even when their circumstances change.\n\nWhat reverses it is small wins. Tiny actions that produce predictable results. You do the thing, the thing happens. This rebuilds the sense that your actions have consequences, which is the foundation of agency."}},
  dopamine:{label:"Dopamine Loops",icon:"🧪",related:["learned_helpless","bias","manufactured_consent"],content:{title:"Dopamine Loops: How You Are Being Engineered",readTime:"9 min",level:"Intermediate",emoji:"🧪",text:"Dopamine gets called the pleasure chemical. That is not quite right. It is the wanting chemical. It fires when you anticipate a reward, not necessarily when you receive one.\n\nBehavioural scientists found that unpredictable rewards produce more dopamine than predictable ones. Slot machines are built around this. So are Instagram and TikTok.\n\nEvery time you open a social media app you do not know what you will find. Maybe something good, maybe nothing. That uncertainty keeps the system searching. You scroll not because you expect something great but because you might find it.\n\nA few weeks away from these inputs lets the baseline come back down. Things that used to feel boring start to feel worthwhile again."}},
  nihilism:{label:"Nihilism vs Stoicism",icon:"🌌",related:["stoicism","bias","platos_cave"],content:{title:"Nihilism vs Stoicism: Two Responses to a Meaningless Universe",readTime:"10 min",level:"Intermediate",emoji:"🌌",text:"If the universe has no built-in meaning — which is a position with real philosophical backing — then what is the point of anything?\n\nNihilism takes this seriously. There is no objective meaning, no moral truth embedded in reality. Sitting with this properly can feel like losing ground beneath your feet. It can also feel like being freed.\n\nStoicism comes at it differently. Meaning is found in living well: with honesty, with reason, paying attention to your own character. You cannot control what happens to you. You can control how you respond.\n\nMost people who actually think through nihilism end up somewhere closer to existentialism. Sartre argued that existence comes before essence. You are not born with a fixed purpose. The absence of built-in meaning is not a tragedy. It is what makes genuine choice possible."}},
  platos_cave:{label:"Plato's Allegory of the Cave",icon:"🕯️",related:["nihilism","stoicism","manufactured_consent"],content:{title:"Plato's Allegory of the Cave",readTime:"8 min",level:"Beginner",emoji:"🕯️",text:"Plato asked you to imagine people who have been chained in a cave their entire lives, facing a wall. Behind them a fire burns. Objects pass in front of the fire and cast shadows on the wall. The prisoners have never seen the objects. They have only ever seen the shadows. The shadows are their entire reality.\n\nWhen one prisoner is freed and dragged into sunlight for the first time, it is painful. Slowly he adjusts and sees the actual world. He goes back to tell the others. They do not believe him.\n\nThe way out is not consuming more information. The information might still be shadows. The way out is developing the habit of asking where your beliefs came from, who benefits from you holding them, and whether you have actually examined the underlying reality."}},
  manufactured_consent:{label:"Manufactured Consent",icon:"📺",related:["platos_cave","dopamine","milgram"],content:{title:"Manufactured Consent: How Public Opinion Is Shaped",readTime:"11 min",level:"Advanced",emoji:"📺",text:"In 1988 Noam Chomsky and Edward Herman published Manufacturing Consent. Their argument was uncomfortable: mass media in free societies does not need to censor to function as propaganda. It just needs to filter.\n\nThey identified five filters: ownership, advertising, sourcing, flak, and shared ideology. Nothing needs to be coordinated. Each filter operates independently. The result is that certain stories get told and others do not, without anyone issuing instructions.\n\nThe test is simple. Find a topic you have a strong opinion on. Ask where that opinion came from. What sources shaped it? Who owns those sources? Who benefits from the public holding that view? This is not about concluding that everything is a conspiracy. It is about being honest about the fact that your beliefs were formed somewhere, and somewhere has interests."}},
};

const LIBRARY={
  life:{label:"Life",icon:"leaf",children:{
    finance:{label:"Finance",icon:"wallet",children:{
      banking_control:{label:"Banking & Financial Control",icon:"bank",children:{fractional:CONTENT.fractional,federal_reserve:CONTENT.federal_reserve,credit_cards:CONTENT.credit_cards,inflation:CONTENT.inflation}},
      markets_investing:{label:"Markets & Investing",icon:"trending",children:{dark_pools:CONTENT.dark_pools,trading:CONTENT.trading,super:CONTENT.super}},
      money_power:{label:"Money & Power Systems",icon:"globe",children:{petrodollar:CONTENT.petrodollar,imf_world_bank:CONTENT.imf_world_bank,billionaire_tax:CONTENT.billionaire_tax}},
      housing:{label:"Housing & Cost of Living",icon:"home",children:{housing_trap:CONTENT.housing_trap}},
      personal_finance_cat:{label:"Personal Finance",icon:"barChart",children:{personal_finance:CONTENT.personal_finance}},
      secrets_money:{label:"Secrets To Money",icon:"lock",children:{secrets:CONTENT.secrets,psych_money:CONTENT.psych_money}},
    }},
    psychology:{label:"Psychology",icon:"brain",children:{
      human_behaviour:{label:"Human Behaviour",icon:"eye",children:{milgram:CONTENT.milgram,stanford_prison:CONTENT.stanford_prison,learned_helpless:CONTENT.learned_helpless}},
      emotions:{label:"Emotions",icon:"flask",children:{dopamine:CONTENT.dopamine}},
      social_psych:{label:"Social Psychology",icon:"users",children:{manufactured_consent:CONTENT.manufactured_consent,bias:CONTENT.bias}},
      philosophy_life:{label:"Philosophy",icon:"book",children:{stoicism:CONTENT.stoicism,nihilism:CONTENT.nihilism,platos_cave:CONTENT.platos_cave}},
    }},
  }},
  ideas:{label:"100 Ways to Make Money",icon:"lightbulb",children:{
    online:{label:"Online",icon:"globe",children:{trading_e:{...CONTENT.trading,label:"Trading"},dropship:CONTENT.dropship}},
    ai_cat:{label:"AI and Technology",icon:"robot",children:{ai_services:CONTENT.ai_services}},
  }},
};

const GUIDED_ORDER=["money","basics_au2","basics_us","adv_finance","secrets","psych_money","gen_income"];
const FINANCE_KEYS=["fractional","federal_reserve","credit_cards","inflation","dark_pools","super","petrodollar","imf_world_bank","billionaire_tax","housing_trap","personal_finance","psych_money","money","basics_au2","basics_us","adv_finance","secrets","gen_income","trading","dropship","ai_services"];

const allContent=[];
const flattenLib=(obj,path=[])=>Object.entries(obj).forEach(([k,v])=>{if(v.content)allContent.push({key:k,node:v,path});if(v.children)flattenLib(v.children,[...path,v.label]);});
flattenLib(LIBRARY);
GUIDED_ORDER.forEach(k=>{if(CONTENT[k]&&!allContent.find(c=>c.key===k))allContent.push({key:k,node:CONTENT[k],path:["Guided"]});});
const MAP={};allContent.forEach(c=>{MAP[c.key]=c;});

const DEFAULT_POSTS=[
  {id:"p1",author:"KC",title:"The moment I understood fractional reserve banking, I saw the world differently",body:"It took me three reads but once it clicked — that banks literally create money when they lend — everything else made sense.",image:null,votes:47,comments:[{id:"c1",author:"MR",text:"Same here. It is one of those pieces of knowledge you cannot un-know.",time:"2h ago"}],time:"3h ago",flair:"Finance"},
  {id:"p2",author:"JL",title:"Dopamine fasting changed my focus more than any productivity app",body:"Deleted socials for 30 days. The first week was brutal. By week three I was reading two books simultaneously and actually enjoying it.",image:null,votes:134,comments:[{id:"c2",author:"AK",text:"How did you handle the initial withdrawal period?",time:"1h ago"},{id:"c3",author:"JL",text:"Replaced it with walking. Boring at first then actually great.",time:"45m ago"}],time:"5h ago",flair:"Psychology"},
  {id:"p3",author:"SR",title:"Read the Petrodollar chapter — this needs to be taught in schools",body:"The fact that global oil pricing in USD is the foundation of American economic dominance and almost nobody knows about it is wild.",image:null,votes:89,comments:[],time:"8h ago",flair:"Finance"},
];
// ─────────────────────────────────────────────────────────
// SHARED UI COMPONENTS (all defined before LifeApp)
// ─────────────────────────────────────────────────────────
function Field({label,type="text",value,onChange,error,placeholder}){
  const[show,setShow]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {label&&<label style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:C.muted,fontFamily:"Georgia,serif"}}>{label}</label>}
      <div style={{position:"relative"}}>
        <input type={type==="password"?(show?"text":"password"):type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{width:"100%",background:C.white,border:`1.5px solid ${error?C.red:C.border}`,borderRadius:12,padding:type==="password"?"16px 50px 16px 16px":"16px",color:C.ink,fontSize:15,outline:"none",fontFamily:"Georgia,serif",boxSizing:"border-box"}}/>
        {type==="password"&&<button onClick={()=>setShow(!show)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:12}}>{show?"Hide":"Show"}</button>}
      </div>
      {error&&<span style={{fontSize:12,color:C.red,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{error}</span>}
    </div>
  );
}

function TreeNode({nodeKey,node,depth=0,onSelect,selectedKey,defaultOpen=false,play}){
  const[open,setOpen]=useState(defaultOpen);
  const hasChildren=node.children&&Object.keys(node.children).length>0;
  const isLeaf=!!node.content;const isSel=selectedKey===nodeKey;const isTop=depth===0;
  const pl=18+depth*16;
  return(
    <div>
      <button onClick={()=>{if(isLeaf){play("open");onSelect(nodeKey,node);}else{play("tap");setOpen(!open);}}}
        style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:`${isTop?14:11}px ${pl}px`,background:isSel?C.greenLt:"transparent",border:"none",borderLeft:isSel?`3px solid ${C.green}`:"3px solid transparent",cursor:"pointer",color:isTop?C.ink:depth===1?C.mid:C.muted,fontSize:isTop?15:depth===1?14:13,fontWeight:isTop?700:depth===1?500:400,textAlign:"left",fontFamily:"Georgia,serif",lineHeight:1.4}}
        onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=C.light;}}
        onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="transparent";}}>
        {node.icon&&Ic[node.icon]&&(isTop||depth<=1)&&<span style={{display:"flex",alignItems:"center",opacity:isTop?1:0.75}}>{Ic[node.icon]("none",isTop?"#4a8c5c":"#8a8070",isTop?18:15)}</span>}
        <span style={{flex:1}}>{node.label}</span>
        {hasChildren&&<svg width="10" height="10" viewBox="0 0 10 10" style={{marginRight:8,flexShrink:0,transform:open?"rotate(90deg)":"none",transition:"transform 0.2s"}}><polyline points="2,2 8,5 2,8" fill="none" stroke={C.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </button>
      {hasChildren&&open&&<div style={{borderLeft:`1px solid ${C.border}`,marginLeft:pl+6}}>{Object.entries(node.children).map(([k,child])=><TreeNode key={k} nodeKey={k} node={child} depth={depth+1} onSelect={onSelect} selectedKey={selectedKey} play={play}/>)}</div>}
    </div>
  );
}

function Bar({label,value,max,color,prefix="",suffix=""}){
  const pct=Math.round((value/max)*100);
  return(
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:12,color:C.mid,fontFamily:"Georgia,serif"}}>{label}</span>
        <span style={{fontSize:12,fontWeight:700,color:color||C.green,fontFamily:"Georgia,serif"}}>{prefix}{typeof value==="number"?value.toLocaleString():value}{suffix}</span>
      </div>
      <div style={{height:10,background:C.light,borderRadius:20}}>
        <div style={{height:"100%",width:`${pct}%`,background:color||C.green,borderRadius:20}}/>
      </div>
    </div>
  );
}
function LineChart({data,color,xLabel}){
  const mx=Math.max(...data.map(d=>d.v));const mn=Math.min(...data.map(d=>d.v));const rng=mx-mn||1;
  const W=280,H=120,P=8;
  const pts=data.map((d,i)=>({x:P+(i/(data.length-1))*(W-P*2),y:H-P-((d.v-mn)/rng)*(H-P*2)}));
  const path=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const fill=path+` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  return(
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",overflow:"visible"}}>
        <defs><linearGradient id="lcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color||C.green} stopOpacity="0.25"/><stop offset="100%" stopColor={color||C.green} stopOpacity="0.02"/></linearGradient></defs>
        <path d={fill} fill="url(#lcg)"/>
        <path d={path} fill="none" stroke={color||C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color||C.green}/>)}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{data.map((d,i)=><span key={i} style={{fontSize:10,color:C.muted,fontFamily:"Georgia,serif"}}>{d.l}</span>)}</div>
      {xLabel&&<p style={{fontSize:10,color:C.muted,textAlign:"center",margin:"6px 0 0",fontStyle:"italic"}}>{xLabel}</p>}
    </div>
  );
}
function ChartCard({title,children}){return(<div style={{margin:"32px 0",padding:"22px",background:C.white,border:`1px solid ${C.border}`,borderRadius:14}}><p style={{margin:"0 0 18px",fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted}}>{title}</p>{children}</div>);}
const FINANCE_CHARTS={
  fractional:()=>(<ChartCard title="The Money Multiplier in Action"><Bar label="Your deposit" value={1000} max={10000} color={C.red} prefix="$"/><Bar label="Bank lends out (90%)" value={900} max={10000} color="#d4834a" prefix="$"/><Bar label="Re-deposited & lent again" value={810} max={10000} color="#6FBE77" prefix="$"/><Bar label="Total money supply created" value={10000} max={10000} color={C.green} prefix="$"/><p style={{fontSize:11,color:C.muted,margin:"12px 0 0",fontStyle:"italic",textAlign:"center"}}>10% reserve ratio → 10x money multiplier</p></ChartCard>),
  inflation:()=>(<ChartCard title="Purchasing Power of $10,000 Over Time"><LineChart color={C.red} data={[{l:"Today",v:10000},{l:"5yr",v:8587},{l:"10yr",v:7374},{l:"20yr",v:5438},{l:"30yr",v:4010}]} xLabel="Cash loses half its value every ~23 years at 3% inflation"/></ChartCard>),
  personal_finance:()=>(<ChartCard title="The Cost of Waiting to Invest"><Bar label="Start at 25 (40 years)" value={1746} max={1746} color={C.green} prefix="$" suffix="k"/><Bar label="Start at 35 (30 years)" value={745} max={1746} color="#d4834a" prefix="$" suffix="k"/><Bar label="Start at 45 (20 years)" value={294} max={1746} color={C.red} prefix="$" suffix="k"/><p style={{fontSize:11,color:C.muted,margin:"12px 0 0",fontStyle:"italic",textAlign:"center"}}>$500/month at 8% — starting 10 years later costs over $1M</p></ChartCard>),
  trading:()=>(<ChartCard title="Day Trader Profitability Over Time"><Bar label="Profitable after 1 year" value={20} max={100} color={C.green} suffix="%"/><Bar label="Profitable after 3 years" value={7} max={100} color="#d4834a" suffix="%"/><Bar label="Profitable after 5 years" value={3} max={100} color={C.red} suffix="%"/><p style={{fontSize:11,color:C.muted,margin:"12px 0 0",fontStyle:"italic",textAlign:"center"}}>97% of people who trade for 5+ years are not profitable</p></ChartCard>),
  billionaire_tax:()=>(<ChartCard title="Effective Tax Rate by Income Group"><Bar label="Average salary earners" value={13.3} max={30} color={C.green} suffix="%"/><Bar label="High earners ($200k–$500k)" value={19.8} max={30} color="#d4834a" suffix="%"/><Bar label="Top 25 billionaires" value={3.4} max={30} color={C.red} suffix="%"/><p style={{fontSize:11,color:C.muted,margin:"12px 0 0",fontStyle:"italic",textAlign:"center"}}>ProPublica, IRS data</p></ChartCard>),
  gen_income:()=>(<ChartCard title="Income Ceiling by Method"><Bar label="Employment" value={150} max={10000} color={C.red} prefix="$" suffix="k"/><Bar label="Freelancing" value={400} max={10000} color="#d4834a" prefix="$" suffix="k"/><Bar label="Investment returns" value={3000} max={10000} color={C.green} prefix="$" suffix="k"/><Bar label="Business / system" value={10000} max={10000} color={C.gold} prefix="$" suffix="k+"/></ChartCard>),
};
function FinanceChart({topicKey}){const c=FINANCE_CHARTS[topicKey];if(!c)return null;return c();}

function AudioPlayer({title,playSound}){
  const[playing,setPlaying]=useState(false);const[elapsed,setElapsed]=useState(0);const total=180;const ref=useRef(null);
  const toggle=()=>{playSound(playing?"back":"open");if(!playing){ref.current=setInterval(()=>setElapsed(e=>{if(e>=total){clearInterval(ref.current);setPlaying(false);return 0;}return e+1;}),1000);}else clearInterval(ref.current);setPlaying(!playing);};
  const reset=()=>{clearInterval(ref.current);setPlaying(false);setElapsed(0);};
  useEffect(()=>()=>clearInterval(ref.current),[]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  return(
    <div style={{marginTop:40,padding:24,background:C.light,border:`1px solid ${C.border}`,borderRadius:14}}>
      <p style={{margin:"0 0 8px",fontSize:10,color:C.muted,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase"}}>Audio Narration</p>
      <p style={{margin:"0 0 16px",fontSize:13,color:C.mid,fontStyle:"italic"}}>{title}</p>
      <div style={{height:5,background:C.border,borderRadius:4,marginBottom:10,cursor:"pointer"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setElapsed(Math.floor(((e.clientX-r.left)/r.width)*total));}}>
        <div style={{height:"100%",width:`${(elapsed/total)*100}%`,background:C.green,borderRadius:4,transition:"width 0.5s linear"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <span style={{fontSize:11,color:C.muted}}>{fmt(elapsed)}</span><span style={{fontSize:11,color:C.muted}}>{fmt(total)}</span>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={toggle} style={{flex:1,background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>{playing?"⏸  Pause":"▶  Play AI Narration"}</button>
        <button onClick={reset} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 18px",color:C.mid,fontSize:16,cursor:"pointer"}}>↺</button>
      </div>
    </div>
  );
}

function FinanceDisclaimer(){return(<div style={{margin:"32px 0 0",padding:"18px 20px",background:"#fdfaf5",border:`1px solid ${C.border}`,borderRadius:10}}><p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.8,fontFamily:"Georgia,serif",fontStyle:"italic"}}>The content presented here is intended solely for general informational and educational purposes. It does not constitute financial advice, investment advice, or any form of professional financial guidance. All financial activity involves risk. Life. strongly encourages all readers to seek independent, qualified financial advice before acting on any information contained in this app.</p></div>);}

// ─────────────────────────────────────────────────────────
// NOTES TAB — full featured with iOS share sheet
// ─────────────────────────────────────────────────────────
function NotesTab({noteInput,setNoteInput,noteSaved,setNoteSaved,saveNote,shareNote,play,selContent}){
  const[showShare,setShowShare]=useState(false);
  const[copied,setCopied]=useState(false);

  const copyNotes=()=>{
    if(!noteInput.trim())return;
    navigator.clipboard?.writeText(noteInput).then(()=>{
      setCopied(true);play("ok");
      setTimeout(()=>setCopied(false),2000);
    }).catch(()=>{
      // fallback
      const ta=document.createElement("textarea");ta.value=noteInput;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);
      setCopied(true);play("ok");setTimeout(()=>setCopied(false),2000);
    });
  };

  const shareVia=(method)=>{
    play("ok");
    const text=`${selContent?.title?`"${selContent.title}"\n\n`:""}${noteInput}`;
    if(method==="postit"){shareNote();setShowShare(false);}
    else if(method==="native"){
      if(navigator.share){navigator.share({title:selContent?.title||"My Notes",text}).catch(()=>{});}
      else{navigator.clipboard?.writeText(text);alert("Copied to clipboard — paste anywhere to share.");}
      setShowShare(false);
    }
    else if(method==="whatsapp"){window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");setShowShare(false);}
    else if(method==="twitter"){window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text.slice(0,240))}`,"_blank");setShowShare(false);}
    else if(method==="copy"){navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);setShowShare(false);}
  };

  // iOS-style share icon SVG
  const ShareIcon=()=>(
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
      <polyline points="16,6 12,2 8,6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );

  return(
    <div style={{padding:"36px 28px",maxWidth:660,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
      {/* Header row */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
        <h2 style={{margin:0,fontSize:30,fontWeight:800,color:C.ink,fontFamily:"Georgia,serif",lineHeight:1.1}}>Your Notes</h2>
        <button onClick={copyNotes}
          style={{display:"flex",alignItems:"center",gap:6,background:copied?C.greenLt:C.white,border:`1.5px solid ${copied?C.green:C.border}`,borderRadius:10,padding:"9px 16px",color:copied?C.green:C.mid,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif",flexShrink:0,marginTop:4,transition:"all 0.2s"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          {copied?"Copied!":"Copy Notes"}
        </button>
      </div>
      {/* Quote */}
      <p style={{margin:"0 0 20px",fontSize:12,color:C.muted,fontStyle:"italic",fontFamily:"Georgia,serif",lineHeight:1.6,borderLeft:`3px solid ${C.border}`,paddingLeft:12}}>
        "You never fail, until you stop trying."
      </p>
      {/* Textarea */}
      <textarea
        value={noteInput}
        onChange={e=>{setNoteInput(e.target.value);setNoteSaved(false);}}
        placeholder="Start writing..."
        style={{width:"100%",minHeight:260,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"18px 20px",color:C.ink,fontSize:16,lineHeight:1.9,outline:"none",resize:"vertical",fontFamily:"Georgia,serif",boxSizing:"border-box"}}/>
      {/* Bottom row: Save + status left, Share right */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={saveNote} style={{background:"#6FBE77",border:"none",borderRadius:10,padding:"12px 26px",color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>Save Note</button>
          {noteSaved&&<span style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>Saved.</span>}
        </div>
        <button onClick={()=>setShowShare(true)}
          style={{display:"flex",alignItems:"center",gap:7,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px 18px",color:C.mid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>
          <ShareIcon/> Share My Notes
        </button>
      </div>

      {/* iOS-style share sheet modal */}
      {showShare&&(
        <>
          <div onClick={()=>setShowShare(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,backdropFilter:"blur(2px)"}}/>
          <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:201,background:C.white,borderRadius:"20px 20px 0 0",padding:"8px 0 32px",boxShadow:"0 -8px 40px rgba(0,0,0,0.18)"}}>
            {/* Sheet handle */}
            <div style={{width:36,height:4,borderRadius:2,background:C.border,margin:"10px auto 20px"}}/>
            <p style={{margin:"0 0 18px",textAlign:"center",fontSize:13,color:C.muted,fontFamily:"Georgia,serif",fontStyle:"italic",paddingBottom:14,borderBottom:`1px solid ${C.light}`}}>Share your notes</p>
            {/* Share grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"0 20px 20px"}}>
              {[
                {id:"native",label:"Share",icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,bg:"#eaf3ec"},
                {id:"postit",label:"Post-It",icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4a8c5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,bg:"#eaf3ec"},
                {id:"whatsapp",label:"WhatsApp",icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,bg:"#f0fdf4"},
                {id:"twitter",label:"Twitter / X",icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M4 20L20 4"/></svg>,bg:"#f5f5f5"},
                {id:"copy",label:"Copy Text",icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,bg:C.light},
              ].map(opt=>(
                <button key={opt.id} onClick={()=>shareVia(opt.id)}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:"10px 4px"}}>
                  <div style={{width:52,height:52,borderRadius:14,background:opt.bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>{opt.icon}</div>
                  <span style={{fontSize:11,color:C.mid,fontFamily:"Georgia,serif",textAlign:"center",lineHeight:1.3}}>{opt.label}</span>
                </button>
              ))}
            </div>
            <div style={{padding:"0 20px"}}>
              <button onClick={()=>setShowShare(false)} style={{width:"100%",background:C.light,border:"none",borderRadius:12,padding:"15px",color:C.mid,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// EBOOK READER — defined before LifeApp (fixes hoisting)
// ─────────────────────────────────────────────────────────
function EbookReader({selKey,selContent,tab,setTab,isBookmarked,toggleBk,play,noteInput,setNoteInput,noteSaved,setNoteSaved,saveNote,shareNote,related,handleSelect,bookmarks,allContent,profile}){
  const PARAS=4;
  const paragraphs=(selContent?.text||"").split("\n\n").filter(p=>p.trim());
  const totalPages=Math.max(1,Math.ceil(paragraphs.length/PARAS));
  const[pageNum,setPageNum]=useState(0);
  const[anim,setAnim]=useState(null);
  const pageRef=useRef(null);
  const sx=useRef(null);
  useEffect(()=>{setPageNum(0);setAnim(null);},[selKey]);
  const turn=(dir)=>{
    const next=pageNum+dir;
    if(next<0||next>=totalPages)return;
    play("pageturn");setAnim(dir>0?"l":"r");
    setTimeout(()=>{setPageNum(next);setAnim(null);if(pageRef.current)pageRef.current.scrollTop=0;},160);
  };
  const onTS=e=>{sx.current=e.touches[0].clientX;};
  const onTE=e=>{if(sx.current===null)return;const dx=e.changedTouches[0].clientX-sx.current;if(Math.abs(dx)>50)turn(dx<0?1:-1);sx.current=null;};
  const cur=paragraphs.slice(pageNum*PARAS,(pageNum+1)*PARAS);
  const isFirst=pageNum===0;const isLast=pageNum===totalPages-1;
  const animStyle=anim?{opacity:0,transform:anim==="l"?"translateX(-18px)":"translateX(18px)",transition:"opacity 0.15s,transform 0.15s"}:{opacity:1,transform:"translateX(0)",transition:"opacity 0.18s,transform 0.18s"};
  if(!selContent)return null;
  return(
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.white,padding:"0 16px",overflowX:"auto",flexShrink:0}}>
        {[{id:"content",label:"Read"},{id:"notes",label:"Notes"},{id:"suggestions",label:"Related"},{id:"saved",label:"Saved"}].map(t=>(
          <button key={t.id} onClick={()=>{play("tap");setTab(t.id);}} style={{padding:"17px 14px",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${C.green}`:"2px solid transparent",color:tab===t.id?C.green:C.muted,fontSize:13,fontWeight:tab===t.id?700:400,cursor:"pointer",fontFamily:"Georgia,serif",whiteSpace:"nowrap"}}>{t.label}</button>
        ))}
        <div style={{flex:1}}/>
        <button onClick={toggleBk} style={{background:"none",border:"none",cursor:"pointer",color:isBookmarked?C.gold:C.border,fontSize:24,padding:"0 6px"}}>{isBookmarked?Ic.starFilled():Ic.star()}</button>
      </div>
      {tab==="content"&&(
        <div style={{position:"relative",maxWidth:640,margin:"0 auto",width:"100%"}}>
        <div style={{position:"absolute",top:16,right:20,fontSize:11,fontWeight:700,color:C.muted,fontFamily:"Georgia,serif",letterSpacing:0.5,pointerEvents:"none",zIndex:5}}>{pageNum+1}/{totalPages}</div>
        <div ref={pageRef} onTouchStart={onTS} onTouchEnd={onTE} style={{overflowY:"auto",padding:"44px 32px 24px",boxSizing:"border-box"}}>
          {isFirst&&(
            <div style={{marginBottom:40}}>
              {profile&&(()=>{
                const score=computeEssentialScore(selKey,profile);
                if(score===null)return null;
                const pct=Math.round(score*100);
                const col=pct>=70?"#6FBE77":pct>=40?C.gold:C.muted;
                return(
                  <div style={{display:"inline-flex",alignItems:"center",gap:7,background:col+"18",border:`1px solid ${col}`,borderRadius:20,padding:"4px 12px 4px 8px",marginBottom:16}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                    <span style={{fontSize:11,fontWeight:700,color:col,fontFamily:"Georgia,serif",letterSpacing:0.4}}>Essential For Growth — {pct}%</span>
                  </div>
                );
              })()}
              <h1 style={{fontSize:28,fontWeight:800,margin:0,letterSpacing:-0.6,color:C.ink,lineHeight:1.25,fontFamily:"Georgia,serif",borderBottom:`2px solid ${C.border}`,paddingBottom:24}}>{selContent.title}</h1>
            </div>
          )}
          {!isFirst&&<p style={{margin:"0 0 32px",fontSize:11,color:C.muted,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",fontFamily:"Georgia,serif"}}>{selContent.title}</p>}
          <div style={animStyle}>
            {cur.map((para,i)=>(
              <p key={i} style={{margin:"0 0 28px",color:C.mid,fontSize:17,lineHeight:2.0,fontFamily:"Georgia,serif"}}
                dangerouslySetInnerHTML={{__html:para.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C.ink};font-weight:700">$1</strong>`)}}/>
            ))}
            {isLast&&(<><FinanceChart topicKey={selKey}/><AudioPlayer title={selContent.title} playSound={play}/>{FINANCE_KEYS.includes(selKey)&&<FinanceDisclaimer/>}</>)}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:48,paddingTop:24,borderTop:`1px solid ${C.light}`}}>
            <button onClick={()=>turn(-1)} disabled={pageNum===0} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:`1px solid ${pageNum===0?C.light:"#6FBE77"}`,borderRadius:10,padding:"12px 20px",cursor:pageNum===0?"default":"pointer",color:pageNum===0?C.light:"#4a8c5c",fontSize:13,fontFamily:"Georgia,serif"}}>
              <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="9,2 3,6 9,10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Previous
            </button>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {Array.from({length:totalPages}).map((_,i)=>(
                <button key={i} onClick={()=>{if(i!==pageNum){play("pageturn");setPageNum(i);if(pageRef.current)pageRef.current.scrollTop=0;}}} style={{width:i===pageNum?22:7,height:7,borderRadius:4,background:i===pageNum?C.green:C.border,border:"none",cursor:"pointer",padding:0,transition:"all 0.2s"}}/>
              ))}
            </div>
            <button onClick={()=>turn(1)} disabled={isLast} style={{display:"flex",alignItems:"center",gap:8,background:isLast?"none":"#6FBE77",border:`1px solid ${isLast?C.light:"#6FBE77"}`,borderRadius:10,padding:"12px 20px",cursor:isLast?"default":"pointer",color:isLast?C.light:C.white,fontSize:13,fontFamily:"Georgia,serif",fontWeight:isLast?400:700}}>
              Next<svg width="12" height="12" viewBox="0 0 12 12"><polyline points="3,2 9,6 3,10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <p style={{textAlign:"center",margin:"16px 0 0",fontSize:11,color:C.muted,fontStyle:"italic",fontFamily:"Georgia,serif"}}>Page {pageNum+1} of {totalPages}</p>
        </div>
        </div>
      )}
      {tab==="notes"&&(
        <NotesTab noteInput={noteInput} setNoteInput={setNoteInput} noteSaved={noteSaved} setNoteSaved={setNoteSaved} saveNote={saveNote} shareNote={shareNote} play={play} selContent={selContent}/>
      )}

      {tab==="suggestions"&&(
        <div style={{padding:"40px 28px",maxWidth:660,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
          <h3 style={{margin:"0 0 10px",fontSize:22,fontWeight:700,color:C.ink}}>Related Topics</h3>
          {related.length===0?<p style={{color:C.border,fontSize:15,fontStyle:"italic"}}>No related topics.</p>:related.map(item=>(
            <button key={item.key} onClick={()=>handleSelect(item.key,item.node)} style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",cursor:"pointer",marginBottom:12,textAlign:"left",fontFamily:"Georgia,serif"}}>
              <div style={{width:42,height:42,borderRadius:10,background:C.greenLt,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic[item.node.icon]?Ic[item.node.icon]("none","#4a8c5c",20):Ic.book("none","#4a8c5c",20)}</div>
              <div style={{flex:1,fontSize:15,fontWeight:600,color:C.ink}}>{item.node.label}</div>
            </button>
          ))}
        </div>
      )}
      {tab==="saved"&&(
        <div style={{padding:"40px 28px",maxWidth:660,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
          <h3 style={{margin:"0 0 10px",fontSize:22,fontWeight:700,color:C.ink}}>Saved Topics</h3>
          {bookmarks.length===0?<p style={{color:C.border,fontSize:15,fontStyle:"italic"}}>Tap ☆ while reading to save a topic.</p>:allContent.filter(c=>bookmarks.includes(c.key)).map(item=>(
            <button key={item.key} onClick={()=>handleSelect(item.key,item.node)} style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",cursor:"pointer",marginBottom:10,textAlign:"left",fontFamily:"Georgia,serif"}}>
              <div style={{width:42,height:42,borderRadius:10,background:C.greenLt,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic[item.node.icon]?Ic[item.node.icon]("none","#4a8c5c",20):Ic.book("none","#4a8c5c",20)}</div>
              <div style={{flex:1,fontSize:15,fontWeight:600,color:C.ink}}>{item.node.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QUIZ PAGE
// ─────────────────────────────────────────────────────────
const DIFF_COLORS={easy:C.green,medium:C.gold,hard:C.red};
const TOPIC_LABELS={finance:"Finance",psychology:"Psychology",money:"Money"};

function QuizPage({play}){
  const[phase,setPhase]=useState("setup");
  const[topic,setTopic]=useState("finance");
  const[diff,setDiff]=useState("medium");
  const[qType,setQType]=useState("multiple");
  const[qs,setQs]=useState([]);
  const[idx,setIdx]=useState(0);
  const[score,setScore]=useState(0);
  const[chosen,setChosen]=useState(null);
  const[timeLeft,setTimeLeft]=useState(0);
  const[streak,setStreak]=useState(0);
  const[bestStreak,setBestStreak]=useState(0);
  const[answers,setAnswers]=useState([]);
  const timerRef=useRef(null);
  const SECS={easy:20,medium:15,hard:10};

  const shuffle=arr=>[...arr].sort(()=>Math.random()-0.5);

  const startQuiz=()=>{
    play("ok");
    let pool=QUIZ_QUESTIONS[topic][diff]||[];
    const limit=qType==="blitz"?10:8;
    const selected=shuffle(pool).slice(0,limit);
    setQs(selected);setIdx(0);setScore(0);setChosen(null);setStreak(0);setBestStreak(0);setAnswers([]);
    setTimeLeft(qType==="blitz"?8:SECS[diff]);
    setPhase("playing");
  };

  useEffect(()=>{
    if(phase!=="playing"||chosen!==null)return;
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);handleAnswer(null);return 0;}
        return t-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[idx,phase,chosen]);

  const handleAnswer=(picked)=>{
    if(chosen!==null)return;
    clearInterval(timerRef.current);
    setChosen(picked);
    const q=qs[idx];
    const correct=picked===q.a;
    if(correct){play("correct");setScore(s=>s+1);setStreak(s=>{const ns=s+1;setBestStreak(b=>Math.max(b,ns));return ns;});}
    else{play("wrong");setStreak(0);}
    setAnswers(a=>[...a,{correct}]);
    setTimeout(()=>{
      if(idx+1>=qs.length){setPhase("result");}
      else{setIdx(i=>i+1);setChosen(null);setTimeLeft(qType==="blitz"?8:SECS[diff]);}
    },1100);
  };

  const maxTime=qType==="blitz"?8:SECS[diff];
  const timerPct=maxTime>0?timeLeft/maxTime:0;
  const timerColor=timerPct>0.5?C.green:timerPct>0.25?C.gold:C.red;

  if(phase==="setup")return(
    <div style={{padding:"40px 24px",maxWidth:520,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>{Ic.brain("none","#4a8c5c",28)}<h2 style={{fontSize:28,fontWeight:800,color:C.ink,margin:0,fontFamily:"Georgia,serif"}}>Quiz</h2></div>
      <p style={{color:C.muted,fontSize:15,margin:"0 0 36px",fontStyle:"italic",lineHeight:1.7}}>Test your knowledge on what you have read. Pick a topic, difficulty, and format — then race the clock.</p>

      <p style={{fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted,margin:"0 0 12px"}}>Topic</p>
      <div style={{display:"flex",gap:10,marginBottom:28,flexWrap:"wrap"}}>
        {Object.entries(TOPIC_LABELS).map(([k,label])=>(
          <button key={k} onClick={()=>{play("tap");setTopic(k);}} style={{flex:1,minWidth:90,background:topic===k?C.ink:C.white,border:`1.5px solid ${topic===k?C.ink:C.border}`,borderRadius:12,padding:"14px 10px",color:topic===k?C.white:C.mid,fontSize:14,fontWeight:topic===k?700:400,cursor:"pointer",fontFamily:"Georgia,serif"}}>{label}</button>
        ))}
      </div>

      <p style={{fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted,margin:"0 0 12px"}}>Difficulty</p>
      <div style={{display:"flex",gap:10,marginBottom:28}}>
        {["easy","medium","hard"].map(d=>(
          <button key={d} onClick={()=>{play("tap");setDiff(d);}} style={{flex:1,background:diff===d?DIFF_COLORS[d]:C.white,border:`1.5px solid ${diff===d?DIFF_COLORS[d]:C.border}`,borderRadius:12,padding:"14px 10px",color:diff===d?C.white:C.mid,fontSize:14,fontWeight:diff===d?700:400,cursor:"pointer",fontFamily:"Georgia,serif",textTransform:"capitalize"}}>{d}</button>
        ))}
      </div>

      <p style={{fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted,margin:"0 0 12px"}}>Format</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:36}}>
        {[{id:"multiple",label:"Multiple Choice",sub:`${SECS[diff]}s per question — 8 questions`},{id:"truefalse",label:"True / False",sub:"Quick-fire — 8 questions"},{id:"blitz",label:"Blitz Mode",sub:"8 seconds each — 10 questions"}].map(f=>(
          <button key={f.id} onClick={()=>{play("tap");setQType(f.id);}} style={{background:qType===f.id?C.greenLt:C.white,border:`1.5px solid ${qType===f.id?C.green:C.border}`,borderRadius:12,padding:"16px 18px",cursor:"pointer",textAlign:"left",fontFamily:"Georgia,serif",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:15,fontWeight:qType===f.id?700:500,color:qType===f.id?C.green:C.ink}}>{f.label}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:3,fontStyle:"italic"}}>{f.sub}</div>
            </div>
            {qType===f.id&&<div style={{width:20,height:20,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.white,fontSize:12}}>✓</span></div>}
          </button>
        ))}
      </div>

      <button onClick={startQuiz} style={{width:"100%",background:C.green,border:"none",borderRadius:14,padding:"18px",color:C.white,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 4px 16px rgba(74,140,92,0.3)"}}>Start Quiz →</button>
    </div>
  );

  if(phase==="result"){
    const pct=Math.round((score/qs.length)*100);
    const grade=pct>=90?"Excellent":pct>=70?"Good":pct>=50?"Decent":"Keep Reading";
    return(
      <div style={{padding:"40px 24px",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"center"}}>{pct>=70?Ic.star("none",C.gold,52):Ic.book("none",C.muted,52)}</div>
        <h2 style={{fontSize:26,fontWeight:800,color:C.ink,margin:"0 0 6px",fontFamily:"Georgia,serif"}}>{grade}</h2>
        <p style={{color:C.muted,fontSize:14,margin:"0 0 28px",fontStyle:"italic"}}>{TOPIC_LABELS[topic]} · {diff} · {qType==="blitz"?"Blitz":qType==="truefalse"?"True/False":"Multiple Choice"}</p>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:28,marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:52,fontWeight:800,color:C.green,lineHeight:1}}>{score}<span style={{fontSize:22,color:C.muted,fontWeight:400}}>/{qs.length}</span></div>
          <p style={{margin:"8px 0 20px",color:C.muted,fontSize:13,fontStyle:"italic"}}>{pct}% correct</p>
          <div style={{height:10,background:C.light,borderRadius:20,marginBottom:20}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?C.gold:C.red,borderRadius:20}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            <div><div style={{fontSize:20,fontWeight:700,color:C.ink}}>{bestStreak}</div><div style={{fontSize:11,color:C.muted}}>Best Streak</div></div>
            <div><div style={{fontSize:20,fontWeight:700,color:C.ink}}>{qs.length-score}</div><div style={{fontSize:11,color:C.muted}}>Missed</div></div>
            <div><div style={{fontSize:20,fontWeight:700,color:C.ink,textTransform:"capitalize"}}>{diff}</div><div style={{fontSize:11,color:C.muted}}>Difficulty</div></div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
          {answers.map((a,i)=>(
            <div key={i} style={{width:28,height:28,borderRadius:"50%",background:a.correct?C.green:C.red,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:C.white,fontSize:13}}>{a.correct?"✓":"✗"}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{play("tap");setPhase("setup");}} style={{flex:1,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"15px",color:C.mid,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>Change Setup</button>
          <button onClick={()=>{play("ok");startQuiz();}} style={{flex:1,background:C.green,border:"none",borderRadius:12,padding:"15px",color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>Play Again</button>
        </div>
      </div>
    );
  }

  const q=qs[idx];if(!q)return null;
  const opts=qType==="truefalse"?["True","False"]:q.opts;
  const correctIdx=qType==="truefalse"?0:q.a;
  return(
    <div style={{padding:"24px 24px 40px",maxWidth:520,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:12,color:C.muted,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{TOPIC_LABELS[topic]} · {diff}</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {streak>=2&&<span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,color:C.gold,fontWeight:700}}><svg width="13" height="13" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z"/><path d="M12 12c0 3-2 4-2 6a2 2 0 004 0c0-2-2-3-2-6z" fill={C.white} stroke="none"/></svg>{streak}</span>}
          <span style={{fontSize:13,fontWeight:700,color:C.green,fontFamily:"Georgia,serif"}}>{score}/{idx}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:24}}>
        {qs.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:4,background:i<idx?C.green:i===idx?C.gold:C.light}}/>)}
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
        <div style={{position:"relative",width:84,height:84}}>
          <svg width="84" height="84" style={{transform:"rotate(-90deg)"}}>
            <circle cx="42" cy="42" r="35" fill="none" stroke={C.light} strokeWidth="7"/>
            <circle cx="42" cy="42" r="35" fill="none" stroke={timerColor} strokeWidth="7"
              strokeDasharray={`${2*Math.PI*35}`}
              strokeDashoffset={`${2*Math.PI*35*(1-timerPct)}`}
              strokeLinecap="round"
              style={{transition:"stroke-dashoffset 1s linear,stroke 0.3s"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:24,fontWeight:800,color:timerColor,fontFamily:"Georgia,serif"}}>{timeLeft}</span>
          </div>
        </div>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:"24px 20px",marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
        <p style={{margin:"0 0 4px",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>Question {idx+1} of {qs.length}</p>
        <p style={{margin:0,fontSize:17,fontWeight:700,color:C.ink,lineHeight:1.5,fontFamily:"Georgia,serif"}}>{q.q}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {opts.map((opt,i)=>{
          let bg=C.white,border=`1.5px solid ${C.border}`,col=C.ink,fw=400;
          if(chosen!==null){
            if(i===correctIdx){bg=C.greenLt;border=`1.5px solid ${C.green}`;col=C.green;fw=700;}
            else if(i===chosen&&chosen!==correctIdx){bg="#fef2f2";border=`1.5px solid ${C.red}`;col=C.red;fw=700;}
            else{col=C.muted;}
          }
          return(
            <button key={i} onClick={()=>handleAnswer(i)} disabled={chosen!==null}
              style={{background:bg,border,borderRadius:12,padding:"15px 18px",textAlign:"left",cursor:chosen!==null?"default":"pointer",fontFamily:"Georgia,serif",color:col,fontSize:15,fontWeight:fw,display:"flex",alignItems:"center",gap:12,transition:"all 0.2s"}}>
              <span style={{width:28,height:28,borderRadius:"50%",background:chosen===null?C.light:i===correctIdx?C.green:i===chosen?C.red:C.light,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:chosen!==null&&(i===correctIdx||i===chosen)?C.white:C.muted,fontSize:12,fontWeight:700,transition:"all 0.2s"}}>
                {chosen!==null?(i===correctIdx?"✓":i===chosen?"✗":String.fromCharCode(65+i)):String.fromCharCode(65+i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────
// TAILORING SYSTEM — scoring engine + all screens
// ─────────────────────────────────────────────────────────

// Content tags map — what categories each topic belongs to
const CONTENT_TAGS={
  money:["finance","beginner","mindset"],
  basics_au2:["finance","beginner","australia"],
  basics_us:["finance","beginner","usa"],
  personal_finance:["finance","beginner","practical"],
  fractional:["finance","intermediate","economics"],
  federal_reserve:["finance","intermediate","economics"],
  credit_cards:["finance","beginner","practical"],
  inflation:["finance","beginner","economics"],
  dark_pools:["finance","advanced","economics"],
  petrodollar:["finance","advanced","economics"],
  imf_world_bank:["finance","advanced","economics"],
  billionaire_tax:["finance","intermediate","economics"],
  housing_trap:["finance","intermediate","practical"],
  adv_finance:["finance","advanced","practical"],
  secrets:["finance","intermediate","economics"],
  gen_income:["finance","intermediate","business","practical"],
  trading:["finance","advanced","business"],
  dropship:["business","beginner","practical"],
  ai_services:["business","beginner","practical","technology"],
  super:["finance","beginner","australia"],
  psych_money:["mindset","intermediate","finance"],
  bias:["mindset","intermediate","psychology"],
  stoicism:["mindset","beginner","philosophy"],
  milgram:["psychology","intermediate","social"],
  stanford_prison:["psychology","intermediate","social"],
  learned_helpless:["psychology","beginner","mindset"],
  dopamine:["psychology","intermediate","mindset"],
  nihilism:["philosophy","intermediate","mindset"],
  platos_cave:["philosophy","beginner","mindset"],
  manufactured_consent:["psychology","advanced","social"],
};

// Scoring weights for each question answer
const TSD_WEIGHTS={
  goals:{
    "Generate Income":      {finance:3,business:2,practical:2},
    "Start A Business":     {business:3,finance:2,practical:2},
    "Improving Mindset":    {mindset:3,psychology:2,philosophy:1},
    "Learning":             {philosophy:2,psychology:2,finance:1},
    "Freedom":              {finance:2,mindset:2,philosophy:2},
    "To Be Wiser":          {philosophy:3,mindset:2,psychology:1},
  },
  motivation:{
    "Financial Freedom":    {finance:3,business:2,practical:2},
    "Self-Improvement":     {mindset:3,psychology:2,philosophy:1},
    "Curiosity":            {philosophy:2,psychology:2,finance:1},
    "Solve Personal Problems":{practical:3,mindset:2,psychology:1},
    "Self-Discipline And Structure":{mindset:3,philosophy:2,psychology:1},
  },
  finance_level:{
    "No understanding (Beginner)": {beginner:3},
    "Basic understanding":         {beginner:2,intermediate:1},
    "Intermediate":                {intermediate:3},
    "Advanced":                    {advanced:2,intermediate:1},
    "Expert Understanding":        {advanced:3},
  },
  english_level:{
    "Beginner":         {short:3,simple:3},
    "Fluent":           {standard:3},
    "Shakespeare Level":{advanced_reading:3,philosophy:1},
  },
  learning_style:{
    "Reading":              {reading:3},
    "Videos":               {video:3},
    "Interactive/Hands-on": {practical:3,interactive:3},
    "Audio":                {audio:3},
  },
  life_areas:{
    "Finance":              {finance:3,practical:2},
    "Psychology/Mindset":   {mindset:3,psychology:2},
    "Discipline":           {mindset:2,philosophy:2,psychology:1},
    "Social Skills":        {social:3,psychology:2},
    "Health":               {mindset:2,psychology:1},
    "Business/Entrepreneurship":{business:3,finance:2,practical:2},
    "Communication":        {social:2,philosophy:1,psychology:1},
    "Productivity":         {practical:3,mindset:2,business:1},
  },
};

// Build a weighted profile from answers
function buildProfile(answers){
  const scores={};
  const add=(cat,val)=>{scores[cat]=(scores[cat]||0)+val;};

  // goals (single)
  if(answers.goals)Object.entries(TSD_WEIGHTS.goals[answers.goals]||{}).forEach(([k,v])=>add(k,v));
  // motivation (single)
  if(answers.motivation)Object.entries(TSD_WEIGHTS.motivation[answers.motivation]||{}).forEach(([k,v])=>add(k,v));
  // finance level (single)
  if(answers.finance_level)Object.entries(TSD_WEIGHTS.finance_level[answers.finance_level]||{}).forEach(([k,v])=>add(k,v));
  // english level (single)
  if(answers.english_level)Object.entries(TSD_WEIGHTS.english_level[answers.english_level]||{}).forEach(([k,v])=>add(k,v));
  // learning style (single)
  if(answers.learning_style)Object.entries(TSD_WEIGHTS.learning_style[answers.learning_style]||{}).forEach(([k,v])=>add(k,v));
  // time (slider 0-100, map to label)
  // life areas (multi)
  if(answers.life_areas)answers.life_areas.forEach(area=>{Object.entries(TSD_WEIGHTS.life_areas[area]||{}).forEach(([k,v])=>add(k,v));});

  // Determine difficulty tier from finance_level
  const diffMap={"No understanding (Beginner)":"beginner","Basic understanding":"beginner","Intermediate":"intermediate","Advanced":"advanced","Expert Understanding":"advanced"};
  const difficulty=diffMap[answers.finance_level]||"beginner";

  // Normalise scores to 0-1
  const max=Math.max(1,...Object.values(scores));
  const norm={};
  Object.entries(scores).forEach(([k,v])=>{norm[k]=Math.round((v/max)*100)/100;});

  // Top 3 categories
  const topCats=Object.entries(norm).filter(([k])=>["finance","mindset","psychology","business","philosophy","practical","social"].includes(k)).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);

  return{scores:norm,difficulty,topCats,answers,time:answers.time||40};
}

// Compute relevance score of a content key against the user profile (0-1 or null)
function computeEssentialScore(key,profile){
  if(!profile)return null;
  const tags=CONTENT_TAGS[key];
  if(!tags)return null;
  const s=profile.scores||{};
  let total=0,count=0;
  tags.forEach(tag=>{if(s[tag]!==undefined){total+=s[tag];count++;}});
  if(!count)return null;
  return Math.min(1,total/count);
}

// Sort content by profile match
function getPersonalisedRelated(related,profile){
  if(!profile||!related)return related;
  return [...related].sort((a,b)=>{
    const sa=computeEssentialScore(a.key,profile)||0;
    const sb=computeEssentialScore(b.key,profile)||0;
    return sb-sa;
  });
}

// ── TailorIntro screen ────────────────────────────────────
function TailorIntro({userName,onExplore,onTailor}){
  return(
    <div style={{minHeight:"100vh",background:C.skin,display:"flex",flexDirection:"column",fontFamily:"Georgia,serif"}}>
      {/* Top title */}
      <div style={{padding:"52px 32px 0",textAlign:"center"}}>
        <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,letterSpacing:3.5,textTransform:"uppercase",color:C.muted}}>Welcome{userName?`, ${userName.split(" ")[0]}`:""}</p>
        <h1 style={{margin:"0 0 0",fontSize:26,fontWeight:800,color:C.ink,lineHeight:1.2,letterSpacing:-0.5}}>Tailored Self-Development</h1>
      </div>
      {/* Main card */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"36px 28px"}}>
        <div style={{maxWidth:420,width:"100%"}}>
          {/* Decorative icon */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:28}}>
            <div style={{width:80,height:80,borderRadius:"24px",background:`linear-gradient(145deg,#6FBE77,#4a8c5c)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px rgba(74,140,92,0.28)"}}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
          </div>
          {/* Header text */}
          <p style={{margin:"0 0 8px",fontSize:16,color:C.mid,lineHeight:1.85,textAlign:"center",fontFamily:"Georgia,serif"}}>
            To best personalise your experience and help you grow, we would like to ask you a few questions so you do not waste valuable time learning on a subject that doesn't align with your values and goals.
          </p>
          {/* Quote */}
          <p style={{margin:"20px 0 36px",fontSize:13,color:"#b0a898",fontStyle:"italic",textAlign:"center",lineHeight:1.7,padding:"0 12px"}}>
            "Knowledge is the first step onto becoming successful, action is the second and final step."
          </p>
          {/* Buttons */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <button onClick={onTailor}
              style={{width:"100%",background:"#6FBE77",border:"none",borderRadius:14,padding:"18px",color:C.white,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 4px 16px rgba(111,190,119,0.35)"}}>
              Let's Get Tailoring! →
            </button>
            <button onClick={onExplore}
              style={{width:"100%",background:C.red,border:"none",borderRadius:14,padding:"18px",color:C.white,fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>
              I'm an Explorer!
            </button>
          </div>
        </div>
      </div>
      <p style={{textAlign:"center",padding:"0 0 24px",fontSize:10,color:C.muted,fontStyle:"italic"}}>You can retake this at any time from your profile.</p>
    </div>
  );
}

// ── TailorQuestions screen ────────────────────────────────
function TailorQuestions({onComplete,onBack}){
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({goals:null,motivation:null,finance_level:null,english_level:null,learning_style:null,time:40,life_areas:[]});
  const[animDir,setAnimDir]=useState("in");

  const questions=[
    {id:"goals",label:"What is your dream / goal?",multi:false,opts:["Generate Income","Start A Business","Improving Mindset","Learning","Freedom","To Be Wiser"]},
    {id:"motivation",label:"Why do you seek knowledge?",multi:false,opts:["Financial Freedom","Self-Improvement","Curiosity","Solve Personal Problems","Self-Discipline And Structure"]},
    {id:"finance_level",label:"What's your understanding of economics and basic financial literacy?",multi:false,opts:["No understanding (Beginner)","Basic understanding","Intermediate","Advanced","Expert Understanding"]},
    {id:"english_level",label:"How well do you understand and speak English?",multi:false,opts:["Beginner","Fluent","Shakespeare Level"]},
    {id:"learning_style",label:"What's your preferred learning style?",multi:false,opts:["Reading","Videos","Interactive/Hands-on","Audio"]},
    {id:"time",label:"How much time per week do you plan to dedicate to learning?",multi:false,opts:null,slider:true},
    {id:"life_areas",label:"What parts of your life do you need to improve on?",multi:true,opts:["Finance","Psychology/Mindset","Discipline","Social Skills","Health","Business/Entrepreneurship","Communication","Productivity"]},
  ];

  const q=questions[step];
  const total=questions.length;

  const timeLabels=[
    {v:0,label:"30 min a day"},
    {v:25,label:"Once a day"},
    {v:50,label:"Twice a day"},
    {v:75,label:"Every evening"},
    {v:100,label:"Everyday Nonstop 😤"},
  ];
  const getNearestLabel=(val)=>{
    let closest=timeLabels[0];
    timeLabels.forEach(t=>{if(Math.abs(t.v-val)<Math.abs(closest.v-val))closest=t;});
    return closest.label;
  };

  const isAnswered=()=>{
    if(q.slider)return true;
    if(q.multi)return answers[q.id].length>0;
    return answers[q.id]!==null;
  };

  const goNext=()=>{
    if(!isAnswered())return;
    if(step<total-1){setAnimDir("out");setTimeout(()=>{setStep(s=>s+1);setAnimDir("in");},180);}
    else{onComplete(buildProfile(answers));}
  };
  const goPrev=()=>{
    if(step===0){onBack();return;}
    setAnimDir("out");setTimeout(()=>{setStep(s=>s-1);setAnimDir("in");},180);
  };

  const toggleOpt=(id,val,multi)=>{
    if(multi){
      setAnswers(a=>{const arr=a[id];return{...a,[id]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]};});
    }else{
      setAnswers(a=>({...a,[id]:val}));
    }
  };

  const pct=Math.round(((step+1)/total)*100);

  return(
    <div style={{minHeight:"100vh",background:C.skin,display:"flex",flexDirection:"column",fontFamily:"Georgia,serif"}}>
      {/* Header */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"18px 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button onClick={goPrev} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:13,padding:0,fontFamily:"Georgia,serif"}}>← Back</button>
          <span style={{fontSize:12,color:C.muted,fontWeight:600}}>{step+1} / {total}</span>
          <div style={{width:40}}/>
        </div>
        {/* Progress bar */}
        <div style={{height:4,background:C.light,borderRadius:4}}>
          <div style={{height:"100%",width:`${pct}%`,background:"#6FBE77",borderRadius:4,transition:"width 0.35s ease"}}/>
        </div>
      </div>

      {/* Question */}
      <div style={{flex:1,padding:"36px 24px 24px",maxWidth:520,margin:"0 auto",width:"100%",boxSizing:"border-box",
        opacity:animDir==="out"?0:1,transform:animDir==="out"?"translateX(18px)":"translateX(0)",transition:"opacity 0.18s,transform 0.18s"}}>

        <p style={{margin:"0 0 6px",fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted}}>Question {step+1}</p>
        <h2 style={{margin:"0 0 28px",fontSize:21,fontWeight:800,color:C.ink,lineHeight:1.3,letterSpacing:-0.3}}>{q.label}</h2>

        {/* Slider for time question */}
        {q.slider&&(
          <div style={{padding:"8px 0 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:8}}>
              {timeLabels.map(t=>(
                <span key={t.v} style={{fontSize:10,color:Math.abs(t.v-answers.time)<14?C.green:C.muted,fontWeight:Math.abs(t.v-answers.time)<14?700:400,fontFamily:"Georgia,serif",textAlign:"center",maxWidth:70,lineHeight:1.3}}>{t.label}</span>
              ))}
            </div>
            <div style={{position:"relative",height:44,display:"flex",alignItems:"center"}}>
              <div style={{position:"absolute",left:0,right:0,height:5,background:C.border,borderRadius:4}}>
                <div style={{height:"100%",width:`${answers.time}%`,background:"#6FBE77",borderRadius:4}}/>
              </div>
              <input type="range" min="0" max="100" value={answers.time}
                onChange={e=>setAnswers(a=>({...a,time:Number(e.target.value)}))}
                style={{position:"absolute",left:0,right:0,width:"100%",opacity:0,height:44,cursor:"pointer",zIndex:2}}/>
              {/* Thumb */}
              <div style={{position:"absolute",left:`calc(${answers.time}% - 14px)`,width:28,height:28,borderRadius:"50%",background:"#6FBE77",boxShadow:"0 2px 10px rgba(111,190,119,0.45)",border:`3px solid ${C.white}`,pointerEvents:"none",transition:"left 0.05s"}}/>
            </div>
            <p style={{marginTop:20,textAlign:"center",fontSize:14,fontWeight:700,color:C.green,fontFamily:"Georgia,serif"}}>{getNearestLabel(answers.time)}</p>
          </div>
        )}

        {/* Option chips */}
        {!q.slider&&q.opts&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {q.opts.map(opt=>{
              const sel=q.multi?answers[q.id].includes(opt):answers[q.id]===opt;
              return(
                <button key={opt} onClick={()=>toggleOpt(q.id,opt,q.multi)}
                  style={{
                    background:sel?"#6FBE77":C.white,
                    border:`1.5px solid ${sel?"#6FBE77":C.border}`,
                    borderRadius:24,
                    padding:"11px 20px",
                    fontSize:14,
                    fontWeight:sel?700:400,
                    color:sel?C.white:C.mid,
                    cursor:"pointer",
                    fontFamily:"Georgia,serif",
                    transition:"all 0.15s",
                    display:"flex",alignItems:"center",gap:8,
                  }}>
                  {sel&&<svg width="13" height="13" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {q.multi&&<p style={{margin:"16px 0 0",fontSize:11,color:C.muted,fontStyle:"italic"}}>Select all that apply.</p>}
      </div>

      {/* Next button */}
      <div style={{padding:"16px 24px 36px",maxWidth:520,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <button onClick={goNext} disabled={!isAnswered()}
          style={{width:"100%",background:isAnswered()?"#6FBE77":C.light,border:"none",borderRadius:14,padding:"17px",color:isAnswered()?C.white:C.muted,fontSize:16,fontWeight:700,cursor:isAnswered()?"pointer":"default",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>
          {step<total-1?"Next →":"Build My Plan ✦"}
        </button>
      </div>
    </div>
  );
}

// ── TailorResult screen ───────────────────────────────────
function TailorResult({profile,userName,onContinue}){
  if(!profile)return null;
  const first=userName?userName.split(" ")[0]:"Explorer";

  const catMeta={
    finance:{label:"Finance",col:"#6FBE77",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>},
    mindset:{label:"Mindset",col:"#7B9ED9",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a4.5 4.5 0 000 9"/><path d="M14.5 2a4.5 4.5 0 010 9"/><path d="M5 11a4 4 0 004 4v5h6v-5a4 4 0 004-4"/></svg>},
    psychology:{label:"Psychology",col:"#C48BB8",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>},
    business:{label:"Business",col:C.gold,icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>},
    philosophy:{label:"Philosophy",col:"#9E8FA8",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/></svg>},
    practical:{label:"Practical Skills",col:"#7AB899",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>},
  };

  const topCats=profile.topCats||[];
  const scores=profile.scores||{};

  // Build recommended starting points
  const starters=Object.entries(CONTENT_TAGS)
    .map(([key,tags])=>{
      const score=computeEssentialScore(key,profile)||0;
      const diffMatch=tags.includes(profile.difficulty);
      return{key,score:score+(diffMatch?0.25:0)};
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0,3)
    .map(x=>x.key);

  return(
    <div style={{minHeight:"100vh",background:C.skin,fontFamily:"Georgia,serif",overflowY:"auto"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(160deg,#6FBE77 0%,#4a8c5c 100%)`,padding:"52px 28px 36px",textAlign:"center",position:"relative"}}>
        <div style={{width:56,height:56,borderRadius:"18px",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
        </div>
        <h1 style={{margin:"0 0 8px",fontSize:24,fontWeight:800,color:"white",letterSpacing:-0.4}}>Your Plan is Ready, {first}.</h1>
        <p style={{margin:0,fontSize:14,color:"rgba(255,255,255,0.82)",fontStyle:"italic",lineHeight:1.6}}>Personalised to your goals, pace, and level.</p>
      </div>

      <div style={{padding:"28px 24px",maxWidth:520,margin:"0 auto"}}>

        {/* Top focus areas */}
        <p style={{fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted,margin:"0 0 14px"}}>Your Focus Areas</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
          {topCats.filter(c=>catMeta[c]).map(cat=>{
            const meta=catMeta[cat];
            const pct=Math.round((scores[cat]||0)*100);
            return(
              <div key={cat} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,color:meta.col}}>{meta.icon}<span style={{fontSize:14,fontWeight:700,color:C.ink}}>{meta.label}</span></div>
                  <span style={{fontSize:13,fontWeight:700,color:meta.col}}>{pct}%</span>
                </div>
                <div style={{height:5,background:C.light,borderRadius:4}}>
                  <div style={{height:"100%",width:`${pct}%`,background:meta.col,borderRadius:4}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Difficulty level */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",marginBottom:28,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:C.greenLt,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
          </div>
          <div>
            <p style={{margin:"0 0 2px",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:C.muted}}>Starting Level</p>
            <p style={{margin:0,fontSize:16,fontWeight:700,color:C.ink,textTransform:"capitalize"}}>{profile.difficulty}</p>
          </div>
        </div>

        {/* Recommended starting topics */}
        <p style={{fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted,margin:"0 0 12px"}}>Where to Begin</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
          {starters.map((key,i)=>{
            const node=CONTENT[key];if(!node)return null;
            const pct=Math.round((computeEssentialScore(key,profile)||0)*100);
            return(
              <div key={key} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#6FBE77",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:C.white,fontSize:12,fontWeight:700}}>{i+1}</span>
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:"0 0 2px",fontSize:14,fontWeight:600,color:C.ink}}>{node.label}</p>
                  <p style={{margin:0,fontSize:11,color:C.muted,fontStyle:"italic"}}>{node.content?.level}</p>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:"#6FBE77",background:"#eaf3ec",padding:"3px 10px",borderRadius:20}}>{pct}% match</span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button onClick={onContinue}
          style={{width:"100%",background:"#6FBE77",border:"none",borderRadius:14,padding:"18px",color:C.white,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 4px 16px rgba(111,190,119,0.32)"}}>
          Start Learning →
        </button>
        <p style={{textAlign:"center",margin:"14px 0 0",fontSize:12,color:C.muted,fontStyle:"italic"}}>Your personalised experience is now active.</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────
// POST-IT FEED
// ─────────────────────────────────────────────────────────
function PostItFeed({posts,setPosts,play,user}){
  const[sort,setSort]=useState("recent");const[viewing,setViewing]=useState(null);
  const[showCompose,setShowCompose]=useState(false);const[newTitle,setNewTitle]=useState("");
  const[newBody,setNewBody]=useState("");const[newFlair,setNewFlair]=useState("Finance");const[commentText,setCommentText]=useState("");
  const flairs=["Finance","Psychology","Philosophy","Money","General"];
  const ini=n=>n?n.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2):"??";
  const sorted=[...posts].sort((a,b)=>sort==="votes"?b.votes-a.votes:sort==="trending"?(b.votes+b.comments.length*3)-(a.votes+a.comments.length*3):b.id.localeCompare(a.id));
  const vote=(id,dir)=>{play("tap");setPosts(ps=>ps.map(p=>p.id===id?{...p,votes:p.votes+dir}:p));};
  const addComment=()=>{if(!commentText.trim())return;play("ok");const c={id:"c"+Date.now(),author:ini(user?.name),text:commentText,time:"just now"};setPosts(ps=>ps.map(p=>p.id===viewing?{...p,comments:[...p.comments,c]}:p));setCommentText("");};
  const submitPost=()=>{if(!newTitle.trim())return;play("ok");setPosts(ps=>[{id:"p"+Date.now(),author:ini(user?.name),title:newTitle,body:newBody,image:null,votes:1,comments:[],time:"just now",flair:newFlair},...ps]);setNewTitle("");setNewBody("");setShowCompose(false);};
  const vp=posts.find(p=>p.id===viewing);
  if(vp)return(
    <div style={{padding:"20px 24px",maxWidth:620,margin:"0 auto"}}>
      <button onClick={()=>setViewing(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:13,padding:"0 0 16px",fontFamily:"Georgia,serif"}}>← Back to Feed</button>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:C.ink,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.white,fontSize:11,fontWeight:700}}>{vp.author}</span></div>
          <span style={{fontSize:13,fontWeight:600,color:C.ink}}>{vp.author}</span><span style={{fontSize:11,color:C.muted,marginLeft:4}}>{vp.time}</span>
          <span style={{marginLeft:"auto",background:C.greenLt,color:C.green,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{vp.flair}</span>
        </div>
        <h2 style={{fontSize:19,fontWeight:700,color:C.ink,margin:"0 0 12px",lineHeight:1.35}}>{vp.title}</h2>
        <p style={{fontSize:15,color:C.mid,lineHeight:1.8,margin:"0 0 20px",fontFamily:"Georgia,serif"}}>{vp.body}</p>
        <div style={{display:"flex",gap:10,borderTop:`1px solid ${C.light}`,paddingTop:14}}>
          <button onClick={()=>vote(vp.id,1)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,color:C.green}}>▲ {vp.votes}</button>
          <button onClick={()=>vote(vp.id,-1)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,color:C.red}}>▼</button>
        </div>
      </div>
      <div style={{marginTop:24}}>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,margin:"0 0 16px"}}>Comments ({vp.comments.length})</p>
        {vp.comments.map(c=>(
          <div key={c.id} style={{display:"flex",gap:12,marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:C.light,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,fontWeight:700,color:C.mid}}>{c.author}</span></div>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",flex:1}}>
              <span style={{fontSize:12,fontWeight:600,color:C.ink}}>{c.author}</span><span style={{fontSize:11,color:C.muted,marginLeft:8}}>{c.time}</span>
              <p style={{margin:"5px 0 0",fontSize:14,color:C.mid,fontFamily:"Georgia,serif",lineHeight:1.6}}>{c.text}</p>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Write a comment..." onKeyDown={e=>{if(e.key==="Enter")addComment();}} style={{flex:1,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"Georgia,serif",color:C.ink}}/>
          <button onClick={addComment} style={{background:C.green,border:"none",borderRadius:10,padding:"12px 18px",color:C.white,fontSize:14,fontWeight:700,cursor:"pointer"}}>Post</button>
        </div>
      </div>
    </div>
  );
  return(
    <div style={{padding:"20px 24px",maxWidth:620,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:22,fontWeight:700,color:C.ink,flex:1}}>Post-It</h2>
        <button onClick={()=>setShowCompose(true)} style={{background:C.green,border:"none",borderRadius:10,padding:"10px 18px",color:C.white,fontSize:22,fontWeight:300,cursor:"pointer",lineHeight:1}}>+</button>
      </div>
      {showCompose&&(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:24,marginBottom:20}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{flairs.map(f=><button key={f} onClick={()=>setNewFlair(f)} style={{background:newFlair===f?C.green:C.light,border:"none",borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:newFlair===f?700:400,color:newFlair===f?C.white:C.muted,cursor:"pointer"}}>{f}</button>)}</div>
          <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Title" style={{width:"100%",background:C.skin,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px",fontSize:15,fontWeight:600,color:C.ink,outline:"none",fontFamily:"Georgia,serif",boxSizing:"border-box",marginBottom:10}}/>
          <textarea value={newBody} onChange={e=>setNewBody(e.target.value)} placeholder="Share your thoughts..." rows={4} style={{width:"100%",background:C.skin,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px",fontSize:14,color:C.mid,outline:"none",fontFamily:"Georgia,serif",resize:"vertical",boxSizing:"border-box",marginBottom:14}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={submitPost} style={{flex:1,background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>Post</button>
            <button onClick={()=>setShowCompose(false)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 20px",color:C.muted,fontSize:14,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["recent","trending","votes"].map(s=>(
          <button key={s} onClick={()=>{play("tap");setSort(s);}} style={{background:sort===s?C.ink:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:sort===s?700:400,color:sort===s?C.white:C.muted,cursor:"pointer",textTransform:"capitalize"}}>{s==="votes"?"Top":s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>
      {sorted.map(post=>(
        <div key={post.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:C.ink,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.white,fontSize:10,fontWeight:700}}>{post.author}</span></div>
            <span style={{fontSize:12,color:C.muted}}>{post.time}</span>
            <span style={{marginLeft:"auto",background:C.greenLt,color:C.green,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{post.flair}</span>
          </div>
          <h3 style={{margin:"0 0 8px",fontSize:15,fontWeight:700,color:C.ink,lineHeight:1.35,cursor:"pointer"}} onClick={()=>{play("tap");setViewing(post.id);}}>{post.title}</h3>
          <p style={{margin:"0 0 14px",fontSize:13,color:C.mid,lineHeight:1.6,fontFamily:"Georgia,serif"}}>{post.body.length>160?post.body.slice(0,160)+"…":post.body}</p>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>vote(post.id,1)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,color:C.green}}>▲ {post.votes}</button>
            <button onClick={()=>vote(post.id,-1)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,color:C.red}}>▼</button>
            <button onClick={()=>{play("tap");setViewing(post.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.muted,fontFamily:"Georgia,serif"}}><span style={{display:'inline-flex',alignItems:'center',gap:5}}>{Ic.chat('none',C.muted,14)} {post.comments.length}</span></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function LifeApp(){
  const play=useSound();
  const[screen,setScreen]=useState("landing");
  const[users,setUsers]=useState(()=>LS.get("life_users",{}));
  const[user,setUser]=useState(()=>LS.get("life_user",null));
  const[siEmail,setSiEmail]=useState("");const[siPass,setSiPass]=useState("");const[siErr,setSiErr]=useState({});
  const[rName,setRName]=useState("");const[rEmail,setREmail]=useState("");const[rUsername,setRUsername]=useState("");const[rDob,setRDob]=useState("");const[rPass,setRPass]=useState("");const[rPass2,setRPass2]=useState("");const[rErr,setRErr]=useState({});
  useEffect(()=>{if(user)setScreen("app");},[]);

  const uid=user?.email||"_";
  const[bookmarks,setBookmarksRaw]=useState(()=>LS.get(`bk_${uid}`,[]));
  const[notes,setNotesRaw]=useState(()=>LS.get(`nt_${uid}`,{}));
  const[readKeys,setReadKeysRaw]=useState(()=>LS.get(`rd_${uid}`,[]));
  const[posts,setPosts]=useState(DEFAULT_POSTS);
  const setBookmarks=v=>{setBookmarksRaw(v);LS.set(`bk_${uid}`,v);};
  const setNotes=v=>{setNotesRaw(v);LS.set(`nt_${uid}`,v);};
  const setReadKeys=v=>{setReadKeysRaw(v);LS.set(`rd_${uid}`,v);};

  const[page,setPage]=useState("home");
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[selKey,setSelKey]=useState(null);
  const[selContent,setSelContent]=useState(null);
  const[selNode,setSelNode]=useState(null);
  const[tab,setTab]=useState("content");
  const[noteInput,setNoteInput]=useState("");
  const[noteSaved,setNoteSaved]=useState(false);
  const[search,setSearch]=useState("");
  const[showSearch,setShowSearch]=useState(false);
  const[lifeOpen,setLifeOpen]=useState(true);
  const[libOpen,setLibOpen]=useState(true);
  const[guidedOpen,setGuidedOpen]=useState(true);
  const[savedOpen,setSavedOpen]=useState(false);
  const[socialsOpen,setSocialsOpen]=useState(false);
  const[shareToast,setShareToast]=useState(false);
  const[profile,setProfileRaw]=useState(()=>LS.get(`tsd_${uid||"_"}`,null));
  const setProfile=v=>{setProfileRaw(v);LS.set(`tsd_${user?.email||"_"}`,v);};

  const doSignIn=()=>{
    const err={};
    if(!siEmail.trim())err.email="Enter your email or username.";
    if(!siPass)err.pass="Password is required.";
    if(Object.keys(err).length){setSiErr(err);play("err");return;}
    const low=siEmail.toLowerCase().trim();
    let stored=users[low];
    if(!stored){const f=Object.values(users).find(u=>u.username&&u.username.toLowerCase()===low);if(f)stored=f;}
    if(!stored){setSiErr({email:"No account found."});play("err");return;}
    if(stored.password!==siPass){setSiErr({pass:"Incorrect password."});play("err");return;}
    const u={email:stored.email||low,name:stored.name,username:stored.username};
    setUser(u);LS.set("life_user",u);play("ok");setScreen("app");
  };
  const doRegister=()=>{
    const err={};
    if(!rName.trim())err.name="Full name is required.";
    if(!rEmail.trim()||!rEmail.includes("@"))err.email="Enter a valid email.";
    if(!rUsername.trim())err.username="Username is required.";
    else if(rUsername.length<6)err.username="Username must be at least 6 characters.";
    else if(rUsername.length>15)err.username="Username must be 15 characters or fewer.";
    else if(/[^a-zA-Z0-9_]/.test(rUsername))err.username="Letters, numbers, underscores only.";
    else{const caps=(rUsername.match(/[A-Z]/g)||[]).length;if(caps>1)err.username="Only one capital letter allowed.";}
    if(!rDob)err.dob="Date of birth is required.";
    else{
      const[dd,mm,yy]=rDob.split("/").map(Number);
      const yr=yy<100?(yy<=26?2000+yy:1900+yy):yy;
      const dob=new Date(yr,mm-1,dd);const today=new Date();
      let age=today.getFullYear()-dob.getFullYear();
      if(today.getMonth()<mm-1||(today.getMonth()===mm-1&&today.getDate()<dd))age--;
      if(isNaN(dob.getTime())||dd<1||dd>31||mm<1||mm>12)err.dob="Enter a valid date (dd/mm/yy).";
      else if(age<13)err.dob="You must be 13 or older to use Life.";
    }
    if(rPass.length<6)err.pass="Password must be at least 6 characters.";
    else if(!/[&$#*@!%^]/.test(rPass))err.pass="Must contain a special character (&, $, #, *, @, !, %).";
    if(rPass!==rPass2)err.pass2="Passwords do not match.";
    if(Object.keys(err).length){setRErr(err);play("err");return;}
    if(users[rEmail.toLowerCase()]){setRErr({email:"Account already exists."});play("err");return;}
    const taken=Object.values(users).some(u=>u.username&&u.username.toLowerCase()===rUsername.toLowerCase());
    if(taken){setRErr({username:"Username already taken."});play("err");return;}
    const nu={...users,[rEmail.toLowerCase()]:{name:rName,password:rPass,username:rUsername,email:rEmail.toLowerCase()}};
    setUsers(nu);LS.set("life_users",nu);
    const u={email:rEmail.toLowerCase(),name:rName,username:rUsername};
    setUser(u);LS.set("life_user",u);play("ok");setScreen("tailor_intro");
  };
  const doSignOut=()=>{setUser(null);LS.set("life_user",null);setScreen("landing");setSiEmail("");setSiPass("");setSiErr({});};

  const handleSelect=(key,node)=>{
    setSelKey(key);setSelContent(node.content);setSelNode(node);
    setTab("content");setNoteInput(notes[key]||"");setNoteSaved(false);
    setSidebarOpen(false);setPage("reading");setSearch("");setShowSearch(false);
    if(!readKeys.includes(key))setReadKeys([...readKeys,key]);
  };
  const goHome=()=>{play("back");setPage("home");};
  const toggleBk=()=>{if(!selKey)return;play("star");setBookmarks(bookmarks.includes(selKey)?bookmarks.filter(b=>b!==selKey):[...bookmarks,selKey]);};
  const saveNote=()=>{if(!selKey)return;play("ok");setNotes({...notes,[selKey]:noteInput});setNoteSaved(true);};
  const shareNote=()=>{
    if(!selKey||!noteInput.trim())return;play("ok");
    const ini=user?.name?user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2):"KC";
    setPosts(ps=>[{id:"p"+Date.now(),author:ini,title:`Note: ${selContent?.title}`,body:noteInput,image:null,votes:1,comments:[],time:"just now",flair:"General"},...ps]);
    setShareToast(true);setTimeout(()=>setShareToast(false),2500);
  };

  const isBookmarked=bookmarks.includes(selKey);
  const related=(selNode?.related||[]).map(k=>MAP[k]).filter(Boolean);
  const searchResults=search.length>1?allContent.filter(i=>i.node.label.toLowerCase().includes(search.toLowerCase())||i.node.content?.text?.toLowerCase().includes(search.toLowerCase())):[];
  const initials=user?.name?user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2):"??";

  const SS=({label,open,setOpen,children})=>(
    <div style={{marginTop:20,borderTop:`1px solid ${C.light}`,paddingTop:16}}>
      <button onClick={()=>{play("tap");setOpen(!open);}} style={{display:"flex",alignItems:"center",width:"100%",padding:"0 20px 12px",background:"transparent",border:"none",cursor:"pointer"}}>
        <p style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:2.5,margin:0,textTransform:"uppercase",flex:1,textAlign:"left",fontFamily:"Georgia,serif"}}>{label}</p>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{transform:open?"rotate(90deg)":"none",transition:"transform 0.2s"}}><polyline points="2,2 8,5 2,8" fill="none" stroke={C.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open&&children}
    </div>
  );
  const SL=({label,icon,onClick,active})=>{
    const ic=icon&&Ic[icon];
    const stroke=active?C.green:"#8a8070";
    return(
      <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"12px 20px",background:active?C.greenLt:"transparent",border:"none",borderLeft:active?`3px solid ${C.green}`:"3px solid transparent",cursor:"pointer",color:active?C.green:C.mid,fontSize:14,textAlign:"left",fontFamily:"Georgia,serif",fontWeight:active?600:400}}
        onMouseEnter={e=>{if(!active)e.currentTarget.style.background=C.light;}}
        onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
        {ic&&<span style={{display:"flex",alignItems:"center",flexShrink:0}}>{ic("none",stroke,18)}</span>}
        <span style={{flex:1}}>{label}</span>
      </button>
    );
  };

  // ── Tailoring screens ──
  if(screen==="tailor_intro")return(
    <TailorIntro
      userName={user?.name}
      onExplore={()=>{play("tap");setScreen("app");}}
      onTailor={()=>{play("ok");setScreen("tailor_qs");}}
    />
  );
  if(screen==="tailor_qs")return(
    <TailorQuestions
      onComplete={(prof)=>{
        setProfile(prof);
        play("ok");
        setScreen("tailor_result");
      }}
      onBack={()=>{play("back");setScreen("tailor_intro");}}
    />
  );
  if(screen==="tailor_result")return(
    <TailorResult
      profile={profile}
      userName={user?.name}
      onContinue={()=>{play("ok");setScreen("app");}}
    />
  );

  // AUTH
  if(screen==="landing")return(
    <div style={{minHeight:"100vh",background:C.skin,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"40px 28px",position:"relative"}}>
      <div style={{marginBottom:28,textAlign:"center"}}>
        <div style={{width:120,height:120,borderRadius:"22%",background:`linear-gradient(145deg,${C.green},#2d6e42)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:"0 8px 32px rgba(74,140,92,0.35)"}}><span style={{color:C.white,fontSize:52,fontWeight:800,fontFamily:"Georgia,serif",letterSpacing:-2}}>l.</span></div>
        <h1 style={{margin:0,fontSize:42,fontWeight:800,color:C.ink,fontFamily:"Georgia,serif",letterSpacing:-1}}>Life.</h1>
        <p style={{margin:"8px 0 0",fontSize:15,color:C.muted,fontStyle:"italic"}}>Knowledge. Finance. Life.</p>
      </div>
      <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:14}}>
        <button onClick={()=>{play("tap");setScreen("signin");}} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"18px 20px",color:C.ink,fontSize:17,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sign In</button>
        <button onClick={()=>{play("tap");setScreen("register");}} style={{background:C.green,border:"none",borderRadius:14,padding:"18px 20px",color:C.white,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 3px 14px rgba(74,140,92,0.32)"}}>Register</button>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"4px 16px"}}>
          <div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.muted,fontSize:12,fontStyle:"italic",whiteSpace:"nowrap"}}>or continue with</span><div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          {["Google","Apple","Facebook"].map(p=><button key={p} onClick={()=>{play("ok");const u={email:p.toLowerCase()+"@social.com",name:p+" User",username:p.toLowerCase()+"user"};setUser(u);LS.set("life_user",u);setScreen("tailor_intro");}} style={{flex:1,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"13px 4px",color:C.mid,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>{p}</button>)}
        </div>
      </div>
      <p style={{position:"absolute",bottom:20,color:C.muted,fontSize:10,fontStyle:"italic",textAlign:"center"}}>© 2026 Life. All rights reserved.</p>
    </div>
  );
  if(screen==="signin")return(
    <div style={{minHeight:"100vh",background:C.skin,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"40px 28px"}}>
      <div style={{width:70,height:70,borderRadius:"20%",background:`linear-gradient(145deg,${C.green},#2d6e42)`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,boxShadow:"0 4px 16px rgba(74,140,92,0.3)"}}><span style={{color:C.white,fontSize:28,fontWeight:800}}>l.</span></div>
      <h2 style={{fontSize:26,fontWeight:700,margin:"0 0 32px",color:C.ink,fontFamily:"Georgia,serif"}}>Sign In</h2>
      <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:16}}>
        <Field label="Email or Username" value={siEmail} onChange={setSiEmail} error={siErr.email} placeholder="Email or username"/>
        <Field label="Password" type="password" value={siPass} onChange={setSiPass} error={siErr.pass} placeholder="Your password"/>
        <button onClick={doSignIn} style={{background:C.green,border:"none",borderRadius:12,padding:"17px",color:C.white,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",marginTop:4}}>Sign In</button>
        <button onClick={()=>{play("tap");setScreen("landing");setSiErr({});}} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",fontStyle:"italic"}}>← Back</button>
        <p style={{textAlign:"center",color:C.muted,fontSize:13,margin:0}}>No account?{" "}<button onClick={()=>{play("tap");setScreen("register");setSiErr({});}} style={{background:"none",border:"none",color:C.green,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:700}}>Register</button></p>
      </div>
    </div>
  );
  if(screen==="register")return(
    <div style={{minHeight:"100vh",background:C.skin,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"40px 28px"}}>
      <div style={{width:70,height:70,borderRadius:"20%",background:`linear-gradient(145deg,${C.green},#2d6e42)`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,boxShadow:"0 4px 16px rgba(74,140,92,0.3)"}}><span style={{color:C.white,fontSize:28,fontWeight:800}}>l.</span></div>
      <h2 style={{fontSize:26,fontWeight:700,margin:"0 0 32px",color:C.ink,fontFamily:"Georgia,serif"}}>Create Account</h2>
      <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:16}}>
        <Field label="Full Name" value={rName} onChange={setRName} error={rErr.name} placeholder="Your full name"/>
        <Field label="Email" type="email" value={rEmail} onChange={setREmail} error={rErr.email} placeholder="you@example.com"/>
        <div><Field label="Username" value={rUsername} onChange={setRUsername} error={rErr.username} placeholder="e.g. Kanucaven03"/><p style={{margin:"4px 0 0",fontSize:11,color:C.muted,fontStyle:"italic"}}>6–15 chars. One capital max. No special chars.</p></div>
        <Field label="Date of Birth (dd/mm/yy)" value={rDob} onChange={setRDob} error={rErr.dob} placeholder="dd/mm/yy"/>
        <Field label="Password" type="password" value={rPass} onChange={setRPass} error={rErr.pass} placeholder="Min 6 chars + special char"/>
        <Field label="Confirm Password" type="password" value={rPass2} onChange={setRPass2} error={rErr.pass2} placeholder="Repeat password"/>
        <button onClick={doRegister} style={{background:C.green,border:"none",borderRadius:12,padding:"17px",color:C.white,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",marginTop:4}}>Create Account</button>
        <button onClick={()=>{play("tap");setScreen("landing");setRErr({});}} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",fontStyle:"italic"}}>← Back</button>
      </div>
    </div>
  );

  // MAIN APP RENDER
  return(
    <div style={{minHeight:"100vh",background:C.skin,display:"flex",flexDirection:"column",fontFamily:"Georgia,serif",color:C.ink}}>
      {shareToast&&<div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",background:C.ink,color:C.white,padding:"10px 22px",borderRadius:20,fontSize:13,zIndex:999,boxShadow:"0 4px 14px rgba(0,0,0,0.2)"}}>Shared to Post-It ✓</div>}

      {/* TOP BAR */}
      <div style={{height:62,background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:10,position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <button onClick={()=>{play("tap");setSidebarOpen(!sidebarOpen);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",gap:5,padding:"6px 4px"}}>
            {[22,14,22].map((w,i)=><span key={i} style={{display:"block",width:w,height:2,background:C.mid,borderRadius:2}}/>)}
          </button>
          <button onClick={goHome} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
            <div style={{width:34,height:34,borderRadius:"22%",background:`linear-gradient(145deg,${C.green},#2d6e42)`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.white,fontSize:14,fontWeight:800,fontFamily:"Georgia,serif"}}>l.</span></div>
          </button>
        </div>
        <div style={{flex:1,margin:"0 10px",position:"relative"}}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
            <circle cx="6" cy="6" r="4.5" stroke={C.muted} strokeWidth="1.5"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={e=>{setSearch(e.target.value);setShowSearch(true);}} onFocus={()=>setShowSearch(true)} placeholder="Search topics..."
            style={{width:"100%",background:C.light,border:`1px solid ${C.border}`,borderRadius:20,padding:"9px 32px 9px 30px",color:C.ink,fontSize:13,outline:"none",fontFamily:"Georgia,serif",boxSizing:"border-box"}}/>
          {search&&<button onClick={()=>{setSearch("");setShowSearch(false);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:16}}>×</button>}
        </div>
        <button onClick={()=>{play("tap");setPage("profile");setSidebarOpen(false);}} style={{width:36,height:36,borderRadius:"50%",background:C.white,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
          <span style={{color:C.ink,fontSize:11,fontWeight:700}}>{initials}</span>
        </button>
      </div>

      {showSearch&&search.length>1&&(
        <div style={{position:"fixed",top:62,left:0,right:0,zIndex:200,background:C.white,borderBottom:`1px solid ${C.border}`,maxHeight:320,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.09)"}}>
          {searchResults.length===0?<p style={{color:C.muted,padding:"22px 28px",margin:0,fontSize:14,fontStyle:"italic"}}>No results.</p>
            :searchResults.map(item=>(
              <button key={item.key} onClick={()=>{handleSelect(item.key,item.node);setShowSearch(false);setSearch("");}}
                style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",borderBottom:`1px solid ${C.light}`,padding:"14px 24px",cursor:"pointer",fontFamily:"Georgia,serif"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.light}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{fontSize:15,fontWeight:600,color:C.ink}}>{item.node.icon&&<span style={{marginRight:8}}>{item.node.icon}</span>}{item.node.label}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2,fontStyle:"italic"}}>{item.path.join(" — ")}</div>
              </button>
            ))}
        </div>
      )}

      <div style={{display:"flex",flex:1,position:"relative",overflow:"hidden"}}>
        {sidebarOpen&&<div onClick={()=>{play("back");setSidebarOpen(false);}} style={{position:"fixed",inset:0,top:62,background:"rgba(0,0,0,0.18)",zIndex:30}}/>}

        {/* SIDEBAR */}
        <div style={{position:"fixed",top:62,left:0,bottom:0,width:288,background:C.white,borderRight:`1px solid ${C.border}`,overflowY:"auto",zIndex:40,transform:sidebarOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",paddingTop:16,paddingBottom:60}}>
          <SS label="Life." open={lifeOpen} setOpen={setLifeOpen}>
            <SL label="Where To Start?" icon="compass" onClick={()=>{play("tap");setPage("where_to_start");setSidebarOpen(false);}} active={page==="where_to_start"}/>
            <SL label="Quiz" icon="brain" onClick={()=>{play("tap");setPage("quiz");setSidebarOpen(false);}} active={page==="quiz"}/>
            <SL label="Help" icon="question" onClick={()=>{play("tap");setPage("help");setSidebarOpen(false);}} active={page==="help"}/>
          </SS>
          <SS label="Library" open={libOpen} setOpen={setLibOpen}>
            {Object.entries(LIBRARY).map(([k,node])=><TreeNode key={k} nodeKey={k} node={node} depth={0} onSelect={handleSelect} selectedKey={selKey} defaultOpen={k==="life"} play={play}/>)}
          </SS>
          <SS label="Guided" open={guidedOpen} setOpen={setGuidedOpen}>
            {GUIDED_ORDER.map(k=>{const node=CONTENT[k];if(!node)return null;return <SL key={k} label={node.label} icon={node.icon} onClick={()=>handleSelect(k,node)} active={selKey===k}/>;} )}
          </SS>
          <SS label="Saved" open={savedOpen} setOpen={setSavedOpen}>
            {bookmarks.length===0?<p style={{color:C.muted,fontSize:13,padding:"4px 20px 12px",fontStyle:"italic",margin:0}}>Nothing saved yet.</p>
              :allContent.filter(c=>bookmarks.includes(c.key)).map(item=><SL key={item.key} label={item.node.label} icon={item.node.icon} onClick={()=>{handleSelect(item.key,item.node);setSidebarOpen(false);}} active={false}/>)}
          </SS>
          <SS label="Socials" open={socialsOpen} setOpen={setSocialsOpen}>
            <SL label="Post-It" icon="pin" onClick={()=>{play("tap");setPage("postit");setSidebarOpen(false);}} active={page==="postit"}/>
            <SL label="Networking" icon="users" onClick={()=>{play("tap");setPage("networking");setSidebarOpen(false);}} active={page==="networking"}/>
          </SS>
          {/* Sidebar sign out */}
          <div style={{padding:"24px 20px 8px",borderTop:`1px solid ${C.light}`,marginTop:24}}>
            <button onClick={doSignOut} style={{width:"100%",background:C.white,border:`1.5px solid ${C.red}`,borderRadius:10,padding:"13px",color:C.red,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sign Out</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{flex:1,overflowY:"auto"}}>

          {page==="home"&&(
            <div>
              <div style={{padding:"14px 28px",background:C.white,borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Your Progress</span>
                  <span style={{fontSize:11,color:C.green,fontWeight:700}}>{readKeys.length}/{allContent.length} · {allContent.length>0?Math.round((readKeys.length/allContent.length)*100):0}%</span>
                </div>
                <div style={{height:4,background:C.light,borderRadius:4}}><div style={{height:"100%",width:`${allContent.length>0?Math.round((readKeys.length/allContent.length)*100):0}%`,background:C.green,borderRadius:4,transition:"width 0.4s"}}/></div>
              </div>
              <div style={{background:`linear-gradient(160deg,${C.white} 0%,${C.skin} 100%)`,padding:"52px 30px 44px",borderBottom:`1px solid ${C.border}`}}>
                <p style={{margin:"0 0 14px",fontSize:11,fontWeight:600,color:C.muted,letterSpacing:4,textTransform:"uppercase"}}>Welcome to</p>
                <h1 style={{margin:"0 0 20px",fontSize:56,fontWeight:800,color:C.ink,fontFamily:"Georgia,serif",letterSpacing:-1,textDecoration:"underline",textUnderlineOffset:8,textDecorationThickness:3,lineHeight:1}}>Life.</h1>
                <p style={{color:C.mid,fontSize:16,lineHeight:1.85,margin:"0 0 8px",maxWidth:480}}>Years of research and documentation compiled into one app. Cherry-picked data from real millionaires, interviews, hundreds of books, gurus, and studies — structured and categorised.</p>
                <p style={{color:C.muted,fontSize:14,lineHeight:1.7,margin:"0 0 28px",maxWidth:420,fontStyle:"italic"}}>No course. No guru. Pure, unheard-of information collected over years.</p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <button onClick={()=>{play("open");setSidebarOpen(true);}} style={{background:C.green,border:"none",borderRadius:12,padding:"14px 28px",color:C.white,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 3px 12px rgba(74,140,92,0.28)"}}>Start Reading →</button>
                  <button onClick={()=>{play("tap");setPage("quiz");}} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"14px 20px",color:C.ink,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}><span style={{display:"flex",alignItems:"center",gap:8}}>{Ic.brain("none",C.green,18)} Take a Quiz</span></button>
                </div>
              </div>
              <div style={{padding:"36px 28px",maxWidth:620,margin:"0 auto"}}>
                <p style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 20px"}}>What's inside</p>
                {[{icon:"leaf",label:"Life",sub:"Finance, psychology, philosophy and more"},{icon:"lightbulb",label:"100 Ways to Make Money",sub:"Online, AI, real-world income strategies"},{icon:"brain",label:"Quiz",sub:"Test your knowledge with timed questions"},{icon:"pin",label:"Post-It",sub:"Community discussion and sharing"}].map((item,i,arr)=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 0",borderBottom:i<arr.length-1?`1px solid ${C.light}`:"none"}}>
                    <div style={{width:46,height:46,borderRadius:12,background:C.white,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.icon}</div>
                    <div><div style={{fontSize:16,fontWeight:600,color:C.ink}}>{item.label}</div><div style={{fontSize:13,color:C.muted,marginTop:3,fontStyle:"italic"}}>{item.sub}</div></div>
                  </div>
                ))}
                <p style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",margin:"36px 0 16px"}}>Guided — Start here</p>
                {GUIDED_ORDER.slice(0,4).map(k=>{const node=CONTENT[k];if(!node)return null;return(
                  <button key={k} onClick={()=>handleSelect(k,node)} style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",cursor:"pointer",marginBottom:10,textAlign:"left",fontFamily:"Georgia,serif"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.light}
                    onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                    <div style={{width:40,height:40,borderRadius:10,background:C.greenLt,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic[node.icon]?Ic[node.icon]("none","#4a8c5c",20):null}</div>
                    <div style={{flex:1,fontSize:15,fontWeight:600,color:C.ink}}>{node.label}</div>
                    <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="2,2 8,5 2,8" fill="none" stroke={C.border} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                );})}
              </div>
            </div>
          )}

          {page==="where_to_start"&&(
            <div style={{padding:"48px 28px",maxWidth:560,margin:"0 auto"}}>
              <h2 style={{fontSize:26,fontWeight:700,color:C.ink,margin:"0 0 10px",fontFamily:"Georgia,serif"}}>Where To Start?</h2>
              <p style={{color:C.muted,fontSize:15,lineHeight:1.8,margin:"0 0 32px",fontStyle:"italic"}}>New to Life.? This is the recommended reading order.</p>
              {[{step:1,label:"Start with Money",desc:"Understand what money actually is before anything else.",key:"money"},{step:2,label:"Finance Basics for your country",desc:"Australia or America — learn the system you live inside.",key:"basics_au2"},{step:3,label:"The Psychological Game of Money",desc:"Your beliefs about money matter more than your strategy.",key:"psych_money"},{step:4,label:"Secrets About Money",desc:"The mechanisms nobody explains in school.",key:"secrets"},{step:5,label:"Generating Income",desc:"The honest framework for building financial independence.",key:"gen_income"}].map(item=>(
                <button key={item.step} onClick={()=>handleSelect(item.key,CONTENT[item.key])}
                  style={{display:"flex",alignItems:"flex-start",gap:16,width:"100%",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px",cursor:"pointer",marginBottom:12,textAlign:"left",fontFamily:"Georgia,serif"}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.light}
                  onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.white,fontSize:14,fontWeight:700}}>{item.step}</span></div>
                  <div><div style={{fontSize:15,fontWeight:700,color:C.ink,marginBottom:4}}>{item.label}</div><div style={{fontSize:13,color:C.muted,fontStyle:"italic"}}>{item.desc}</div></div>
                </button>
              ))}
              <div style={{marginTop:28,padding:22,background:C.greenLt,border:`1px solid ${C.green}`,borderRadius:14}}>
                <p style={{margin:"0 0 6px",fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.green}}>Test yourself</p>
                <p style={{margin:"0 0 14px",fontSize:15,color:C.ink,fontFamily:"Georgia,serif"}}>Once you have read a few topics, test your knowledge with a timed quiz.</p>
                <button onClick={()=>{play("tap");setPage("quiz");}} style={{background:C.green,border:"none",borderRadius:10,padding:"12px 22px",color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}><span style={{display:"inline-flex",alignItems:"center",gap:8}}>{Ic.brain("none",C.white,17)} Go to Quiz</span></button>
              </div>
            </div>
          )}

          {page==="quiz"&&<QuizPage play={play}/>}

          {page==="help"&&(
            <div style={{padding:"48px 28px",maxWidth:560,margin:"0 auto"}}>
              <h2 style={{fontSize:28,fontWeight:700,color:C.ink,margin:"0 0 12px"}}>Help</h2>
              <p style={{color:C.muted,fontSize:15,lineHeight:1.8,margin:"0 0 32px",fontStyle:"italic"}}>Everything you need to know about using Life.</p>
              {[["How do I navigate the app?","Tap the menu icon top left to open the sidebar. Browse Library folders or jump into Guided for a curated path."],["How do I save topics?","Tap the ☆ star on any reading page. All saved topics appear in the Saved section in the sidebar."],["How do I take notes?","Open any topic and tap the Notes tab. Write your thoughts and tap Save."],["What is Post-It?","The Life. community feed. Share insights, ask questions, and discuss topics with other readers."],["What is the Quiz?","Test your knowledge on Finance, Psychology, and Money. Pick easy, medium, or hard. Three formats: Multiple Choice, True/False, and Blitz."],["What is Guided?","A curated sequence designed to take you from zero understanding of money to a solid foundation."]].map(([q,a])=>(
                <div key={q} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px",marginBottom:12}}>
                  <p style={{margin:"0 0 8px",fontSize:15,fontWeight:700,color:C.ink}}>{q}</p>
                  <p style={{margin:0,fontSize:14,color:C.mid,lineHeight:1.7,fontFamily:"Georgia,serif"}}>{a}</p>
                </div>
              ))}
            </div>
          )}

          {page==="postit"&&<PostItFeed posts={posts} setPosts={setPosts} play={play} user={user}/>}

          {page==="networking"&&(
            <div style={{padding:"40px 28px",maxWidth:520,margin:"0 auto"}}>
              <h2 style={{fontSize:24,fontWeight:700,color:C.ink,margin:"0 0 10px"}}>Networking</h2>
              <p style={{color:C.muted,fontSize:15,lineHeight:1.8,margin:"0 0 32px",fontStyle:"italic"}}>Connect with others building real knowledge and financial independence.</p>
              <div style={{background:C.greenLt,border:`1px solid ${C.green}`,borderRadius:16,padding:28,textAlign:"center"}}>
                <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.green}}>Life. Community</p>
                <p style={{margin:"0 0 20px",fontSize:16,fontWeight:700,color:C.ink}}>Join the Discord Server</p>
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 20px",display:"inline-block",marginBottom:20}}>
                  <span style={{fontSize:22,fontWeight:800,letterSpacing:3,color:C.ink,fontFamily:"Georgia,serif"}}>#12345</span>
                </div>
                <p style={{margin:"0 0 20px",fontSize:13,color:C.muted,fontStyle:"italic"}}>Use invite code #12345 at discord.gg/life</p>
                <button onClick={()=>window.open("https://discord.gg","_blank")} style={{background:C.green,border:"none",borderRadius:12,padding:"14px 32px",color:C.white,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}}>Open Discord</button>
              </div>
            </div>
          )}

          {page==="profile"&&(
            <div style={{padding:"48px 28px",maxWidth:480,margin:"0 auto"}}>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:36}}>
                <div style={{width:70,height:70,borderRadius:"50%",background:C.white,border:`2px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24,fontWeight:700,color:C.ink}}>{initials}</span></div>
                <div><h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.ink}}>{user?.name}</h2><p style={{margin:0,fontSize:14,color:C.muted,fontStyle:"italic"}}>{user?.email}</p></div>
              </div>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:24,marginBottom:20}}>
                <p style={{margin:"0 0 16px",fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:C.muted}}>Your Stats</p>
                {[["Topics Read",readKeys.length],["Bookmarks Saved",bookmarks.length],["Notes Written",Object.keys(notes).filter(k=>notes[k]).length]].map(([label,val])=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.light}`}}>
                    <span style={{fontSize:15,color:C.mid,fontFamily:"Georgia,serif"}}>{label}</span>
                    <span style={{fontSize:15,fontWeight:700,color:C.green}}>{val}</span>
                  </div>
                ))}
              </div>
              <button onClick={doSignOut} style={{width:"100%",background:"none",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"15px",color:C.red,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sign Out</button>
            </div>
          )}

          {page==="reading"&&selContent&&(
            <EbookReader
              selKey={selKey}
              selContent={selContent}
              tab={tab}
              setTab={setTab}
              isBookmarked={isBookmarked}
              toggleBk={toggleBk}
              play={play}
              noteInput={noteInput}
              setNoteInput={setNoteInput}
              noteSaved={noteSaved}
              setNoteSaved={setNoteSaved}
              saveNote={saveNote}
              shareNote={shareNote}
              related={related}
              handleSelect={handleSelect}
              bookmarks={bookmarks}
              allContent={allContent}
              profile={profile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
