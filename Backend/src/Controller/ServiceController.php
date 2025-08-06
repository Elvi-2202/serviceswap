<?php

namespace App\Controller;

use App\Entity\Service;
use App\Entity\Categorie;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/services')]
class ServiceController extends AbstractController
{
    #[Route('', name: 'api_services_index', methods: ['GET'])]
    public function index(ServiceRepository $serviceRepository): JsonResponse
    {
        $services = $serviceRepository->findAll();

        $data = [];
        foreach ($services as $service) {
            $data[] = [
                'id' => $service->getId(),
                'titre' => $service->getTitre(),
                'description' => $service->getDescription(),
                'statut' => $service->getStatut(),
                'category' => [
                    'id' => $service->getCategory()?->getId(),
                    'name' => $service->getCategory()?->getName(),
                ],
                'user' => [
                    'id' => $service->getUser()?->getId(),
                    'pseudo' => $service->getUser()?->getPseudo(),
                ],
            ];
        }

        return $this->json($data);
    }

    #[Route('', name: 'api_services_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié.'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['titre'], $data['description'], $data['statut'], $data['category'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $category = $em->getRepository(Categorie::class)->find($data['category']);
        if (!$category) {
            return $this->json(['error' => 'Catégorie invalide'], 404);
        }

        $service = new Service();
        $service->setTitre($data['titre']);
        $service->setDescription($data['description']);
        $service->setStatut($data['statut']);
        $service->setCategory($category);
        $service->setUser($user); // Associer l'utilisateur connecté

        $em->persist($service);
        $em->flush();

        return $this->json([
            'message' => 'Service ajouté avec succès',
            'id' => $service->getId()
        ], 201);
    }

    #[Route('/{id}', name: 'api_services_show', methods: ['GET'])]
    public function show(Service $service): JsonResponse
    {
        return $this->json([
            'id' => $service->getId(),
            'titre' => $service->getTitre(),
            'description' => $service->getDescription(),
            'statut' => $service->getStatut(),
            'category' => [
                'id' => $service->getCategory()?->getId(),
                'name' => $service->getCategory()?->getName(),
            ],
            'user' => [
                'id' => $service->getUser()?->getId(),
                'pseudo' => $service->getUser()?->getPseudo(),
            ],
        ]);
    }

    #[Route('/{id}', name: 'api_services_update', methods: ['PUT'])]
    public function update(Request $request, Service $service, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'JSON invalide'], 400);
        }

        $service->setTitre($data['titre'] ?? $service->getTitre());
        $service->setDescription($data['description'] ?? $service->getDescription());
        $service->setStatut($data['statut'] ?? $service->getStatut());

        if (isset($data['category'])) {
            $category = $em->getRepository(Categorie::class)->find($data['category']);
            if (!$category) {
                return $this->json(['error' => 'Catégorie invalide'], 404);
            }
            $service->setCategory($category);
        }

        $em->flush();

        return $this->json(['message' => 'Service modifié avec succès']);
    }

    #[Route('/{id}', name: 'api_services_delete', methods: ['DELETE'])]
    public function delete(Service $service, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($service);
        $em->flush();

        return $this->json(['message' => 'Service supprimé avec succès']);
    }
}
