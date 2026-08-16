import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

/*
    *사용법
    1. js파일은 도메인 기준으로 생성, 도메인은 스웨거에 나눠져있는 기준을 말함 User,Recipe...
    2. js파일 안에 해당 도메인의 API를 생성, 함수 이름은 어떤 기능이고 어떤 요청인지 알 수 있도록 해야함
    3. 하단의 코드는 템플릿이라고 보면 됨, API 사용 규칙을 정해놓은 것임
    4. APIService.public.{해당 요청 메소드}("{해당 요청 경로}");
    ! 경로는 환경변수 이후 경로부터 써야함 예: 환경변수=~~api/v1 이면 그 뒤의 경로만 넣으면 됨
    ? userApi.js에 예시를 만들었으니 참고하고 질문이 있다면 언제든 환영~
    TODO: 환경변수 상의하여 결정하고 노션에 적어놓기, 보통 v1까지 환경변수로 설정 함
 */


// ─── Axios 인스턴스 생성 ─────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 타임아웃
});

// ─── 공통 응답 인터셉터 (response.data 자동 추출) ────
const unwrapResponse = (response) => response.data;
const handleError = (error) => Promise.reject(error);

api.interceptors.response.use(unwrapResponse, handleError);

// ─── 요청 취소 헬퍼 (AbortController) ────────────────
export const createCancelToken = () => new AbortController();

// ─── 재시도 헬퍼 (네트워크 에러 시 자동 재시도) ───────
const withRetry = (fn, retries = 2, delay = 1000) => {
  return async (...args) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        const isLastAttempt = attempt === retries;
        const isRetryable = !error.response || error.code === 'ECONNABORTED';

        if (isLastAttempt || !isRetryable) throw error;
        await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
      }
    }
  };
};

// ─── API 서비스 ──────────────────────────────────────
const baseMethods = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
};

export const APIService = {
  ...baseMethods,

  // 기존 코드 호환용 (APIService.public / APIService.private 둘 다 동일하게 동작)
  public: baseMethods,
  private: baseMethods,

  // 재시도가 필요한 중요 요청용 (네트워크 불안정 대비)
  retry: {
    get: withRetry(baseMethods.get),
    post: withRetry(baseMethods.post),
  },
};

export { api };
