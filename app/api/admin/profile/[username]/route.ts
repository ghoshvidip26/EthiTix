import dbConnect from "../../../../lib/models/mongodb";
import Admin from "../../../../lib/models/Admin";

export async function GET(request: Request, props: { params: Promise<{ username: string }> }){

  const params = await props.params;
  const username = params.username.toLowerCase();
  console.log("Fetching admin profile for username:", username);

  try {
    await dbConnect();
    const users = await Admin.find({username});
    console.log("Fetched admin:", users);
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log("Error fetching admin:", error);
  }
}
