import {
  CryptoCurrencies,
  Currencies,
  ExchangeStreamTickerRequest,
} from "../types";
import { BitfinexExchange } from "./BitfinexExchange";

// Module mocks
jest.mock("ws");
jest.mock("../constants/BitfinexExchange/", () => ({
  getTickerUpdateFromMsgData: (update) => console.log(update),
}));

describe("BitfinexExchange", () => {
  const testBitfinexName = "tBFNX";
  let testBitfinexExchange: BitfinexExchange;
  const mockOnTickerUpdate = jest.fn();

  // Messages
  const testHeartbeatMsg: string = JSON.stringify({
    data: ["2", "hb"],
    event: "subscribed",
  });
  const validTickerData: number[] =
    [2, 236.62, 9.0029, 236.88, 7.1138, -1.02, 0, 236.52, 5191.36754297, 250.01, 220.05];
  const testValidTickerMsg: string = JSON.stringify({
    data: validTickerData,
    event: "subscribed",
  });

  beforeEach(() => {
    mockOnTickerUpdate.mockReset();
    testBitfinexExchange = new BitfinexExchange(testBitfinexName);
    testBitfinexExchange.onTickerUpdate = mockOnTickerUpdate;
  });

  describe("constructor", () => {
    it("should have correctly set the name", () => {
      expect(testBitfinexExchange.name).toBe(testBitfinexName);
    });
  });

  // TODO: test stream ticker prices

  describe("deconstructMsg", () => {
    it("should return undefined given an empty message", () => {
      testBitfinexExchange.deconstructMsg("", mockOnTickerUpdate);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should not call ticker update given an invalid JSON message", () => {
      const invalidJSON: string = "{{]]";
      testBitfinexExchange.deconstructMsg(invalidJSON, mockOnTickerUpdate);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should not call ticker update given a Bitfinex heartbeat message", () => {
      testBitfinexExchange.deconstructMsg(testHeartbeatMsg, mockOnTickerUpdate);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(0);
    });

    it("should call ticker update given a valid Bitfinex ticker message", () => {
      testBitfinexExchange.deconstructMsg(testValidTickerMsg, mockOnTickerUpdate);
      expect(mockOnTickerUpdate.mock.calls.length).toBe(1);
    });
  });
});
