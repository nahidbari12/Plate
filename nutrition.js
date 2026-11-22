'use strict';
function barcodeNutrition(product) {
  const n=product?.nutriments||{},keys=['energy-kcal','proteins','carbohydrates','fat'];
  const complete=suffix=>keys.every(k=>n[k+suffix]!==null&&n[k+suffix]!==undefined&&n[k+suffix]!==''&&Number.isFinite(Number(n[k+suffix]))&&Number(n[k+suffix])>=0);
  const serving=typeof product?.serving_size==='string'?product.serving_size.trim():'';
  let suffix,unit,note;
  if(serving&&complete('_serving')) {
    suffix='_serving';unit=serving;
    note='Database values per labeled serving: '+serving+'. Compare with your package; serving is not necessarily the whole bottle.';
  } else if(complete('_100g')) {
    suffix='_100g';unit='100 g / 100 mL database reference — check label';
    note='PER 100 REFERENCE, NOT PER SERVING OR WHOLE PACKAGE. The database lacks complete labeled-serving values. Check whether its reference is 100 g or 100 mL and replace the serving description and ALL nutrition fields with your package values before logging a labeled serving.';
  } else return null;
  return {micros:micronutrientsFromOFF(n,suffix),name:product.product_name||'Scanned food',unit,cal:Number(n['energy-kcal'+suffix]),p:Number(n['proteins'+suffix]),c:Number(n['carbohydrates'+suffix]),f:Number(n['fat'+suffix]),source:'Open Food Facts · '+note,barcodeBasis:suffix==='_serving'?'serving':'100-reference'};
}
if(typeof module!=='undefined')module.exports={barcodeNutrition};

