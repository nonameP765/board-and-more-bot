import { Client } from 'discord.js';
import * as cron from 'node-cron';
import {
  crawlWebsite,
  getLastCrawledData,
  setLastCrawledData,
  isFirstRunCheck,
  setFirstRun
} from './crawler';
import { sendToChannel } from './discord';

// 크롤링 작업 실행
export async function runCrawlingTask(client: Client): Promise<void> {
  console.log('🔄 크롤링 작업 실행 중...');

  const crawledData = await crawlWebsite();

  if (!crawledData) {
    console.log('❌ 크롤링 데이터를 가져올 수 없습니다.');
    return;
  }

  const lastData = getLastCrawledData();
  const isFirst = isFirstRunCheck();

  // 첫 실행이거나 데이터가 변경되었을 때만 메시지 발송
  if (isFirst || lastData !== crawledData) {
    const prefix = isFirst ? '🎯 **초기 크롤링 결과**\n' : '🔄 **업데이트 감지**\n';
    const message = `${prefix}\`\`\`\n${crawledData}\n\`\`\``;

    await sendToChannel(client, message);
    setLastCrawledData(crawledData);
    setFirstRun(false);
  } else {
    console.log('📝 데이터 변경 없음 - 메시지 건너뜀');
  }
}

// 크롤링 스케줄러 시작
export function startCrawlingScheduler(client: Client): void {
  const cronExpression = process.env.CRAWL_CRON_SCHEDULE || '*/5 * * * *'; // 기본값: 5분마다

  console.log(`🕐 크롤링 스케줄러 시작 (${cronExpression})`);

  cron.schedule(
    cronExpression,
    async () => {
      await runCrawlingTask(client);
    },
    {
      scheduled: true,
      timezone: 'Asia/Seoul'
    }
  );

  // 봇 시작 시 즉시 한 번 실행 (선택사항)
  if (process.env.CRAWL_ON_STARTUP === 'true') {
    console.log('🚀 시작 시 크롤링 실행...');
    setTimeout(async () => {
      await runCrawlingTask(client);
    }, 5000); // 5초 후 실행
  }
}
