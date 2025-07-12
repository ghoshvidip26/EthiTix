// /app/api/register/route.ts
import dbConnect from "../../lib/models/mongodb";
import Event from "../../lib/models/Event"; 
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const {
      eventName,
      descriptionOfEvent,
      eventDate,
      eventLocation,
      capacityOfEvent,
    } = await request.json();
    console.log("Received data:", {
      eventName,
      descriptionOfEvent,
      eventDate,
      eventLocation,
      capacityOfEvent,
    });

    await dbConnect();
    // 1. Check if event with same ID already exists
    const existingEvent = await Event.findOne({ eventName });
    if (existingEvent) {
      return new Response(JSON.stringify({ message: "Event ID already exists" }), {
        status: 409,
      });
    }

    // 2. Create and save the event
    const newEvent = new Event({
      id: uuidv4(),
      eventName: eventName,
      descriptionOfEvent: descriptionOfEvent,
      eventDate: eventDate,
      eventLocation: eventLocation,
      capacityOfEvent: capacityOfEvent,
    });

    await newEvent.save();

    return new Response(JSON.stringify({ message: "Event created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.log("Server error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function GET(){
  try {
    await dbConnect();
    const events = await Event.find({});
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), { status: 500 });
  }
}