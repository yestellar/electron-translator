const { ipcRenderer, contextBridge } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", 
    {
        send: (channel, data) => {
            // From renderer to main
            const validChannels = [
                "get_dictionary_request",
                "search_translation_request",
                "update_dictionary"
            ]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            // From main to renderer
            const validChannels = [
                "get_dictionary_response",
                "search_translation_response",
                "translate_copied",
                "archive_selected"
            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
);