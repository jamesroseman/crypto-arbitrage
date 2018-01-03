/* tslint:disable:max-classes-per-file */

import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { Market } from "./Market";
import { MarketState } from "./MarketState";
import { ITickerUpdate } from "./TickerUpdate";

jest.mock("./MarketState");

describe("Market", () => {
  describe("getName", () => {
    it("should get the set name", () => {
      const testMarketName: string = "GetNameMarket";
      const testMarket: Market = new Market(testMarketName, [], jest.fn());
      expect(testMarket.getName()).toBe(testMarketName);
    });
  });

  describe("getOnTickerUpdate", () => {
    it("should get the set onTickerUpdate", () => {
      const mockOnTickerUpdate = jest.fn();
      const testMarketName: string = "GetOnTickerUpdateMarket";
      const testMarket: Market = new Market(testMarketName, [], mockOnTickerUpdate);
      expect(testMarket.getOnTickerUpdate()).toBe(mockOnTickerUpdate);
    });
  });

  describe("getState", () => {
    it("should get the state passed into the constructor", () => {
      const mockOnTickerUpdate = jest.fn();
      const mockMarketState: MarketState = new MarketState("GetStateMarketState", []);
      const testMarketName: string = "GetStateMarket";
      const testMarket: Market = new Market(testMarketName, [], mockOnTickerUpdate, mockMarketState);
      expect(testMarket.getState()).toBe(mockMarketState);
    });
  });

  describe("setOnTickerUpdate", () => {
    it("should set onTickerUpdate and get the updated fn", () => {
      const mockOnTickerUpdate = jest.fn();
      const mockUpdatedOnTickerUpdate = jest.fn();
      const testMarketName: string = "getOnTickerUpdateMarket";
      const testMarket: Market = new Market(testMarketName, [], mockOnTickerUpdate);
      expect(testMarket.getOnTickerUpdate()).toBe(mockOnTickerUpdate);
      testMarket.setOnTickerUpdate(mockUpdatedOnTickerUpdate);
      expect(testMarket.getOnTickerUpdate()).toBe(mockUpdatedOnTickerUpdate);
    });
  });
});
