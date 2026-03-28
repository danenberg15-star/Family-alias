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
      <div style={{ color: 'white', fontSize: '20px', textAlign: 'center', marginBottom: '10px' }}>
        תור השחקן <b style={{ color: '#ffd700' }}>{turnInfo.name}</b> {isTeamMode && `מ${turnInfo.team}`}
      </div>
      <div style={styles.hugeTimer}>{timer}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>מתחילים...</div>
    </div>
  );
}