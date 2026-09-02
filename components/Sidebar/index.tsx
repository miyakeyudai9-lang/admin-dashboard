import Image from "next/image";
import { useRouter } from "next/navigation";
import { sidebarItems, type SidebarItem } from "./sidebar.type";

type SidebarProps = {
  selected: SidebarItem;
  onSelect: (item: SidebarItem) => void;
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({
  selected,
  onSelect,
  collapsed,
  onToggle,
}: SidebarProps) {
  const router = useRouter();

  const sidebarWidth = collapsed ? "w-20" : "w-64";

  return (
    <aside
      className={`
        ${sidebarWidth}
        min-h-screen
        bg-white
        shadow-lg
        p-4
        transition-all
        duration-300
      `}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          aria-label="Go to dashboard"
          className="flex items-center overflow-hidden"
        >
          <Image
            src="/company_logo.png"
            alt="Fortune Link logo"
            width={collapsed ? 35 : 180}
            height={collapsed ? 35 : 80}
            priority
            className="object-contain"
          />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="
            rounded-md
            border
            border-gray-200
            px-2
            py-1
            text-gray-600
            hover:bg-gray-100
          "
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const active = selected === item;

            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`
                    flex
                    w-full
                    items-center
                    rounded-md
                    px-3
                    py-2
                    text-left
                    transition-colors

                    ${
                      active
                        ? "bg-gray-100 font-semibold text-black"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                >
                  {collapsed ? item.charAt(0) : item}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}