import crypto from 'crypto'

export class Random {
  public static uuid(): string {
    return crypto.randomUUID()
  }
}
