# 🚀 배포 가이드

## 방법 1: Vercel로 배포 (추천)

### 1단계: GitHub에 코드 업로드

1. **GitHub 계정 만들기** (없다면)
   - https://github.com 접속
   - Sign up 클릭

2. **새 Repository 만들기**
   - GitHub 로그인 후 우측 상단 `+` 버튼 → `New repository` 클릭
   - Repository name: `care-diary` (또는 원하는 이름)
   - Public 선택
   - `Create repository` 클릭

3. **코드 업로드**
   
   **방법 A: GitHub 웹사이트에서 직접 업로드**
   - `uploading an existing file` 링크 클릭
   - 프로젝트 폴더의 모든 파일을 드래그 앤 드롭
   - `Commit changes` 클릭

   **방법 B: Git 사용 (터미널)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[사용자이름]/care-diary.git
   git push -u origin main
   ```

### 2단계: Vercel에 배포

1. **Vercel 계정 만들기**
   - https://vercel.com 접속
   - `Continue with GitHub` 클릭하여 GitHub 계정으로 로그인

2. **프로젝트 배포**
   - `Add New...` → `Project` 클릭
   - GitHub repository 목록에서 `care-diary` 선택
   - `Import` 클릭
   - 설정은 그대로 두고 `Deploy` 클릭

3. **배포 완료!** 🎉
   - 1-2분 후 배포 완료
   - `https://care-diary-xxxx.vercel.app` 같은 주소 생성
   - 이 주소를 모바일에서 접속!

---

## 방법 2: GitHub Pages로 배포

### 1단계: package.json 수정

`package.json`에 homepage 추가:
```json
{
  "homepage": "https://[사용자이름].github.io/care-diary",
  ...
}
```

### 2단계: vite.config.js 수정

```javascript
export default defineConfig({
  base: '/care-diary/',
  ...
})
```

### 3단계: 배포 스크립트 추가

`package.json`의 scripts에 추가:
```json
"scripts": {
  ...
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### 4단계: gh-pages 설치 및 배포

```bash
npm install --save-dev gh-pages
npm run deploy
```

---

## 모바일에서 PWA로 설치하기

### 안드로이드 (Chrome)
1. 배포된 주소 접속
2. 우측 상단 `⋮` 메뉴 → `홈 화면에 추가`
3. 앱 이름 확인 후 `추가` 클릭
4. 홈 화면에 앱 아이콘 생성됨!

### iOS (Safari)
1. 배포된 주소 접속
2. 하단 공유 버튼 (□↑) 클릭
3. `홈 화면에 추가` 선택
4. 앱 이름 확인 후 `추가` 클릭
5. 홈 화면에 앱 아이콘 생성됨!

---

## 주요 기능

✅ **오프라인 작동**: 설치 후 인터넷 없이도 사용 가능
✅ **데이터 보안**: 모든 데이터는 각자의 폰에만 저장
✅ **앱처럼 사용**: 홈 화면에서 바로 실행
✅ **자동 업데이트**: 코드 수정 후 GitHub에 푸시하면 자동 배포

---

## 아이콘 교체하기 (선택사항)

현재는 임시 고양이 이모지 아이콘입니다.
커스텀 아이콘을 원하시면:

1. 512x512px PNG 이미지 준비
2. `public/icon-192.png` (192x192px)
3. `public/icon-512.png` (512x512px)
4. 다시 배포

**아이콘 생성 도구**:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

---

## 문제 해결

### Q: 배포는 됐는데 빈 화면만 나와요
A: vite.config.js의 base 설정을 확인하세요. Vercel은 base가 '/'여야 합니다.

### Q: 데이터가 사라졌어요
A: 브라우저 캐시/쿠키를 삭제하면 IndexedDB 데이터도 삭제됩니다. 조심하세요!

### Q: 코드 수정 후 반영이 안돼요
A: 
- Vercel: GitHub에 push하면 자동 배포됨
- GitHub Pages: `npm run deploy` 다시 실행
- 브라우저 캐시 삭제 후 새로고침

---

## 다음 단계

- [ ] 아이콘 커스터마이징
- [ ] 도메인 연결 (선택사항)
- [ ] 친구들과 링크 공유
- [ ] 각자의 폰에 PWA 설치

