<?php

namespace App\Controller;

use App\Repository\ServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class HomeController extends AbstractController
{
    #[Route('/home', name: 'api_home', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function index(ServiceRepository $serviceRepository): JsonResponse
    {
        $servicesEntities = $serviceRepository->findAll();

        $services = [];
        foreach ($servicesEntities as $service) {
            $services[] = [
                'name' => $service->getUser()?->getPseudo() ?? 'Inconnu',
                'rating' => 5,
                'color' => "#5DA271",
                'service1' => $service->getTitre(),
                'service2' => $service->getDescription(),
                'description' => $service->getDescription(),
                'details' => "Détails du service...",
            ];
        }

        return $this->json([
            'services' => $services,
            'accent_color' => "#CF6B4D",
            'header_bg' => "#1D1E22",
        ]);
    }
}
