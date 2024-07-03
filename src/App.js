import React from 'react';
import './App.css'; // Asegúrate de crear y ajustar los estilos en este archivo CSS

function App() {
return (
<div className="app-container">
<header className="navigation-tabs">
<div className="tab">Tab 1</div>
<div className="tab">Tab 2</div>
<div className="tab">Tab 3</div>
</header>
<main className="main-content">
<div className="left-section">
<div className="globe-icon">🌐</div>
<div className="cloud-graphics">☁️☁️</div>
<div className="user-profile">
<img src="avatar.png" alt="User Avatar" className="avatar" />
<div className="user-info">
<h2>Nombre del Usuario</h2>
<p>Descripción breve del usuario.</p>
</div>
</div>
</div>
<div className="center-section">
<div className="smartphone">
<img src="smartphone.png" alt="Smartphone" />
</div>
</div>
<div className="right-section">
<div className="geometric-shapes">🔷🔶</div>
<div className="office-items">
<div className="keyboard">⌨️</div>
<div className="mouse">🖱️</div>
</div>
</div>
</main>
</div>
);
}

export default App;