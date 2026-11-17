'use strict';
// Context-bound AST analysis. Types denote consumer contracts, not proof of all JS values.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const H=__dirname, ts=require('/opt/openharmony/prebuilts/ohos-sdk/linux/20/ets/build-tools/ets-loader/node_modules/typescript/lib/typescript.js');
const rows=JSON.parse(fs.readFileSync(path.join(H,'undef_contexts.json'),'utf8'));
const groups=new Map();
for(const r of rows) if(r.origin==='js-bytecode' && r.source.path){let a=groups.get(r.source.path)||[];a.push(r);groups.set(r.source.path,a);}
const results={}, snapshots=[];
function fname(n,sf){
 if(n.name)return n.name.getText(sf).replace(/^['"]|['"]$/g,'');
 if(n.parent&&ts.isVariableDeclaration(n.parent))return n.parent.name.getText(sf);
 return 'anonymous';
}
const isfn=n=>ts.isFunctionLike(n)&&!!n.body;
const strings=new Set(['trim','trimStart','trimEnd','toLowerCase','toUpperCase','charAt','charCodeAt','substring','substr','split','replace','replaceAll','match','search','startsWith','endsWith','localeCompare','codePointAt','padStart','padEnd']);
const arrays=new Set(['push','pop','shift','unshift','splice','forEach','map','filter','reduce','reduceRight','every','some','find','findIndex','sort']);
for(const [file,rs] of groups){
 let text;try{text=fs.readFileSync(file,'utf8');}catch(e){continue;}
 const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,file.endsWith('.js')?ts.ScriptKind.JS:ts.ScriptKind.TS);
 const hash=crypto.createHash('sha256').update(text).digest('hex');snapshots.push({file,sha256:hash,bytes:Buffer.byteLength(text)});
 const funcs=[],accesses=[],byfunc=new Map(),classProps=[];
 function walk(n,fun,cls){
  if(ts.isClassLike(n))cls=n;
  if(isfn(n)){fun=n;funcs.push(n);byfunc.set(n,[]);}
  if(ts.isPropertyAccessExpression(n)||ts.isElementAccessExpression(n)){accesses.push({n,fun,cls});if(fun)byfunc.get(fun).push(n);}
  if(ts.isPropertyDeclaration(n)&&n.type)classProps.push({n,cls});
  ts.forEachChild(n,c=>walk(c,fun,cls));
 }walk(sf,null,null);
 const line=n=>sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1;
 const key=n=>ts.isPropertyAccessExpression(n)?n.name.text:(ts.isStringLiteralLike(n.argumentExpression)||ts.isNumericLiteral(n.argumentExpression))?n.argumentExpression.text:null;
 const expr=n=>n.getText(sf);
 const evidence=(n,type,op,note='')=>({type,operation:op,file,line:line(n),column:sf.getLineAndCharacterOfPosition(n.getStart(sf)).character+1,code:expr(n).slice(0,800),note,source_sha256:hash});
 function consume(node,scope){
  const out=[],aliases=new Set([expr(node)]), origins=[node];
  const writes=new Map();
  function countWrites(n){
   if(n!==scope&&isfn(n))return;
   let name='';
   if(ts.isVariableDeclaration(n)&&n.initializer)name=expr(n.name);
   if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.EqualsToken)name=expr(n.left);
   if(name)writes.set(name,(writes.get(name)||0)+1);
   ts.forEachChild(n,countWrites);
  }countWrites(scope);
  // Flow through local assignment aliases, including params.key -> this.key.
  for(let round=0;round<3;round++){
   function find(n){
    if(n!==scope&&isfn(n))return;
    if(ts.isVariableDeclaration(n)&&n.initializer&&aliases.has(expr(n.initializer))&&writes.get(expr(n.name))===1){aliases.add(expr(n.name));}
    if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.EqualsToken&&aliases.has(expr(n.right))&&writes.get(expr(n.left))===1){aliases.add(expr(n.left));}
    ts.forEachChild(n,find);
   }find(scope);
  }
  function visit(n){
   if(n!==scope&&isfn(n))return;
   if(aliases.has(expr(n))){
    let p=n.parent;
    if(p&&ts.isCallExpression(p)&&p.expression===n)out.push(evidence(p,'function','function_call'));
    if(p&&ts.isNewExpression(p)&&p.expression===n)out.push(evidence(p,'function','constructor_call'));
    if(p&&ts.isPropertyAccessExpression(p)&&p.expression===n){
     const method=p.name.text,q=p.parent;
     if(q&&ts.isCallExpression(q)&&q.expression===p){
      if(['call','apply','bind'].includes(method))out.push(evidence(q,'function','function_'+method));
      else if(strings.has(method))out.push(evidence(q,'string','string_method', 'Expected built-in string interface; custom method-bearing objects are not excluded.'));
      else if(arrays.has(method))out.push(evidence(q,'','array_interface','Array-like method use; custom classes can define these methods, so no concrete array type follows.'));
     } else out.push(evidence(p,'','member_access','Structural constraint only; object/function/string cannot be distinguished here.'));
    }
    if(p&&ts.isElementAccessExpression(p)&&p.expression===n)out.push(evidence(p,'','element_access','Indexed access alone does not determine the value type.'));
    if(p&&ts.isPrefixUnaryExpression(p)&&p.operator===ts.SyntaxKind.PlusToken)out.push(evidence(p,'number','numeric_coercion','Unary + accepts coercible values; this is a numeric consumer contract.'));
    if(p&&ts.isBinaryExpression(p)){
     const op=p.operatorToken.kind,other=p.left===n?p.right:p.left;
     const nums=[ts.SyntaxKind.MinusToken,ts.SyntaxKind.AsteriskToken,ts.SyntaxKind.SlashToken,ts.SyntaxKind.PercentToken,ts.SyntaxKind.AsteriskAsteriskToken,ts.SyntaxKind.LessThanLessThanToken,ts.SyntaxKind.GreaterThanGreaterThanToken,ts.SyntaxKind.AmpersandToken,ts.SyntaxKind.BarToken,ts.SyntaxKind.CaretToken];
     if(nums.includes(op))out.push(evidence(p,ts.isNumericLiteral(other)?'number':'','numeric_operation',ts.isNumericLiteral(other)?'Number operand establishes the expected numeric kind; coercion is possible.':'May accept number or bigint; no exclusive type inferred.'));
     if(op===ts.SyntaxKind.PlusToken&&ts.isStringLiteralLike(other))out.push(evidence(p,'','string_concatenation','Concatenation coerces other operands and does not establish their original type.'));
    }
    if(p&&ts.isCallExpression(p)&&p.arguments.includes(n)){
     const cal=expr(p.expression);
     if(cal==='Array.isArray')out.push(evidence(p,'','array_test','A type probe is not an exclusive type contract.'));
     if(['Object.keys','Object.entries','Object.values'].includes(cal))out.push(evidence(p,'','enumeration','Object enumeration alone also accepts boxed primitives.'));
    }
   }
   ts.forEachChild(n,visit);
  }visit(scope);
  return out;
 }
 const analysisCache=new Map();
 for(const r of rs){
  const cacheKey=JSON.stringify([r.key,r.function,r.pos,r.source.binding]);
  if(analysisCache.has(cacheKey)){results[r.id]=analysisCache.get(cacheKey);continue;}
  const ln=Number((r.pos||'').split(':')[0]);
  let matched=funcs.filter(f=>fname(f,sf)===r.function);
  if(r.source.binding==='exact_logged_path'&&ln>0){const at=matched.filter(f=>line(f)<=ln&&sf.getLineAndCharacterOfPosition(f.end).line+1>=ln);if(at.length)matched=at;}
  // A simple assignment target is a write, not the GET observed in the log.
  const writeOnly=n=>n.parent&&ts.isBinaryExpression(n.parent)&&n.parent.left===n&&n.parent.operatorToken.kind===ts.SyntaxKind.EqualsToken;
  let candidates=accesses.filter(a=>key(a.n)===r.key&&matched.includes(a.fun)&&!writeOnly(a.n));
  if(r.source.binding==='exact_logged_path'&&ln>0){const near=candidates.filter(a=>Math.abs(line(a.n)-ln)<=2);if(near.length)candidates=near;}
  let ev=[],reason='no_context_bound_property_read',binding='';
  const ambiguousRead=new Set(candidates.map(a=>expr(a.n))).size>1;
  // A dynamic framework lookup is bound by function and key construction, not by a name-only search.
  if(file.endsWith('/strip.native.min.js')&&r.function==='lt'&&!candidates.length&&matched.length===1){
   const f=matched[0],body=expr(f);
   if(/var r=e\[t\]/.test(body)&&body.includes('Object.keys(r)')&&body.includes('r[e]')){
    ev=[evidence(f,'object','style_dictionary_merge','lt reads e[t]; entries of r are copied to a style dictionary. Expected style record, not a string inferred from the selector key.')];binding='framework_dynamic_style_lookup';reason='consumer_contract';
   }
  }
  if(!ev.length&&candidates.length&&matched.length===1&&!ambiguousRead){
   binding=r.source.binding;reason='no_exclusive_consumer_type';
   for(const a of candidates){
    ev.push(...consume(a.n,a.fun));
    const p=a.n.parent;
    if(a.cls&&p&&ts.isBinaryExpression(p)&&p.operatorToken.kind===ts.SyntaxKind.EqualsToken&&p.right===a.n&&expr(p.left).startsWith('this.')){
     for(const dest of accesses)if(dest.cls===a.cls&&dest.fun!==a.fun&&dest.fun&&expr(dest.n)===expr(p.left))ev.push(...consume(dest.n,dest.fun));
    }
   }
   // Explicit TypeScript annotation on the same containing class is independent source evidence.
   for(const a of candidates)for(const cp of classProps)if(cp.cls===a.cls&&cp.n.name.getText(sf)===r.key){
    const typ=cp.n.type.getText(sf),simple={string:'string',number:'number',boolean:'boolean',Function:'function'}[typ];
    const t=simple||(/=>/.test(typ)?'function':/\[\]$|^Array</.test(typ)?'array':'');if(t)ev.push(evidence(cp.n,t,'explicit_type_annotation'));
   }
  } else if(!ev.length&&(matched.length>1||ambiguousRead))reason='ambiguous_function_or_receiver_binding';
  if(file.endsWith('/stateMgmt.js')&&matched.length===1){
   const f=matched[0];
   if((r.function==='constructComputed'&&r.key.startsWith('Symbol(___comp_'))||(r.function==='constructMonitor'&&r.key.startsWith('Symbol(___watch_'))){
    const producerLine=r.function==='constructComputed'?12437:12412;
    ev=[evidence(f,'object','metadata_dictionary_enumeration','Symbol prefix binds the read to a decorator-created dictionary of functions.'),{type:'object',operation:'metadata_dictionary_creation',file,line:producerLine,code:text.split('\n').slice(producerLine-1,producerLine+1).join('\n'),source_sha256:hash}];binding='framework_symbol_prefix_and_producer';reason='consumer_contract';
   }
   if(r.function==='addParamVariableDecoMeta'&&!['deco','deco2','isViewV2'].includes(r.key)){
    ev=[evidence(f,'object','metadata_record_initialization_and_member_write','Both proto[V2_DECO_META] and meta[varName] default to {} before .deco/.deco2 writes.')];binding='framework_dynamic_metadata_lookup';reason='consumer_contract';
   }
  }
  if(!ev.length&&file.endsWith('/stateMgmt.js')&&['trackInternal','constructComputed','constructMonitor','addParamVariableDecoMeta'].includes(r.function)&&matched.length===1){
   const f=matched[0];ev=[evidence(f,'','dynamic_framework_metadata','Dynamic property lookup/copy. Metadata value type is not established solely from the observed key.')];reason='dynamic_key_without_exclusive_value_contract';binding='named_framework_function';
  }
  const unique=[...new Map(ev.map(e=>[JSON.stringify(e),e])).values()];
  const types=[...new Set(unique.map(e=>e.type).filter(Boolean))].sort();
  const ans={types,evidence:unique,reason:types.length?'consumer_contract':reason,binding};
  analysisCache.set(cacheKey,ans);results[r.id]=ans;
 }
 console.log(JSON.stringify({file,contexts:rs.length,typed:rs.filter(r=>results[r.id]?.types.length).length}));
}
fs.writeFileSync(path.join(H,'js_results.json'),JSON.stringify(results));
fs.writeFileSync(path.join(H,'source_snapshots_js.json'),JSON.stringify(snapshots,null,2));
