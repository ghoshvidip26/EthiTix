import dbConnect from "../../../../lib/models/mongodb";
import User from "../../../../lib/models/User";

export async function GET(request: Request, props: { params: Promise<{ address: string }> }){
  try {
    await dbConnect();
    const { address } = await props.params;
    const profile = await User.findOne({ walletAddress: address });
    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    console.log("Server-error", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}