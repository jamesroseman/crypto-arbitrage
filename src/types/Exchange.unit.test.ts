/* tslint:disable:max-classes-per-file */

import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";

jest.mock("./ExchangeState");

describe("Exchange", () => {
  describe("consumeMsg", () => {
    const mockOnTickerUpdate = jest.fn();

    beforeAll(() => {
      mockOnTickerUpdate.mockReset();
    });

    it("should return false and not call ticker update or modify state when given an invalid message", () => {
      const testInvalidMessage: string = "any message";
      class NoValidMessagesExchange extends Exchange {
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            "NoValidMessages",
            "NoValidMessages",
            mockOnTickerUpdate,
          );
        }
        public isValidMsg = (msg: any) => false;
        public isHeartbeatMsg = (msg: any) => false;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => false;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
      }
      const testExchange: NoValidMessagesExchange = new NoValidMessagesExchange();
      expect(testExchange.consumeMsg(testInvalidMessage)).toBe(false);
      expect(testExchange.getState().addTickerToState.mock.calls.length).toBe(0);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should return true and not call ticker update or modify state when given a heartbeat message", () => {
      const testHeartbeatMsg: string = "any message";
      class ValidHeartbeatMessagesExchange extends Exchange {
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            "ValidHeartbeatMessages",
            "ValidHeartbeatMessages",
            mockOnTickerUpdate,
          );
        }
        public isValidMsg = (msg: any) => true;
        public isHeartbeatMsg = (msg: any) => true;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => false;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
      }
      const testExchange: ValidHeartbeatMessagesExchange = new ValidHeartbeatMessagesExchange();
      expect(testExchange.consumeMsg(testHeartbeatMsg)).toBe(true);
      expect(testExchange.getState().addTickerToState.mock.calls.length).toBe(0);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should return true and call ticker update and modify state when given a ticker message", () => {
      const testTickerMsg: string = "any message";
      class ValidTickerMessagesExchange extends Exchange {
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            "ValidTickerMessages",
            "ValidTickerMessages",
            mockOnTickerUpdate,
          );
        }
        public isValidMsg = (msg: any) => true;
        public isHeartbeatMsg = (msg: any) => false;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => true;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
      }
      const testExchange: ValidTickerMessagesExchange = new ValidTickerMessagesExchange();
      expect(testExchange.consumeMsg(testTickerMsg)).toBe(true);
      expect(testExchange.getState().addTickerToState.mock.calls.length).toBe(1);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(1);
    });
  });

  describe("getOnTickerUpdate", () => {
    it("should get the set onTickerUpdate", () => {
      const mockOnTickerUpdate = jest.fn();
      class GetOnTickerUpdateExchange extends Exchange {
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            "GetOnTickerUpdateExchange",
            "GetOnTickerUpdateExchange",
            mockOnTickerUpdate,
          );
        }
        public isValidMsg = (msg: any) => false;
        public isHeartbeatMsg = (msg: any) => false;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => false;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
      }
      const testExchange: GetOnTickerUpdateExchange = new GetOnTickerUpdateExchange();
      expect(testExchange.getOnTickerUpdate()).toBe(mockOnTickerUpdate);
    });
  });

  describe("getName", () => {
    it("should get the set name", () => {
      const testExchangeName: string = "GetNameExchange";
      class GetNameExchange extends Exchange {
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            testExchangeName,
            testExchangeName,
            jest.fn(),
          );
        }
        public isValidMsg = (msg: any) => false;
        public isHeartbeatMsg = (msg: any) => false;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => false;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
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
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            testExchangeName,
            testExchangeName,
            jest.fn(),
            mockExchangeState,
          );
        }
        public isValidMsg = (msg: any) => false;
        public isHeartbeatMsg = (msg: any) => false;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => false;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
      }
      const testExchange: GetStateExchange = new GetStateExchange();
      expect(testExchange.getState()).toEqual(mockExchangeState);
    });

    it("should get a new state if no state passed into the constructor", () => {
      const testExchangeStateName: string = "GetStateExchangeState";
      const testExchangeName: string = "GetStateExchange";
      class GetStateExchange extends Exchange {
        protected getCurrencyPairFromMsg = jest.fn();
        protected getTickerUpdateFromMsg = jest.fn();
        constructor() {
          super(
            testExchangeName,
            testExchangeName,
            jest.fn(),
          );
        }
        public isValidMsg = (msg: any) => false;
        public isHeartbeatMsg = (msg: any) => false;
        public isSubscriptionMsg = (msg: any) => false;
        public isTickerMsg = (msg: any) => false;
        protected initializeExchangeConnection = () => true;
        protected initializeExchangeTicker = () => true;
      }
      const testExchange: GetStateExchange = new GetStateExchange();
      expect(testExchange.getState().getName()).toBe(testExchangeStateName);
    });
  });

  describe("setOnTickerUpdate", () => {
    const mockOnTickerUpdate = jest.fn();
    const mockUpdatedOnTickerUpdate = jest.fn();

    class UpdateOnTickerUpdateExchange extends Exchange {
      protected getCurrencyPairFromMsg = jest.fn();
      protected getTickerUpdateFromMsg = jest.fn();
      constructor() {
        super(
          "UpdateOnTickerUpdateExchange",
          "UpdateOnTickerUpdateExchange",
          mockOnTickerUpdate,
        );
      }
      public isValidMsg = (msg: any) => true;
      public isHeartbeatMsg = (msg: any) => false;
      public isSubscriptionMsg = (msg: any) => false;
      public isTickerMsg = (msg: any) => true;
      protected initializeExchangeConnection = () => true;
      protected initializeExchangeTicker = () => true;
    }

    it("should call the old onTickerUpdate, then the new one after setting", () => {
      const validTickerMsg: string = "any message";
      const testExchange: UpdateOnTickerUpdateExchange = new UpdateOnTickerUpdateExchange();
      testExchange.consumeMsg(validTickerMsg);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(1);
      expect(mockUpdatedOnTickerUpdate.mock.calls.length).toBe(0);
      testExchange.setOnTickerUpdate(mockUpdatedOnTickerUpdate);
      testExchange.consumeMsg(validTickerMsg);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(1);
      expect(mockUpdatedOnTickerUpdate.mock.calls.length).toBe(1);
    });
  });
});
