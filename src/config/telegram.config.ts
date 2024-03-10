import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from '../telegram/telegram.interface';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');
  const chatId = configService.get('TELEGRAM_CHAT_ID');

  if (!token) {
    throw new Error('Telegram token and chatId must be defined');
  }

  return {
    token,
    chatId,
  };
};
