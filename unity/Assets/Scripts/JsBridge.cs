using System.Runtime.InteropServices;
using UnityEngine;

namespace Scripts
{
    public static class JsBridge
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void SendMessageToBrowser(string eventName, string data);
#endif

        public static void InvokeEvent(string eventName, string data)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            SendMessageToBrowser(eventName, data);
#else
            Debug.Log($"[Mock JsBridge] {eventName}: {data}");
#endif
        }
    }
}