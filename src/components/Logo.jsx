
    import React from 'react';

    const Logo = ({ className, width = 160, height = "auto" }) => {
      const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/e4640efc-3cc0-4fbe-8025-a5690e00f1a3/2681c41be2a8641b3b0c35677358b34b.png";
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img 
            src={logoUrl} 
            alt="No Palco Logo" 
            style={{ width: `${width}px`, height: height === "auto" ? "auto" : `${height}px` }}
            className="object-contain"
          />
        </div>
      );
    };

    export default Logo;
  