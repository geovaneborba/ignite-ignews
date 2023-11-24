"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton } from "./SignInButton";
import { twMerge } from "tailwind-merge";

export function Header() {
  const pathName = usePathname();
  const navItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Posts",
      href: "/posts",
    },
  ];

  return (
    <header className="h-20 border border-gray-800">
      <div className="flex items-center max-w-[1120px] h-20 my-0 mx-auto px-8">
        <Image src={logo} alt="" />
        <nav className="">
          <ul className="flex items-center ml-20 h-20 gap-8">
            {navItems.map((navItem) => (
              <li key={navItem.title}>
                <Link
                  href={navItem.href}
                  className={twMerge(
                    "inline-block relative px-2 h-20 leading-[5rem] text-gray-300 transition-colors duration-200 hover:text-white",
                    pathName === navItem.href
                      ? "font-bold text-white after:height-[3px] after:border after:rounded-tl-[3px] after:rounded-tr-[3px] after:w-full after:absolute after:bottom-[2px] after:left-0 after:border-yellow-500"
                      : ""
                  )}
                >
                  {navItem.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
