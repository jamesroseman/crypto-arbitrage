import { Exchange } from "./Exchange";
import { ExchangeState, ICurrencyPair } from "./ExchangeState";
import { ITickerUpdate } from "./TickerUpdate";

const validNonHeartbeatNonTickerMsg: string = "VALID_NON_HB_NON_TICKER";
const validHeartbeatMsg: string = "VALID_HB";
const validTickerMsg: string = "VALID_TICKER";

class TestExchange extends Exchange {
  constructor(
    name: string,
    getCurrencyPairFromMsg: (msg: string) => ICurrencyPair,
    getTickerUpdateFromMsg: (msg: string, currPair: ICurrencyPair, state: ExchangeState) => ITickerUpdate,
    isValidMsg: (msg: string) => boolean,
    isHeartbeatMsg: (msg: string) => boolean,
    isTickerMsg: (msg: string) => boolean,
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void,
    state?: ExchangeState,
  ) {
    super(
      name,
      getCurrencyPairFromMsg,
      getTickerUpdateFromMsg,
      onTickerUpdate,
      state,
    );
    this.isValidMsg = isValidMsg;
    this.isHeartbeatMsg = isHeartbeatMsg;
    this.isTickerMsg = isTickerMsg;
  }

  public isValidMsg(msg: string) {
    return (msg === validNonHeartbeatNonTickerMsg ||
            msg === validHeartbeatMsg ||
            msg === validTickerMsg);
  }

  public isHeartbeatMsg(msg: string) {
    return (msg === validHeartbeatMsg);
  }

  public isTickerMsg(msg: string) {
    return (msg === validTickerMsg);
  }

  public initializeExchangeConnection() { return true; }
  public initializeExchangeTicker() { return true; }
}

describe("Exchange", () => {
  let testExchange: Exchange;

  beforeAll(() => {
    const testName: string = "Test Exchange";
    const testGetCurrencyPairFromMsg = jest.fn();
    const testGetTickerUpdateFromMsg = jest.fn();
    const testOnTickerUpdate = jest.fn();
    testExchange = new Exchange(
      testName,
      testGetCurrencyPairFromMsg,
      testGetTickerUpdateFromMsg,
      testOnTickerUpdate,
    );
  });

  describe("deconstructMsg", () => {

  });
});
