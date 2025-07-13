import dbConnect from "../../../../lib/models/mongodb";
import User from "../../../../lib/models/User";

export async function GET(request: Request, props: { params: Promise<{ username: string }> }){
  const params = await props.params;
  try {
    const username = params.username.toLowerCase();
    console.log("Fetching user profile for username:", username);
    await dbConnect();
    const users = await User.findOne({username});
    console.log("Fetched user:", users);
    if(!users){
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
  }
}