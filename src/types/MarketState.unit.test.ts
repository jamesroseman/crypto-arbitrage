import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { IMarketUpdatesByTimestamp, MarketState } from "./MarketState";
import { IMarketUpdate } from "./MarketUpdate";
import { ITickerUpdate } from "./TickerUpdate";

jest.unmock("./MarketState");

describe("MarketState", () => {
  const mockExchangeName: string = "MockExchange";
  class MockExchange extends Exchange {
    constructor() {
      super(
        mockExchangeName,
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

  // Initial update mocks and test objects
  const expectedInitialBTCTickerUpdate = {
    askPrice: 0,
    bidPrice: 0,
    cryptoCurrency: CryptoCurrencies.Bitcoin,
    currency: Currencies.USD,
    timestamp: 0,
  } as ITickerUpdate;
  const testCrypto: CryptoCurrencies = CryptoCurrencies.Bitcoin;
  const testTimestamp: number = 0;
  const expectedInitialBTCMarketUpdate = {
    cryptoCurrency: CryptoCurrencies.Bitcoin,
    timestamp: testTimestamp,
    updates: {
      [mockExchangeName]: expectedInitialBTCTickerUpdate,
    },
  } as IMarketUpdate;
  const expectedInitialBTCMarketUpdatesByTimestamp = {
    [testTimestamp]: {
      [CryptoCurrencies.Bitcoin]: expectedInitialBTCMarketUpdate,
    },
  } as IMarketUpdatesByTimestamp;

  describe("createInitialMarketUpdate", () => {
    it("should return the initialMarketUpdate with provided crypto, exchanges, timestamp", () => {
      expect(MarketState.createInitialMarketUpdate(testCrypto, [mockExchange], testTimestamp))
        .toEqual(expectedInitialBTCMarketUpdate);
    });
  });

  describe("createInitialMarketUpdatesByTimestamp", () => {
    it("should return the initialMarketUpdatesByTimestamp with provided cryptos, exchanges", () => {
      expect(MarketState
        .createInitialMarketUpdatesByTimestamp([testCrypto], [mockExchange], testTimestamp))
      .toEqual(expectedInitialBTCMarketUpdatesByTimestamp);
    });
  });

  describe("createInitialTickerUpdate", () => {
    it("should return the initialTickerUpdate with provided cryptocurrency", () => {
      expect(MarketState.createInitialTickerUpdate(testCrypto))
        .toEqual(expectedInitialBTCTickerUpdate);
    });
  });

  describe("getExchanges", () => {
    it("should get the constructor set exchanges", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      expect(testMarketState.getExchanges()).toBe(mockExchanges);
    });
  });

  describe("getName", () => {
    it("should get the constructor set name", () => {
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, []);
      expect(testMarketState.getName()).toEqual(testMarketStateName);
    });
  });
});
