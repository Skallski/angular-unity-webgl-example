# Angular Unity WebGL Example

Embed a Unity WebGL build in Angular and exchange messages between TypeScript and C#.

- `app/` — Angular 15 application with a player component.
- `unity/Assets/` — C# helpers and a JavaScript callback bridge.

## Setup

1. Copy `unity/Assets/` into your Unity project's `Assets` folder.
2. Build for WebGL with compression **Disabled** and copy the generated `Build` folder to `app/src/assets/unity/Build/`.
3. Set the build filename prefix in `app/src/app/unity/unity.component.ts`:

   ```typescript
   const unityAppName: string = 'MyGame';
   ```

   The loader expects `MyGame.loader.js`, `MyGame.data`, `MyGame.framework.js`, and `MyGame.wasm`.

4. Start the Angular application using Node.js and npm compatible with Angular 15:

   ```bash
   cd app
   npm install
   npm start
   ```

If using StreamingAssets, copy the folder to `app/src/assets/unity/StreamingAssets/` and set `streamingAssetsUrl` to `assets/unity/StreamingAssets`.

## Angular → Unity

Attach this component to a GameObject named `GameController`:

```csharp
using UnityEngine;

public class GameController : MonoBehaviour
{
    public void SetPlayerName(string name) => Debug.Log(name);

    public void SetPosition(float x, float y, float z)
        => transform.position = new Vector3(x, y, z);
}
```

The example's `AppComponent` already references the player through `@ViewChild('unityComp')`. After Unity has loaded:

```typescript
this.unityComp.sendMessage('GameController', 'SetPlayerName', 'Alex');
```

### Multiple parameters

Rename `SendComplexMessageandler.cs` to `SendComplexMessageHandler.cs`, add the missing `System`, `System.Linq`, and `System.Reflection` imports, then attach it to a GameObject named `SendComplexMessageHandler`.

```typescript
// GameObject name, component name, method name, arguments
this.unityComp.sendComplexMessage(
  'GameController', 'GameController', 'SetPosition', 1, 2, 3
);
```

The handler resolves the method by reflection and converts the arguments to its parameter types. Arguments are comma-separated: avoid strings containing commas and empty string values.

## Unity → Angular

Send a named event from a C# method:

```csharp
Scripts.JsBridge.InvokeEvent("scoreChanged", "{\"score\":42}");
```

Receive it through the component output:

```html
<app-unity #unityComp (unityEvent)="onUnityEvent($event)"></app-unity>
```

```typescript
public onUnityEvent(event: UnityEventPayload): void {
  if (event.eventName === 'scoreChanged') {
    console.log(event.data.score); // 42
  }
}
```

Valid JSON payloads are parsed automatically; other payloads remain strings. In the Unity Editor, the bridge logs events instead of calling the browser.

## Notes

- One player per page: the component uses a fixed canvas ID and a global callback.
- Calls sent before Unity is ready are dropped with a console warning.
- Add Unity instance shutdown and callback cleanup if the component is mounted and removed during navigation.
- Loading bar and fullscreen button markup are present, but their behavior is not implemented.
