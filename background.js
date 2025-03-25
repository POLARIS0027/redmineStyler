function initializeDefaultSettings() {
  chrome.storage.sync.get(['urlPattern'], (data) => {
    // 기본값 설정
    if (!data.urlPattern) {
      chrome.storage.sync.set({ urlPattern: '*' });
    }
  });
}

// 확장 프로그램 설치 or 업뎃시 이벤트처리
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ urlPattern: '*' });
  }
});

// 탭 업뎃시 다시 적용
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['urlPattern'], (data) => {
      if (data.urlPattern && tab.url.includes(data.urlPattern.replace('*', ''))) {
        chrome.tabs.sendMessage(tabId, { action: 'reapplyStyles' });
      }
    });
  }
});

// 이름 클릭시 option으로
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});