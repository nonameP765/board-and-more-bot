import { REST, Routes, Client, ChatInputCommandInteraction } from 'discord.js';
import {
  basicCommands,
  handlePing,
  handleHello,
  handleDice,
  handleCoin,
  handleServerInfo,
  handleHelp
} from './basic';
import { gameCommands, handleGameRecommendation, handlePlayerCountGame } from './games';
import { crawlingCommands, handleManualCrawling, handleCrawlingStatus } from './crawling';

// 모든 명령어 통합
export const allCommands = [...basicCommands, ...gameCommands, ...crawlingCommands].map((command) =>
  command.toJSON()
);

// 명령어 등록 함수
export async function deployCommands(client: Client): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const guildId = process.env.GUILD_ID;

  if (!token) {
    console.error('❌ DISCORD_TOKEN이 설정되지 않았습니다!');
    return;
  }

  try {
    const rest = new REST({ version: '10' }).setToken(token);

    console.log('🔄 슬래시 명령어를 등록하는 중...');

    if (guildId) {
      // 특정 길드에만 등록 (테스트용, 즉시 반영)
      await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), {
        body: allCommands
      });
      console.log('✅ 길드 슬래시 명령어가 등록되었습니다!');
    } else {
      // 글로벌 명령어 등록 (1시간 정도 소요)
      await rest.put(Routes.applicationCommands(client.user!.id), { body: allCommands });
      console.log('✅ 글로벌 슬래시 명령어가 등록되었습니다!');
    }
  } catch (error) {
    console.error('❌ 명령어 등록 실패:', error);
  }
}

// 명령어 처리 라우터
export async function handleCommand(
  interaction: ChatInputCommandInteraction,
  client: Client
): Promise<void> {
  const { commandName } = interaction;

  try {
    switch (commandName) {
      // 기본 명령어들
      case 'ping':
        await handlePing(interaction);
        break;
      case '안녕':
        await handleHello(interaction);
        break;
      case '주사위':
        await handleDice(interaction);
        break;
      case '동전':
        await handleCoin(interaction);
        break;
      case '서버정보':
        await handleServerInfo(interaction);
        break;
      case '도움말':
        await handleHelp(interaction);
        break;

      // 게임 명령어들
      case '게임추천':
        await handleGameRecommendation(interaction);
        break;
      case '인원게임':
        await handlePlayerCountGame(interaction);
        break;

      // 크롤링 명령어들
      case '크롤링실행':
        await handleManualCrawling(interaction, client);
        break;
      case '크롤링상태':
        await handleCrawlingStatus(interaction);
        break;

      default:
        await interaction.reply('❓ 알 수 없는 명령어입니다.');
    }
  } catch (error) {
    console.error('명령어 처리 중 오류:', error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp('❌ 명령어 처리 중 오류가 발생했습니다.');
    } else {
      await interaction.reply('❌ 명령어 처리 중 오류가 발생했습니다.');
    }
  }
}
