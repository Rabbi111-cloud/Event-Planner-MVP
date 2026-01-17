import { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ViewEvent({ shareId }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const q = query(collection(db, "events"), where("shareId", "==", shareId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setEvent(querySnapshot.docs[0].data());
      }
    };
    fetchEvent();
  }, [shareId]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>{event.title}</h2>
      <p>Created by: {event.uid}</p>
    </div>
  );
}
