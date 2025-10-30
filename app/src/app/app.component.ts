import { Component, ViewChild } from '@angular/core';
import { UnityComponent, UnityEventPayload } from './unity/unity.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

    @ViewChild('unityComp') unityComp!: UnityComponent;

    public onUnityEvent(event: UnityEventPayload): void {
      console.log('Event from Unity:', event);

      // handle events here :)
    }
}