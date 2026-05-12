import {
  useGetEventByIdQuery,
} from "@/store/apiSlice";

export default function EventDetailsModal({
  eventId,
  onClose,
}: any) {
  const {
    data,
    isLoading,
  } =
    useGetEventByIdQuery(
      eventId,
      {
        skip:
          !eventId,
      }
    );

  const event =
    data?.data;

  const guests =
    event?.guests || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-xl">
        {/* HEADER */}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Event Details
          </h2>

          <button
            onClick={
              onClose
            }
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* LOADING */}

        {isLoading && (
          <div className="py-10 text-center text-gray-500">
            Loading event
            details...
          </div>
        )}

        {/* EVENT */}

        {!isLoading &&
          event && (
            <>
              {/* EVENT INFO */}

              <div className="mb-4 border rounded-lg p-3 bg-gray-50">
                <p className="font-semibold">
                  {
                    event
                      ?.template
                      ?.title
                  }
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {
                    event.messageType
                  }
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Event ID:{" "}
                  {
                    event.id
                  }
                </p>
              </div>

              {/* GUESTS */}

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {guests.map(
                  (
                    g: any
                  ) => (
                    <div
                      key={
                        g.id
                      }
                      className="flex justify-between border p-2 rounded"
                    >
                      <div>
                        <p>
                          {
                            g.name
                          }
                        </p>

                        <p className="text-xs text-gray-500">
                          {
                            g.phone
                          }
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded h-fit ${
                          g.status ===
                          "sent"
                            ? "bg-green-100 text-green-700"
                            : g.status ===
                              "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {
                          g.status
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}

        {/* EMPTY */}

        {!isLoading &&
          !event && (
            <div className="py-10 text-center text-gray-500">
              Event not
              found
            </div>
          )}

        {/* FOOTER */}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}