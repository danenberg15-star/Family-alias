"use client";

import { styles } from "../game.styles";

interface CountdownStepProps {
  timer: number;
  turnInfo: { name: string; team: string };
  isTeamMode: boolean;
}

export default function CountdownStep({ timer, turnInfo, isTeamMode }: CountdownStepProps) {
  return (
    <div style={styles.flexLayout}>
      <div style={styles.turnInfo}>
        תור השחקן <b>{turnInfo.name}</b> {isTeamMode && `מ${turnInfo.team}`} [cite: 1, 22]
      </div>
      <div style={styles.hugeTimer}>{timer}</div>
      <div style={styles.loadingText}>טוען תמונות... [cite: 1, 9, 10]</div>
    </div>
  );
}