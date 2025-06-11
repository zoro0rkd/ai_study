# 온라인 시험 웹 애플리케이션

## 설치

### 필수 요구사항
- **Node.js** (v14 이상) 및 **npm** 설치  
  - **Homebrew** 사용 시:
    ```bash
    brew install node
    ```
  - 또는 [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드 후 설치

### 의존성 설치
프로젝트 루트 디렉토리에서 다음 명령어 실행:
```bash
npm install express
```

## 실행
```bash
node server.js
```
브라우저에서 `http://localhost:32400` 으로 접속하여 UI 확인

## 폴더 구조
```plaintext
online-test/
├─ server.js            # Express 서버 엔트리포인트
├─ questions.json       # 시험 문항 데이터 파일
├─ README.md            # 이 가이드 문서
└─ public/              # 정적 파일 디렉토리
   ├─ index.html        # 메인 HTML
   ├─ style.css         # 스타일 시트
   ├─ script.js         # 클라이언트 로직
   └─ images/           # 이미지 리소스
       └─ Q4.png        # 예시 이미지 파일
```

## `questions.json` 구조

`questions.json` 은 JSON 배열 형태이며, 각 문항 객체는 다음 키를 가집니다:

```json
[
  {
    "type": "objective",   // 문제 유형: "objective" | "subjective" | "essay"
    "number": 1,           // 문제 번호 (정수)
    "question": "...",     // 질문 본문 (문자열)
    "choices": [           // 객관식 선택지 배열, 주관식/서술형 시 빈 배열
      "보기1",
      "보기2",
      "보기3"
    ],
    "explanation": "...",  // (옵션) 추가 설명 텍스트 또는 `images/파일명` 형태의 이미지 경로
    "textboxCount": 0      // 텍스트박스 개수 (주관식/서술형)
  }
]
```

- **type**  
  - `objective` (객관식)  
  - `subjective` (주관식)  
  - `essay`     (서술형)  
- **number**: 고유 문제 번호  
- **question**: 화면에 표시할 질문 텍스트  
- **choices**: 객관식 보기 배열  
- **explanation**: 추가 설명(텍스트) 또는 이미지 경로  
- **textboxCount**: 텍스트박스 개수  

---

프로젝트 설정 및 문항 편집 후 서버를 재시작하면 변경 사항이 즉시 반영됩니다.