
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FormEvent } from "react";
import { Logo } from "@/components/Logo";

const navLinks = [
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/watchlist", label: "My Watchlist" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={180} />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2">
              <Input
                type="search"
                name="search"
                placeholder="Search..."
                className="h-9 w-40 lg:w-64"
              />
               <Button type="submit" size="icon" variant="ghost">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
