import { CryptoCurrencies, Currencies } from "./Currency";
import { ExchangeState } from "./ExchangeState";
import { ITickerUpdate } from "./TickerUpdate";

jest.unmock("./ExchangeState");

describe("ExchangeState", () => {
  describe("addTickerToState", () => {
    it("should get the updated ticker update when new update added", () => {
      const testExchangeStateName: string = "any name";
      const testExchangeState: ExchangeState = new ExchangeState(testExchangeStateName);
      const newBTCTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      };
      const newETHTickerUpdate: ITickerUpdate = {
        askPrice: 20,
        bidPrice: 20,
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
        timestamp: 0,
      };
      const newLTCTickerUpdate: ITickerUpdate = {
        askPrice: 30,
        bidPrice: 30,
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
        timestamp: 0,
      };
      // Because TickerUpdate type includes timestamp but the expected and actual won't be
      // instantiated at the same time in this test, we leave timestamps at 0 for convenience.
      testExchangeState.addTickerToState(newBTCTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Bitcoin)).toEqual(newBTCTickerUpdate);
      testExchangeState.addTickerToState(newETHTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Ethereum)).toEqual(newETHTickerUpdate);
      testExchangeState.addTickerToState(newLTCTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Litecoin)).toEqual(newLTCTickerUpdate);
    });
  });

  describe("createInitialTickerUpdate", () => {
    it("should return the initialTickerUpdate with provided cryptocurrency", () => {
      const expectedInitialBTCTickerUpdate = {
        askPrice: 0,
        bidPrice: 0,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      } as ITickerUpdate;
      const testExchangeStateName: string = "any name";
      const testExchangeState: ExchangeState = new ExchangeState(testExchangeStateName);
      expect(testExchangeState.createInitialTickerUpdate(CryptoCurrencies.Bitcoin))
        .toEqual(expectedInitialBTCTickerUpdate);
    });
  });

  describe("getName", () => {
    it("should get the constructor set name", () => {
      const testExchangeStateName: string = "any name";
      const testExchangeState: ExchangeState = new ExchangeState(testExchangeStateName);
      expect(testExchangeState.getName()).toEqual(testExchangeStateName);
    });
  });

  describe("getLatestTickerUpdate", () => {
    it("should get the initial ticker update when called from new instance", () => {
      const initialBTCTickerUpdate: ITickerUpdate = {
        askPrice: 0,
        bidPrice: 0,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      } as ITickerUpdate;
      const initialETHTickerUpdate: ITickerUpdate = {
        askPrice: 0,
        bidPrice: 0,
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
        timestamp: 0,
      } as ITickerUpdate;
      const initialLTCTickerUpdate: ITickerUpdate = {
        askPrice: 0,
        bidPrice: 0,
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
        timestamp: 0,
      } as ITickerUpdate;
      const testExchangeStateName: string = "any name";
      const testExchangeState: ExchangeState = new ExchangeState(testExchangeStateName);
      // Because TickerUpdate includes timestamp and they won't be instantiated at the same time,
      // it's safe to leave the timestamp untested.
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Bitcoin)).toEqual(initialBTCTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Ethereum)).toEqual(initialETHTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Litecoin)).toEqual(initialLTCTickerUpdate);
    });

    it("should get the updated ticker update when new update added", () => {
      const testExchangeStateName: string = "any name";
      const testExchangeState: ExchangeState = new ExchangeState(testExchangeStateName);
      const newBTCTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      };
      const newETHTickerUpdate: ITickerUpdate = {
        askPrice: 20,
        bidPrice: 20,
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
        timestamp: 0,
      };
      const newLTCTickerUpdate: ITickerUpdate = {
        askPrice: 30,
        bidPrice: 30,
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
        timestamp: 0,
      };
      // Because TickerUpdate includes timestamp and they won't be instantiated at the same time,
      // it's safe to leave the timestamp untested.
      testExchangeState.addTickerToState(newBTCTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Bitcoin)).toEqual(newBTCTickerUpdate);
      testExchangeState.addTickerToState(newETHTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Ethereum)).toEqual(newETHTickerUpdate);
      testExchangeState.addTickerToState(newLTCTickerUpdate);
      expect(testExchangeState.getLatestTickerUpdate(CryptoCurrencies.Litecoin)).toEqual(newLTCTickerUpdate);
    });
  });
});
