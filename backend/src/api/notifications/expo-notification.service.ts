import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class ExpoNotificationService {
  private expo: Expo;
  private readonly logger = new Logger(ExpoNotificationService.name);

  constructor() {
    this.expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  }

  async sendNotification(
    expoPushTokens: string[],
    title: string,
    body: string,
    data: Record<string, any> = {},
  ): Promise<void> {
    // Create the messages to send
    const messages: ExpoPushMessage[] = [];

    for (const pushToken of expoPushTokens) {
      // Check if the token is valid
      if (!Expo.isExpoPushToken(pushToken)) {
        this.logger.error(
          `Push token ${pushToken} is not a valid Expo push token`,
        );
        continue;
      }

      // Construct a message
      messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
      });
    }

    // No valid tokens to send to
    if (messages.length === 0) {
      return;
    }

    try {
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      // Send the notifications
      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          this.logger.error('Error sending notification chunk:', error);
        }
      }

      // Process the tickets
      this.processTickets(tickets);
    } catch (error) {
      this.logger.error('Error sending notifications:', error);
    }
  }

  private processTickets(tickets: ExpoPushTicket[]): void {
    for (const ticket of tickets) {
      if (ticket.status === 'error') {
        this.logger.error(`Error sending notification: ${ticket.message}`);

        if (ticket.details?.error === 'DeviceNotRegistered') {
          // You should remove this token from your database
          this.logger.warn('Device not registered, should remove token');
        }
      }
    }
  }
}
