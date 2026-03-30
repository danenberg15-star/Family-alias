// app/components/SetupStep.tsx
"use client";

import React, { useState, useRef } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (mode: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy";
  setDifficulty: (d: "age-appropriate" | "easy") => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  teamNames: string[];
  editTeamName: (idx: number) => void;
  players: any[];
  onPlayerMove: (pId: string, teamIdx: number) => void;
  activeHover: string | null; // הוספת השדה החסר
  teamsRef: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  onStart: () => void;
}

export default function SetupStep(props: SetupStepProps) {
  // ... שאר הקוד של הקומפוננטה כפי שסגרנו קודם ...
  return (
    // ... JSX ...
  );
}