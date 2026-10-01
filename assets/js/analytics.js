(function(){
  if(window.__CASASTUDENT_ANALYTICS_LOADED__) return;
  window.__CASASTUDENT_ANALYTICS_LOADED__=true;
  const cfg=window.STUDENTBNB_CONFIG||{};
  if(!cfg.supabaseUrl||!cfg.supabasePublishableKey) return;
  const params=new URLSearchParams(location.search);
  const market=params.get("country")||cfg.countryCode||"EU";
  const path=(location.pathname||"/")+(location.search||"");
  const uuid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${"6c5c9795c0f418"}`;
  const key=(name)=>`casastudent:analytics:${name}:v1`;
  const getId=(storage,name)=>{try{let id=storage.getItem(key(name));if(!id){id=uuid();storage.setItem(key(name),id)}return id}catch(_){return uuid()}};
  const visitorId=getId(localStorage,"visitor"), sessionId=getId(sessionStorage,"session");
  function send(eventName,properties={}){
    const body={event_name:eventName,path:path.slice(0,500),anonymous_session_id:sessionId,visitor_id:visitorId,country_code:market,referrer_host:(()=>{try{return document.referrer?new URL(document.referrer).hostname:null}catch(_){return null}})(),properties};
    fetch(`${cfg.supabaseUrl}`+"/rest/v1/analytics_events",{method:"POST",headers:{apikey:cfg.supabasePublishableKey,Authorization:`Bearer ${cfg.supabasePublishableKey}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(body),keepalive:true}).catch(()=>{});
  }
  if(path!=="stats.html") send("page_view",{title:document.title||"",screen:`${screen.width}x${screen.height}`});
  addEventListener("click",event=>{const a=event.target.closest&&event.target.closest("a[href]");const b=event.target.closest&&event.target.closest("button");const target=a||b;if(!target)return;const label=(target.textContent||target.getAttribute("aria-label")||"").trim().slice(0,120);if(a){const href=a.getAttribute("href")||"";if(a.classList.contains("header-cta")||a.classList.contains("btn")||a.classList.contains("publish-choice"))send("cta_click",{label,href:href.slice(0,300)});if(/^https?:/i.test(href)&&!href.includes(location.hostname))send("outbound_click",{label,href:href.slice(0,300)});else if(href&&!href.startsWith("#")&&!href.startsWith("mailto:")&&!href.startsWith("tel:"))send("internal_click",{label,href:href.slice(0,300)})}else if(b&&b.classList.contains("btn"))send("cta_click",{label})},{passive:true});
})();
