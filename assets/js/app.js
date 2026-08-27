const strongSites={IT:'https://www.casastudent.it/',ES:'https://www.casastudent.es/',FR:'https://www.casastudent.fr/',DE:'https://www.casastudent.de/',PL:'https://www.casastudent.pl/'};
const countryNames={IE:'Ireland',UK:'United Kingdom',PT:'Portugal',ES:'Spain',FR:'France',BE:'Belgium',NL:'Netherlands',DE:'Germany',DK:'Denmark',NO:'Norway',SE:'Sweden',FI:'Finland',PL:'Poland',CZ:'Czech Republic',AT:'Austria',CH:'Switzerland',IT:'Italy',SI:'Slovenia',HR:'Croatia',HU:'Hungary',SK:'Slovakia',RO:'Romania',BG:'Bulgaria',GR:'Greece',RS:'Serbia',EE:'Estonia',LV:'Latvia',LT:'Lithuania'};
const countryCities={PT:['Lisbon','Porto','Coimbra','Braga'],NL:['Amsterdam','Rotterdam','Utrecht','Groningen'],BE:['Brussels','Leuven','Ghent','Antwerp'],AT:['Vienna','Graz','Innsbruck','Salzburg'],CZ:['Prague','Brno','Olomouc'],HU:['Budapest','Szeged','Debrecen'],GR:['Athens','Thessaloniki','Patras'],HR:['Zagreb','Split','Rijeka'],SI:['Ljubljana','Maribor'],IE:['Dublin','Cork','Galway'],DK:['Copenhagen','Aarhus','Odense'],SE:['Stockholm','Lund','Uppsala','Gothenburg'],FI:['Helsinki','Turku','Tampere'],NO:['Oslo','Bergen','Trondheim'],RO:['Bucharest','Cluj-Napoca','Timișoara'],BG:['Sofia','Plovdiv','Varna'],SK:['Bratislava','Košice'],EE:['Tallinn','Tartu'],LV:['Riga'],LT:['Vilnius','Kaunas'],RS:['Belgrade','Novi Sad'],CH:['Zurich','Geneva','Lausanne'],UK:['London','Manchester','Edinburgh','Bristol']};
function countryHref(code){return strongSites[code]||`country.html?country=${code}`}
document.querySelectorAll('[data-country]').forEach(el=>{const code=el.dataset.country;el.href=countryHref(code)});
const countrySelect=document.querySelector('#countrySelect');const citySelect=document.querySelector('#citySelect');const searchBtn=document.querySelector('#searchBtn');
if(countrySelect){Object.keys(countryNames).forEach(code=>{const o=document.createElement('option');o.value=code;o.textContent=countryNames[code];countrySelect.appendChild(o)});countrySelect.addEventListener('change',()=>{citySelect.innerHTML='<option value="">Select city</option>';(countryCities[countrySelect.value]||[]).forEach(city=>{const o=document.createElement('option');o.value=city;o.textContent=city;citySelect.appendChild(o)});citySelect.disabled=!(countryCities[countrySelect.value]||[]).length});}
if(searchBtn)searchBtn.addEventListener('click',()=>{const code=countrySelect.value;if(!code)return;const base=countryHref(code);if(strongSites[code]){location.href=base;return}const city=citySelect.value;location.href=`country.html?country=${code}${city?`&city=${encodeURIComponent(city)}`:''}`});

const numericToCode={
  '372':'IE','826':'UK','620':'PT','724':'ES','250':'FR','56':'BE','528':'NL','276':'DE','208':'DK','578':'NO','752':'SE','246':'FI','616':'PL','203':'CZ','40':'AT','756':'CH','380':'IT','705':'SI','191':'HR','348':'HU','703':'SK','642':'RO','100':'BG','300':'GR','688':'RS','233':'EE','428':'LV','440':'LT'
};

function loadScript(src,key){
  if(document.querySelector(`script[data-map-lib="${key}"]`)) return Promise.resolve();
  return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.dataset.mapLib=key;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
}

async function renderEuropeMap(){
  const container=document.querySelector('.europe-map');
  if(!container)return;
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js','d3');
    await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js','topojson');
    const response=await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json',{cache:'force-cache'});
    if(!response.ok)throw new Error('Map data unavailable');
    const atlas=await response.json();
    const all=topojson.feature(atlas,atlas.objects.countries).features;
    const features=all.filter(f=>numericToCode[String(Number(f.id))]);
    if(!features.length)throw new Error('No European geometry');

    const width=Math.max(760,container.clientWidth||1000);
    const height=620;
    const svg=d3.create('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label','Interactive geographic map of Europe').attr('preserveAspectRatio','xMidYMid meet');
    const projection=d3.geoMercator().fitExtent([[38,26],[width-38,height-34]],{type:'FeatureCollection',features});
    const path=d3.geoPath(projection);

    svg.append('path').datum({type:'Sphere'}).attr('class','map-ocean').attr('d',path);
    svg.append('path').datum(d3.geoGraticule10()).attr('class','map-graticule').attr('d',path);

    const tooltip=document.createElement('div');
    tooltip.className='map-tooltip';
    tooltip.hidden=true;
    container.appendChild(tooltip);

    const countries=svg.append('g').attr('class','map-countries');
    countries.selectAll('path').data(features).join('path')
      .attr('d',path)
      .attr('class',d=>{const code=numericToCode[String(Number(d.id))];return `geo-country${strongSites[code]?' national':''}`})
      .attr('tabindex',0)
      .attr('role','link')
      .attr('aria-label',d=>{const code=numericToCode[String(Number(d.id))];return `${countryNames[code]}${strongSites[code]?' — dedicated national CasaStudent portal':''}`})
      .on('mouseenter focus',function(event,d){const code=numericToCode[String(Number(d.id))];d3.select(this).classed('active',true);tooltip.hidden=false;tooltip.innerHTML=`<strong>${countryNames[code]}</strong><span>${strongSites[code]?'Dedicated CasaStudent portal':'Explore student cities'}</span>`})
      .on('mousemove',function(event){const box=container.getBoundingClientRect();tooltip.style.left=`${Math.min(event.clientX-box.left+14,box.width-190)}px`;tooltip.style.top=`${Math.max(event.clientY-box.top-48,10)}px`})
      .on('mouseleave blur',function(){d3.select(this).classed('active',false);tooltip.hidden=true})
      .on('click',function(event,d){const code=numericToCode[String(Number(d.id))];location.href=countryHref(code)})
      .on('keydown',function(event,d){if(event.key==='Enter'||event.key===' '){event.preventDefault();const code=numericToCode[String(Number(d.id))];location.href=countryHref(code)}});

    const labelCodes=new Set(['IT','ES','FR','DE','PL','PT','NL','BE','AT','CZ','HU','GR','UK','IE','SE','NO','FI','RO']);
    svg.append('g').attr('class','map-labels').selectAll('text').data(features.filter(d=>labelCodes.has(numericToCode[String(Number(d.id))]))).join('text')
      .attr('x',d=>path.centroid(d)[0]).attr('y',d=>path.centroid(d)[1])
      .attr('class',d=>strongSites[numericToCode[String(Number(d.id))]]?'geo-label national':'geo-label')
      .text(d=>numericToCode[String(Number(d.id))]);

    const badges=features.filter(d=>strongSites[numericToCode[String(Number(d.id))]]);
    svg.append('g').attr('class','national-badges').selectAll('circle').data(badges).join('circle')
      .attr('cx',d=>path.centroid(d)[0]+13).attr('cy',d=>path.centroid(d)[1]-13).attr('r',5.5).attr('class','national-badge');

    container.querySelectorAll('.country').forEach(el=>el.setAttribute('aria-hidden','true'));
    container.prepend(svg.node());
    container.classList.add('geo-ready');
  }catch(error){
    console.warn('CasaStudent Europe map fallback',error);
  }
}

renderEuropeMap();
window.addEventListener('resize',()=>{const map=document.querySelector('.europe-map');if(map?.classList.contains('geo-ready')){clearTimeout(window.__euMapResize);window.__euMapResize=setTimeout(()=>{const svg=map.querySelector('svg');const tooltip=map.querySelector('.map-tooltip');svg?.remove();tooltip?.remove();map.classList.remove('geo-ready');renderEuropeMap()},180)}});
window.CasaStudentEU={countryNames,countryCities,strongSites};