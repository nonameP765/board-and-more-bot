import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

// 봇 클라이언트 생성
export function createClient(): Client {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers
    ]
  });
}

// 봇 상태 설정
export function setBotActivity(client: Client): void {
  client.user?.setActivity('스위트랜드', { type: ActivityType.Playing });
}
