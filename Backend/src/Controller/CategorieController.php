<?php

namespace App\Controller;

use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/categorie')]
class CategorieController extends AbstractController
{
    #[Route('', name: 'api_categorie_index', methods: ['GET'])]
    public function index(CategorieRepository $categorieRepository): JsonResponse
    {
        $categories = $categorieRepository->findAll();

        $data = [];
        foreach ($categories as $categorie) {
            $data[] = [
                'id' => $categorie->getId(),
                'name' => $categorie->getName(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/new', name: 'api_categorie_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(['error' => 'Le champ "name" est requis.'], 400);
        }

        $categorie = new Categorie();
        $categorie->setName($data['name']);

        $entityManager->persist($categorie);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Catégorie créée avec succès.',
            'id' => $categorie->getId(),
            'name' => $categorie->getName()
        ], 201);
    }

    #[Route('/{id}', name: 'api_categorie_show', methods: ['GET'])]
    public function show(Categorie $categorie): JsonResponse
    {
        return new JsonResponse([
            'id' => $categorie->getId(),
            'name' => $categorie->getName()
        ]);
    }

    #[Route('/{id}/edit', name: 'api_categorie_edit', methods: ['PUT', 'PATCH'])]
    public function edit(Request $request, Categorie $categorie, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $categorie->setName($data['name']);
            $entityManager->flush();
        }

        return new JsonResponse([
            'message' => 'Catégorie mise à jour.',
            'id' => $categorie->getId(),
            'name' => $categorie->getName()
        ]);
    }

    #[Route('/{id}', name: 'api_categorie_delete', methods: ['DELETE'])]
    public function delete(Categorie $categorie, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($categorie);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Catégorie supprimée.']);
    }
}
