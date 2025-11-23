import { useState, useEffect } from "react";

const quickLinks = [
  { name: "Overview", href: "#about" },
  { name: "Curriculum", href: "#curriculum" },
  { name: "Instructor", href: "#instructors" },
  { name: "Outcomes", href: "#career-support" },
  { name: "Reviews", href: "#reviews" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#why-bcalm" },
];

export default function StickyQuicklinks() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const quicklinksEl = document.getElementById('quicklinks-section');
      if (quicklinksEl) {
        const rect = quicklinksEl.getBoundingClientRect();
        setIsSticky(rect.top <= 64);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="quicklinks-section" className="relative">
      <nav 
        className={`
          ${isSticky ? 'fixed top-16 left-0 right-0 z-40 shadow-sm' : 'relative'}
          bg-background border-b border-border transition-all duration-200
        `}
        data-testid="nav-quicklinks"
      >
        <div className="container mx-auto px-4" style={{ maxWidth: '1080px' }}>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="
                  text-sm text-muted-foreground hover:text-foreground 
                  transition-colors px-3 py-1.5 rounded-md 
                  hover:bg-muted whitespace-nowrap
                "
                data-testid={`link-quick-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
      {/* Spacer when sticky to prevent layout shift */}
      {isSticky && <div style={{ height: '48px' }} />}
    </div>
  );
}
