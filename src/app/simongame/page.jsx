"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
const colors = ["green", "red", "yellow", "blue"];
import { Press_Start_2P } from "next/font/google"; 

const press_start_2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})

const App = () => {
  const [gameSequence, setGameSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [hasGameStarted, setStartGame] = useState(false);
  const [failed, setFailed] = useState({
    text: "Click any key to Start Game",
    bgColor: "#011e41",
  });

  useEffect(() => {
    if (userSequence.length && isUserTurn) {
      const isCorrect =
        gameSequence[userSequence.length - 1] ===
        userSequence[userSequence.length - 1];

      if (!isCorrect) {
        setFailed({
          text: "Opps! You lost",
          bgColor: "#7f1d00",
        });
        setTimeout(() => {
          setFailed({
            text: "Click any key to Start Game",
            bgColor: "#011e41",
          });
        }, 1500);
        reset();
      } else if (userSequence.length === gameSequence.length) {
        setTimeout(() => nextRound(), 1000);
      }
    }
  }, [userSequence]);

  const flashColor = (color) => {
    const el = document.getElementById(color);
    el.classList.add("opacity-50");
    setTimeout(() => el.classList.remove("opacity-50"), 500);
  };

  const playSequence = async (gameSequence) => {
    for (let color of gameSequence) {
      flashColor(color);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setIsUserTurn(true);
  };

  const handleUserInput = (color) => {
    if (!isUserTurn) return;
    setUserSequence([...userSequence, color]);
  };

  const nextRound = () => {
    setIsUserTurn(false);
    setUserSequence([]);
    const nextColor = colors[Math.floor(Math.random() * 4)];
    const currColorSequence = [...gameSequence, nextColor];
    setTimeout(() => playSequence([nextColor]), 1000);
    setGameSequence(currColorSequence);
  };

  const startGame = () => {
    if(hasGameStarted) return;
    setGameSequence([]);
    setUserSequence([]);
    setIsUserTurn(false);
    setStartGame(true);
    nextRound();
  };
  const reset = () => {
    setGameSequence([]);
    setUserSequence([]);
    setIsUserTurn(false);
    setStartGame(false);
  };

  return (
    <div style={{ backgroundColor: failed.bgColor }} className="h-screen flex flex-col gap-10">
      <div className="flex justify-between w-full p-4"> 
        <Link
          href="/"
          className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Home
        </Link>
        <Link
          href="/flodertree"
          className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Folder Tree
        </Link>
      </div>
      <div
        className="flex flex-col items-center justify-center text-white focus-visible:outline-0"
        tabIndex={0}
        onKeyDown={startGame}
      >
        <h1 className={`text-3xl font-bold mb-8 p-2 text-center ${press_start_2P.className}`}>
          {hasGameStarted
            ? isUserTurn
              ? "Level " + gameSequence.length + ": " + "Your Turn"
              : "My Turn"
            : failed.text}
        </h1>
        {!hasGameStarted && (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            Start Game
          </button>
        )}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {colors.map((color) => (
            <div
              key={color}
              id={color}
              className={`w-32 h-32 rounded-2xl border-4 border-black cursor-pointer transition-opacity ${
                {
                  green: "bg-green-500",
                  red: "bg-red-500",
                  yellow: "bg-yellow-500",
                  blue: "bg-blue-500",
                }[color]
              }`}
              onClick={() => handleUserInput(color)}
            />
          ))}
        </div>
      </div>{" "}
    </div>
  );
};

export default App;
