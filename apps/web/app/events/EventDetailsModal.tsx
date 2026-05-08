import { useGetEventDetailsQuery } from "@/store/apiSlice";

export default function EventDetailsModal({ eventId, onClose }: any) {
  const { data } = useGetEventDetailsQuery(eventId);

  const guests = data?.data?.guests || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-xl">
        <h2 className="text-lg font-bold mb-4">Event Details</h2>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {guests.map((g: any) => (
            <div key={g.id} className="flex justify-between border p-2 rounded">
              <div>
                <p>{g.name}</p>
                <p className="text-xs text-gray-500">{g.phone}</p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  g.status === "sent"
                    ? "bg-green-100 text-green-700"
                    : g.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {g.status}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-4 w-full bg-gray-200 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
