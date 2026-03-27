"use client";

import { styles } from "../game.styles";

interface SetupStepProps {
  gameMode: "individual" | "team";
  setGameMode: (mode: "individual" | "team") => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  teamNames: string[];
  editTeamName: (idx: number) => void;
  players: string[];
  playerTeamMap: {[key: string]: number};
  onPlayerPointerDown: (e: React.PointerEvent, pName: string) => void;
  activeHover: string | null;
  teamsRef: React.MutableRefObject<{[key: number]: HTMLDivElement | null}>;
  onStart: () => void;
}

export default function SetupStep({
  gameMode, setGameMode, numTeams, setNumTeams, teamNames,
  editTeamName, players, playerTeamMap, onPlayerPointerDown,
  activeHover, teamsRef, onStart
}: SetupStepProps) {
  return (
    <div style={{...styles.flexLayout, justifyContent:'flex-start', paddingTop:'20px'}}>
      <h2 style={{color:'white', marginBottom:'15px'}}>חדר: חלון</h2> 
      
      <div style={{display:'flex', gap:'5px', width:'100%', backgroundColor:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'12px', marginBottom:'10px'}}>
        <button onClick={() => setGameMode("individual")} style={gameMode === "individual" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק אישי</button>
        <button onClick={() => setGameMode("team")} style={gameMode === "team" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק קבוצתי</button> 
      </div>

      {gameMode === "team" && (
        <div style={styles.toggleRow}>
          <span style={styles.teamLabel}>מספר הקבוצות</span>
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => setNumTeams(n)} style={{width:'35px', height:'35px', borderRadius:'50%', border: numTeams === n ? '2px solid #ffd700' : '1px solid white', backgroundColor: numTeams === n ? '#ffd700' : 'transparent', color: numTeams === n ? 'black' : 'white'}}>{n}</button>
          ))}
        </div>
      )}

      <div style={gameMode === "team" ? styles.teamsGrid : {width:'100%', marginTop:'15px'}}>
        {(gameMode === "team" ? teamNames.slice(0, numTeams) : ["שחקנים"]).map((tName, tIdx) => (
          <div key={tIdx} ref={(el) => { if (teamsRef.current) teamsRef.current[tIdx] = el; }} style={{...styles.teamColumn, backgroundColor: activeHover === `TEAM_${tIdx}` ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}}>
            {gameMode === "team" && (
              <div style={styles.teamHeaderWrapper}>
                <span style={{color:'#ffd700', fontSize:'13px'}}>{tName}</span>
                <span onClick={() => editTeamName(tIdx)} style={styles.editIcon}>✏️</span>
              </div>
            )}
            {players.filter(p => gameMode === "individual" || playerTeamMap[p] === tIdx).map(p => (
              <div key={p} onPointerDown={(e) => onPlayerPointerDown(e, p)} style={styles.playerTag}>{p}</div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={onStart} style={{...styles.goldButton, marginTop:'20px'}}>התחל משחק 🏁</button> 
    </div>
  );
}