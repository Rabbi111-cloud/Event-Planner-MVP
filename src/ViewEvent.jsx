import { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function ViewEvent({ shareId }) {
  const [event, setEvent] = useState(null);
  const [attending, setAttending] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const q = query(collection(db, "events"), where("shareId", "==", shareId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        data.id = snapshot.docs[0].id;
        setEvent(data);
      }
    };
    fetchEvent();
  }, [shareId]);

  const rsvp = async () => {
    if (!userEmail) return alert("Enter your email to RSVP");
    const attendees = event.attendees || [];
    if (!attendees.includes(userEmail)) attendees.push(userEmail);

    await updateDoc(doc(db, "events", event.id), { attendees });
    setEvent({ ...event, attendees });
    setAttending(true);
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div style={{ padding:"40px", maxWidth:"600px", margin:"0 auto", fontFamily:"Arial" }}>
      <h2>{event.title}</h2>
      {event.description && <p>{event.description}</p>}
      <p><strong>When:</strong> {new Date(event.datetime).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category || "None"}</p>
      <p><strong>Attendees:</strong> {event.attendees?.join(", ") || "No RSVPs yet"}</p>

      <div style={{ marginTop:"20px" }}>
        <input type="email" placeholder="Your email to RSVP" value={userEmail} onChange={e=>setUserEmail(e.target.value)} style={{ padding:"8px", width:"70%", marginRight:"10px" }}/>
        <button onClick={rsvp} style={{ padding:"8px 12px", borderRadius:"6px", backgroundColor:"#4CAF50", color:"#fff", border:"none", cursor:"pointer" }}>
          {attending ? "RSVP'd" : "RSVP"}
        </button>
      </div>
    </div>
  );
}
