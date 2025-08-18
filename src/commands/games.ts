import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { boardGames, getGamesByPlayerCount, getRandomGame } from '../data/games';

// 게임 관련 명령어 정의
export const gameCommands = [
  new SlashCommandBuilder().setName('게임추천').setDescription('랜덤 보드게임을 추천합니다'),
  new SlashCommandBuilder()
    .setName('인원게임')
    .setDescription('지정된 인원수에 맞는 게임을 추천합니다')
    .addIntegerOption((option) =>
      option
        .setName('인원수')
        .setDescription('플레이어 수')
        .setMinValue(1)
        .setMaxValue(20)
        .setRequired(true)
    )
];

// 게임 추천 명령어 처리
export async function handleGameRecommendation(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const randomGame = getRandomGame(boardGames);
  await interaction.reply(`🎲 추천 보드게임: **${randomGame}**`);
}

// 인원별 게임 추천 명령어 처리
export async function handlePlayerCountGame(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const playerCount = interaction.options.getInteger('인원수')!;
  const gamesByPlayers = getGamesByPlayerCount(playerCount);
  const recommendedGame = getRandomGame(gamesByPlayers);

  await interaction.reply(`👥 ${playerCount}명을 위한 추천 게임: **${recommendedGame}**`);
}
