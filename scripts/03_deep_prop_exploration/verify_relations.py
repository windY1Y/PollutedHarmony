"""Conservative source-supported parent paths. Does not assert persistent object identity."""
import collections,gzip,hashlib,json,re,sys
from pathlib import Path
import aggregate as a
H=Path(__file__).resolve().parent
ROOT=Path('/opt/openharmony')
ARK='foundation/arkui/ace_engine/frameworks/bridge/declarative_frontend/'
GRAPH='foundation/graphic/graphic_2d/interfaces/kits/napi/graphic/text/utils/napi_common.cpp'
NET='foundation/communication/netstack/frameworks/js/napi/http/async_context/src/request_context.cpp'
NOTIF='base/notification/distributed_notification_service/frameworks/js/napi/src/'
RULES=[]
def rule(parent,children,path,source,ranges,**match):
    RULES.append(dict(parent=parent,children=children.split(),path=path,source=source,ranges=ranges,match=match))
rule('clientCert','certPath certType keyPath keyPassword','clientCert.{child}',NET,[(828,845)],nativeModule='net.http')
rule('certificatePinning','hashAlgorithm publicKeyHash','certificatePinning{element}.{child}',NET,[(889,900),(926,948)],nativeModule='net.http')
rule('decoration','textDecoration color decorationStyle decorationThicknessScale','decoration.{child}',GRAPH,[(103,130),(352,364)],nativeModule='graphics.text')
rule('fontVariations','axis value','fontVariations[0].{child}',GRAPH,[(219,251)],nativeModule='graphics.text')
rule('fontFeatures','name value','fontFeatures[0].{child}',GRAPH,[(183,215)],nativeModule='graphics.text')
rule('strutStyle','fontFamilies fontStyle fontWidth fontWeight fontSize height leading forceHeight enabled heightOverride halfLeading','strutStyle.{child}',GRAPH,[(451,454),(563,592)],nativeModule='graphics.text')
rule('textShadows','color point blurRadius','textShadows[0].{child}',GRAPH,[(295,348)],nativeModule='graphics.text')
rule('backgroundRect','color leftTopRadius rightTopRadius rightBottomRadius leftBottomRadius','backgroundRect.{child}',GRAPH,[(595,613)],nativeModule='graphics.text')
rule('annulusRegion','center innerRadius outerRadius startAngle endAngle','annulusRegion.{child}',ARK+'jsview/js_particle.cpp',[(558,589)],origin='ark-api')
rule('expectedFrameRateRange','min max expected','expectedFrameRateRange.{child}',ARK+'jsview/js_view_context.cpp',[(364,375)],origin='ark-api')
rule('distributedOption','isDistributed supportDisplayDevices supportOperateDevices','distributedOption.{child}',NOTIF+'common_convert_notification.cpp',[(167,230)],nativeModule='notificationManager')
rule('eventConfigs','domain name isRealTime','eventConfigs[0].{child}','base/hiviewdfx/hiappevent/frameworks/js/napi/src/napi_hiappevent_processor.cpp',[(235,279)],nativeModule='hiviewdfx.hiAppEvent')
rule('_gestureEvent','clearGestures','component._gestureEvent.clearGestures',ARK+'engine/arkComponent.js',[(3791,3801),(5994,5999)],function='applyGesture',origin='js-bytecode')
rule('components','binarySearch','scope.components.binarySearch',ARK+'engine/arkTheme.js',[(786,797)],function='isComponentInScope',origin='js-bytecode')
rule('mdListener','on','this.mdListener.on','foundation/arkui/ace_engine/advanced_ui_component/chip/interfaces/chip_v16.js',[(969,982)],origin='js-bytecode')
rule('theme','unbindFromScope','scope.theme.unbindFromScope',ARK+'engine/arkTheme.js',[(808,810),(918,936)],function='onScopeDestroyInternal',origin='js-bytecode')
rule('typography','displayLarge displayMiddle displaySmall titleLarge titleMiddle titleSmall subtitleLarge subtitleMiddle subtitleSmall bodyLarge bodyMiddle bodySmall captionLarge captionMiddle captionSmall','theme.typography.{child}',ARK+'engine/arkTheme.js',[(648,711),(713,720)],function='ArkTypographyImpl',origin='js-bytecode')
rule('shapes','cornerRadius paddings borders outlines','theme.shapes.{child}',ARK+'engine/arkTheme.js',[(640,646),(713,720)],function='ArkShapesImpl',origin='js-bytecode')
rule('previewAnimationOptions','scale transition hoverScale hoverScaleInterruption','previewAnimationOptions.{child}',ARK+'jsview/js_popups.cpp',[(1577,1614)],origin='ark-api')
rule('progress','maxValue currentValue isPercentage','notification.content.progress.{child}',NOTIF+'common_convert_liveview.cpp',[(952,1018)],nativeModule='notificationManager')
rule('multiFormDataList','name contentType remoteFileName data filePath','multiFormDataList[0].{child}',NET,[(848,885)],nativeModule='net.http')
# These two properties belong to framework dictionaries, not the component field itself.
STATE='out/qemu-arm64-linux/obj/foundation/arkui/ace_engine/frameworks/bridge/declarative_frontend/stateMgmt.js'
rule('*','add','target[SYMBOL_REFS][{parent_json}].add',STATE,[(9731,9737)],function='addRef4IdInternal',origin='js-bytecode')
rule('*','deco','target[V2_DECO_META][{parent_json}].deco',STATE,[(10679,10682),(10695,10699),(10716,10720)],function='checkInvalidUsage',origin='js-bytecode')

def source_info(rule):
    p=ROOT/rule['source'];raw=p.read_bytes();ls=raw.decode('utf8','replace').splitlines()
    return dict(path=str(p),sha256=hashlib.sha256(raw).hexdigest(),snippets=[dict(start=s,end=e,text='\n'.join(ls[s-1:e])) for s,e in rule['ranges']])
def main():
    inv=json.loads((H/'inventory.json').read_text());base=set(json.loads((H/'baseline_keys.json').read_text()))
    sources={i:source_info(r) for i,r in enumerate(RULES)};verified={};js_cache={}
    for item in inv:
        job=item['job'];parent=job['key'];candidates=[(i,r) for i,r in enumerate(RULES) if r['parent'] in ('*',parent)]
        pp={};rows=[];f=H/'compact'/('%05d.tsv.gz'%item['id'])
        with gzip.open(f,'rt',errors='replace') as stream:
            for l in stream:
                kind,off,hits,raw=l.rstrip('\n').split('\t',3);m=a.PID.match(raw);pid=m[1] if m else '?'
                if kind=='P':
                    try:marker,data=raw.split('[pp] ',1)[1].split(' ',1);data=json.loads(data)
                    except (ValueError,IndexError):continue
                    if marker=='taint-'+job['mode'] and data.get('key')==parent:pp[pid]=min(pp.get(pid,10**30),int(off))
                else:rows.append((int(off),int(hits),raw,pid))
        for off,hits,raw,pid in rows:
            if pid not in pp or off<pp[pid]:continue
            payload=re.sub(r' receiverTag=\S+','',raw[raw.find('[pptrace][prop-context-'):]);c=a.parse(payload)
            if not c or not c['disposition'].startswith('keep_'):continue
            child=c['key']
            matched_paths=set()
            if c['origin']=='js-bytecode' and re.fullmatch(r'[A-Za-z_$][\w$]*',parent) and re.fullmatch(r'[A-Za-z_$][\w$]*',child):
                fn=c['file'];path=Path(fn)
                if not path.is_absolute():
                    fn=re.sub(r'^(?:\.\./)+','',fn)
                    options=[ROOT/fn,ROOT/'out/qemu-arm64-linux'/fn]
                    path=next((v for v in options if v.exists()),options[0])
                if path.exists() and path.is_file():
                    if str(path) not in js_cache:
                        data=path.read_bytes();js_cache[str(path)]=(data.decode('utf8','replace').splitlines(),hashlib.sha256(data).hexdigest())
                    lines,sha=js_cache[str(path)]
                    try:n=int(c['pos'].split(':')[0])
                    except ValueError:n=0
                    expression='this.'+parent+'.'+child
                    for line_no in range(max(1,n-1),min(len(lines),n+1)+1):
                        pattern=r'\bthis\.'+re.escape(parent)+r'(?:\?\.|\.)'+re.escape(child)+r'\b'
                        if not re.search(pattern,lines[line_no-1]):continue
                        sig=(parent,job['mode'],expression)
                        row=verified.setdefault(sig,dict(parent=parent,mode=job['mode'],child=child,path=expression,child_in_baseline=child in base,
                            evidence_level='source_supported_not_receiver_id_proof',modules=set(),hits=0,
                            source=dict(path=str(path),sha256=sha,snippets=[dict(start=line_no,end=line_no,text=lines[line_no-1])]),context=c,
                            evidence=dict(log=item['path'],byte_offset=off,raw=raw,file_id=item['id'])))
                        row['modules'].add(job['module']);row['hits']+=hits
                        matched_paths.add(sig)
                        break
            for i,r in candidates:
                if child not in r['children'] or any(c.get(k)!=v for k,v in r['match'].items()):continue
                full=r['path'].format(child=child,parent_json=json.dumps(parent),element='[0]' if job['mode']=='array' else '')
                sig=(parent,job['mode'],full)
                if sig in matched_paths:continue
                row=verified.setdefault(sig,dict(parent=parent,mode=job['mode'],child=child,path=full,child_in_baseline=child in base,
                    evidence_level='source_supported_not_receiver_id_proof',modules=set(),hits=0,source=sources[i],
                    context=c,evidence=dict(log=item['path'],byte_offset=off,raw=raw,file_id=item['id'])))
                row['modules'].add(job['module']);row['hits']+=hits
    rows=[]
    for k,r in sorted(verified.items()):r['modules']=sorted(r['modules']);rows.append(r)
    (H/'source_supported_paths.json').write_text(json.dumps(rows,ensure_ascii=True))
    stats=dict(source_supported_paths=len(rows),distinct_paths=len({r['path'] for r in rows}),
        new_child_names=len({r['child'] for r in rows if not r['child_in_baseline']}),
        shared_child_names=len({r['child'] for r in rows if r['child_in_baseline']}),
        paths_with_new_names=sum(not r['child_in_baseline'] for r in rows),paths_with_shared_names=sum(r['child_in_baseline'] for r in rows))
    (H/'source_supported_summary.json').write_text(json.dumps(stats,indent=2));print(json.dumps(stats),flush=True)
if __name__=='__main__':main()
