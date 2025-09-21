"use client";

import React, { useEffect, useState, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
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
import DarkModeButton from "./darkmode-button";
import {
  getLocalCart,
  removeFromLocalCart,
  updateLocalCartItemQuantity,
  LocalCartItem,
} from "@/lib/cart-utils";

import { CartSheet } from "@/components/cart/cart-sheet";

export default function UserBar() {
  const { user } = useAuth();
  const { data: cartCount } = useGetCartCountQuery(undefined, {
    skip: !user,
  });
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !user,
  });
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  // API cart state (for logged-in users)
  const [localQuantities, setLocalQuantities] = useState<
    Record<number, number>
  >({});
  const [localTotalPrice, setLocalTotalPrice] = useState(0);

  // localStorage cart state (for guest users)
  const [localCart, setLocalCart] = useState<{
    items: LocalCartItem[];
    total_items: number;
  }>({
    items: [],
    total_items: 0,
  });
  const [localCartQuantities, setLocalCartQuantities] = useState<
    Record<string, number>
  >({});
  const [localCartTotalPrice, setLocalCartTotalPrice] = useState(0);

  // UI state
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

  // Ensure client-side only rendering for user-dependent content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load localStorage cart when user is not logged in
  useEffect(() => {
    if (!user) {
      const cart = getLocalCart();
      setLocalCart(cart);

      // Initialize quantities
      const quantities = cart.items.reduce((acc, item) => {
        acc[item.cart_item_id] = item.quantity;
        return acc;
      }, {} as Record<string, number>);
      setLocalCartQuantities(quantities);

      // Calculate total price
      const total = cart.items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      setLocalCartTotalPrice(total);
    }
  }, [user]);

  // Listen for localStorage changes to update cart count immediately
  useEffect(() => {
    if (!user) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "local_cart") {
          const cart = getLocalCart();
          setLocalCart(cart);

          const quantities = cart.items.reduce((acc, item) => {
            acc[item.cart_item_id] = item.quantity;
            return acc;
          }, {} as Record<string, number>);
          setLocalCartQuantities(quantities);

          const total = cart.items.reduce(
            (sum, item) => sum + parseFloat(item.price) * item.quantity,
            0
          );
          setLocalCartTotalPrice(total);
        }
      };

      // Listen for storage events (cross-tab changes)
      window.addEventListener("storage", handleStorageChange);

      // Also create a custom event listener for same-tab updates
      const handleCustomCartUpdate = () => {
        const cart = getLocalCart();
        setLocalCart(cart);

        const quantities = cart.items.reduce((acc, item) => {
          acc[item.cart_item_id] = item.quantity;
          return acc;
        }, {} as Record<string, number>);
        setLocalCartQuantities(quantities);

        const total = cart.items.reduce(
          (sum, item) => sum + parseFloat(item.price) * item.quantity,
          0
        );
        setLocalCartTotalPrice(total);
      };

      window.addEventListener("localCartUpdated", handleCustomCartUpdate);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("localCartUpdated", handleCustomCartUpdate);
      };
    }
  }, [user]);

  // Refresh localStorage cart when cart is opened (to catch any updates from item detail page)
  useEffect(() => {
    if (!user && isCartOpen) {
      const cart = getLocalCart();
      setLocalCart(cart);

      const quantities = cart.items.reduce((acc, item) => {
        acc[item.cart_item_id] = item.quantity;
        return acc;
      }, {} as Record<string, number>);
      setLocalCartQuantities(quantities);

      const total = cart.items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      setLocalCartTotalPrice(total);
    }
  }, [user, isCartOpen]);

  useEffect(() => {
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

  // Initialize local quantities and total price when cart data changes (for logged-in users)
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

  // API cart functions (for logged-in users)
  const handleDeleteItem = async (cartItemId: number) => {
    try {
      await deleteCartItem(cartItemId).unwrap();
      toast.success("Item removed from cart");
    } catch {
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

  // localStorage cart functions (for guest users)
  const handleLocalDeleteItem = (cartItemId: string) => {
    try {
      const updatedCart = removeFromLocalCart(cartItemId);
      setLocalCart(updatedCart);

      // Update quantities
      const quantities = updatedCart.items.reduce((acc, item) => {
        acc[item.cart_item_id] = item.quantity;
        return acc;
      }, {} as Record<string, number>);
      setLocalCartQuantities(quantities);

      // Update total price
      const total = updatedCart.items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      setLocalCartTotalPrice(total);

      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item from cart");
    }
  };

  const handleLocalUpdateQuantity = (
    cartItemId: string,
    newQuantity: number
  ) => {
    const cartItem = localCart.items.find(
      (item) => item.cart_item_id === cartItemId
    );
    if (!cartItem) return;

    if (newQuantity < 1) return;
    if (newQuantity > cartItem.total_available) {
      toast.error(`Only ${cartItem.total_available} items available`);
      return;
    }

    const oldQuantity = localCartQuantities[cartItemId] ?? cartItem.quantity;
    const priceDiff = parseFloat(cartItem.price) * (newQuantity - oldQuantity);

    // Update local states immediately
    setLocalCartQuantities((prev) => ({
      ...prev,
      [cartItemId]: newQuantity,
    }));
    setLocalCartTotalPrice((prev) => prev + priceDiff);

    // Update localStorage
    try {
      const updatedCart = updateLocalCartItemQuantity(cartItemId, newQuantity);
      setLocalCart(updatedCart);
    } catch {
      // Revert local states on error
      setLocalCartQuantities((prev) => ({
        ...prev,
        [cartItemId]: cartItem.quantity,
      }));
      setLocalCartTotalPrice((prev) => prev - priceDiff);
      toast.error("Failed to update cart");
    }
  };

  // Determine which cart data to use for CartSheet
  const displayCartData = user ? cartData : { items: localCart.items };
  const displayQuantities = user ? localQuantities : localCartQuantities;
  const displayTotalPrice = user ? localTotalPrice : localCartTotalPrice;
  const displayCartCount = user
    ? cartCount
    : { total_items: localCart.total_items };

  return (
    <div
      className={`fixed flex flex-col top-0 left-0 right-0 bg-header-background z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      ref={menuRef}
    >
      <div className="px-3 md:px-10  h-[60px]  flex items-center justify-between">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
          <Image
            src="/images/icon-full.png"
            alt="Logo"
            width={400}
            height={400}
            className="w-56 mt-4 hidden md:block  "
          />
          <Image
            src="/images/icon.png"
            alt="Logo"
            width={250}
            height={250}
            className="w-12 md:hidden  "
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
                setIsMobileMenuOpen(false);
                setSearchQuery("");
              }
            }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-[120px] rounded-2xl pl-8 bg-white/90 border-white/60 text-black focus:w-[280px]  transition-all duration-1000 ease-in-out !ring-0 !ring-offset-0 !focus-visible:ring-0 !focus-visible:ring-offset-0 !focus:ring-0 !focus:ring-offset-0 !outline-none "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </form>
          <CartSheet
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cartData={displayCartData}
            localQuantities={displayQuantities}
            localTotalPrice={displayTotalPrice}
            handleDeleteItem={user ? handleDeleteItem : handleLocalDeleteItem}
            handleUpdateQuantity={
              user ? handleUpdateQuantity : handleLocalUpdateQuantity
            }
            user={user}
            cartCount={displayCartCount}
          />
          <DarkModeButton />
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
                  <div className="flex items-center  gap-2 text-white">
                    <div className="w-6 h-6 rounded-full   bg-blue-300/40 flex items-center justify-center text-white font-medium">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm text-header-font hover:underline">
                      {user.email}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link href="/login">
                  <div className="text-header-font font-semibold hover:text-foreground hover:underline text-sm">
                    Login
                  </div>
                </Link>
              )}
            </>
          )}
          <DarkModeButton />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-200 dark:bg-zinc-700 overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "h-[calc(100vh-60px)]" : "h-0"
        }`}
      >
        <div
          className={`px-3  transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <Accordion type="single" collapsible className="w-full  pb-4">
            {categories.map((category) => (
              <AccordionItem value={category.id.toString()} key={category.id}>
                <AccordionTrigger className="text-base  hover:no-underline">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col  pl-4">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/items/${subcategory.id}`}
                        className="text-sm text-header-font hover:text-foreground py-2"
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
          <div className="border-t dark:border-t-0 flex items-center justify-between cursor-pointer border-gray-300 pt-4">
            {isClient && (
              <>
                {user ? (
                  <Link
                    href="/myaccount"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-300/40 flex items-center justify-center text-header-font font-medium">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm">{user.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-header-font" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <h5 className="text-md">Login</h5>
                      <ChevronRight className="w-4 h-4 text-header-font" />
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex relative flex-row justify-between h-[50px] items-center w-full mx-auto px-10">
        <div className="flex space-x-4 items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer relative py-2 transition-all duration-300"
              onClick={() => handleCategoryClick(Number(category.id))}
            >
              <div
                className={`px-2 font-semibold text-sm transition-colors duration-300 ${
                  activeCategory === category.id
                    ? "text-primary"
                    : "text-header-font"
                }`}
              >
                {category.name}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[3px]">
                <div
                  className={`h-full bg-primary transition-all duration-500 mx-auto
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
        <div className="flex mb-2 items-center space-x-4">
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
              className="w-[200px] rounded-2xl h-[35px] border-white/10 pl-8 text-black bg-white/90 focus:w-[350px] transition-all duration-1000 ease-in-out !ring-0 !ring-offset-0 !focus-visible:ring-0 !focus-visible:ring-offset-0 !focus:ring-0 !focus:ring-offset-0 !outline-none text-base sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <CartSheet
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cartData={displayCartData}
            localQuantities={displayQuantities}
            localTotalPrice={displayTotalPrice}
            handleDeleteItem={user ? handleDeleteItem : handleLocalDeleteItem}
            handleUpdateQuantity={
              user ? handleUpdateQuantity : handleLocalUpdateQuantity
            }
            user={user}
            cartCount={displayCartCount}
          />
        </div>
        {/* expandable categories */}
        {activeCategory !== null && (
          <div
            className="hidden md:flex text-header-font absolute  rounded-b-sm flex-row left-0 top-[50px] w-[600px] h-[290px] bg-header-background shadow-lg 
            transform transition-all duration-300 ease-in-out opacity-100 translate-y-0 space-x-6
            origin-top animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex flex-col w-40 h-full">
              <div className="flex flex-col pl-8 pt-4">
                {categories
                  .find((c) => c.id === activeCategory)
                  ?.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/items/${subcategory.id}`}
                      className="hover:bg-foreground/10 rounded-md px-4 py-2 cursor-pointer   hover:text-primary"
                      onClick={handleLinkClick}
                    >
                      <p className="text-sm">{subcategory.name}</p>
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
