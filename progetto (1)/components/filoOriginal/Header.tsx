import logo2D from "./assets/logo-2d.png";
import headerBg from "./assets/header-bg.jpeg";

const Header = () => {
  return (
    <header 
      className="relative w-full flex items-center justify-center"
      style={{ 
        minHeight: '320px',
        backgroundImage: `url(${headerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay - 60% opacity */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Logo centered */}
      <div className="relative z-10 flex items-center justify-center py-8">
        <img 
          src={logo2D} 
          alt="2D Sviluppo Immobiliare" 
          className="h-auto w-auto object-contain"
          style={{ maxWidth: '280px' }}
        />
      </div>
    </header>
  );
};

export default Header;
