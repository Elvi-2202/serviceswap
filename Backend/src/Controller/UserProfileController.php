<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/user')]
#[IsGranted('ROLE_USER')]
class UserProfileController extends AbstractController
{
    // C'est la route la plus spécifique, elle doit venir en premier
    // GET /api/user/me - Profil utilisateur connecté
    #[Route('/me', name: 'app_user_profile_me', methods: ['GET'])]
    public function getMyProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'id'           => $user->getId(),
            'pseudo'       => $user->getPseudo(),
            'description'  => $user->getDescription(),
            'localisation' => $user->getLocalisation(),
            'email'        => $user->getEmail(),
            'roles'        => $user->getRoles(),
        ], Response::HTTP_OK);
    }
    
    // PUT /api/user/me - Mise à jour du profil connecté
    #[Route('/me', name: 'app_user_profile_update_me', methods: ['PUT'])]
    public function updateMyProfile(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Mise à jour des propriétés de l'utilisateur
        if (isset($data['pseudo'])) {
            $user->setPseudo($data['pseudo']);
        }
        if (isset($data['description'])) {
            $user->setDescription($data['description']);
        }
        if (isset($data['localisation'])) {
            $user->setLocalisation($data['localisation']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $messages], Response::HTTP_BAD_REQUEST);
        }

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès'], Response::HTTP_OK);
    }

    // LES ROUTES GÉNÉRIQUES AVEC '{id}' VIENNENT APRÈS
    // GET /api/user/{id} - Lire un profil quelconque
    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    public function getProfile(User $user): JsonResponse
    {
        return new JsonResponse([
            'id'           => $user->getId(),
            'pseudo'       => $user->getPseudo(),
            'description'  => $user->getDescription(),
            'localisation' => $user->getLocalisation(),
            'email'        => $user->getEmail(),
        ], Response::HTTP_OK);
    }

    // PUT /api/user/{id} - Modifier un profil, seulement pour le propriétaire
    #[Route('/{id}', name: 'app_user_update', methods: ['PUT'])]
    public function updateProfile(User $user, Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        if ($user !== $this->getUser()) {
            return new JsonResponse(['message' => 'Accès interdit.'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['pseudo'])) {
            $user->setPseudo($data['pseudo']);
        }
        if (isset($data['description'])) {
            $user->setDescription($data['description']);
        }
        if (isset($data['localisation'])) {
            $user->setLocalisation($data['localisation']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $messages], Response::HTTP_BAD_REQUEST);
        }

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès'], Response::HTTP_OK);
    }
}