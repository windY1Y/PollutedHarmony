import webview from '@ohos.web.webview';
import { webState } from '../fixtures/web/webState';
@Entry
@Component
struct WebHarness {
  private controller: webview.WebviewController = new webview.WebviewController();
  build() {
    Column() {
    Web({src:'about:blank',controller:this.controller})
      .javaScriptAccess(true)
      .onControllerAttached(() => {
        const handler = new webview.WebSchemeHandler();
        handler.onRequestStart((_request: webview.WebSchemeHandlerRequest, resource: webview.WebResourceHandler) => {
          const response = new webview.WebSchemeHandlerResponse();
          response.setStatus(200);response.setStatusText('OK');response.setMimeType('application/javascript');response.setEncoding('utf-8');
          const source = "window.ppv3Executed=true;console.log('PPV3_CSP_EXECUTED');";
          const buffer = new Uint8Array(source.length);
          for(let i=0;i<source.length;i++)buffer[i]=source.charCodeAt(i);
          resource.didReceiveResponse(response);resource.didReceiveResponseBody(buffer.buffer);resource.didFinish();return true;
        });
        this.controller.setWebSchemeHandler('ppv3',handler);
        this.controller.loadUrl(webState.url);
      })
      .onConsole(event => {
        if(event){const message=event.message.getMessage();webState.messages.push(message);if(message==='PPV3_CSP_EXECUTED')webState.executed=true;}
        return false;
      })
    }.width('100%').height('100%')
  }
}
