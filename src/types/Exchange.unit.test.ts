/* tslint:disable:max-classes-per-file */

import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
import { ITickerUpdate } from "./TickerUpdate";

jest.mock("./ExchangeState");

describe("Exchange", () => {
  describe("getName", () => {
    it("should get the set name", () => {
      const testExchangeName: string = "GetNameExchange";
      class GetNameExchange extends Exchange {
        constructor() {
          super(
            testExchangeName,
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
      const testExchange: GetNameExchange = new GetNameExchange();
      expect(testExchange.getName()).toBe(testExchangeName);
    });
  });

  describe("getState", () => {
    it("should get the state passed into the constructor", () => {
      const testExchangeStateName: string = "GetStateExchangeState";
      const mockExchangeState: ExchangeState = new ExchangeState(testExchangeStateName);
      const testExchangeName: string = "GetStateExchange";
      class GetStateExchange extends Exchange {
        constructor() {
          super(
            testExchangeName,
            jest.fn(),
            jest.fn(),
            jest.fn(),
            mockExchangeState,
          );
        }
        public isValidMsg(msg: string) { return false; }
        public isHeartbeatMsg(msg: string) { return false; }
        public isTickerMsg(msg: string) { return false; }
        public initializeExchangeConnection() { return true; }
        public initializeExchangeTicker() { return true; }
      }
      const testExchange: GetStateExchange = new GetStateExchange();
      expect(testExchange.getState()).toEqual(mockExchangeState);
    });

    it("should get a new state if no state passed into the constructor", () => {
      const testExchangeStateName: string = "GetStateExchangeState";
      const testExchangeName: string = "GetStateExchange";
      class GetStateExchange extends Exchange {
        constructor() {
          super(
            testExchangeName,
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
      const testExchange: GetStateExchange = new GetStateExchange();
      expect(testExchange.getState().getName()).toBe(testExchangeStateName);
    });
  });

  describe("consumeMsg", () => {
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
