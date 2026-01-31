import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/content";

interface NavbarProps {
  onSignupClick?: () => void;
  onLoginClick?: () => void;
}

export function Navbar({ onSignupClick, onLoginClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
            IG
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-muted-foreground">Gestão</span>
            <span className="text-base">Igreja Clara</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:inline-flex"
            onClick={onLoginClick}
          >
            Entrar
          </Button>
          <Button size="sm" onClick={onSignupClick}>
            Começar agora
          </Button>
        </div>
      </div>
    </header>
  );
}
