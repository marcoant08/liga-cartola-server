export const SITE_VISITOR_REPOSITORY = 'SITE_VISITOR_REPOSITORY' as const;

export interface ISiteVisitorRepository {
  upsertHeartbeat(visitorId: string, at: Date): Promise<void>;
  countSeenSince(since: Date): Promise<number>;
}
