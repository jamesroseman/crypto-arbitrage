import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
} from "../types";
import { OKCoinExchange } from "./OKCoinExchange";

describe("OKCoinExchange", () => {
  describe("getCurrencyPairFromChannel", () => {
    it("should get (BTC, USD) pair from channel", () => {
      const testChannel: string = "ok_sub_spot_btc_usd_ticker";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      expect(OKCoinExchange.getCurrencyPairFromChannel(testChannel))
        .toEqual(expectedCurrencyPair);
    });

    it("should get (ETH, USD) pair from channel", () => {
      const testChannel: string = "ok_sub_spot_eth_usd_ticker";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
      };
      expect(OKCoinExchange.getCurrencyPairFromChannel(testChannel))
        .toEqual(expectedCurrencyPair);
    });

    it("should get (LTC, USD) pair from channel", () => {
      const testChannel: string = "ok_sub_spot_ltc_usd_ticker";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
      };
      expect(OKCoinExchange.getCurrencyPairFromChannel(testChannel))
        .toEqual(expectedCurrencyPair);
    });

    it("should throw error for invalid crypto-currency", () => {
      expect(() => {
        OKCoinExchange.getCurrencyPairFromChannel("ok_sub_spot_INVALID_usd_ticker");
      }).toThrow();
    });

    it("should throw error for invalid currency", () => {
      expect(() => {
        OKCoinExchange.getCurrencyPairFromChannel("ok_sub_spot_btc_INVALID_ticker");
      }).toThrow();
    });
  });

  describe("getCurrencyPairFromMsg", () => {
    const okCoinExchange: OKCoinExchange = new OKCoinExchange(
      [CryptoCurrencies.Bitcoin],
      [Currencies.USD],
    );

    it("should throw error if channel is missing from message", () => {
      expect(() => {
        okCoinExchange.getCurrencyPairFromMsg({});
      }).toThrow();
    });

    it("should throw error if channel exists, but is invalid", () => {
      expect(() => {
        okCoinExchange.getCurrencyPairFromMsg({ channel: "INVALID" });
      }).toThrow();
    });
  });
});
