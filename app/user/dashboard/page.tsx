// components/UserDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/event");
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      const res = await axios.post("/api/register-event", { eventId });
      alert(res.data.message);
    } catch (err: any) {
      console.log(err);
      alert("Error registering for event");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white shadow-lg rounded-lg p-4">
          <img
            src={event.imageUrl || "/placeholder.jpg"}
            alt={event.eventName}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="text-xl font-semibold mt-2">{event.eventName}</h2>
          <p className="text-gray-600">{event.descriptionOfEvent}</p>
          <p className="text-sm mt-1">📍 {event.eventLocation}</p>
          <p className="text-sm">👥 Capacity: {event.capacityOfEvent}</p>
          <button
            onClick={() => handleRegister(event._id)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      ))}
    </div>
  );
}
