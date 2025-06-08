// GoogleSearchSimulator.tsx
import React, { useState, useEffect } from 'react';
import "./css/google.css"
const GoogleSearchSimulator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Kullanıcı "Ara" butonuna tıkladığında arama işlemini simüle et
  useEffect(() => {
    if (isSearching) {
      // Arama işlemini taklit etmek için 2 saniye bekle
      setTimeout(() => {
        // Google'da aramayı yeni sekmede aç
        window.open(`https://www.google.com/search?q=${searchTerm}`, '_blank');
        setIsSearching(false);
      }, 2000);
    }
  }, [isSearching, searchTerm]);

  // Arama kutusundaki değeri güncelle
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // "Ara" butonuna tıklandığında arama işlemini başlat
  const handleSearchSubmit = () => {
    setIsSearching(true);
  };

  return (
    <div className="google-search-simulator">
      <h1>Google Arama Simülasyonu</h1>
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Google'da Ara"
          className="search-input"
        />
        <button
          onClick={handleSearchSubmit}
          className="search-button"
          disabled={!searchTerm}
        >
          Ara
        </button>
      </div>
      {isSearching && <p>Arama yapılıyor...</p>}
    </div>
  );
};

export default GoogleSearchSimulator;
