import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../store/gameStore";
import type { TradeFundingMode } from "../types/gameState";

const CATEGORY_LABELS = {
  stocks: "Equities",
  funds: "Funds",
  fixedIncome: "Fixed Income",
  bonds: "Bonds",
  forex: "Forex",
  commodities: "Commodities",
  futures: "Futures"
} as const;

export function OrderEntry() {
  const tickers = useGameStore((state) => state.tickers);
  const clients = useGameStore((state) => state.clients);
  const selectedTicker = useGameStore((state) => state.selectedTicker);
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const personalAccountSleeves = useGameStore((state) => state.personalAccountSleeves);
  const personalSleeveCashBalances = useGameStore((state) => state.personalSleeveCashBalances);
  const submitOrder = useGameStore((state) => state.submitOrder);
  const playerTradeStatus = useGameStore((state) => state.playerTradeStatus);
  const playerSuspensionRounds = useGameStore((state) => state.playerSuspensionRounds);
  const tradeFeedback = useGameStore((state) => state.tradeFeedback);
  const [orderTicker, setOrderTicker] = useState(selectedTicker);
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState(10);
  const [accountTarget, setAccountTarget] = useState("player::player-taxable");
  const [mode, setMode] = useState<TradeFundingMode>("cash");
  const marginEnabled = activeDifficulty === "advisor" || activeDifficulty === "senior";
  const shortEnabled = activeDifficulty === "senior";
  const selectedAsset = tickers[orderTicker];
  const selectedIsMarginable = selectedAsset ? selectedAsset.category === "stocks" || selectedAsset.category === "funds" : false;
  const [selectedClientId] = accountTarget === "player" ? [null] : accountTarget.split("::");
  const selectedClient = selectedClientId ? clients.find((client) => client.id === selectedClientId) ?? null : null;
  const sleeveTotalsByClient = useMemo(
    () =>
      Object.fromEntries(
        clients.map((client) => [
          client.id,
          Object.fromEntries(
            client.accountSleeves.map((sleeve) => {
              const sleeveCash = client.sleeveCashBalances[sleeve.id] ?? 0;
              const sleeveLongValue = Object.entries(client.holdings)
                .filter(([holdingKey]) => (client.holdingAccountMap[holdingKey] ?? client.accountSleeves[0]?.id) === sleeve.id)
                .reduce((sum, [, holding]) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
              const sleeveShortValue = Object.entries(client.shortHoldings ?? {})
                .filter(([holdingKey]) => (client.shortHoldingAccountMap[holdingKey] ?? client.accountSleeves[0]?.id) === sleeve.id)
                .reduce((sum, [, holding]) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);

              return [sleeve.id, sleeveCash + sleeveLongValue - sleeveShortValue];
            })
          )
        ])
      ) as Record<string, Record<string, number>>,
    [clients, tickers]
  );
  useEffect(() => {
    if (!marginEnabled && mode !== "cash") {
      setMode("cash");
    }
  }, [marginEnabled, mode]);

  useEffect(() => {
    if (mode === "margin" && !selectedIsMarginable) {
      setMode("cash");
    }
  }, [mode, selectedIsMarginable]);

  useEffect(() => {
    setOrderTicker(selectedTicker);
  }, [selectedTicker]);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Order Entry</h2>
      </div>
      <div className="order-grid">
        <label>
          Ticker
          <select value={orderTicker} onChange={(event) => setOrderTicker(event.target.value)}>
            {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
              <optgroup key={category} label={label}>
                {Object.values(tickers)
                  .filter((ticker) => ticker.category === category)
                  .map((ticker) => (
                    <option key={ticker.symbol} value={ticker.symbol}>
                      {ticker.symbol} - {ticker.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label>
          Side
          <select value={direction} onChange={(event) => setDirection(event.target.value as "buy" | "sell")}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <label>
          Funding
          <select value={mode} onChange={(event) => setMode(event.target.value as TradeFundingMode)} disabled={!marginEnabled || !selectedIsMarginable}>
            <option value="cash">Cash</option>
            <option value="margin">Margin</option>
          </select>
        </label>
        <label>
          Quantity
          <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} />
        </label>
        <label>
          Account
          <select value={accountTarget} onChange={(event) => setAccountTarget(event.target.value)}>
            <optgroup label="Player Portfolio">
              {personalAccountSleeves.map((sleeve) => (
                <option key={sleeve.id} value={`player::${sleeve.id}`}>
                  {sleeve.label} - {(personalSleeveCashBalances[sleeve.id] ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                </option>
              ))}
            </optgroup>
            {clients.map((client) => (
              <optgroup key={client.id} label={client.name}>
                {client.accountSleeves.map((sleeve) => (
                  <option key={sleeve.id} value={`${client.id}::${sleeve.id}`}>
                    {sleeve.label} - {(sleeveTotalsByClient[client.id]?.[sleeve.id] ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </div>
      {marginEnabled ? (
        <div className="order-banner">
          {!selectedIsMarginable
            ? "This instrument is cash-only. Margin is reserved for stocks and funds in the advanced difficulties."
            : shortEnabled
            ? "Pro margin is live: leveraged longs and short selling are enabled on marginable stocks and funds."
            : "Hard margin is live: leveraged long positions are enabled on marginable stocks and funds."}
        </div>
      ) : null}
      {playerTradeStatus === "suspended" ? (
        <div className="order-banner">Personal trading is suspended for {playerSuspensionRounds} more market rounds.</div>
      ) : null}
      {tradeFeedback ? (
        <div className={`trade-feedback ${tradeFeedback.tone}`}>
          <strong>{tradeFeedback.title}</strong>
          <span>{tradeFeedback.detail}</span>
          {tradeFeedback.bullets && tradeFeedback.bullets.length > 0 ? (
            <ul className="trade-feedback-list">
              {tradeFeedback.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <button className="primary-btn" onClick={() => submitOrder({ ticker: orderTicker, direction, quantity, clientId: selectedClientId ?? "player", accountId: accountTarget.split("::")[1] ?? "player-taxable", mode })}>
        Submit Order
      </button>
    </section>
  );
}
