// 이 파일은 설정용 파일입니다.
// http://localhost:9000

const API_HOST = "localhost" ; // API를 위한 호스트 컴퓨터(127.0.0.1) 이름, 두개 다 내 컴퓨터를 의미
const API_PORT = "9000"; // 스프링 부트 포트 번호

// export 키워드를 적어 주어야 외부에서 접근 가능합니다
export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`; 
