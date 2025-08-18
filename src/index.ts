import * as dotenv from 'dotenv';
import { createClient } from './bot/client';
import { setupAllEvents } from './bot/events';

// 환경변수 로드
dotenv.config();

// 메인 함수
async function main(): Promise<void> {
  // Discord 토큰 확인
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('❌ DISCORD_TOKEN이 환경변수에 설정되지 않았습니다!');
    console.log('env.example 파일을 .env로 복사하고 토큰을 설정하세요.');
    process.exit(1);
  }

  // 봇 클라이언트 생성
  const client = createClient();

  // 이벤트 핸들러 설정
  setupAllEvents(client);

  // 봇 로그인
  try {
    await client.login(token);
  } catch (error) {
    console.error('❌ 봇 로그인 실패:', error);
    process.exit(1);
  }
}

// 애플리케이션 시작
main().catch((error) => {
  console.error('❌ 애플리케이션 시작 실패:', error);
  process.exit(1);
});
