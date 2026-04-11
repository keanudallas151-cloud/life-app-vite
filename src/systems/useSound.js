import { useRef, useCallback } from "react";

// ── Sound personality map ──────────────────────────────────
// topic_select      → deep bass     → heavy, intentional actions
// drop_down_category→ medium bass   → navigation, transitions
// category_selection→ high pitch    → light taps, quick confirms
// home_sound        → home only     → full volume
// ─────────────────────────────────────────────────────────
const S = {
  deep:   "/sounds/topic_select.mp3",
  mid:    "/sounds/drop_down_category.mp3",
  high:   "/sounds/category_selection.mp3",
  home:   "/sounds/home_sound.mp3",
};

const VOL = 0.4; // 40% for everything except home

export function useSound(){
  const ctx=useRef(null);
  const cache=useRef({});

  const getAC=()=>{
    if(!ctx.current)ctx.current=new(window.AudioContext||window.webkitAudioContext)();
    return ctx.current;
  };

  const playMP3=useCallback((src, volume=VOL)=>{
    try{
      const ac=getAC();
      const fire=(buf)=>{
        const source=ac.createBufferSource();
        const gain=ac.createGain();
        gain.gain.value=volume;
        source.buffer=buf;
        source.connect(gain);gain.connect(ac.destination);
        source.start();
      };
      if(cache.current[src]){fire(cache.current[src]);return;}
      fetch(src)
        .then(r=>r.arrayBuffer())
        .then(buf=>ac.decodeAudioData(buf))
        .then(decoded=>{cache.current[src]=decoded;fire(decoded);})
        .catch(()=>{/* decode/network */});
    }catch{/* AudioContext */ }
  },[]);

  const play=useCallback((type)=>{
    try{
      // ── MP3 sounds ──────────────────────────────────────
      // home: full volume, deep bass — feels like returning to base
      if(type==="home"){playMP3(S.home, 1.0);return;}

      // open: deep bass — opening sidebar/content, weighty moment
      if(type==="open"){playMP3(S.deep);return;}

      // star/bookmark: deep bass — intentional, satisfying save
      if(type==="star"){playMP3(S.deep);return;}

      // pageturn/back: medium bass — smooth page/nav transitions
      if(type==="pageturn"||type==="back"){playMP3(S.mid);return;}

      // tap/ok: high pitch — light quick taps & confirmations
      if(type==="tap"||type==="ok"){playMP3(S.high);return;}

      // ── Generated sounds (quiz + errors) ────────────────
      const ac=getAC();
      const v=VOL;

      if(type==="correct"){
        [0,0.08].forEach((t,i)=>{
          const o=ac.createOscillator(),g=ac.createGain();
          o.connect(g);g.connect(ac.destination);
          o.frequency.setValueAtTime([520,660][i],ac.currentTime+t);
          g.gain.setValueAtTime(0.08*v,ac.currentTime+t);
          g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+t+0.18);
          o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.2);
        });return;
      }
      if(type==="wrong"){
        const o=ac.createOscillator(),g=ac.createGain();
        o.connect(g);g.connect(ac.destination);
        o.type="sawtooth";
        o.frequency.setValueAtTime(220,ac.currentTime);
        o.frequency.exponentialRampToValueAtTime(140,ac.currentTime+0.25);
        g.gain.setValueAtTime(0.07*v,ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.25);
        o.start();o.stop(ac.currentTime+0.25);return;
      }
      if(type==="err"){
        const o=ac.createOscillator(),g=ac.createGain();
        o.connect(g);g.connect(ac.destination);
        o.type="sawtooth";
        o.frequency.setValueAtTime(220,ac.currentTime);
        o.frequency.exponentialRampToValueAtTime(180,ac.currentTime+0.2);
        g.gain.setValueAtTime(0.07*v,ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.2);
        o.start();o.stop(ac.currentTime+0.2);return;
      }
    }catch{/* oscillator */ }
  },[playMP3]);

  return play;
}