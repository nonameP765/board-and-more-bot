import { Client, TextChannel } from 'discord.js';

// 채널로 메시지 발송
export async function sendToChannel(client: Client, message: string): Promise<void> {
  const channelId = process.env.CRAWL_CHANNEL_ID;

  if (!channelId) {
    console.error('❌ CRAWL_CHANNEL_ID가 설정되지 않았습니다!');
    return;
  }

  try {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;

    if (!channel || !channel.isTextBased()) {
      console.error('❌ 유효하지 않은 채널입니다.');
      return;
    }

    await channel.send(message);
    console.log('✅ 메시지가 채널로 전송되었습니다.');
  } catch (error) {
    console.error('❌ 메시지 전송 오류:', error);
  }
}
