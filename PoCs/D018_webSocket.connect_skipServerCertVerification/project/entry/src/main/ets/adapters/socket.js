import socket from '@ohos.net.socket';
import webSocket from '@ohos.net.webSocket';
import { clone, need, makePlan, attempt, resolve } from '../runtime/common.js';
import { prepareLab } from '../runtime/lab.js';
export async function prepare(context,cfg,spec) {
  const lab=await prepareLab(context,cfg);
  try {
  const api=spec.target.api,o=cfg.ordinary,options=resolve(clone(need(o,'options')),lab.resources);
  let connection,invoke,args;
  if(api==='WebSocket.connect') {
    connection=webSocket.createWebSocket();const url=need(o,'url');args=[url,options];
    invoke=async()=>{
      const r=await connection.connect(url,options);
      if(o.message!==undefined)await connection.send(o.message);
      return {connected:r};
    };
  }else{
    const types={TCPSocket:socket.constructTCPSocketInstance,TLSSocket:socket.constructTLSSocketInstance,
      TLSSocketServer:socket.constructTLSSocketServerInstance,UDPSocket:socket.constructUDPSocketInstance,MulticastSocket:socket.constructMulticastSocketInstance};
    const [type,method]=api.split('.');connection=need(types,type)();args=[options];
    if(o.bind&&method!=='listen')await connection.bind(clone(o.bind));
    if(method==='connect')invoke=async()=>{await connection.connect(options);if(o.message!==undefined)await connection.send({data:o.message});return {connected:true};};
    else if(method==='listen')invoke=async()=>{await connection.listen(options);return {listening:true,note:'A separate fixed client is required to establish handshake/authentication effects.'};};
    else if(method==='send')invoke=async()=>({sent:await connection.send(options)});
    else throw new Error('UNSUPPORTED_RECORDED_API:'+api);
  }
  return makePlan(args,invoke,{resources:lab.resources,receiver:connection,cleanup:async()=>{try{return await attempt(()=>connection.close());}finally{lab.cleanup();}}});
  }catch(e){lab.cleanup();throw e;}
}
