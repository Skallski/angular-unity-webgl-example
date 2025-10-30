using UnityEngine;

namespace Scripts
{
    /// <summary>
    /// Handles complex message sending
    ///
    /// GameObject instance of this script should be named the same as this class!
    /// </summary>    
    public class SendComplexMessageHandler : MonoBehaviour
    {
        public static SendComplexMessageHandler Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
            }
            else
            {
                Instance = this;
            }
        }

        public void SendComplexMessage(string message)
        {
            string[] lines = message.Split(',', StringSplitOptions.RemoveEmptyEntries);
            if (lines.Length < 4)
            {
                return;
            }

            string objectName = lines[0];
            string scriptName = lines[1];
            string methodName = lines[2];
            string[] parameters = lines.Skip(3).ToArray();

            // find game object by name
            GameObject targetGameObject = GameObject.Find(objectName);
            if (targetGameObject == null)
            {
                Debug.LogError($"No object with name: {objectName} found!");
                return;
            }

            // find script by name
            Component targetComponent = targetGameObject.GetComponent(scriptName);
            if (targetComponent == null)
            {
                Debug.LogError($"No script with name: {scriptName} found!");
                return;
            }

            // find method by name
            MethodInfo method = targetComponent.GetType().GetMethod(methodName,
                BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

            if (method == null)
            {
                Debug.LogError($"No method with name: {methodName} found!");
                return;
            }

            // parse parameters by name
            ParameterInfo[] parametersInfo = method.GetParameters();
            object[] parsedParams = new object[parametersInfo.Length];

            for (int i = 0; i < parametersInfo.Length; i++)
            {
                if (i >= parameters.Length)
                {
                    break;
                }

                Type paramType = parametersInfo[i].ParameterType;
                string value = parameters[i];

                try
                {
                    parsedParams[i] = Convert.ChangeType(value, paramType,
                        System.Globalization.CultureInfo.InvariantCulture);
                }
                catch
                {
                    Debug.LogWarning($"Parameter '{value}' cannot be converted to type: {paramType}!");
                    parsedParams[i] = null;
                }
            }

            method.Invoke(targetComponent, parsedParams);
        }
    }
}