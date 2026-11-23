'use strict';
// FDA label Daily Values: general references, not individualized prescriptions.
const DAILY_NUTRIENTS=[
 {key:'caffeine',name:'Caffeine',unit:'mg',dv:null,off:'caffeine',factor:1000},
 {key:'sodium',name:'Sodium (salt)',unit:'mg',dv:2300,off:'sodium',factor:1000,limit:true},
 {key:'fiber',name:'Fiber',unit:'g',dv:28,off:'fiber',factor:1},
 {key:'saturatedFat',name:'Saturated fat',unit:'g',dv:20,off:'saturated-fat',factor:1,limit:true},
 {key:'addedSugars',name:'Added sugars',unit:'g',dv:50,off:'added-sugars',factor:1,limit:true},
 {key:'calcium',name:'Calcium',unit:'mg',dv:1300,off:'calcium',factor:1000},
 {key:'iron',name:'Iron',unit:'mg',dv:18,off:'iron',factor:1000},
 {key:'potassium',name:'Potassium',unit:'mg',dv:4700,off:'potassium',factor:1000},
 {key:'magnesium',name:'Magnesium',unit:'mg',dv:420,off:'magnesium',factor:1000},
 {key:'zinc',name:'Zinc',unit:'mg',dv:11,off:'zinc',factor:1000},
 {key:'vitaminA',name:'Vitamin A',unit:'mcg RAE',dv:900,off:'vitamin-a',factor:1000000},
 {key:'vitaminC',name:'Vitamin C',unit:'mg',dv:90,off:'vitamin-c',factor:1000},
 {key:'vitaminD',name:'Vitamin D',unit:'mcg',dv:20,off:'vitamin-d',factor:1000000},
 {key:'vitaminE',name:'Vitamin E',unit:'mg alpha-tocopherol',dv:15,off:'vitamin-e',factor:1000},
 {key:'vitaminK',name:'Vitamin K',unit:'mcg',dv:120,off:'vitamin-k',factor:1000000},
 {key:'vitaminB6',name:'Vitamin B6',unit:'mg',dv:1.7,off:'vitamin-b6',factor:1000},
 {key:'vitaminB12',name:'Vitamin B12',unit:'mcg',dv:2.4,off:'vitamin-b12',factor:1000000}
];
function validMicros(m){return m===undefined||(m!==null&&typeof m==='object'&&!Array.isArray(m)&&Object.entries(m).every(([k,v])=>DAILY_NUTRIENTS.some(n=>n.key===k)&&Number.isFinite(v)&&v>=0&&v<=10000000))}
function micronutrientsFromOFF(n,suffix){
 const result={},present=k=>n[k]!==null&&n[k]!==undefined&&n[k]!==''&&Number.isFinite(Number(n[k]))&&Number(n[k])>=0;
 for(const spec of DAILY_NUTRIENTS){const key=spec.off+suffix;if(present(key)){const value=Number(n[key])*spec.factor;if(value<=10000000)result[spec.key]=Number(value.toPrecision(10));}}
 // OFF sodium and salt are in grams. FDA %DV uses sodium, not grams of salt.
 if(!Object.hasOwn(result,'sodium')&&present('salt'+suffix)){const value=Number(n['salt'+suffix])*1000/2.5;if(value<=10000000)result.sodium=Number(value.toPrecision(10));}
 return result;
}
function nutrientNumber(n){return Number(n.toPrecision(5)).toLocaleString(undefined,{maximumFractionDigits:4})}
function dailyNutrientRows(entries){return DAILY_NUTRIENTS.map(spec=>{const known=entries.filter(e=>validMicros(e.micros)&&e.micros&&Object.hasOwn(e.micros,spec.key));const amount=known.reduce((s,e)=>s+e.micros[spec.key],0);return {...spec,amount,known:known.length,total:entries.length,percent:spec.dv?amount/spec.dv*100:null}})}
function dailyNutrientsView(entries){const on=db.dailyNutrients===true;return `<section class="card nutrients-card" aria-labelledby="dailyNutrientsTitle"><div class="nutrients-heading"><div><h2 id="dailyNutrientsTitle">Daily nutrients</h2><p>Vitamins, minerals & caffeine</p></div><label class="nutrients-switch"><input id="dailyNutrientsToggle" type="checkbox" role="switch" aria-label="Show daily nutrients and caffeine" aria-controls="dailyNutrientsPanel" ${on?'checked':''}><span aria-hidden="true"></span><b>${on?'On':'Off'}</b></label></div><div id="dailyNutrientsPanel" ${on?'':'hidden'}>${on?`<p class="nutrients-note">Percentages of general FDA Daily Values from foods logged for ${esc(date)}. These are label reference values, not personal requirements. Sodium, saturated fat and added sugars are limits—not goals to reach.</p>${!entries.length?'<p class="notice">Log a food to start your nutrient summary.</p>':''}<div class="nutrients-grid">${dailyNutrientRows(entries).map(n=>`<article class="nutrient-tile ${n.limit?'nutrient-limit':''}"><div class="nutrient-top"><h3>${n.name}</h3><strong>${n.known?(n.dv?Math.round(n.percent)+'<small>% DV</small>':nutrientNumber(n.amount)+'<small>'+n.unit+'</small>'):'—'}</strong></div>${n.known?`${n.dv?`<div class="nutrient-meter" aria-hidden="true"><i style="width:${Math.min(100,n.percent)}%"></i></div><p>${nutrientNumber(n.amount)} / ${nutrientNumber(n.dv)} ${n.unit}</p>`:`<p>Amount reported in your logged foods and drinks</p>`}<small>${n.known<n.total?'Partial total · ':''}Data for ${n.known} of ${n.total} logged ${n.total===1?'food':'foods'}${n.limit?' · limit reference':''}</small>`:'<p>Not reported in your logged foods</p><small>Missing data does not mean zero intake.</small>'}</article>`).join('')}</div><p class="nutrients-note">Incomplete food records give incomplete totals. Starter foods, older entries and AI photo estimates may have no vitamin/mineral data. Add values from the label when editing a food; leave unknown values blank. Salt is tracked as sodium (1 g salt ≈ 400 mg sodium). Total sugar has no FDA %DV, so this panel uses added sugars only. Caffeine is displayed in milligrams, without a percentage bar. Database caffeine values may be missing; add the amount from the label or product information when available.</p><a class="nutrients-source" href="https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels" target="_blank" rel="noopener">About FDA Daily Values</a>`:''}</div></section>`}
function bindDailyNutrients(){const toggle=$('#dailyNutrientsToggle');if(toggle)toggle.onchange=()=>{const old=db.dailyNutrients;db.dailyNutrients=toggle.checked;if(!save()){db.dailyNutrients=old;toggle.checked=old===true;return}render()}}
function nutrientFields(micros){return `<details class="nutrient-fields"><summary>Vitamins, minerals & caffeine (optional)</summary><p>Enter amounts for the total food being logged, in the units shown. Leave missing values blank; enter 0 only when the label reports zero. Use mcg RAE for vitamin A and alpha-tocopherol for vitamin E; don’t copy IU values.</p><div class="nutrient-input-grid">${DAILY_NUTRIENTS.map(n=>`<label>${n.name} (${n.unit})<input name="micro-${n.key}" type="number" inputmode="decimal" step="any" min="0" max="10000000" value="${Number.isFinite(micros?.[n.key])?micros[n.key]:''}"></label>`).join('')}</div></details>`}
function readNutrientFields(form){const result={};for(const n of DAILY_NUTRIENTS){const value=String(form.elements['micro-'+n.key].value).trim();if(value!=='')result[n.key]=Number(value)}if(!validMicros(result))throw Error('Check the optional nutrient amounts.');return result}
function scaleNutrientFields(form,quantity,previous){if(!Number.isFinite(quantity)||quantity<=0||quantity>100)return previous;for(const n of DAILY_NUTRIENTS){const input=form.elements['micro-'+n.key];if(String(input.value).trim()!=='')input.value=Number((Number(input.value)*quantity/previous).toPrecision(10))}return quantity}

function recipeMicronutrients(items,servings){const result={};for(const n of DAILY_NUTRIENTS){if(items.length&&items.every(x=>validMicros(x.food.micros)&&Number.isFinite(x.food.micros?.[n.key])))result[n.key]=Number((items.reduce((s,x)=>s+x.food.micros[n.key]*x.qty,0)/servings).toPrecision(10));}return validMicros(result)?result:{}}

