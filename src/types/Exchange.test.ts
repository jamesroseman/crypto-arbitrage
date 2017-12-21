import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
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
  let testExchange: TestExchange;
  const testExchangeName: string = "TestExchange";
  const getCurrencyPairFromMsg = (msg: string) => ({
    cryptoCurrency: CryptoCurrencies.Bitcoin,
    currency: Currencies.USD,
  } as ICurrencyPair);

  beforeAll(() => {
    testExchange = new TestExchange()
  })

  describe("deconstructMsg", () => {

  });
});
