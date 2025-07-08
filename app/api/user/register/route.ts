import dbConnect from "../../../lib/models/mongodb";
import User from "../../../lib/models/User";

export async function POST(request: Request) {
  try {
    const { address, username } = await request.json();
    await dbConnect();
    console.log("Received data:", { address, username });

    if (!address || address.length !== 66 || !username) {
      return new Response(JSON.stringify({ message: "Invalid input" }), { status: 400 });
    }

    const existingProfile = await User.findOne({ $or: [{ username }, { walletAddress: address }] });
    if (existingProfile) {
      return new Response(JSON.stringify({ message: "Username or address already taken" }), { status: 409 });
    }

    const newProfile = new User({ walletAddress: address, username });
    await newProfile.save();

    return new Response(JSON.stringify({ message: "Username registered successfully" }), { status: 201 });
  } catch (error) {
    console.log("Server-error", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}