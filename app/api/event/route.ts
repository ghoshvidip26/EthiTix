// /app/api/register/route.ts
import dbConnect from "../../lib/models/mongodb";
import Event from "../../lib/models/Event"; 

export async function POST(request: Request) {
  try {
    const {
      id,
      eventName,
      descriptionOfEvent,
      eventDate,
      eventLocation,
      capacityOfEvent,
    } = await request.json();

    await dbConnect();

    // 1. Check if event with same ID already exists
    const existingEvent = await Event.findOne({ id });
    if (existingEvent) {
      return new Response(JSON.stringify({ message: "Event ID already exists" }), {
        status: 409,
      });
    }

    // 2. Create and save the event
    const newEvent = new Event({
      id,
      eventName,
      descriptionOfEvent,
      eventDate,
      eventLocation,
      capacityOfEvent,
    });

    await newEvent.save();

    return new Response(JSON.stringify({ message: "Event created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Server error:", error);
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