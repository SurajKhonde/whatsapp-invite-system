import { Guest } from "@/types/guest";

type Props = {
  guests: Guest[];
  onEdit: (index: number) => void;
};

export default function GuestList({ guests, onEdit }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-pink-100">

      <h2 className="text-xl font-semibold text-pink-600 mb-4">
        Guest List
      </h2>

      {guests.length === 0 && (
        <p className="text-gray-400 text-sm">No guests added yet</p>
      )}

      <div className="divide-y">
        {guests.map((g, i) => (
          <div key={i} className="flex justify-between items-center py-3">

            <div>
              <p className="font-medium text-black">{g.name}</p>
              <p className="text-sm text-gray-800 ">{g.phone}</p>
            </div>

            <button
              onClick={() => onEdit(i)}
              className="text-sm text-pink-600 hover:underline"
            >
              Edit
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}