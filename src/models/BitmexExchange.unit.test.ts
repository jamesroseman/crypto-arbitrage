import {
  CryptoCurrencies,
  Currencies,
  ExchangeState,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";
import { BitmexExchange } from "./BitmexExchange";

describe("BitmexExchange", () => {
  describe("symbolToCurrencyPair", () => {
    it("should convert XBTUSD to (BTC, USD) pair", () => {
      const testSymbol: string = "XBTUSD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      expect(BitmexExchange.symbolToCurrencyPair(testSymbol))
        .toEqual(expectedCurrencyPair);
    });

    it("should convert ETHH18 to (ETH, XBT) pair", () => {
      const testSymbol: string = "ETHH18";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.XBT,
      };
      expect(BitmexExchange.symbolToCurrencyPair(testSymbol))
        .toEqual(expectedCurrencyPair);
    });

    it("should convert LTCH18 to (LTC, XBT) pair", () => {
      const testSymbol: string = "LTCH18";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.XBT,
      };
      expect(BitmexExchange.symbolToCurrencyPair(testSymbol))
        .toEqual(expectedCurrencyPair);
    });

    it("should throw exception for invalid currency", () => {
      const testSymbol: string = "invalid symbol";
      expect(() => {
        BitmexExchange.symbolToCurrencyPair(testSymbol);
      }).toThrow();
    });
  });

  describe("getTickerUpdateFromMsg", () => {
    let testBitmexExchange: BitmexExchange;
    const testAskPrice: number = 10;
    const testBidPrice: number = 20;
    const testBTCTickerMessage = {
      data: JSON.stringify({
        data: [{
          askPrice: testAskPrice,
          bidPrice: testBidPrice,
          symbol: "XBTUSD",
          timestamp: "0",
        }],
        table: "quote",
      }),
    };

    beforeEach(() => {
      testBitmexExchange = new BitmexExchange(
        [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin],
      );
    });

    it("should get (BTC, USD) from message", () => {
      const testCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      const expectedTickerUpdate: ITickerUpdate = {
        askPrice: testAskPrice,
        bidPrice: testBidPrice,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      };
      expect(testBitmexExchange.getTickerUpdateFromMsg(testBTCTickerMessage, testCurrencyPair))
        .toEqual(expectedTickerUpdate);
    });

    it("should get (ETH, USD) from message with XBT to USD conversion", () => {
      const testCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
      };
      const testETHAskPrice: number = 0.10;
      const testETHBidPrice: number = 0.20;
      const testETHTickerMessage = {
        data: JSON.stringify({
          data: [{
            askPrice: testETHAskPrice,
            bidPrice: testETHBidPrice,
            symbol: "ETHH18",
            timestamp: "0",
          }],
        }),
      };
      const expectedTickerUpdate: ITickerUpdate = {
        askPrice: testETHAskPrice * testAskPrice,
        bidPrice: testETHBidPrice * testBidPrice,
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
        timestamp: 0,
      };
      // First we need to load in the current XBTUSD price
      expect(testBitmexExchange.isTickerMsg(testBTCTickerMessage)).toBe(true);
      expect(testBitmexExchange.getTickerUpdateFromMsg(testETHTickerMessage, testCurrencyPair))
        .toEqual(expectedTickerUpdate);
    });

    it("should get (LTC, USD) from message with XBT to USD conversion", () => {
      const testCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
      };
      const testLTCAskPrice: number = 0.010;
      const testLTCBidPrice: number = 0.020;
      const testLTCTickerMessage = {
        data: JSON.stringify({
          data: [{
            askPrice: testLTCAskPrice,
            bidPrice: testLTCBidPrice,
            symbol: "LTCH18",
            timestamp: "0",
          }],
        }),
      };
      const expectedTickerUpdate: ITickerUpdate = {
        askPrice: testLTCAskPrice * testAskPrice,
        bidPrice: testLTCBidPrice * testBidPrice,
        cryptoCurrency: CryptoCurrencies.Litecoin



        ,
        currency: Currencies.USD,
        timestamp: 0,
      };
      // First we need to load in the current XBTUSD price
      expect(testBitmexExchange.isTickerMsg(testBTCTickerMessage)).toBe(true);
      expect(testBitmexExchange.getTickerUpdateFromMsg(testLTCTickerMessage, testCurrencyPair))
        .toEqual(expectedTickerUpdate);
    });
  });
});
