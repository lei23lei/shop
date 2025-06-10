"use client";

import React, { useEffect, useState, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  ChevronRight,
  MoonStar,
  Sun,
} from "lucide-react";
import { categories } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  useGetCartCountQuery,
  useGetCartQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/services/endpoints/account-endpoints";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useTheme } from "next-themes";

import { CartSheet } from "@/components/cart/cart-sheet";

export default function UserBar() {
  const { user } = useAuth();
  const { data: cartCount } = useGetCartCountQuery(undefined, {
    skip: !user, // Skip the query if user is not logged in
  });
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !user,
  });
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [localQuantities, setLocalQuantities] = useState<
    Record<number, number>
  >({});
  const [localTotalPrice, setLocalTotalPrice] = useState(0);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const SCROLL_THRESHOLD = 100;
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos === 0) {
        setVisible(true);
        setPrevScrollPos(currentScrollPos);
        return;
      }

      if (Math.abs(prevScrollPos - currentScrollPos) > SCROLL_THRESHOLD) {
        const isScrollingUp = prevScrollPos > currentScrollPos;
        setVisible(isScrollingUp);
        if (!isScrollingUp) {
          setIsMobileMenuOpen(false);
          setActiveCategory(null);
        }
        setPrevScrollPos(currentScrollPos);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [prevScrollPos, user]);

  // Initialize local quantities and total price when cart data changes
  useEffect(() => {
    if (cartData?.items) {
      const initialQuantities = cartData.items.reduce((acc, item) => {
        acc[item.cart_item_id] = item.quantity;
        return acc;
      }, {} as Record<number, number>);
      setLocalQuantities(initialQuantities);

      // Calculate initial total price
      const total = cartData.items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      setLocalTotalPrice(total);
    }
  }, [cartData?.items]);

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleLinkClick = () => {
    setActiveCategory(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDeleteItem = async (cartItemId: number) => {
    try {
      await deleteCartItem(cartItemId).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    const cartItem = cartData?.items.find(
      (item) => item.cart_item_id === cartItemId
    );
    if (!cartItem) return;

    if (newQuantity < 1) return;
    if (newQuantity > cartItem.total_available) {
      toast.error(`Only ${cartItem.total_available} items available`);
      return;
    }

    const oldQuantity = localQuantities[cartItemId] ?? cartItem.quantity;
    const priceDiff = parseFloat(cartItem.price) * (newQuantity - oldQuantity);

    // Update local states immediately
    setLocalQuantities((prev) => ({
      ...prev,
      [cartItemId]: newQuantity,
    }));
    setLocalTotalPrice((prev) => prev + priceDiff);

    // Make the API call in the background
    updateCartItem({
      cart_item_id: cartItemId,
      quantity: newQuantity,
    })
      .unwrap()
      .catch(() => {
        // Revert local states on error
        setLocalQuantities((prev) => ({
          ...prev,
          [cartItemId]: cartItem.quantity,
        }));
        setLocalTotalPrice((prev) => prev - priceDiff);
        toast.error("Failed to update cart");
      });
  };

  // Handle theme toggle with animation
  const handleThemeToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 200);
  };

  return (
    <div
      className={`fixed flex flex-col top-0 left-0 right-0 bg-zinc-700 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      ref={menuRef}
    >
      <div className="px-3 md:px-10  h-[70px] md:h-[80px] flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/icon-full.png"
            alt="Logo"
            width={400}
            height={400}
            className="w-64 mt-4 hidden md:block  "
          />
          <Image
            src="/images/icon.png"
            alt="Logo"
            width={250}
            height={250}
            className="w-14 md:hidden  "
          />
        </Link>

        <div className="flex md:hidden items-center justify-center space-x-4">
          <form
            className="relative "
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(
                  `/items/?search=${encodeURIComponent(searchQuery.trim())}`
                );
                setSearchQuery("");
              }
            }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-[120px]  pl-8 bg-white/80 focus:w-[200px] focus-visible:ring-offset-0 border-4 border-primary/20 transition-all  duration-400 ease-in-out"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <CartSheet
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cartData={cartData}
            localQuantities={localQuantities}
            localTotalPrice={localTotalPrice}
            handleDeleteItem={handleDeleteItem}
            handleUpdateQuantity={handleUpdateQuantity}
            user={user}
            cartCount={cartCount}
          />
          <button
            className={`hamburger  mt-1.5 focus:outline-none ${
              isMobileMenuOpen ? "open" : ""
            }`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isClient && (
            <>
              {user ? (
                <Link href="/myaccount">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full hover:underline  bg-blue-300/40 flex items-center justify-center text-white font-medium">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-md">{user.email}</p>
                  </div>
                </Link>
              ) : (
                <Link href="/login">
                  <div className="text-white text-lg">Login</div>
                </Link>
              )}
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="h-8 w-8 overflow-hidden rounded-full transition-colors hover:bg-muted"
            disabled={isAnimating}
          >
            <div
              className={`transform transition-all duration-500 ${
                theme === "dark" ? "rotate-0" : "rotate-180"
              }`}
              style={{ transformOrigin: "center" }}
            >
              {theme === "dark" ? (
                <MoonStar
                  className={`h-4 w-4 text-gray-300 ${
                    isAnimating ? "scale-90" : "scale-[1.4]"
                  } transition-transform duration-300`}
                />
              ) : (
                <Sun
                  className={`h-4 w-4 text-gray-300 ${
                    isAnimating ? "scale-90" : "scale-[1.4]"
                  } transition-transform duration-300`}
                />
              )}
            </div>
            <span className="sr-only">Toggle dark mode</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "h-[calc(100vh-72px)]" : "h-0"
        }`}
      >
        <div
          className={`px-3  transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <Accordion type="single" collapsible className="w-full pb-4">
            {categories.map((category) => (
              <AccordionItem value={category.id.toString()} key={category.id}>
                <AccordionTrigger className="text-base hover:no-underline">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col  pl-4">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/items/${subcategory.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground py-2"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLinkClick();
                        }}
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="border-t flex items-center justify-between cursor-pointer border-gray-300 pt-4">
            {user ? (
              <Link href="/myaccount">
                <div className="flex items-center gap-2 ">
                  <div className="w-8 h-8 rounded-full bg-blue-300/40 flex items-center justify-center text-muted-foreground font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-md">{user.email}</p>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <h5 className="text-md">Login</h5>
              </Link>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex relative flex-row justify-between h-[55px] items-center w-full mx-auto px-10">
        <div className="flex space-x-4 items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer relative py-2"
              onClick={() => handleCategoryClick(Number(category.id))}
            >
              <div className="px-2 text-white">{category.name}</div>
              <div className="absolute bottom-0 left-0 w-full h-[3px]">
                <div
                  className={`h-full bg-white transition-all duration-400 mx-auto
                    ${
                      activeCategory === category.id
                        ? "w-[80%]"
                        : "w-0 group-hover:w-[80%]"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <form
            className="relative"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(
                  `/items/?search=${encodeURIComponent(searchQuery.trim())}`
                );
                setSearchQuery("");
              }
            }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8 border-4 border-primary/20 focus-visible:ring-offset-0 bg-white/80 focus:w-[400px] transition-all duration-400 ease-in-out"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <CartSheet
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cartData={cartData}
            localQuantities={localQuantities}
            localTotalPrice={localTotalPrice}
            handleDeleteItem={handleDeleteItem}
            handleUpdateQuantity={handleUpdateQuantity}
            user={user}
            cartCount={cartCount}
          />
        </div>
        {/* expandable categories */}
        {activeCategory !== null && (
          <div
            className="hidden md:flex text-white absolute  rounded-b-sm flex-row left-0 top-[55px] w-[600px] h-[290px] bg-zinc-700 shadow-lg 
            transform transition-all duration-300 ease-in-out opacity-100 translate-y-0 space-x-6
            origin-top animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex flex-col w-40 h-full">
              <div className="flex flex-col pl-6 pt-4">
                {categories
                  .find((c) => c.id === activeCategory)
                  ?.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/items/${subcategory.id}`}
                      className="hover:bg-background rounded-md px-4 py-2 cursor-pointer hover:text-foreground"
                      onClick={handleLinkClick}
                    >
                      {subcategory.name}
                    </Link>
                  )) ?? null}
              </div>
            </div>
            <div className="flex flex-col flex-1 h-full">
              <div className="pt-2.5 pr-2 relative">
                <Image
                  src={
                    categories.find((c) => c.id === activeCategory)?.image ?? ""
                  }
                  alt={
                    categories.find((c) => c.id === activeCategory)?.name ?? ""
                  }
                  className="rounded-md"
                  width={500}
                  height={250}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
