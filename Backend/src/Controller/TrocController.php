<?php
// src/Controller/TrocController.php
namespace App\Controller;

use App\Entity\Troc;
use App\Repository\TrocRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/troc')]
class TrocController extends AbstractController
{
    #[Route('', name: 'troc_list', methods: ['GET'])]
    public function list(TrocRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        $trocs = $repo->findBy(['user' => $user]);
        return $this->json($trocs, 200, [], ['groups' => 'troc:read']);
    }

    #[Route('', name: 'troc_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        // TODO : Valider $data (ex: check champs obligatoires)

        $troc = new Troc();
        $troc->setUser($user);

        // Exemple : adapter selon la structure Troc
        if (isset($data['serviceGiven'])) {
            $troc->setServiceGiven($data['serviceGiven']);
        }
        if (isset($data['serviceReceived'])) {
            $troc->setServiceReceived($data['serviceReceived']);
        }
        if (isset($data['partner'])) {
            $troc->setPartner($data['partner']);
        }
        if (isset($data['date'])) {
            $troc->setDate(new \DateTime($data['date']));
        }
        if (isset($data['status'])) {
            $troc->setStatus($data['status']);
        }

        $em->persist($troc);
        $em->flush();

        return $this->json($troc, 201, [], ['groups' => 'troc:read']);
    }

    #[Route('/{id}', name: 'troc_delete', methods: ['DELETE'])]
    public function delete(int $id, TrocRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $troc = $repo->find($id);

        if (!$troc || $troc->getUser() !== $user) {
            return $this->json(['error' => 'Not found or access denied'], 404);
        }

        $em->remove($troc);
        $em->flush();

        return $this->json(null, 204);
    }

    // Tu peux ajouter update ou details si nécessaire
}
