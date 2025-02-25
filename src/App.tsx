import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabaseClient";
import { sendSignal, subscribeToSignals } from "./utils/signaling";

function App() {
  const [clientId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const roomId = "test-room";

  useEffect(() => {
    let channel: any;
    const setup = async () => {
      channel = await subscribeToSignals(roomId, clientId, (signalData) => {
        console.log("received signal: ", signalData);
        // In the future, you would process the signalData to handle offers/answers/ICE candidates.
      });
    };
    setup();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [clientId, roomId]);

  const handleSendSignal = () => {
    //for testing, send a dummy signal (this could be dummy offer or ICE candiate)
    const dummySignal = { type: "offer", sdp: "dummy-offer-data" };
    console.info("=====SENDING SIGNAL=======");
    sendSignal(roomId, clientId, dummySignal);
  };

  return (
    <>
      <h1>Web RTC Connect </h1>
      <p>Your client ID: {clientId}</p>

      <button onClick={handleSendSignal}>Send Dummy Signal</button>
    </>
  );
}

export default App;
