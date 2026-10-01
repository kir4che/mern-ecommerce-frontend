import { Link } from "react-router";

import { useProductCollections } from "@/hooks/useProductCollections";
import { cn } from "@/utils/cn";

interface NavigationProps {
  handleMenuClose: () => void;
}

const Navigation = ({ handleMenuClose }: NavigationProps) => {
  const { collections } = useProductCollections();

  const sections = [
    {
      items: [
        { title: "首頁", path: "/" },
        { title: "關於我們", path: "/about" },
        { title: "最新消息", path: "/news" },
        { title: "常見問題", path: "/faq" },
        { title: "聯繫我們", path: "/contact" },
        { title: "會員中心", path: "/my-account" },
      ],
    },
    {
      title: "所有商品",
      path: "/collections/all",
      items: collections
        .filter((c) => c.value !== "all")
        .map((c) => ({ title: c.label, path: `/collections/${c.value}` })),
    },
  ];

  return (
    <nav
      aria-label="主選單"
      className="mx-auto flex w-full max-w-xs gap-12 px-8 pt-10 pb-24 text-white max-tablet:flex-col tablet:max-w-2xl tablet:items-baseline tablet:gap-24 tablet:pt-16"
    >
      {sections.map((section, index) => (
        <div key={index} className="flex-1">
          {section.title && section.path && (
            <div className="mb-4 border-b border-dashed border-white/50 pb-2.5">
              <Link
                to={section.path}
                onClick={handleMenuClose}
                className="text-lg font-medium tracking-wider transition-colors hover:text-gray-200"
              >
                {section.title}
              </Link>
            </div>
          )}
          <ul
            className={cn(
              "flex flex-col text-nowrap",
              index === 1 ? "space-y-3" : "space-y-4"
            )}
          >
            {section.items.map(({ title, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={handleMenuClose}
                  className="block w-fit font-light tracking-wide opacity-80 transition-all duration-300 hover:translate-x-2 hover:opacity-100"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
