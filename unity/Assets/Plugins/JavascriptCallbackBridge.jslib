mergeInto(LibraryManager.library, {
  /**
   * Called from C# (via [DllImport("__Internal")])
   * eventPtr and dataPtr are pointers to UTF8 strings in WebAssembly memory
   */
  SendMessageToBrowser: function (eventPtr, dataPtr) {
    try {
      var eventName = UTF8ToString(eventPtr);
      var data = UTF8ToString(dataPtr);

      if (typeof window.onUnityEvent === "function") {
        window.onUnityEvent(eventName, data);
      }
    } catch (err) {
      console.error("SendMessageToBrowser error:", err);
    }
  }
});