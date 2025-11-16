import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-foreground">
            Bcalm
          </div>
          
          <Link 
            href="/resources"
            className="px-5 py-2.5 rounded-full font-medium transition-all duration-200 hover:shadow-sm"
            style={{
              backgroundColor: '#f5f3ff',
              color: '#6c47ff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ebe8ff';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3ff';
              e.currentTarget.style.boxShadow = '';
            }}
            data-testid="link-free-resources"
          >
            Free Resources
          </Link>
        </div>
      </div>
    </nav>
  );
}
