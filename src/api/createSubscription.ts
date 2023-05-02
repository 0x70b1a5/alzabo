import { SubscriptionRequestInterface } from "@urbit/http-api";

export function createSubscription(app: string, path: string, e: (data: any) => void, quit: (e: any) => void): SubscriptionRequestInterface {
  const request = {
    app,
    path,
    event: e,
    err: () => console.warn('SUBSCRIPTION ERROR'),
    quit: (e: any) => {
      quit(e)
      throw new Error(`subscription %${app}${path} quit`, e);
    }
  };
  console.log(`Subscribed: %${app}${path}`)
  // TODO: err, quit handling (resubscribe?)
  return request;           
}
