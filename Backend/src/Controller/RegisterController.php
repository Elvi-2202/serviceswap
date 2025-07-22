<?php

// src/Controller/RegisterController.php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class RegisterController extends AbstractController
{
    #[Route('/api/signup', name: 'api_signup', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $pseudo = $data['pseudo'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$pseudo || !$email || !$password) {
            return new JsonResponse(['message' => 'Tous les champs sont requis.'], 400);
        }

        // Vérifie si l'utilisateur existe déjà
        if ($em->getRepository(User::class)->findOneBy(['email' => $email])) {
            return new JsonResponse(['message' => 'Cet email est déjà utilisé.'], 400);
        }

        $user = new User();
        $user->setPseudo($pseudo);
        $user->setEmail($email);
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        // Crée un token JWT pour l'utilisateur
        $token = $jwtManager->create($user);

        return new JsonResponse(['token' => $token], 201);
    }
}
