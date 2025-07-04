<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException; // Pour les erreurs de contrainte d'unicité

#[Route('/api/user')] // Base route pour l'API des utilisateurs
final class UserController extends AbstractController
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager // Injecté ici pour une meilleure cohérence
    ) {
    }

    /**
     * Récupère la liste de tous les utilisateurs.
     */
    #[Route('', name: 'app_user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        // Le 4ème argument est le contexte de sérialisation (groupes, max_depth, etc.)
        return $this->json($users, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }

    /**
     * Crée un nouvel utilisateur à partir des données JSON de la requête.
     */
    #[Route('/user_create', name: 'app_user_create', methods: ['POST'])] // Changé de /create_user à '' pour être plus RESTful
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérification de la validité du JSON et de sa structure de base
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
        }

        // Vérification des champs obligatoires avant hydratation pour des messages d'erreur plus clairs
        $requiredFields = ['pseudo', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return $this->json(['message' => "Missing required field: {$field}."], Response::HTTP_BAD_REQUEST);
            }
        }

        $user = new User();
        $user->setPseudo($data['pseudo']);
        $user->setEmail($data['email']);
        $user->setLocalisation($data['localisation'] ?? null); // Utilise null par défaut si non présent
        $user->setDescription($data['description'] ?? null);

        // Hachage du mot de passe
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data['password'])
        );

        // Définition des rôles (par défaut ROLE_USER si non fourni ou tableau vide)
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);

        // Validation de l'entité
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $formattedErrors = [];
            foreach ($errors as $error) {
                // Associe le message d'erreur à la propriété concernée
                $formattedErrors[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json([
                'message' => 'Validation failed',
                'errors' => $formattedErrors
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $e) {
            // Gérer spécifiquement l'erreur d'email déjà utilisé
            return $this->json(['message' => 'User with this email already exists.', 'field' => 'email'], Response::HTTP_CONFLICT); // 409 Conflict
        } catch (\Exception $e) {
            // Gérer les autres erreurs de base de données
            // En production, ne pas exposer le message exact de l'exception
            return $this->json(['message' => 'An error occurred while creating the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Retourne la ressource créée avec le statut 201 Created
        return $this->json($user, Response::HTTP_CREATED, [], ['groups' => 'user:read']);
    }

    /**
     * Affiche les détails d'un utilisateur spécifique.
     * Le ParamConverter de Symfony gère le 404 si l'ID n'existe pas.
     */
    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }

    /**
     * Met à jour un utilisateur existant avec les données JSON de la requête.
     */
    #[Route('/{id}', name: 'app_user_update', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, User $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
        }

        // Mise à jour des champs si présents dans la requête
        if (isset($data['pseudo'])) {
            $user->setPseudo($data['pseudo']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['localisation'])) {
            $user->setLocalisation($data['localisation']);
        }
        // Utilise array_key_exists pour permettre de définir la description à null explicitement
        if (array_key_exists('description', $data)) {
            $user->setDescription($data['description']);
        }
        if (isset($data['password']) && !empty($data['password'])) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $data['password'])
            );
        }
        // Mise à jour des rôles si présents
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        // Validation de l'entité après mise à jour
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
            return $this->json(['message' => 'User with this email already exists.', 'field' => 'email'], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while updating the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Retourne la ressource mise à jour avec le statut 200 OK
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }

    /**
     * Supprime un utilisateur.
     * Le ParamConverter de Symfony gère le 404 si l'ID n'existe pas.
     */
    #[Route('/{id}', name: 'app_user_delete', methods: ['DELETE'])]
    public function delete(User $user): JsonResponse
    {
        try {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while deleting the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Retourne un statut 204 No Content pour une suppression réussie sans corps de réponse
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}