interface MinimizedButtonProps {
  onClick: () => void;
}

// Get logo URL - use chrome.runtime if available (extension context), otherwise fallback to gradient
function getLogoUrl(): string {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    return chrome.runtime.getURL('icons/GlossLogo48.png');
  }
  // Fallback to gradient if not in extension context
  return '';
}

// Minimized button component - uses actual Gloss logo when in extension context
export function MinimizedButton({ onClick }: MinimizedButtonProps) {
  const logoUrl = getLogoUrl();
  const hasLogo = logoUrl !== '';

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-[999999] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center overflow-hidden"
      style={{
        width: '56px',
        height: '56px',
        backgroundImage: hasLogo 
          ? `url('${logoUrl}')`
          : 'linear-gradient(135deg, rgb(251, 100, 182) 0%, rgb(255, 184, 106) 100%)',
        backgroundSize: hasLogo ? 'cover' : 'auto',
        backgroundPosition: hasLogo ? 'center' : 'auto',
        backgroundRepeat: hasLogo ? 'no-repeat' : 'no-repeat',
      }}
      aria-label="Open Gloss panel"
    >
      {!hasLogo && (
        <div className="flex items-center justify-center w-full h-full">
          <p 
            className="text-white font-bold"
            style={{
              fontFamily: "'Arimo', 'Arimo Bold', sans-serif",
              fontSize: '20px',
              lineHeight: '20px',
              letterSpacing: '0.32px',
              fontWeight: 'bold'
            }}
          >
            g
          </p>
        </div>
      )}
    </button>
  );
}