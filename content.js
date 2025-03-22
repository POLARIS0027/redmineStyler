class ColorMineContentManager {
  constructor() {
    this.init(); // 클래스 초기화 시 실행
  }

  // 초기화: 색상 적용 + DOM 변화 감지 시작
  init() {
    this.applyStatusColors();
    this.observeDOM();
  }

  // #TODO URL별로 설정 다르게 지정할수 있게 하기. isUrlMatched같은거..?
  // 현재 URL이 유효하면 상태 컬러를 적용 
  async applyStatusColors() {
    const settings = await this.getSettings();
    if (!this.isValidUrl(settings)) return;

    this.processStatusElements(settings); // tr들 처리
  }

  // chrome.storage에서 설정값 가져오기
  async getSettings() {
    return new Promise(resolve => {
      chrome.storage.sync.get(["urlPattern", "statusStyles"], resolve);
    });
  }

  // 현재 페이지 URL이 패턴과 일치하는지 확인
  isValidUrl(settings) {
    const { urlPattern } = settings;
    if (!urlPattern) return false;
    return window.location.href.includes(urlPattern.replace("*", ""));
  }

  // 테이블 내 td.status을 순회하며 스타일 처리
  processStatusElements(settings) {
    const statusElements = document.querySelectorAll("td.status");
    statusElements.forEach(td =>
      this.processStatusElement(td, settings.statusStyles)
    );
  }

  // 각 tr에 해당하는 스타일 적용
  processStatusElement(td, statusStyles) {
    const row = td.closest("tr");
    if (!row) return; // 없으면 중지하고 

    const style = this.getApplicableStyle(td, row, statusStyles); // 적용할 스타일 결정
    this.applyStyle(row, style); // 스타일 적용
  }

  // td와 tr 정보로 어떤 스타일을 적용할지 판단
  getApplicableStyle(td, row, statusStyles) {
    // 1. Overdue 상태가 우선 적용됨
    if (row.classList.contains("overdue") &&
      statusStyles.overdue?.enabled) {
      return statusStyles.overdue;
    }

    // 2. 일반 상태 텍스트로 스타일 검색
    const statusText = td.textContent.trim();
    return Object.values(statusStyles).find(style =>
      style.alias === statusText && style.alias !== 'Overdue'
    );
  }

  // 스타일 있으면 적용, 없으면 초기화
  applyStyle(row, style) {
    if (!style) {
      this.resetStyle(row); // style 리셋
      return;
    }

    this.applyInlineStyle(row, style.background, style.color); // html에 sytle속성 적용
  }

  // HTML 요소에 스타일 important로 강제적용
  applyInlineStyle(element, bgColor, fontColor) {
    element.style.setProperty("background-color", bgColor, "important");
    element.style.setProperty("color", fontColor, "important");

    // 하위 td, a 태그에도 강제적용
    element.querySelectorAll("td, td a").forEach(child => {
      child.style.setProperty("color", fontColor, "important");
    });
  }

  // 스타일 초기화 (기본 상태로 되돌림)
  resetStyle(element) {
    element.style.removeProperty("background-color");
    element.style.removeProperty("color");

    element.querySelectorAll("td, td a").forEach(child => {
      child.style.removeProperty("color");
    });
  }

  // DOM 변경 감지 (새로운 row가 생기면 자동으로 스타일 재적용)
  observeDOM() {
    const observer = new MutationObserver(() => this.applyStatusColors());
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// 클래스 인스턴스 생성 → 초기화 진행됨
new ColorMineContentManager();

// background에서 'reapplyStyles' 수신하면, 재적용하는 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'reapplyStyles') {
    manager.applyStatusColors();
  }
});
