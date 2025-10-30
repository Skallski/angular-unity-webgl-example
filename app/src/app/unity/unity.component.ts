import { Component, AfterViewInit, OnInit, Output, EventEmitter } from '@angular/core';

export interface UnityEventPayload {
  eventName: string;
  data: any;
}

@Component({
  selector: 'app-unity',
  templateUrl: './unity.component.html',
  styleUrls: ['./unity.component.css']
})

export class UnityComponent implements OnInit, AfterViewInit {

  private unityInstance: any;

  @Output() unityEvent = new EventEmitter<UnityEventPayload>();

  ngOnInit(): void {
    this.registerUnityCallbacks();
  }

  ngAfterViewInit(): void {
    this.loadUnityApp();
  }

  private loadUnityApp(): void {
    const canvas = document.querySelector('#unity-canvas') as HTMLCanvasElement;

    const unityAppName: string = ''; // set name
    const unityAppPath: string = `assets/unity/Build/${unityAppName}`; 

    const config = {
      dataUrl: `${unityAppPath}.data`,
      frameworkUrl: `${unityAppPath}.framework.js`,
      codeUrl: `${unityAppPath}.wasm`,
      streamingAssetsUrl: 'StreamingAssets',
      companyName: 'Your Company',
      productName: 'Unity App',
      productVersion: '1.0',
      showBanner: (msg: string, type: string) => console.log(`[Unity ${type}] ${msg}`),
      devicePixelRatio: 1
    };

    const script = document.createElement('script');
    script.src = `${unityAppPath}.loader.js`;
    script.onload = async () => {
      try {
        this.unityInstance = await (window as any).createUnityInstance(canvas, config);
      } catch (err) {
        alert(err);
      }
    };

    document.body.appendChild(script);
  }

  public sendMessage(gameObjectName: string, methodName: string, value?: any): void {
    if (this.unityInstance) {
      this.unityInstance.SendMessage(gameObjectName, methodName, value);
    } else {
      console.warn("Unity instance is not ready!");
    }
  }

  public sendComplexMessage(gameObjectName: string, scriptName: string, methodName: string, ...parameters: any[]): void {
    if (this.unityInstance) {
      const handlerObjectName = "SendComplexMessageHandler"; // set name
      const handlerMethodName = "SendComplexMessage"; // set name

      const parts = [gameObjectName, scriptName, methodName, ...parameters];
      const message = parts.join(',');

      this.unityInstance.SendMessage(handlerObjectName, handlerMethodName, message);
    } else {
      console.warn("Unity instance is not ready!");
    }
  }

  private registerUnityCallbacks(): void {
    (window as any).onUnityEvent = (eventName: string, data: any) => {
      let parsed = data;

      try {
        parsed = JSON.parse(data);
      } catch {}

      this.unityEvent.emit({ eventName, data: parsed });
    };
  }
}