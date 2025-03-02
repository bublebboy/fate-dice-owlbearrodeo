import { JSX, useState } from 'react';
import './App.css';
import { RollResult, roll, renderRoll } from './roll';

function LocalRoller(props: {limit: number}) : JSX.Element {
  const [history, setHistory] = useState([] as RollResult[]);

  function onRollClicked() {
    const newRoll = roll();

    let newHistory = history.slice();
    newHistory.push(newRoll);
    while (newHistory.length > props.limit) newHistory.shift();

    setHistory(newHistory);
  }

  let message = null;
  if (history.length > 0) {
    message = <div className="rollHistory">{history.map((row, i) => renderRoll(i, row, false))}</div>;
  }

  return (
    <>
      <div>
        {message}
        <button onClick={onRollClicked}>
          Roll
        </button>
      </div>
    </>
  );
}

export default LocalRoller
