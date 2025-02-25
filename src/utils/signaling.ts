import supabase from "../supabaseClient";

export async function sendSignal(
  roomId: string,
  sender: string,
  signalData: RTCSessionDescriptionInit | RTCIceCandidateInit
) {
  const { error } = await supabase.from("signals").insert([
    {
      room_id: roomId,
      sender,
      data: signalData,
    },
  ]);

  if (error) {
    console.error("Error sending signal:", error.message);
  }
}

export async function subscribeToSignals(
  roomId: string,
  myClientId: string,
  handleSignal: (
    signalData: RTCSessionDescriptionInit | RTCIceCandidateInit
  ) => void
) {
  supabase
    .channel("signals")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "signals",
        filter: `room_id=eq.${roomId}`,
      },
      (payload: any) => {
        const { sender, data } = payload.new;
        if (sender !== myClientId) {
          handleSignal(data);
        }
      }
    )
    .subscribe();
}
