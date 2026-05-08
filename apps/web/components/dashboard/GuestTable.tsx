export default function GuestTable({ data }: any) {
  const user = data || [];
  return (
    <div className="bg-white rounded-2xl shadow border border-pink-100 h-full flex flex-col">
      <div className="p-4 border-b flex justify-between">
        <h2 className="text-lg font-semibold text-pink-600">Contacts</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {user?.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No guests saved yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b">
              <tr className="text-left text-gray-600">
                <th className="p-3">Name</th>
                <th>Phone</th>
                <th>Relation</th>
              </tr>
            </thead>

            <tbody>
              {user?.map((g: any, i: number) => (
                <tr key={i} className="border-b hover:bg-pink-50">
                  <td className="p-3 font-medium text-black">{g.name}</td>
                  <td className="text-gray-700">{g.phone}</td>
                  <td className="text-gray-700">{g.relation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
