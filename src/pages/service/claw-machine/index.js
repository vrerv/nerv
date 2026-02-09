import React from "react";
import Head from "next/head";

export default function ClawMachine() {
  return (
    <>
      <Head>
        <title>🎮 인형뽑기 Physics - VReRV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0, 
        overflow: 'hidden' 
      }}>
        <iframe
          src="/games/claw-machine.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="autoplay"
        />
      </div>
    </>
  );
}
