/* global chrome */
let ChromeUtil = {
    get: key => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, data => {
                if (key) {
                    resolve(data[key]);
                } else {
                    resolve(data);
                }
            });
        });
    },
    set: obj => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(obj, () => {
                const error = chrome.runtime.lastError;  
                if (error) {
                    reject(error);
                } else {
                    resolve(obj);
                }
            });
        });
    },
    getSync: key => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, data => {
                if (key) {
                    resolve(data[key]);
                } else {
                    resolve(data);
                }
            });
        });
    },
    setSync: obj => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set(obj, () => {
                const error = chrome.runtime.lastError;  
                if (error) {
                    console.log(error) // Ignore error, not reject
                } 
                resolve(obj);
            });
        });
    },
    clear: () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.clear(() => {
                const error = chrome.runtime.lastError;  
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    },
    openTab: (url, active = true) => {
        chrome.tabs.create({url, active});
    },
    connect: (state, receiveMessage) => {
        const port = chrome.runtime.connect({name: "reader"});
        port.state = state;
        port.onMessage.addListener(msg => {
            receiveMessage(msg);
        });
    },
    setUnreadCount: count => {
        chrome.browserAction.setBadgeText({text: count > 0 ? `${count}` : ''});        
    },
    createNotifications: count => {  
        if(count > 0) {
            const notif_options = {
                type: 'basic',
                iconUrl: '/twitter.png',
                title: 'New Upwork Jobs',                
                message: `${count} new jobs have just posted.`                
            };
            chrome.notifications.create(notif_options);
        }       
    },
    getVersion: () => {
        return chrome.runtime.getManifest().version;
    },
    recreateAlarm: (name, periodInMinutes, delayInMinutes = 1) => {
        chrome.alarms.clear(name, (wasCleared) => {
            chrome.alarms.create(name, {
                delayInMinutes,
                periodInMinutes,
            });
        })
    },
    download: config => {
        chrome.downloads.download(config);
    }
};

export default ChromeUtil;