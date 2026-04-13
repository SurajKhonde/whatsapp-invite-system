import { inviteQueue } from "@/../../packages/queue/queue";
import { prisma } from "@/../../packages/db";

type GuestInput = {
  name: string;
  phone: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const guests: GuestInput[] = body.guests;

    if (!guests || guests.length === 0) {
      return Response.json(
        { error: "Guests are required" },
        { status: 400 }
      );
    }

    // ✅ FIX HERE
    await prisma.guest.createMany({
      data: guests.map((g: GuestInput) => ({
        name: g.name,
        phone: g.phone,
      })),
    });

    const savedGuests = await prisma.guest.findMany({
      orderBy: { createdAt: "desc" },
      take: guests.length,
    });

    await inviteQueue.addBulk(
      savedGuests.map((g:{ id: string; phone: string }) => ({
        name: "sendInvite",
        data: {
          id: g.id,
          phone: g.phone,
        },
      }))
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}