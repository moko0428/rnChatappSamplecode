# 1. 프로젝트 세팅

## 1-1. 헤르메스 엔진 비활성화

- 헤르메스 엔진을 활성화시키게 되면 다른 패키지와 충돌이 발생할 수도 있기 때문에 비활성화 하는 것이 좋다.

- 장점:
  a. 비활성화 시 자바스크립트 디버깅 도구의 호환성이 개선될 수 있다.
  b. 빌드 시간이 단축될 수 있다.
  c. 일부 설정 문제나 호환성 문제를 피할 수 있다.

- 단점:
  a. 안드로이드에서 자바스크립트 코드 실행 성능이 저하될 수 있다.
  b. 헤르메스 엔진이 아닌 기본 엔진을 사용하게 될 경우 메모리 사용량이 증가할 수 있다.
  c. 앱 크기가 증가할 수 있다.

따라서 작은 규모의 앱, 간단한 앱을 만들 경우 헤르메스 엔진을 비활성화하는 것이 편하다!

### ios에서 헤르메스 비활성화

ios/Podfile

```
 use_react_native!(
    :path => config[:reactNativePath],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    :hermes_enabled => false <- 추가
  )
```

추가 후에
cd ios
pod install

### android에서 헤르메스 비활성화

android/app/build.gradle

```
def jscFlavor = 'org.webkit:android-jsc:+'
def hermesEnabled = false
```

## 1-2. 번들 이름 수정하기

### ios에서 수정

1. xcode 열기
   cd ios
   xed .

2. bundle identifier 수정
   폴더/프로젝트 명/Signing & Capabillites/Bundle Identifier/com.원하는 이름.chatapp으로 수정 후 엔터!

### android에서 수정

android/app/src/main/java/MainActivity.kt

1. 파일 맨 위에 패키지명이 있는데 그것을 복사한다.

2. 검색에서 그 패키지명을 찾고 ios에서 설정한 패키지명으로 모두 바꿔준다.

# 2. 파이어베이스 패키지 설치

<a href="https://velog.io/@moko0428/RN-Firebase-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0-Authentication">파이어베이스 설정 하는 방법</a>
위의 링크에서 파이어베이스가 제시하는 버전만 바꿔 설정한다.

# 3. 회원가입 스크린 구현

- react-navigation 패키지 설치

```
npm i @react-navigation/native react-native-screens react-native-safe-area-context @react-navigation/native-stack react-native-gesture-handler
```

> 안드로이드는 따로 설정이 필요하다.

- TextInput 필드 구현
- 입력한 텍스트 검증

```
npm i --save-dev @types/validator
```

- 에러가 있을 시 회원 가입 버튼 비활성화
- 파이어베이스 auth를 이용하여 회원가입

공통 스크린 구현 - 헤더

# 4. 로그인 스크린 구현

- TextInput 필드 구현
- 입력한 텍스트 검증
- 에러가 있을 시 로그인 버튼 비활성화
- 파이어베이스 auth를 이용하여 로그인
- 이전 스크린 네비게이션 구현 (뒤로가기 버튼)

# 5. 홈 스크린 구현

- 로그인 된 사용자 정보 불러오기
- 로그아웃 구현
- firestore를 이용한 데이터 로드
- flatList를 이용하여 사용자 리스트 구현
