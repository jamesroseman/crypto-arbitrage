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

  describe("addTickerToState", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should get the updated ticker update when new update added", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testBTCTickerUpdate: ITickerUpdate = testInitialBTCTickerUpdate;
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      testMarketState.addTickerToState(testBTCTickerUpdate, mockExchangeName);
      expect(testMarketState.getLatestMarketUpdateCryptoMap()[CryptoCurrencies.Bitcoin])
        .toEqual(testInitialBTCMarketUpdate);
    });
  });

  describe("createInitialMarketUpdate", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should return the initialMarketUpdate with provided crypto, exchanges, timestamp", () => {
      expect(MarketState.createInitialMarketUpdate(CryptoCurrencies.Bitcoin, [mockExchange], testTimestamp))
        .toEqual(testInitialBTCMarketUpdate);
    });
  });

  describe("createInitialMarketUpdatesByTimestamp", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should return the initialMarketUpdatesByTimestamp with provided cryptos, exchanges", () => {
      const testCryptos: CryptoCurrencies[] =
        [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin];
      expect(MarketState
        .createInitialMarketUpdatesByTimestamp(testCryptos, [mockExchange], testTimestamp))
      .toEqual(testInitialMarketUpdatesByTimestamp);
    });
  });

  describe("createInitialTickerUpdate", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should return the initialTickerUpdate with provided cryptocurrency", () => {
      expect(MarketState.createInitialTickerUpdate(CryptoCurrencies.Bitcoin))
        .toEqual(testInitialBTCTickerUpdate);
    });
  });

  describe("getExchanges", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

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

  describe("getLatestMarketUpdateCryptoMap", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should get the initial ticker update when called from new instance", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      expect(testMarketState.getLatestMarketUpdateCryptoMap())
        .toEqual(testInitialMarketUpdatesByTimestamp[testTimestamp]);
    });

    it("should get the updated ticker update when new update added", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      const newBTCTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 10,
      };
      const newLatestMarketUpdateByCrypto = testInitialMarketUpdatesByTimestamp[testTimestamp];
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Bitcoin] = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        timestamp: 10,
        updates: { [mockExchangeName]: newBTCTickerUpdate },
      } as IMarketUpdate;
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Ethereum].timestamp = 10;
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Litecoin].timestamp = 10;
      testMarketState.addTickerToState(newBTCTickerUpdate, mockExchangeName);
      expect(testMarketState.getLatestMarketUpdateCryptoMap())
        .toEqual(newLatestMarketUpdateByCrypto);
    });
  });

  describe("getMarketUpdateCryptoMapByTimestamp", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should get an empty map when called with invalid timestamp", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      expect(testMarketState.getMarketUpdateCryptoMapByTimestamp(1514708393))
        .toEqual({});
    });

    it("should get the initial ticker update when called from new instance", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      expect(testMarketState.getMarketUpdateCryptoMapByTimestamp(0))
        .toEqual(testInitialMarketUpdatesByTimestamp[testTimestamp]);
    });

    it("should get the updated ticker update when new update added", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      const newBTCTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 10,
      };
      const newETHTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Ethereum,
        currency: Currencies.USD,
        timestamp: 10,
      };
      const newLTCTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Litecoin,
        currency: Currencies.USD,
        timestamp: 10,
      };
      const newLatestMarketUpdateByCrypto = testInitialMarketUpdatesByTimestamp[testTimestamp];
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Bitcoin] = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        timestamp: 10,
        updates: { [mockExchangeName]: newBTCTickerUpdate },
      } as IMarketUpdate;
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Ethereum] = {
        cryptoCurrency: CryptoCurrencies.Ethereum,
        timestamp: 10,
        updates: { [mockExchangeName]: newETHTickerUpdate },
      } as IMarketUpdate;
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Litecoin] = {
        cryptoCurrency: CryptoCurrencies.Litecoin,
        timestamp: 10,
        updates: { [mockExchangeName]: newLTCTickerUpdate },
      } as IMarketUpdate;
      testMarketState.addTickerToState(newBTCTickerUpdate, mockExchangeName);
      testMarketState.addTickerToState(newETHTickerUpdate, mockExchangeName);
      testMarketState.addTickerToState(newLTCTickerUpdate, mockExchangeName);
      expect(testMarketState.getMarketUpdateCryptoMapByTimestamp(10))
        .toEqual(newLatestMarketUpdateByCrypto);
    });
  });

  describe("getTimestamps", () => {
    // Initial test ticker updates
    const testInitialBTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialETHTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Ethereum,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
    const testInitialLTCTickerUpdate = {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency: CryptoCurrencies.Litecoin,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;

    // Initial test market updates
    const testTimestamp: number = 0;
    const testInitialBTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Bitcoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialBTCTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialETHMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Ethereum,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialETHTickerUpdate,
      },
    } as IMarketUpdate;
    const testInitialLTCMarketUpdate = {
      cryptoCurrency: CryptoCurrencies.Litecoin,
      timestamp: testTimestamp,
      updates: {
        [mockExchangeName]: testInitialLTCTickerUpdate,
      },
    } as IMarketUpdate;

    // Initial test market updates by timestamps
    const testInitialMarketUpdatesByTimestamp = {
      [testTimestamp]: {
        [CryptoCurrencies.Bitcoin]: testInitialBTCMarketUpdate,
        [CryptoCurrencies.Ethereum]: testInitialETHMarketUpdate,
        [CryptoCurrencies.Litecoin]: testInitialLTCMarketUpdate,
      },
    } as IMarketUpdatesByTimestamp;

    it("should only get a list of timestamp 0 when called from new instance", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      expect(testMarketState.getTimestamps()).toEqual([0]);
    });

    it("should get a list of all timestamps in order when called from updated instance", () => {
      const mockExchanges: Exchange[] = [mockExchange];
      const testMarketStateName: string = "any name";
      const testMarketState: MarketState = new MarketState(testMarketStateName, mockExchanges);
      const newBTCTickerUpdate: ITickerUpdate = {
        askPrice: 10,
        bidPrice: 10,
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        currency: Currencies.USD,
        timestamp: 10,
      };
      const newLatestMarketUpdateByCrypto = testInitialMarketUpdatesByTimestamp[testTimestamp];
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Bitcoin] = {
        cryptoCurrency: CryptoCurrencies.Bitcoin,
        timestamp: 10,
        updates: { [mockExchangeName]: newBTCTickerUpdate },
      } as IMarketUpdate;
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Ethereum].timestamp = 10;
      newLatestMarketUpdateByCrypto[CryptoCurrencies.Litecoin].timestamp = 10;
      testMarketState.addTickerToState(newBTCTickerUpdate, mockExchangeName);
      expect(testMarketState.getTimestamps()).toEqual([0, 10]);
    });
  });
});
