// src/pages/Home.jsx
import React from "react";
import { Button, Typography } from "@mui/material";

const Home = () => {
  return (
    <div className="homepage">
      {/* Titre */}
      <Typography variant="h2" className="homepage-header">
        BIENVENUE SUR SERVICESWRAP
      </Typography>

      {/* Description */}
      <Typography variant="body1" className="homepage-description">
        Nous sommes une plateforme communautaire et entièrement à but non lucratif, où les utilisateurs peuvent échanger des services gratuitement dans leurs propres communautés. Il s’agit de réutiliser et d’éviter que de bonnes choses n’entrent aux décharges. L’adhésion est gratuite. Et maintenant, vous pouvez aussi créer votre propre cercle d’amis personnel, plus petit, pour offrir et prêter des services avec vos amis uniquement !
      </Typography>
      {/* Section des fonctionnalités */}
      <div className="homepage-features">
        <div className="homepage-feature">
          <h3>Échanger des services</h3>
          <p>Donnez et recevez des services gratuitement dans votre communauté.</p>
        </div>
        <div className="homepage-feature">
          <h3>Communauté locale</h3>
          <p>Connectez-vous avec des personnes près de chez vous.</p>
        </div>
        <div className="homepage-feature">
          <h3>Écologique</h3>
          <p>Réduisez les déchets en réutilisant ce qui est déjà disponible.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;