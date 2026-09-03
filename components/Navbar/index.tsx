type NavbarProps = {
  title: string;
};

export default function Navbar({ title }: NavbarProps) {
  return (
    <div className="sticky top-0 z-10 mb-8 border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-md">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
    </div>
  );
}