<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\Serializer\SerializerInterface;

// Ce contrôleur gère toutes les actions liées au profil de l'utilisateur connecté.
// L'annotation IsGranted garantit que seul un utilisateur authentifié peut y accéder.
#[Route('/api/profile')]
#[IsGranted('ROLE_USER')]
class ProfileController extends AbstractController
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager,
        private readonly SerializerInterface $serializer // Injection du service de sérialisation
    ) {
    }

    /**
     * Affiche le profil de l'utilisateur actuellement authentifié.
     */
    #[Route('', name: 'app_profile_show', methods: ['GET'])]
    public function show(): JsonResponse
    {
        // Récupère l'utilisateur connecté via la méthode de l'AbstractController.
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        // 💡 Correction : Utilise le sérialiseur pour renvoyer un JSON avec le groupe 'user:read'
        // Cela garantit que seules les propriétés annotées avec ce groupe sont incluses.
        $jsonContent = $this->serializer->serialize($user, 'json', ['groups' => 'user:read']);
        
        return new JsonResponse($jsonContent, Response::HTTP_OK, [], true);
    }

    /**
     * Met à jour le profil de l'utilisateur actuellement authentifié.
     * Les champs tels que les rôles ne sont pas modifiables ici pour des raisons de sécurité.
     */
    #[Route('', name: 'app_profile_update', methods: ['PUT', 'PATCH'])]
    public function update(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
        }

        // On met à jour uniquement les champs autorisés.
        if (isset($data['pseudo'])) {
            $user->setPseudo($data['pseudo']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['localisation'])) {
            $user->setLocalisation($data['localisation']);
        }
        if (array_key_exists('description', $data)) {
            $user->setDescription($data['description']);
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $formattedErrors = [];
            foreach ($errors as $error) {
                $formattedErrors[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json([
                'message' => 'Validation failed',
                'errors' => $formattedErrors
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $e) {
            return $this->json(['message' => 'This email is already in use.'], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while updating the profile.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // 💡 Correction : Utilise le sérialiseur pour renvoyer un JSON avec le groupe 'user:read'
        $jsonContent = $this->serializer->serialize($user, 'json', ['groups' => 'user:read']);
        
        return new JsonResponse($jsonContent, Response::HTTP_OK, [], true);
    }

    /**
     * Gère la suppression du compte de l'utilisateur actuellement authentifié.
     */
    #[Route('', name: 'app_profile_delete', methods: ['DELETE'])]
    public function delete(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while deleting the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['message' => 'Account deleted successfully.'], Response::HTTP_NO_CONTENT);
    }

    /**
     * Gère le changement de mot de passe de l'utilisateur connecté.
     */
    #[Route('/change-password', name: 'app_profile_change_password', methods: ['PATCH'])]
    public function changePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data) || !isset($data['new_password'])) {
            return $this->json(['message' => 'Invalid JSON body or new_password field missing.'], Response::HTTP_BAD_REQUEST);
        }

        // On s'assure que le mot de passe n'est pas vide
        if (empty($data['new_password'])) {
            return $this->json(['message' => 'Password cannot be empty.'], Response::HTTP_BAD_REQUEST);
        }

        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data['new_password'])
        );

        // On valide uniquement le champ du mot de passe
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $formattedErrors = [];
            foreach ($errors as $error) {
                if ($error->getPropertyPath() === 'password') {
                    $formattedErrors['new_password'] = $error->getMessage();
                }
            }
            return $this->json([
                'message' => 'Validation failed',
                'errors' => $formattedErrors
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while changing the password.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['message' => 'Password updated successfully.'], Response::HTTP_OK);
    }
}
