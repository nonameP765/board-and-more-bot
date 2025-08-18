import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

// 기본 명령어 정의
export const basicCommands = [
  new SlashCommandBuilder().setName('ping').setDescription('봇의 응답 시간을 확인합니다'),
  new SlashCommandBuilder().setName('안녕').setDescription('봇과 인사를 나눕니다'),
  new SlashCommandBuilder()
    .setName('주사위')
    .setDescription('주사위를 굴립니다')
    .addIntegerOption((option) =>
      option
        .setName('면수')
        .setDescription('주사위 면의 수 (기본값: 6)')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    ),
  new SlashCommandBuilder().setName('동전').setDescription('동전을 던집니다'),
  new SlashCommandBuilder().setName('서버정보').setDescription('현재 서버의 정보를 보여줍니다'),
  new SlashCommandBuilder().setName('도움말').setDescription('사용 가능한 명령어를 보여줍니다')
];

// 기본 명령어 처리 함수들
export async function handlePing(interaction: ChatInputCommandInteraction): Promise<void> {
  const ping = Date.now() - interaction.createdTimestamp;
  await interaction.reply(`🏓 퐁! 지연시간: ${ping}ms`);
}

export async function handleHello(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply(`안녕하세요, ${interaction.user.username}님! 👋`);
}

export async function handleDice(interaction: ChatInputCommandInteraction): Promise<void> {
  const sides = interaction.options.getInteger('면수') || 6;
  const result = Math.floor(Math.random() * sides) + 1;
  await interaction.reply(`🎲 ${sides}면 주사위 결과: **${result}**`);
}

export async function handleCoin(interaction: ChatInputCommandInteraction): Promise<void> {
  const coinResult = Math.random() < 0.5 ? '앞면' : '뒷면';
  await interaction.reply(`🪙 동전 던지기 결과: **${coinResult}**`);
}

export async function handleServerInfo(interaction: ChatInputCommandInteraction): Promise<void> {
  if (interaction.guild) {
    const guild = interaction.guild;
    const infoEmbed = {
      color: 0x0099ff,
      title: `📊 ${guild.name} 서버 정보`,
      fields: [
        { name: '👥 멤버 수', value: guild.memberCount.toString(), inline: true },
        {
          name: '📅 생성일',
          value: guild.createdAt.toLocaleDateString('ko-KR'),
          inline: true
        },
        { name: '👑 소유자', value: `<@${guild.ownerId}>`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };
    await interaction.reply({ embeds: [infoEmbed] });
  } else {
    await interaction.reply('❌ 서버 정보를 가져올 수 없습니다.');
  }
}

export async function handleHelp(interaction: ChatInputCommandInteraction): Promise<void> {
  const helpMessage = `
📋 **사용 가능한 슬래시 명령어**

\`/ping\` - 봇의 응답 시간 확인
\`/안녕\` - 인사하기
\`/주사위 [면수]\` - 주사위 굴리기 (기본값: 6)
\`/동전\` - 동전 던지기
\`/서버정보\` - 서버 정보 보기
\`/도움말\` - 이 도움말 보기

🎲 **보드게임 명령어**
\`/게임추천\` - 랜덤 보드게임 추천
\`/인원게임 <인원수>\` - 해당 인원수에 맞는 게임 추천

🕷️ **크롤링 명령어**
\`/크롤링실행\` - 수동으로 크롤링 실행
\`/크롤링상태\` - 크롤링 설정 및 상태 확인

💡 **팁**: 명령어를 입력할 때 자동완성과 설명을 확인하세요!
  `;
  await interaction.reply(helpMessage);
}
