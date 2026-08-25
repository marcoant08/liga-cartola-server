import { Inject, Injectable } from '@nestjs/common';
import {
  ISiteVisitorRepository,
  SITE_VISITOR_REPOSITORY,
} from '@domain/interfaces/repositories/site-visitor.repository.interface';

@Injectable()
export class RecordHeartbeatUseCase {
  constructor(
    @Inject(SITE_VISITOR_REPOSITORY) private visitorRepository: ISiteVisitorRepository,
  ) {}

  async execute(visitorId: string): Promise<void> {
    await this.visitorRepository.upsertHeartbeat(visitorId, new Date());
  }
}
