/* tslint:disable:max-classes-per-file */

import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
import { ITickerUpdate } from "./TickerUpdate";

jest.mock("./ExchangeState");

describe("Exchange", () => {
  const testExchangeName: string = "TestExchange";
  const testGetCurrencyPairFromMsg = (msg: string) => ({
    cryptoCurrency: CryptoCurrencies.Bitcoin,
    currency: Currencies.USD,
  } as ICurrencyPair);
  const testAskPrice: number = 10;
  const testBidPrice: number = 20;
  const testTimestamp: number = new Date().getTime();
  const testGetTickerUpdateFromMsg = (msg: string, currPair: ICurrencyPair, state: ExchangeState) => ({
    askPrice: testAskPrice,
    bidPrice: testBidPrice,
    cryptoCurrency: currPair.cryptoCurrency,
    currency: currPair.currency,
    timestamp: testTimestamp,
  } as ITickerUpdate);

  describe("deconstructMsg", () => {
    const mockOnTickerUpdate = jest.fn();

    beforeAll(() => {
      mockOnTickerUpdate.mockReset();
    });

    it("should return false and not call ticker update or modify state when given an invalid message", () => {
      const testInvalidMessage: string = "any message";
      class NoValidMessagesExchange extends Exchange {
        constructor() {
          super(
            "NoValidMessages",
            jest.fn(),
            jest.fn(),
            mockOnTickerUpdate,
          );
        }
        public isValidMsg(msg: string) { return false; }
        public isHeartbeatMsg(msg: string) { return false; }
        public isTickerMsg(msg: string) { return false; }
        public initializeExchangeConnection() { return true; }
        public initializeExchangeTicker() { return true; }
      }
      const testExchange: NoValidMessagesExchange = new NoValidMessagesExchange();
      expect(testExchange.consumeMsg(testInvalidMessage)).toBe(false);
      expect(testExchange.getState().addTickerToState.mock.calls.length).toBe(0);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should return true and not call ticker update or modify state when given a heartbeat message", () => {
      const testHeartbeatMsg: string = "any message";
      class ValidHeartbeatMessagesExchange extends Exchange {
        constructor() {
          super(
            "ValidHeartbeatMessages",
            jest.fn(),
            jest.fn(),
            mockOnTickerUpdate,
          );
        }
        public isValidMsg(msg: string) { return true; }
        public isHeartbeatMsg(msg: string) { return true; }
        public isTickerMsg(msg: string) { return false; }
        public initializeExchangeConnection() { return true; }
        public initializeExchangeTicker() { return true; }
      }
      const testExchange: ValidHeartbeatMessagesExchange = new ValidHeartbeatMessagesExchange();
      expect(testExchange.consumeMsg(testHeartbeatMsg)).toBe(true);
      expect(testExchange.getState().addTickerToState.mock.calls.length).toBe(0);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should return true and call ticker update and modify state when given a ticker message", () => {
      const testTickerMsg: string = "any message";
      class ValidTickerMessagesExchange extends Exchange {
        constructor() {
          super(
            "ValidTickerMessages",
            jest.fn(),
            jest.fn(),
            mockOnTickerUpdate,
          );
        }
        public isValidMsg(msg: string) { return true; }
        public isHeartbeatMsg(msg: string) { return false; }
        public isTickerMsg(msg: string) { return true; }
        public initializeExchangeConnection() { return true; }
        public initializeExchangeTicker() { return true; }
      }
      const testExchange: ValidTickerMessagesExchange = new ValidTickerMessagesExchange();
      expect(testExchange.consumeMsg(testTickerMsg)).toBe(true);
      expect(testExchange.getState().addTickerToState.mock.calls.length).toBe(1);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(1);
    });
  });
});
