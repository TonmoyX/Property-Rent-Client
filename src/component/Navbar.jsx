'use client';
import { useState } from "react";
import { Button } from "@heroui/react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import NavLink from "./NavLink";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection after logout
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userData = authClient.useSession();
  const user = userData?.data?.user;

  // Sign out routine handling redirect cleanly
  const handleSignOut = async () => {
    setIsMenuOpen(false); // Clean mobile drawer exit
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };


  const closeMenu = () => {
        setIsMenuOpen(false);
    };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center">
            <Image src={logo} alt="Logo" width={100} height={100} className="h-15 w-15" />
            <p className="font-bold text-xl bg-gradient-to-r from-[#ef8e38] to-[#108dc7] bg-clip-text text-transparent">
              PropRent
            </p>
          </div>
        </div>
        <ul className="hidden items-center gap-4 md:flex">
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="/allproperties">
              All Properties
            </NavLink>
          </li>
          <li>
            <NavLink href="/services">Services</NavLink>
          </li>
          {user && <li>
            <NavLink href={`/dashboard/${user.role}`}>Dashboard</NavLink>
          </li>
          }
        </ul>
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Button variant="danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <>
              <Button><Link href="/authentication/login">Login</Link></Button>
              <Button><Link href="/authentication/signup">Sign Up</Link></Button>
            </>
          )}
        </div>
      </header>
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <NavLink href="/">Home</NavLink>
            </li>
            <li>
              <NavLink href="/allproperties">
                All Properties
              </NavLink>
            </li>
            <li>
              <NavLink href="/services">
                Services
              </NavLink>
            </li>
            {
            user && <li>
              <NavLink href={`/dashboard/${user.role}`}>
                Dashboard
              </NavLink>
            </li>
            }
            <li className="mt-4 flex flex-col gap-2 border-t border-separator pt-4">
              {user ? (
                <Button variant="danger" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button onClick={()=>closeMenu()} className='w-full'><Link href="/authentication/login">Login</Link></Button>
                  <Button onClick={()=>closeMenu()} className="w-full"><Link href="/authentication/signup">Sign Up</Link></Button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;