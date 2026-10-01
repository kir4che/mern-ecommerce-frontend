import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/utils/cn";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import Navigation from "@/components/shared/Navigation";

import CartIcon from "@/assets/icons/cart.inline.svg?react";
import MenuIcon from "@/assets/icons/menu.inline.svg?react";
import UserIcon from "@/assets/icons/user-circle.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import shop5 from "@/assets/images/about/shop5.webp";

const HeaderMenu = () => {
  const { user } = useAuth();
  const { totalQuantity } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 當 scrollY 大於 30 時，將 isScrolled 設為 true，否則設為 false。
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 當選單開啟時，禁止 body 滾動，並補上 scrollbar 寬度的 padding-right，避免畫面跳動。
  useEffect(() => {
    if (!isMenuOpen) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {!isMenuOpen && <div className="h-20 w-full shrink-0" />}
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-50 w-full transition-all",
          isMenuOpen
            ? "h-screen overflow-hidden bg-slate-900 duration-700 ease-out"
            : "bg-white duration-150 ease-in",
          isScrolled && !isMenuOpen
            ? "border-b border-primary shadow-sm"
            : "border-transparent"
        )}
      >
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 z-0 overflow-hidden bg-slate-800 transition-all max-md:hidden md:w-1/2 lg:w-7/12",
            isMenuOpen
              ? "translate-x-0 opacity-100 duration-700 ease-out"
              : "translate-x-full opacity-0 duration-300 ease-in"
          )}
        >
          <img
            src={shop5}
            alt="日出麵包坊"
            className="size-full object-cover object-center opacity-80 transition-all duration-1000 hover:scale-105 hover:opacity-100"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative z-10 flex size-full flex-col">
          <header
            className={cn(
              "relative flex-between px-4 transition-all md:px-8",
              isScrolled && !isMenuOpen ? "h-16" : "h-20",
              isMenuOpen
                ? "w-full duration-700 ease-out md:w-1/2 lg:w-5/12"
                : "w-full duration-300 ease-in"
            )}
          >
            <Button
              variant="secondary"
              icon={isMenuOpen ? CloseIcon : MenuIcon}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconStyle={cn(
                isMenuOpen
                  ? "stroke-white duration-700"
                  : "stroke-slate-900 duration-150"
              )}
              aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
              className={cn(
                "size-9 rounded-full",
                isMenuOpen
                  ? "border-white bg-transparent hover:bg-white/10"
                  : "border border-slate-900 bg-white"
              )}
            />
            <Link
              to="/"
              className={cn(
                "absolute left-1/2 -translate-x-1/2 transition-all",
                isMenuOpen
                  ? "pointer-events-none scale-95 opacity-0 duration-300"
                  : "scale-100 opacity-100 delay-150 duration-500"
              )}
              aria-label="回首頁"
            >
              <Logo isWhite={false} />
            </Link>
            <div className="mr-3 flex items-center gap-3 md:gap-4">
              {user ? (
                <>
                  <Link
                    to="/my-account"
                    className="hidden tablet:block"
                    aria-label="前往會員中心"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon
                      className={cn(
                        "size-6 transition-colors",
                        isMenuOpen
                          ? "text-white duration-700"
                          : "text-primary duration-150"
                      )}
                    />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="secondary"
                      className={cn(
                        "h-9",
                        isMenuOpen
                          ? "border-white bg-transparent text-white hover:bg-white hover:text-primary"
                          : ""
                      )}
                    >
                      登入
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="max-md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="primary"
                      className={cn(
                        "h-9",
                        isMenuOpen ? "border-none bg-transparent" : ""
                      )}
                    >
                      註冊
                    </Button>
                  </Link>
                </div>
              )}
              <Link
                to="/cart"
                className="relative"
                aria-label={`購物車目前有 ${totalQuantity} 件商品`}
                onClick={() => setIsMenuOpen(false)}
              >
                <CartIcon
                  className={cn(
                    "size-6 transition-colors",
                    isMenuOpen
                      ? "stroke-white duration-700"
                      : "stroke-primary duration-150"
                  )}
                />
                {totalQuantity > 0 && (
                  <span
                    className={cn(
                      "absolute -top-2.5 -right-3 inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      isMenuOpen
                        ? "bg-white text-primary duration-500"
                        : "bg-primary text-white duration-50"
                    )}
                  >
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </header>
          {isMenuOpen && (
            <div className="animate-fade-in h-[calc(100vh-80px)] w-full overflow-y-auto md:w-1/2 lg:w-5/12">
              <Navigation handleMenuClose={() => setIsMenuOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
