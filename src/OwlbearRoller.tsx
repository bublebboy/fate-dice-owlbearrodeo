import { JSX, useEffect, useState } from 'react'
import './App.css'
import OBR from '@owlbear-rodeo/sdk'
import { RollResult, roll, renderRoll, PlayerData } from './roll';

const ROLL_HISTORY_KEY = 'net.nodelimit.obr.fate-dice.roll-history-key';

function App(props: { limit: number }) : JSX.Element {
  console.log('App render');
  const [isReady, setIsReady] = useState(false);
  const [isInSync, setIsInSync] = useState(false);
  const [history, setHistory] = useState([] as RollResult[]);
  const [party, setParty] = useState(new Map() as Map<string, PlayerData>);

  useEffect(() => {
    if (!isReady) {
      const unsub = OBR.onReady(() => {
        console.log('OBR is ready...');
        setIsReady(true);
      });
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (isReady && !isInSync) {
      Promise.all([
        OBR.room.getMetadata(),
        OBR.party.getPlayers(),
        OBR.player.getName(),
        OBR.player.getColor(),
      ]).then(([metadata, party, playerName, playerColor]) => {
        const newParty: Map<string, PlayerData> = new Map();
        for (const player of party) {
          newParty.set(
            player.id,
            {
              id: player.id,
              name: player.name,
              color: player.color
            });
        }
        newParty.set(
          OBR.player.id,
          {
            id: OBR.player.id,
            name: playerName,
            color: playerColor,
          });
        setParty(newParty);
        
        const newHistory = metadata[ROLL_HISTORY_KEY] as RollResult[];
        if (Array.isArray(newHistory)) {
          for (const row of newHistory) {
            const player = newParty.get(row.playerId);
            if (player) {
              row.playerName = player.name;
              row.color = player.color;
            }
          }
          setHistory(newHistory);
        }

        setIsInSync(true);
      });
    }
  }, [isReady, isInSync]);

  useEffect(() => {
    if (isReady) {
      const unsub = OBR.room.onMetadataChange(metadata => {
        if (Array.isArray(metadata[ROLL_HISTORY_KEY])) {
          setIsInSync(false);
        }
      });
      return unsub;
    }
  }, [isReady]);

  useEffect(() => {
    if (isReady) {
      const unsub = OBR.party.onChange(() => setIsInSync(false));
      return unsub;
    }
  }, [isReady])

  useEffect(() => {
    if (isReady) {
      const unsub = OBR.player.onChange(() => setIsInSync(false));
      return unsub;
    }
  }, [isReady])

  function onRollClicked() {
    const newRoll = roll(party.get(OBR.player.id));

    let newHistory = history.slice();
    newHistory.push(newRoll);
    while (newHistory.length > props.limit) newHistory.shift();

    OBR.room.setMetadata({ [ROLL_HISTORY_KEY]: newHistory });
  }
  
  if (OBR.isAvailable && !isReady) {
    return (
      <p>Loading...</p>
    )
  }

  let message = null;
  if (history.length > 0) {
    message = <div className="rollHistory">{history.map((row, i) => renderRoll(i, row, true))}</div>;
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
  )
}

export default App
