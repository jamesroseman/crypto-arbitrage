import {
  CryptoCurrencies,
  Currencies,
  ExchangeState,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";
import { BitfinexExchange } from "./BitfinexExchange";

describe("BitfinexExchange", () => {
  describe("currencyPairToSubscriptionPair", () => {
    it("should convert (BTC, USD) pair to subscription pair", () => {
      const testCurrencyPair: ICurrencyPair = { cryptoCurrency: CryptoCurrencies.Bitcoin, currency: Currencies.USD };
      const expectedSubscriptionPair: string = "BTCUSD";
      expect(BitfinexExchange.currencyPairToSubscriptionPair(testCurrencyPair)).toBe(expectedSubscriptionPair);
    });

    it("should convert (ETH, USD) pair to subscription pair", () => {
      const testCurrencyPair: ICurrencyPair = { cryptoCurrency: CryptoCurrencies.Ethereum, currency: Currencies.USD };
      const expectedSubscriptionPair: string = "ETHUSD";
      expect(BitfinexExchange.currencyPairToSubscriptionPair(testCurrencyPair)).toBe(expectedSubscriptionPair);
    });

    it("should convert (LTC, USD) pair to subscription pair", () => {
      const testCurrencyPair: ICurrencyPair = { cryptoCurrency: CryptoCurrencies.Litecoin, currency: Currencies.USD };
      const expectedSubscriptionPair: string = "LTCUSD";
      expect(BitfinexExchange.currencyPairToSubscriptionPair(testCurrencyPair)).toBe(expectedSubscriptionPair);
    });
  });

  describe("subscriptionPairToCurrencyPair", () => {
    it("should convert BTCUSD pair to (BTC, USD) pair", () => {
      const testSubscriptionPair: string = "BTCUSD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      expect(BitfinexExchange.subscriptionPairToCurrencyPair(testSubscriptionPair)).toEqual(expectedCurrencyPair);
    });

    it("should convert ETHUSD pair to (ETH, USD) pair", () => {
      const testSubscriptionPair: string = "ETHUSD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
      };
      expect(BitfinexExchange.subscriptionPairToCurrencyPair(testSubscriptionPair)).toEqual(expectedCurrencyPair);
    });

    it("should convert LTCUSD pair to (LTC, USD) pair", () => {
      const testSubscriptionPair: string = "LTCUSD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
      };
      expect(BitfinexExchange.subscriptionPairToCurrencyPair(testSubscriptionPair)).toEqual(expectedCurrencyPair);
    });
  });

  describe("getCurrencyPairFromMsg", () => {
    const testBitfinexExchange: BitfinexExchange = new BitfinexExchange(
      [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin],
      [Currencies.USD],
    );
    const testBTCSubscriptionMessage = {
      data: JSON.stringify({
        chanId: 1,
        channel: "ticker",
        event: "subscribed",
        pair: "BTCUSD",
      }),
    };

    it("should get (BTC, USD) pair from message", () => {
      const testBidValue: number = 10;
      const testAskValue: number = 20;
      const testTickerMessage = {
        // [ CHANNEL_ID, BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_PERC, LAST_PRICE, VOLUME, HIGH, LOW]
        data: JSON.stringify([1, testBidValue, 0, testAskValue, 0, 0, 0, 0, 0, 0, 0]),
      };
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      expect(testBitfinexExchange.isSubscriptionMsg(testBTCSubscriptionMessage)).toBe(true);
      expect(testBitfinexExchange.getCurrencyPairFromMsg(testTickerMessage)).toEqual(expectedCurrencyPair);
    });
  });

  describe("getTickerUpdateFromMsg", () => {
    const testBitfinexExchange: BitfinexExchange = new BitfinexExchange(
      [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin],
      [Currencies.USD],
    );
    const testBTCSubscriptionMessage = {
      data: JSON.stringify({
        chanId: 1,
        channel: "ticker",
        event: "subscribed",
        pair: "BTCUSD",
      }),
    };

    it("should get correct ticker update from ticker message", () => {
      const testBidValue: number = 10;
      const testAskValue: number = 20;
      const testTickerMessage = {
        // [ CHANNEL_ID, BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_PERC, LAST_PRICE, VOLUME, HIGH, LOW]
        data: JSON.stringify([1, testBidValue, 0, testAskValue, 0, 0, 0, 0, 0, 0, 0]),
      };
      const testCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      const expectedTickerUpdate: ITickerUpdate = {
        askPrice: testAskValue,
        bidPrice: testBidValue,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      };
      const resultTickerUpdate =
        testBitfinexExchange.getTickerUpdateFromMsg(testTickerMessage, testCurrencyPair, new ExchangeState(""));
      // Because BitfinexExchange grabs "now" as the timestamp, the test will always fail unless it's
      // explicitly set after being created within the exchange.
      resultTickerUpdate.timestamp = 0;
      expect(resultTickerUpdate).toEqual(expectedTickerUpdate);
    });
  });
});
