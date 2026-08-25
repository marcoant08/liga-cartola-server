export class SiteVisitor {
  id: string;
  visitorId: string;
  firstSeenAt: Date;
  lastSeenAt: Date;

  constructor(partial: Partial<SiteVisitor>) {
    Object.assign(this, partial);
  }
}
