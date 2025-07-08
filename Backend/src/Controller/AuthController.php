<?php

// src/Controller/AuthController.php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;
    private ValidatorInterface $validator;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
    }

    /**
     * @Route("/api/user/user_create", name="api_user_create", methods={"POST"})
     * // ... (la logique de création d'utilisateur est ici, elle n'est pas modifiée)
     */
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['pseudo'])) {
            return new JsonResponse(['message' => 'Email, password, and pseudo are required.'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPseudo($data['pseudo']);
        $user->setLocalisation($data['localisation'] ?? null);
        $user->setDescription($data['description'] ?? null);
        $user->setRoles(['ROLE_USER']);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['message' => 'Validation failed', 'errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'Duplicate entry') || str_contains($e->getMessage(), 'SQLSTATE[23000]')) {
                return new JsonResponse(['message' => 'User with this email or pseudo already exists.'], Response::HTTP_CONFLICT);
            }
            return new JsonResponse(['message' => 'Could not create user due to a server error.', 'error_detail' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['message' => 'User created successfully!'], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/login_check", name="api_login_check", methods={"POST"})
     * Ce endpoint est intercepté par LexikJWTAuthenticationBundle.
     * Vous n'avez PAS besoin d'écrire de logique ici.
     * Lexik va gérer l'authentification et retourner un JWT si successful.
     * Pour ce faire, il utilise la configuration 'json_login' dans security.yaml.
     */
    public function loginCheck(): JsonResponse
    {
        // Cette méthode ne sera jamais réellement exécutée car LexikJWTAuthenticationBundle
        // intercepte la requête avant qu'elle n'atteigne ce code.
        // Elle existe principalement pour que la route soit définie.
        // Si vous arrivez ici, c'est qu'il y a un problème de configuration.
        throw new \Exception('This code should not be reached. LexikJWTAuthenticationBundle handles the login.');
    }
}