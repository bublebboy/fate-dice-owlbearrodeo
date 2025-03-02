import { JSX } from "react";
import './roll.css';

export interface RollResult {
  dice: number[],
  total: number,
  playerId: string,
  playerName: string,
  color: string,
}

export interface PlayerData {
  id: string,
  name: string,
  color: string,
}

export function roll(player?: PlayerData) : RollResult {
  let total = 0;
  let dice = [];
  for (let i = 0; i < 4; ++i) {
    const v = Math.floor(Math.random() * 3 - 1);
    total += v;
    dice.push(v);
  }
  dice.sort((a, b) => a - b);

  return {
    dice,
    total,
    playerId: player?.id || '',
    playerName: player?.name || '',
    color: player?.color || '',
  };
}

function getDie(v: number, i: number) {
  const size = 28;
  switch(v) {
    case -1:
      return <img key={i} src="assets/die_n.svg" width={size} height={size} className="dieImage" />
    case 0:
      return <img key={i} src="assets/die_0.svg" width={size} height={size} className="dieImage" />
    case 1:
      return <img key={i} src="assets/die_p.svg" width={size} height={size} className="dieImage" />
    default:
      return null;
  }
}

export function renderRoll(key: number, roll: RollResult, showPlayer: boolean) : JSX.Element {
  const dice = <div>{roll.dice.map(getDie)}</div>;
  const total = <div>{roll.total < 0 ? roll.total : roll.total > 0 ? `+${roll.total}` : '00'}</div>;
  const playerTag = showPlayer ? <div style={{color: roll.color}}>{roll.playerName}</div> : null;
  return <div className="total" key={key}>{dice}{total}{playerTag}</div>
}