import { ChatInputCommandInteraction, SlashCommandBuilder, Client } from 'discord.js';
import { runCrawlingTask } from '../crawling/scheduler';
import { getLastCrawledData, getDriverStatus } from '../crawling/crawler';

// 크롤링 관련 명령어 정의
export const crawlingCommands = [
  new SlashCommandBuilder().setName('크롤링실행').setDescription('수동으로 크롤링을 실행합니다'),
  new SlashCommandBuilder().setName('크롤링상태').setDescription('크롤링 설정과 상태를 확인합니다')
];

// 수동 크롤링 실행
export async function handleManualCrawling(
  interaction: ChatInputCommandInteraction,
  client: Client
): Promise<void> {
  await interaction.deferReply();

  try {
    await runCrawlingTask(client);
    await interaction.editReply('✅ 크롤링이 실행되었습니다! 결과는 설정된 채널에서 확인하세요.');
  } catch (error) {
    console.error('수동 크롤링 오류:', error);
    await interaction.editReply('❌ 크롤링 실행 중 오류가 발생했습니다.');
  }
}

// 크롤링 상태 확인
export async function handleCrawlingStatus(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const targetUrl = process.env.CRAWL_TARGET_URL;
  const channelId = process.env.CRAWL_CHANNEL_ID;
  const cronSchedule = process.env.CRAWL_CRON_SCHEDULE || '*/5 * * * *';
  const selector = process.env.CRAWL_TARGET_SELECTOR || 'body';
  const onStartup = process.env.CRAWL_ON_STARTUP || 'false';
  const lastCrawledData = getLastCrawledData();
  const driverStatus = getDriverStatus();

  const statusEmbed = {
    color: 0x00ff00,
    title: '🕷️ 크롤링 상태',
    fields: [
      {
        name: '🎯 대상 URL',
        value: targetUrl || '❌ 설정되지 않음',
        inline: false
      },
      {
        name: '📍 CSS 선택자',
        value: `\`${selector}\``,
        inline: true
      },
      {
        name: '📢 알림 채널',
        value: channelId ? `<#${channelId}>` : '❌ 설정되지 않음',
        inline: true
      },
      {
        name: '⏰ 실행 주기',
        value: `\`${cronSchedule}\``,
        inline: true
      },
      {
        name: '🚀 시작시 실행',
        value: onStartup === 'true' ? '✅' : '❌',
        inline: true
      },
      {
        name: '🔧 드라이버 상태',
        value: driverStatus ? '✅ 활성화' : '❌ 비활성화',
        inline: true
      },
      {
        name: '📊 마지막 데이터',
        value: lastCrawledData ? '✅ 저장됨' : '❌ 없음',
        inline: true
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: '크롤링 설정 변경은 환경변수(.env) 파일에서 가능합니다.'
    }
  };

  await interaction.reply({ embeds: [statusEmbed] });
}
