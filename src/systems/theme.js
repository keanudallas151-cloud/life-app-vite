export const C = {
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
