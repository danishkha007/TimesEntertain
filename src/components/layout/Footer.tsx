import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo width={24} height={24} />
            <span className="text-md font-headline font-semibold">
              TimesEntertain
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TimesEntertain. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
             <Link href="#" className="text-sm text-muted-foreground hover:text-primary">About</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
