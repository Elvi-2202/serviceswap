<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Entity\Service;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/message')]
class MessageController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly MessageRepository $messageRepository,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly UserRepository $userRepository,
        private readonly ServiceRepository $serviceRepository // Rendu non-nullable si la relation est obligatoire
    ) {}

    #[Route('', name: 'app_api_message_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $messages = $this->messageRepository->findAll();

        return $this->json($messages, Response::HTTP_OK, [], ['groups' => 'message:read']);
    }

    #[Route('', name: 'app_api_message_new', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function new(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
                return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
            }

            // Désérialiser les champs simples
            /** @var Message $message */
            $message = $this->serializer->deserialize(
                $request->getContent(), 
                Message::class, 
                'json', 
                ['groups' => 'message:write']
            );

            // Gérer la relation User
            if (isset($data['user_id'])) {
                $user = $this->userRepository->find($data['user_id']);
                if (!$user) {
                    return $this->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
                }
                $message->setUser($user);
            } else {
                return $this->json(['message' => 'Missing user_id for message.'], Response::HTTP_BAD_REQUEST);
            }

            // Gérer la relation Service
            if (isset($data['service_id'])) {
                $service = $this->serviceRepository->find($data['service_id']);
                if (!$service) {
                    return $this->json(['message' => 'Service not found.'], Response::HTTP_NOT_FOUND);
                }
                $message->setService($service);
            } else {
                return $this->json(['message' => 'Missing service_id for message.'], Response::HTTP_BAD_REQUEST);
            }

            // Si createdAt n'est pas fourni, initialisez-le
            if (!$message->getCreatedAt()) {
                $message->setCreatedAt(new \DateTimeImmutable());
            }
            
            // Valider l'entité
            $errors = $this->validator->validate($message);
            if (count($errors) > 0) {
                $formattedErrors = [];
                foreach ($errors as $error) {
                    $formattedErrors[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['message' => 'Validation failed', 'errors' => $formattedErrors], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->persist($message);
            $this->entityManager->flush();

            return $this->json($message, Response::HTTP_CREATED, [], ['groups' => 'message:read']);

        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'app_api_message_show', methods: ['GET'])]
    public function show(Message $message): JsonResponse
    {
        return $this->json($message, Response::HTTP_OK, [], ['groups' => 'message:read']);
    }

    #[Route('/{id}', name: 'app_api_message_edit', methods: ['PUT', 'PATCH'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function edit(Request $request, Message $message): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
                return $this->json(['message' => 'Invalid JSON body.'], Response::HTTP_BAD_REQUEST);
            }

            // Désérialiser les champs simples et mettre à jour l'objet existant
            $this->serializer->deserialize($request->getContent(), Message::class, 'json', [
                AbstractNormalizer::OBJECT_TO_POPULATE => $message,
                'groups' => 'message:write',
            ]);

            // Gérer la relation User si elle est modifiable via l'API
            if (isset($data['user_id'])) {
                $user = $this->userRepository->find($data['user_id']);
                if (!$user) {
                    return $this->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
                }
                $message->setUser($user);
            }

            // Gérer la relation Service
            if (isset($data['service_id'])) {
                $service = $this->serviceRepository->find($data['service_id']);
                if (!$service) {
                    return $this->json(['message' => 'Service not found.'], Response::HTTP_NOT_FOUND);
                }
                $message->setService($service);
            }

            // Valider l'entité mise à jour
            $errors = $this->validator->validate($message);
            if (count($errors) > 0) {
                $formattedErrors = [];
                foreach ($errors as $error) {
                    $formattedErrors[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['message' => 'Validation failed', 'errors' => $formattedErrors], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->flush();

            return $this->json($message, Response::HTTP_OK, [], ['groups' => 'message:read']);
        
        } catch (\Exception $e) {
            return $this->json(['message' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'app_api_message_delete', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function delete(Message $message): JsonResponse
    {
        $this->entityManager->remove($message);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
