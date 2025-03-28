# 📌 프로젝트 개요
**Redmine 상태별 색상 표시 Chrome 확장 프로그램**은 회사 내부에서 사용하는 Redmine 티켓 시스템에 상태별 색상 구분을 적용하기 위해 개발되었습니다. 서버 접근 권한이 제한된 환경에서 사용자 경험을 개선하고자 클라이언트 측에서 작동하는 브라우저 확장 프로그램을 구현했습니다.

[다운로드](https://chromewebstore.google.com/detail/eianjmfecdppblkehkjojenjbmgianih?utm_source=item-share-cb)

![Image](https://github.com/user-attachments/assets/58c960c1-ecd9-450c-96f2-404a450d5587)

![Image](https://github.com/user-attachments/assets/c23071d7-cec2-4b49-9a7d-1c1f862b4113)


# 🧩 프로젝트 배경
회사에서는 평가 업무 시 Redmine을 통해 버그와 티켓을 관리합니다. 하지만 사내 Redmine은 서버 접근이 불가능하여 플러그인 설치나 서버 커스터마이징이 불가능했습니다.

Redmine의 상태별 구분이 시각적으로 제공되지 않아, 업무 중 티켓 상태를 빠르게 식별하는 데 어려움이 있었고, 이로 인해 실수나 확인 지연이 발생할 수 있었습니다.


# 💡 해결책
브라우저에서 실행되는 Chrome 확장 프로그램을 개발하여, Redmine 화면 내 `<td class="status">` 요소를 감지하고, 해당 텍스트를 기반으로 사용자가 지정한 색상으로 각 행(`tr`)을 스타일링하도록 설계하였습니다.

- 클라이언트 사이드에서 DOM을 조작하여 상태별로 배경색과 글자색을 동적으로 적용
- chrome.storage.sync를 통해 사용자 설정을 저장하고 동기화(Chrome언어에 따라 한국어, 영어, 일본어 지원)
- Overdue가 색을 덮어쓰도록 되어있으나, ON / OFF 가능
- URL 패턴 기반으로 특정 Redmine 페이지에만 동작하도록 설정 가능


# 🌟 주요 어필 포인트

## 1. 문제 해결 능력
- **서버 접근 제약**이라는 조건 속에서도 실용적인 해결책을 도출
- 기존 시스템을 변경하지 않고도 사용자 경험 개선 가능
- 실제 사용자 니즈(상태별 색상 구분)를 반영한 기능 구현

## 2. 기술적 역량
- **Chrome Extension 개발 역량**: background script, content script, 메시지 통신, storage API 등 활용
- **JavaScript ES6+** 문법 활용 (클래스 기반 설계, async/await 등)
- **DOM 조작을 통한 실시간 반영** 및 **MutationObserver**를 활용한 동적 페이지 대응
- **i18n을 활용한 다국어 메시지 처리** 구현

## 3. 코드 품질
- 객체 지향적 설계: `ColorMineContentManager` 클래스를 통해 역할 분리
- 재사용성과 유지보수성을 고려한 함수 분리 및 명확한 변수/함수명
- 확장 가능성 높은 구조 (상태 추가 및 스타일 수정이 용이)

## 4. 사용자 경험 (UX) 고려
- 옵션 페이지에서 상태별 스타일을 설정 가능 (직관적인 UI 구성)
- 실시간으로 색상 반영이 가능한 구조 설계
- URL 패턴 지정 기능을 통해 불필요한 페이지 오작동 방지

## 5. 보안 및 안정성
- `chrome.storage.sync`를 통해 안전하고 신뢰성 있는 데이터 저장
- 비정상 상황 (tr 또는 td가 없을 경우 등)에 대한 예외 처리 구현
- 사용자 설정값에 대한 유효성 검증을 고려


# 🚀 개발 및 적용 과정
1. **요구사항 정의**: Redmine 상태별 시각화 필요성 확인
2. **기획/설계**: DOM 구조 분석, 상태 텍스트 및 클래스 구조 파악
3. **구현**: content script 및 background script로 기능 분리 개발
4. **테스트**: 다양한 상태값과 URL 환경에서 테스트 진행
5. **배포 및 적용**: 사내 크롬 사용자들에게 배포 후 피드백 수집


# ✅ 결과 및 효과
- 시각적인 상태 구분이 가능해짐으로써 업무 효율 상승
- Redmine UI를 해치지 않고 사용자 맞춤 시각화 구현 가능
- 확장 기능이기 때문에 환경 제약 없이 사용 가능


# 🛠️ 사용 기술 스택
- JavaScript (ES6+)
- Chrome Extensions API (Manifest V3)
- HTML/CSS
- Storage API (`chrome.storage.sync`)
- DOM 조작 및 MutationObserver
- i18n (다국어 메시지 처리)