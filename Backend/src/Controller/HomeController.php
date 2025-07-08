<?php

// src/Controller/Api/HomeController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class HomeController extends AbstractController
{
    #[Route('/home', name: 'api_home', methods: ['GET'])]
    public function index(): JsonResponse
    {
        // Vérifie que l'utilisateur est authentifié
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // Données correspondant à votre page React
        $services = [
            [
                'name' => 'Paul',
                'rating' => 4,
                'color' => "#5DA271",
                'services' => ["2h de ménage", "Réparation sèche cheveux"]
            ],
            [
                'name' => 'Laurie', 
                'rating' => 5,
                'color' => "#F79CA8",
                'services' => ["Coupe de cheveux h/f", "2h garde de chat à domicile"]
            ],
            [
                'name' => 'Kevin',
                'rating' => 5,
                'color' => "#9DAAF2",
                'services' => ["Petit frigo en bon état", "2h de aide pour déménagement"]
            ]
        ];

        return $this->json([
            'services' => $services,
            'accent_color' => "#CF6B4D",
            'header_bg' => "#1D1E22"
        ]);
    }
}