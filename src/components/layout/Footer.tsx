
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
             {/* Logo removed */}
          </div>

          <div className="flex-1 flex justify-center text-center my-4 md:my-0">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-4">
               <Link href="#" className="text-sm text-muted-foreground hover:text-primary">About</Link>
               <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
               <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
