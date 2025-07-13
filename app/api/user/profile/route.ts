import dbConnect from "../../../lib/models/mongodb";
import User from "../../../lib/models/User";

export async function GET(){
    try {
        await dbConnect();
        const users = await User.find({});
        console.log("Fetched users:", users);
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
    }
}