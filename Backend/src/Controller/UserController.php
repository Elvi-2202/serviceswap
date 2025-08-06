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
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

#[Route('/api/user')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'app_user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        return $this->json($users, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }

    #[Route('/user_create', name: 'app_user_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
        }

        $requiredFields = ['pseudo', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return $this->json(['message' => "Missing required field: {$field}."], Response::HTTP_BAD_REQUEST);
            }
        }

        $user = new User();
        $user->setPseudo($data['pseudo']);
        $user->setEmail($data['email']);
        $user->setLocalisation($data['localisation'] ?? null);
        $user->setDescription($data['description'] ?? null);

        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data['password'])
        );

        $user->setRoles($data['roles'] ?? ['ROLE_USER']);

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
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $e) {
            return $this->json(['message' => 'User with this email already exists.', 'field' => 'email'], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while creating the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($user, Response::HTTP_CREATED, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}', name: 'app_user_update', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, User $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
        }

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
        if (isset($data['password']) && !empty($data['password'])) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $data['password'])
            );
        }
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->setRoles($data['roles']);
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
            return $this->json(['message' => 'User with this email already exists.', 'field' => 'email'], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while updating the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}', name: 'app_user_delete', methods: ['DELETE'])]
    public function delete(User $user): JsonResponse
    {
        try {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred while deleting the user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
