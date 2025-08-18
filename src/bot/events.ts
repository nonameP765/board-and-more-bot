import { Client } from 'discord.js';
import { setBotActivity } from './client';
import { deployCommands, handleCommand } from '../commands';
import { startCrawlingScheduler } from '../crawling/scheduler';
import { cleanupDriver } from '../crawling/crawler';

// 봇 준비 이벤트 핸들러
export function setupReadyEvent(client: Client): void {
  client.once('ready', async (readyClient) => {
    console.log(`✅ ${readyClient.user.tag}로 로그인했습니다!`);

    // 봇 상태 설정
    setBotActivity(client);

    // 슬래시 명령어 등록
    await deployCommands(client);

    // 크롤링 스케줄러 시작
    startCrawlingScheduler(client);
  });
}

// 명령어 상호작용 이벤트 핸들러
export function setupInteractionEvent(client: Client): void {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await handleCommand(interaction, client);
  });
}

// 에러 이벤트 핸들러
export function setupErrorEvents(client: Client): void {
  client.on('error', (error) => {
    console.error('Discord 클라이언트 에러:', error);
  });

  process.on('unhandledRejection', (error) => {
    console.error('처리되지 않은 Promise 거부:', error);
  });
}

// 프로세스 종료 이벤트 핸들러
export function setupProcessEvents(): void {
  process.on('SIGINT', async () => {
    console.log('\n🔄 봇 종료 중...');
    await cleanupDriver();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🔄 봇 종료 중...');
    await cleanupDriver();
    process.exit(0);
  });
}

// 모든 이벤트 설정
export function setupAllEvents(client: Client): void {
  setupReadyEvent(client);
  setupInteractionEvent(client);
  setupErrorEvents(client);
  setupProcessEvents();
}
