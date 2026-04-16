export default function DraftGuestList({ guests, onRemove, onSaveAll }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-pink-100 flex flex-col">

      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-pink-600">
          New Guests
        </h2>

        <button
          onClick={onSaveAll}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Save All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y">
        {guests.length === 0 ? (
          <p className="text-gray-400 text-sm">No guests added</p>
        ) : (
          guests.map((g: any, i: number) => (
            <div key={i} className="py-2 flex justify-between items-center">

              <div>
                <p className="text-sm font-medium text-black">{g.name}</p>
                <p className="text-xs text-gray-500">{g.phone}</p>
              </div>

              <button
                onClick={() => onRemove(i)}
                className="text-xs text-red-500"
              >
                Remove
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}