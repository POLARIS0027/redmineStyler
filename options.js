// 상태 관리 클래스
class StatusManager {
  constructor() {
    this.statusList = document.getElementById('statusList');
    this.template = document.getElementById('statusItemTemplate');
    this.initUI();
    this.setupEventListeners();
    this.setupOverdueToggle();
    this.loadSavedStatuses();
  }

  initUI() {
    // 페이지 텍스트 초기화
    document.getElementById('title').textContent = chrome.i18n.getMessage('title');
    document.getElementById('urlPatternLabel').textContent = chrome.i18n.getMessage('urlPattern');
    document.getElementById('specialStatusTitle').textContent = chrome.i18n.getMessage('specialStatus');
    document.getElementById('overdueLabel').textContent = chrome.i18n.getMessage('overdue');
    document.getElementById('backgroundColorLabel').textContent = chrome.i18n.getMessage('backgroundColor');
    document.getElementById('textColorLabel').textContent = chrome.i18n.getMessage('textColor');
    document.getElementById('overduePreview').textContent = chrome.i18n.getMessage('overdue');
    document.getElementById('normalStatusTitle').textContent = chrome.i18n.getMessage('normalStatus');
    document.getElementById('addStatusTitle').textContent = chrome.i18n.getMessage('addStatus');
    document.getElementById('newBgColorLabel').textContent = chrome.i18n.getMessage('backgroundColor');
    document.getElementById('newTextColorLabel').textContent = chrome.i18n.getMessage('textColor');
    document.getElementById('addNewStatus').textContent = chrome.i18n.getMessage('addNew');
    document.getElementById('saveButton').textContent = chrome.i18n.getMessage('save');

    // placeholder 설정
    document.getElementById('newStatusAlias').placeholder = chrome.i18n.getMessage('statusName');
  }

  setupEventListeners() {
    document.getElementById('addNewStatus').addEventListener('click', () => this.addNewStatus());
    document.getElementById('saveButton').addEventListener('click', () => this.saveAllStatuses());
  }

  setupOverdueToggle() {
    const toggle = document.getElementById('overdueEnabled');
    const settings = document.getElementById('overdueSettings');

    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        settings.classList.remove('disabled');
      } else {
        settings.classList.add('disabled');
      }
      this.updateOverduePreview();
    });

    this.updateOverduePreview();
  }

  updateOverduePreview() {
    const bgInput = document.getElementById('overdueBackground');
    const colorInput = document.getElementById('overdueColor');
    const preview = document.getElementById('overduePreview');
    const enabled = document.getElementById('overdueEnabled').checked;

    if (enabled) {
      preview.style.backgroundColor = bgInput.value;
      preview.style.color = colorInput.value;
    } else {
      preview.style.backgroundColor = '';
      preview.style.color = '';
    }
  }

  createStatusElement(alias, bgColor, fontColor) {
    const clone = this.template.content.cloneNode(true);
    const container = clone.querySelector('.status-item');

    container.querySelector('.alias-input').value = alias;
    container.querySelector('.alias-input').placeholder = chrome.i18n.getMessage('statusName');

    const bgLabel = container.querySelector('.bg-color-label');
    bgLabel.textContent = chrome.i18n.getMessage('backgroundColor');

    const textLabel = container.querySelector('.text-color-label');
    textLabel.textContent = chrome.i18n.getMessage('textColor');

    container.querySelector('.bg-color-input').value = bgColor;
    container.querySelector('.font-color-input').value = fontColor;

    // 미리보기 설정
    const preview = container.querySelector('.color-preview');
    preview.style.backgroundColor = bgColor;
    preview.style.color = fontColor;
    preview.textContent = alias || chrome.i18n.getMessage('preview');

    // 색상 변경 이벤트
    container.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        const currentAlias = container.querySelector('.alias-input').value;
        const currentBg = container.querySelector('.bg-color-input').value;
        const currentColor = container.querySelector('.font-color-input').value;

        preview.style.backgroundColor = currentBg;
        preview.style.color = currentColor;
        preview.textContent = currentAlias || chrome.i18n.getMessage('preview');
      });
    });

    // 삭제 버튼
    const deleteBtn = container.querySelector('.delete-btn');
    deleteBtn.textContent = chrome.i18n.getMessage('delete');
    deleteBtn.addEventListener('click', () => container.remove());

    this.statusList.appendChild(container);
  }

  addNewStatus() {
    const alias = document.getElementById('newStatusAlias').value;
    const bgColor = document.getElementById('newStatusBgColor').value;
    const fontColor = document.getElementById('newStatusFontColor').value;

    if (!alias) {
      alert(chrome.i18n.getMessage('statusName'));
      return;
    }

    this.createStatusElement(alias, bgColor, fontColor);

    // 입력 필드 초기화
    document.getElementById('newStatusAlias').value = '';
  }

  saveAllStatuses() {
    const statusStyles = {};

    // Overdue 상태 저장
    const overdueEnabled = document.getElementById('overdueEnabled').checked;
    if (overdueEnabled) {
      statusStyles['overdue'] = {
        alias: chrome.i18n.getMessage('overdue'),
        background: document.getElementById('overdueBackground').value,
        color: document.getElementById('overdueColor').value,
        enabled: true
      };
    }

    // 일반 상태 저장
    this.statusList.querySelectorAll('.status-item').forEach((item, index) => {
      const alias = item.querySelector('.alias-input').value;
      if (!alias) return;

      statusStyles[`status-${index + 1}`] = {
        alias: alias,
        background: item.querySelector('.bg-color-input').value,
        color: item.querySelector('.font-color-input').value
      };
    });

    chrome.storage.sync.set({
      statusStyles,
      urlPattern: document.getElementById('urlPattern').value
    }, () => {
      alert(chrome.i18n.getMessage('saved'));
    });
  }

  async loadSavedStatuses() {
    const data = await chrome.storage.sync.get(['statusStyles', 'urlPattern']);

    // URL 패턴 로드
    if (data.urlPattern) {
      document.getElementById('urlPattern').value = data.urlPattern;
    }

    // 상태 스타일이 없으면 기본값 생성
    if (!data.statusStyles) {
      // 기본 상태 생성은 생략 (필요시 추가)
      return;
    }

    // Overdue 설정 로드
    if (data.statusStyles.overdue) {
      document.getElementById('overdueEnabled').checked = data.statusStyles.overdue.enabled;
      document.getElementById('overdueBackground').value = data.statusStyles.overdue.background;
      document.getElementById('overdueColor').value = data.statusStyles.overdue.color;

      if (!data.statusStyles.overdue.enabled) {
        document.getElementById('overdueSettings').classList.add('disabled');
      }

      this.updateOverduePreview();
    }

    // 일반 상태 로드
    this.statusList.innerHTML = '';
    Object.entries(data.statusStyles).forEach(([key, style]) => {
      if (key !== 'overdue' && style.alias) {
        this.createStatusElement(
          style.alias,
          style.background,
          style.color
        );
      }
    });
  }

  // 기본 상태 스타일 가져오기 (초기 설정용)
  getDefaultStatuses() {
    return {
      'overdue': {
        alias: chrome.i18n.getMessage('overdue'),
        background: '#FFE0E0',
        color: '#FF0000',
        enabled: true
      },
      'status-1': {
        alias: 'New',
        background: '#FFFFFF',
        color: '#000000'
      },
      'status-2': {
        alias: 'In Progress',
        background: '#E0F0FF',
        color: '#0000FF'
      },
      'status-3': {
        alias: 'Resolved',
        background: '#E0FFE0',
        color: '#008000'
      }
    };
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  new StatusManager();
  document.body.classList.add('content-loaded');
});
