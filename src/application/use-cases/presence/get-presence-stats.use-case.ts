import { Inject, Injectable } from '@nestjs/common';
import {
  ONLINE_WINDOW_SECONDS,
  UNIQUE_VISITORS_WINDOW_DAYS,
} from '@domain/constants/presence.constants';
import {
  ISiteVisitorRepository,
  SITE_VISITOR_REPOSITORY,
} from '@domain/interfaces/repositories/site-visitor.repository.interface';
import { PresenceStatsResponseDto } from '@application/dtos/presence/presence-stats-response.dto';

@Injectable()
export class GetPresenceStatsUseCase {
  constructor(
    @Inject(SITE_VISITOR_REPOSITORY) private visitorRepository: ISiteVisitorRepository,
  ) {}

  async execute(): Promise<PresenceStatsResponseDto> {
    const now = Date.now();
    const uniqueSince = new Date(now - UNIQUE_VISITORS_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const onlineSince = new Date(now - ONLINE_WINDOW_SECONDS * 1000);
    const [uniqueVisitors, onlineNow] = await Promise.all([
      this.visitorRepository.countSeenSince(uniqueSince),
      this.visitorRepository.countSeenSince(onlineSince),
    ]);

    return {
      uniqueVisitors,
      onlineNow,
      onlineWindowSeconds: ONLINE_WINDOW_SECONDS,
      uniqueVisitorsWindowDays: UNIQUE_VISITORS_WINDOW_DAYS,
    };
  }
}
