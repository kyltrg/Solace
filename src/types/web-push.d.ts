declare module "web-push" {
  interface PushSubscriptionKeys {
    p256dh: string;
    auth: string;
  }

  interface PushSubscription {
    endpoint: string;
    keys: PushSubscriptionKeys;
  }

  interface VapidDetails {
    subject: string;
    publicKey: string;
    privateKey: string;
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string,
  ): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload: string,
    options?: Record<string, unknown>,
  ): Promise<void>;

  export function generateVAPIDKeys(): {
    publicKey: string;
    privateKey: string;
  };
}
