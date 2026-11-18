import webview from '@ohos.web.webview';
import { BusinessError } from '@ohos.base';
import { webState } from '../fixtures/web/webState';

// Observation-only harness. The scheme handed to customizeSchemes is built in
// cases/H17.js; this page never changes what is passed in, it only reports what
// the engine did with it.
const CANARY_JS: string = "window.__ppv3Canary=1;window.__ppv3Msg='CANARY_EXECUTED';" +
  "console.log('PPV3_CANARY_EXECUTED');";

// Plain-ASCII key=value readback: the ArkWeb bridge JSON-encodes the return
// value, so anything with quotes becomes unparsable noise. Keep it to a|b|c.
const READBACK_JS: string = "(function(){var c=typeof window.__ppv3Canary==='undefined'?'absent'" +
  ":String(window.__ppv3Canary);var i=typeof window.ppv3Inline==='undefined'?'absent'" +
  ":String(window.ppv3Inline);return 'canary='+c+';inline='+i+';title='+String(document.title)" +
  "+';url='+String(location.href);})()";

@Entry
@Component
struct WebHarness {
  private controller: webview.WebviewController = new webview.WebviewController();
  private handler: webview.WebSchemeHandler = new webview.WebSchemeHandler();
  private probe: webview.WebSchemeHandler = new webview.WebSchemeHandler();

  private toBytes(text: string): ArrayBuffer {
    const buf = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
      buf[i] = text.charCodeAt(i) & 0xff;
    }
    return buf.buffer as ArrayBuffer;
  }

  private settle(): void {
    webState.tDone = Date.now();
    webState.done = true;
  }

  private readback(): void {
    try {
      const pending = this.controller.runJavaScript(READBACK_JS);
      pending.then((value: string) => {
        webState.jsReadback = String(value);
        if (webState.jsReadback.indexOf('canary=1;') >= 0) {
          webState.executed = true;
        }
        this.settle();
      }, (err: BusinessError) => {
        webState.jsError = String(err.code) + ':' + String(err.message);
        this.settle();
      });
    } catch (e) {
      const be = e as BusinessError;
      webState.jsError = String(be.code) + ':' + String(be.message);
      this.settle();
    }
  }

  build() {
    Column() {
      Web({ src: webState.pendingUrl.length > 0 ? webState.pendingUrl : 'about:blank',
            controller: this.controller })
        .width('100%')
        .height('100%')
        .javaScriptAccess(true)
        .onControllerAttached(() => {
          webState.attached = true;
          webState.tAttach = Date.now();
          this.handler.onRequestStart((request: webview.WebSchemeHandlerRequest,
                                       resource: webview.WebResourceHandler) => {
            webState.requested = true;
            webState.requestCount = webState.requestCount + 1;
            let url: string = '';
            try {
              url = request.getRequestUrl();
            } catch (e) {
              url = '';
            }
            webState.requestUrls.push(url);
            try {
              const response = new webview.WebSchemeHandlerResponse();
              response.setStatus(200);
              response.setStatusText('OK');
              response.setMimeType('text/javascript');
              response.setEncoding('utf-8');
              const body: ArrayBuffer = this.toBytes(CANARY_JS);
              response.setHeaderByName('Content-Length', String(body.byteLength), true);
              response.setHeaderByName('Cache-Control', 'no-store', true);
              response.setHeaderByName('Access-Control-Allow-Origin', '*', true);
              resource.didReceiveResponse(response);
              resource.didReceiveResponseBody(body);
              resource.didFinish();
              webState.respondedCount = webState.respondedCount + 1;
            } catch (e) {
              const be = e as BusinessError;
              webState.respondError = String(be.code) + ':' + String(be.message);
            }
            return true;
          });
          try {
            this.controller.setWebSchemeHandler('ppv3', this.handler);
            webState.handlerSet = true;
          } catch (e) {
            const be = e as BusinessError;
            webState.handlerError = String(be.code) + ':' + String(be.message);
          }
          if (webState.httpProbe) {
            // Diagnostic only: prove the handler plumbing sees the main document.
            // Returning false lets the request fall through to the network stack.
            this.probe.onRequestStart((request: webview.WebSchemeHandlerRequest,
                                       _resource: webview.WebResourceHandler) => {
              let url: string = '';
              try {
                url = request.getRequestUrl();
              } catch (e) {
                url = '';
              }
              webState.httpRequestUrls.push(url);
              return false;
            });
            try {
              this.controller.setWebSchemeHandler('http', this.probe);
            } catch (e) {
              const be = e as BusinessError;
              webState.handlerError = 'http:' + String(be.code) + ':' + String(be.message);
            }
          }
        })
        .onPageBegin((event) => {
          if (event) {
            webState.pageBegin = event.url;
          }
        })
        .onPageEnd((event) => {
          if (event) {
            webState.pageEnd = event.url;
            webState.pageEndCount = webState.pageEndCount + 1;
            webState.tEnd = Date.now();
            if (webState.pageEnd.indexOf('about:blank') !== 0) {
              setTimeout(() => {
                this.readback();
              }, 2500);
            }
          }
        })
        .onErrorReceive((event) => {
          if (event) {
            try {
              webState.netErrors.push(String(event.error.getErrorCode()) + ':' +
                String(event.error.getErrorInfo()) + ':' + String(event.request.getRequestUrl()));
            } catch (e) {
            }
          }
        })
        .onConsole((event) => {
          if (event) {
            try {
              const message = event.message.getMessage();
              webState.consoleMsgs.push(message);
              if (message === 'PPV3_CANARY_EXECUTED') {
                webState.executed = true;
              }
            } catch (e) {
            }
          }
          return false;
        })
    }
    .width('100%')
    .height('100%')
  }
}
