// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Section 1 : À propos */}
      <div className="footer-section">
        <h3>À PROPOS</h3>
        <ul>
          <li><a href="/our-story">Notre histoire</a></li>
          <li><a href="/events">Événements</a></li>
          <li><a href="/retailers">Revendeurs</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/illustration-work">Travaux d'illustration</a></li>
        </ul>
      </div>

      {/* Section 2 : Service client */}
      <div className="footer-section">
        <h3>SERVICE CLIENT</h3>
        <ul>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/retailers">Revendeurs</a></li>
          <li><a href="/policies">Nos politiques</a></li>
          <li><a href="/wholesale">Vente en gros</a></li>
          <li><a href="/bulk-ordering">Commandes en volume</a></li>
        </ul>
      </div>

      {/* Section 3 : Newsletter */}
      <div className="footer-section">
        <h3>RESTEZ CONNECTÉ</h3>
        <form className="newsletter-form">
          <p>Inscrivez-vous à notre newsletter pour rester informé de nos actualités, nouveaux produits, offres spéciales, et obtenez 10% de réduction sur votre premier achat.</p>
          <input
            type="email"
            placeholder="Adresse e-mail"
            required
          />
          <button type="submit">S'inscrire</button>
        </form>
      </div>

      {/* Section 4 : Droits d'auteur */}
      <div className="footer-bottom">
        © 2023 ServicesWrap. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;