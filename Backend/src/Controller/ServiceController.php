<?php

namespace App\Controller;

use App\Entity\Service;
use App\Entity\Categorie;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/services')]
class ServiceController extends AbstractController
{
    // Lister tous les services avec possibilité de filtrage via query params
    #[Route('', name: 'api_services_index', methods: ['GET'])]
    public function index(Request $request, ServiceRepository $serviceRepository): JsonResponse
    {
        // Récupération des filtres depuis les paramètres d'URL
        $categories = $request->query->get('category'); // peut être tableau ou string
        if ($categories && !is_array($categories)) {
            $categories = [$categories];
        }

        $filters = [
            'categories' => $categories ?? [],
            'statut' => $request->query->get('statut'),
            'keyword' => $request->query->get('keyword'),
            'dateFrom' => $request->query->get('dateFrom'),
            'dateTo' => $request->query->get('dateTo'),
        ];

        $services = $serviceRepository->findWithFilters($filters);

        $data = [];

        foreach ($services as $service) {
            $data[] = [
                'id' => $service->getId(),
                'titre' => $service->getTitre(),
                'description' => $service->getDescription(),
                'statut' => $service->getStatut(),
                'createdAt' => $service->getCreatedAt()?->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $service->getUser()?->getId(),
                    'pseudo' => $service->getUser()?->getPseudo(),
                ],
                'category' => [
                    'id' => $service->getCategory()?->getId(),
                    'name' => $service->getCategory()?->getName(),
                ],
            ];
        }

        return $this->json($data);
    }


    // Créer un nouveau service
    #[Route('', name: 'api_services_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['titre'], $data['description'], $data['statut'], $data['category'])) {
            return $this->json(['error' => 'Champs manquants'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $category = $em->getRepository(Categorie::class)->find($data['category']);
        if (!$category) {
            return $this->json(['error' => 'Catégorie invalide'], Response::HTTP_NOT_FOUND);
        }

        $service = new Service();
        $service->setTitre($data['titre']);
        $service->setDescription($data['description']);
        $service->setStatut($data['statut']);
        $service->setUser($user);
        $service->setCategory($category);

        $em->persist($service);
        $em->flush();

        return $this->json([
            'message' => 'Service ajouté avec succès',
            'id' => $service->getId()
        ], Response::HTTP_CREATED);
    }


    // Afficher un service spécifique
    #[Route('/{id}', name: 'api_services_show', methods: ['GET'])]
    public function show(Service $service): JsonResponse
    {
        return $this->json([
            'id' => $service->getId(),
            'titre' => $service->getTitre(),
            'description' => $service->getDescription(),
            'statut' => $service->getStatut(),
            'user' => [
                'id' => $service->getUser()?->getId(),
                'pseudo' => $service->getUser()?->getPseudo(),
            ],
            'category' => [
                'id' => $service->getCategory()?->getId(),
                'name' => $service->getCategory()?->getName(),
            ],
        ]);
    }


    // Mettre à jour un service existant
    #[Route('/{id}', name: 'api_services_update', methods: ['PUT'])]
    public function update(Request $request, Service $service, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if ($service->getUser() !== $user) {
            return $this->json(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        $service->setTitre($data['titre'] ?? $service->getTitre());
        $service->setDescription($data['description'] ?? $service->getDescription());
        $service->setStatut($data['statut'] ?? $service->getStatut());

        if (isset($data['category'])) {
            $category = $em->getRepository(Categorie::class)->find($data['category']);
            if (!$category) {
                return $this->json(['error' => 'Catégorie invalide'], Response::HTTP_NOT_FOUND);
            }
            $service->setCategory($category);
        }

        $em->flush();

        return $this->json(['message' => 'Service modifié avec succès']);
    }


    // Supprimer un service
    #[Route('/{id}', name: 'api_services_delete', methods: ['DELETE'])]
    public function delete(Service $service, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if ($service->getUser() !== $user) {
            return $this->json(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $em->remove($service);
        $em->flush();

        return $this->json(['message' => 'Service supprimé avec succès']);
    }
}
