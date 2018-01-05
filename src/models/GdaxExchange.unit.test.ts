import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
} from "../types";
import { GdaxExchange } from "./GdaxExchange";

describe("GdaxExchange", () => {
  describe("getProductIdsFromCurrencies", () => {
    it("should get product ID BTC-USD for (BTC, USD) pair", () => {
      const expectedProductIds: string[] = ["BTC-USD"];
      expect(GdaxExchange.getProductIdsFromCurrencies([CryptoCurrencies.Bitcoin], [Currencies.USD]))
        .toEqual(expectedProductIds);
    });

    it("should get product ID ETH-USD for (ETH, USD) pair", () => {
      const expectedProductIds: string[] = ["ETH-USD"];
      expect(GdaxExchange.getProductIdsFromCurrencies([CryptoCurrencies.Ethereum], [Currencies.USD]))
        .toEqual(expectedProductIds);
    });

    it("should get product ID LTC-USD for (LTC, USD) pair", () => {
      const expectedProductIds: string[] = ["LTC-USD"];
      expect(GdaxExchange.getProductIdsFromCurrencies([CryptoCurrencies.Litecoin], [Currencies.USD]))
        .toEqual(expectedProductIds);
    });

    it("should get multiple product IDs for all pairs", () => {
      const testCryptoCurrencies: CryptoCurrencies[] =
        [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin];
      const expectedProductIds: string[] = ["BTC-USD", "ETH-USD", "LTC-USD"];
      expect(GdaxExchange.getProductIdsFromCurrencies(testCryptoCurrencies, [Currencies.USD]))
        .toEqual(expectedProductIds);
    });
  });

  describe("getCurrencyPairFromProductId", () => {
    it("should get (BTC, USD) pair from BTC-USD product ID", () => {
      const testProductId: string = "BTC-USD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
      };
      expect(GdaxExchange.getCurrencyPairFromProductId(testProductId))
        .toEqual(expectedCurrencyPair);
    });

    it("should get (ETH, USD) pair from ETH-USD product ID", () => {
      const testProductId: string = "ETH-USD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
      };
      expect(GdaxExchange.getCurrencyPairFromProductId(testProductId))
        .toEqual(expectedCurrencyPair);
    });

    it("should get (LTC, USD) pair from LTC-USD product ID", () => {
      const testProductId: string = "LTC-USD";
      const expectedCurrencyPair: ICurrencyPair = {
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
      };
      expect(GdaxExchange.getCurrencyPairFromProductId(testProductId))
        .toEqual(expectedCurrencyPair);
    });

    it("should throw an error for invalid product ID", () => {
      const invalidProductId: string = "invalid product ID";
      expect(() => {
        GdaxExchange.getCurrencyPairFromProductId(invalidProductId);
      }).toThrow();
    });
  });
});
