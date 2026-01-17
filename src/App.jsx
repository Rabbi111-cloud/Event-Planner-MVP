import { Routes, Route } from "react-router-dom";
import Auth from "./Auth.jsx";
import Dashboard from "./Dashboard.jsx";
import ViewEvent from "./ViewEvent.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.js";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Auth />} />
      <Route path="/event/:shareId" element={<ViewEventWrapper />} />
    </Routes>
  );
}

import { useParams } from "react-router-dom";
function ViewEventWrapper() {
  const { shareId } = useParams();
  return <ViewEvent shareId={shareId} />;
}
