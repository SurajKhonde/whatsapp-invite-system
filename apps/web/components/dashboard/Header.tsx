export default function Header() {
  return (
    <header className="bg-white border-b border-pink-100 px-8 py-4 flex justify-between items-center">

      <h1 className="text-xl font-bold text-pink-600">
        InvitePro
      </h1>

      <div className="flex gap-6 text-sm text-gray-700">
        <span className="hover:text-pink-500 cursor-pointer">Home</span>
        <span className="hover:text-pink-500 cursor-pointer">Templates</span>
        <span className="hover:text-pink-500 cursor-pointer">Create</span>
        <span className="hover:text-pink-500 cursor-pointer">Events</span>
      </div>
    </header>
  );
}