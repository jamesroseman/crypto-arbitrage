import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../../types";

export function getTickerUpdateFromMsgData(msgData: number[], currPair: ICurrencyPair): ITickerUpdate {
  if (msgData.length !== 11) {
    throw new Error("Message is not formatted correctly.");
  }
  const now: Date = new Date();
  return {
    askPrice: msgData[3],
    bidPrice: msgData[1],
    cryptoCurrency: currPair.cryptoCurrency,
    currency: currPair.currency,
    timestamp: now.getTime(),
  } as ITickerUpdate;
}
