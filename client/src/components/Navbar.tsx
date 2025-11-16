import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between" style={{ padding: '16px 24px' }}>
          <div 
            className="font-semibold select-none"
            style={{
              color: '#111111',
              fontSize: 'clamp(17px, 2.5vw, 20px)',
              fontWeight: 600,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              letterSpacing: '0.75px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'baseline'
            }}
            data-testid="logo-bcalm"
          >
            <span style={{ marginRight: '-1.5px' }}>B</span>
            <span style={{ letterSpacing: '1px' }}>calm</span>
          </div>
          
          <Link 
            href="/resources"
            className="rounded-full font-medium transition-all duration-200"
            style={{
              padding: '6px 16px',
              backgroundColor: '#f5f3ff',
              color: '#6c47ff',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ebe4ff';
              e.currentTarget.style.color = '#5a38f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3ff';
              e.currentTarget.style.color = '#6c47ff';
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
