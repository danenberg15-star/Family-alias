"use client";

import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
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

export default function SetupStep(props: SetupStepProps) {
  return (
    <div style={{...styles.flexLayout, justifyContent:'flex-start', paddingTop:'20px'}}>
      <div style={{textAlign: 'center', marginBottom: '10px'}}>
        <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>קוד החדר להצטרפות:</div>
        <h1 style={{color: '#ffd700', fontSize: '42px', fontWeight: 'bold', letterSpacing: '5px', margin: '5px 0'}}>{props.roomId}</h1>
      </div>
      
      <div style={{display:'flex', gap:'5px', width:'320px', backgroundColor:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'12px', marginBottom:'10px'}}>
        <button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק אישי</button>
        <button onClick={() => props.setGameMode("team")} style={props.gameMode === "team" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק קבוצתי</button>
      </div>

      {props.gameMode === "team" && (
        <div style={styles.toggleRow}>
          <span style={styles.teamLabel}>מספר הקבוצות</span>
          <div style={{display:'flex', gap:'10px'}}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => props.setNumTeams(n)} style={{width:'35px', height:'35px', borderRadius:'50%', border: props.numTeams === n ? '2px solid #ffd700' : '1px solid white', backgroundColor: props.numTeams === n ? '#ffd700' : 'transparent', color: props.numTeams === n ? 'black' : 'white', fontWeight:'bold'}}>{n}</button>
            ))}
          </div>
        </div>
      )}

      <div style={props.gameMode === "team" ? styles.teamsGrid : {width:'320px', marginTop:'15px'}}>
        {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים"]).map((tName, tIdx) => (
          <div key={tIdx} ref={(el) => { if (props.teamsRef.current) props.teamsRef.current[tIdx] = el; }} style={{...styles.teamColumn, backgroundColor: props.activeHover === `TEAM_${tIdx}` ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', borderColor: props.activeHover === `TEAM_${tIdx}` ? '#ffd700' : 'rgba(255,255,255,0.05)'}}>
            {props.gameMode === "team" && (
              <div style={styles.teamHeaderWrapper}>
                <span style={{color:'#ffd700', fontSize:'13px', fontWeight:'bold'}}>{tName}</span>
                <span onClick={() => props.editTeamName(tIdx)} style={styles.editIcon}>✏️</span>
              </div>
            )}
            {props.players.filter(p => props.gameMode === "individual" || props.playerTeamMap[p] === tIdx).map(p => (
              <div key={p} onPointerDown={(e) => props.onPlayerPointerDown(e, p)} style={styles.playerTag}>{p}</div>
            ))}
          </div>
        ))}
      </div>
      
      <button onClick={props.onStart} style={{...styles.goldButton, marginTop:'20px'}}>התחל משחק 🏁</button>
    </div>
  );
}