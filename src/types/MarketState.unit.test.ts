import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { MarketState } from "./MarketState";
import { ITickerUpdate } from "./TickerUpdate";

jest.unmock("./MarketState");

describe("MarketState", () => {
  class MockExchange extends Exchange {
    constructor() {
      super(
        "MockExchange",
        jest.fn(),
        jest.fn(),
        jest.fn(),
      );
    }
    public isValidMsg(msg: string) { return false; }
    public isHeartbeatMsg(msg: string) { return false; }
    public isTickerMsg(msg: string) { return false; }
    public initializeExchangeConnection() { return true; }
    public initializeExchangeTicker() { return true; }
  }
  const mockExchange: MockExchange = new MockExchange();
  const testMarketStateName: string = "any name";

  describe("createInitialTickerUpdate", () => {
    it("should return the initialTickerUpdate with provided cryptocurrency", () => {
      const expectedInitialBTCTickerUpdate = {
        askPrice: 0,
        bidPrice: 0,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 0,
      } as ITickerUpdate;
      const testMarketState: MarketState = new MarketState(testMarketStateName, []);
      expect(testMarketState.createInitialTickerUpdate(CryptoCurrencies.Bitcoin))
        .toEqual(expectedInitialBTCTickerUpdate);
    });
  });

  describe("getExchanges", () => {
    it("should get the constructor set exchanges", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      expect(testMarketState.getExchanges()).toBe(mockExchanges);
    });
  });

  describe("getName", () => {
    it("should get the constructor set name", () => {
      const testMarketState: MarketState = new MarketState(testMarketStateName, []);
      expect(testMarketState.getName()).toEqual(testMarketStateName);
    });
  });
});
