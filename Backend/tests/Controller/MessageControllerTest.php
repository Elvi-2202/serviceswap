<?php

namespace App\Tests\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Entity\Service;
use App\Entity\Categorie;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class MessageControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $messageRepository;
    private EntityRepository $userRepository;
    private EntityRepository $serviceRepository;
    private EntityRepository $categorieRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private string $path = '/api/message'; // Chemin de l'API
    private ?string $authToken = null;
    private ?User $testUser = null;
    private ?Service $testService = null;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->manager = static::getContainer()->get('doctrine')->getManager();
        $this->messageRepository = $this->manager->getRepository(Message::class);
        $this->userRepository = $this->manager->getRepository(User::class);
        $this->serviceRepository = $this->manager->getRepository(Service::class);
        $this->categorieRepository = $this->manager->getRepository(Categorie::class);
        $this->passwordHasher = static::getContainer()->get('security.user_password_hasher');

        // Nettoyage de la base de données dans l'ordre inverse des dépendances
        // L'ordre a été corrigé ici pour éviter l'erreur "Column not found"
        foreach ($this->messageRepository->findAll() as $object) {
            $this->manager->remove($object);
        }
        foreach ($this->serviceRepository->findAll() as $object) {
            $this->manager->remove($object);
        }
        foreach ($this->categorieRepository->findAll() as $object) {
            $this->manager->remove($object);
        }
        foreach ($this->userRepository->findAll() as $object) {
            $this->manager->remove($object);
        }
        $this->manager->flush();

        // Création des dépendances pour les tests
        $this->testUser = new User();
        $this->testUser->setEmail('test_user_msg_' . uniqid() . '@example.com');
        $this->testUser->setPseudo('test_msg_user');
        $this->testUser->setLocalisation('TestLoc');
        $this->testUser->setDescription('TestDesc');
        $this->testUser->setPassword($this->passwordHasher->hashPassword($this->testUser, 'password'));
        $this->manager->persist($this->testUser);

        $categorie = new Categorie();
        $categorie->setName('Test Catégorie ' . uniqid());
        $this->manager->persist($categorie);

        $this->testService = new Service();
        $this->testService->setTitre('Test Service ' . uniqid());
        $this->testService->setDescription('Test Description');
        $this->testService->setStatut('actif');
        $this->testService->setUser($this->testUser);
        $this->testService->setCategory($categorie);
        $this->manager->persist($this->testService);

        $this->manager->flush();

        // Récupération du jeton JWT pour l'authentification
        $this->authToken = $this->getJwtToken($this->client, $this->testUser->getEmail(), 'password');
    }

    private function getJwtToken(KernelBrowser $client, string $email, string $password): ?string
    {
        $client->request(
            Request::METHOD_POST,
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => $email,
                'password' => $password,
            ])
        );

        $response = $client->getResponse();
        $data = json_decode($response->getContent(), true);

        self::assertResponseIsSuccessful('Échec de l\'obtention du jeton JWT : ' . ($data['message'] ?? $response->getContent()));
        self::assertArrayHasKey('token', $data, 'Jeton JWT non trouvé dans la réponse.');

        return $data['token'] ?? null;
    }

    private function getAuthenticatedClient(): KernelBrowser
    {
        if ($this->authToken) {
            $this->client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $this->authToken));
        }
        return $this->client;
    }

    public function testIndex(): void
    {
        $fixture = new Message();
        $fixture->setContent('Ceci est un message de test.');
        $fixture->setCreatedAt(new \DateTimeImmutable());
        $fixture->setUser($this->testUser);
        $fixture->setService($this->testService);
        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->getAuthenticatedClient()->request(Request::METHOD_GET, $this->path);

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        self::assertIsArray($responseData);
        self::assertCount(1, $responseData);
        self::assertArrayHasKey('id', $responseData[0]);
        self::assertArrayHasKey('content', $responseData[0]);
        self::assertArrayHasKey('createdAt', $responseData[0]);
        self::assertArrayHasKey('user', $responseData[0]);
        self::assertArrayHasKey('service', $responseData[0]);
        self::assertSame('Ceci est un message de test.', $responseData[0]['content']);
        self::assertSame($this->testUser->getId(), $responseData[0]['user']['id']);
        self::assertSame($this->testService->getId(), $responseData[0]['service']['id']);
    }

    public function testNew(): void
    {
        $payload = [
            'content' => 'Nouveau message API.',
            'user_id' => $this->testUser->getId(),
            'service_id' => $this->testService->getId(),
            // 'createdAt' n'est pas nécessaire si le contrôleur le définit automatiquement
        ];

        $this->getAuthenticatedClient()->request(
            Request::METHOD_POST,
            $this->path,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
        self::assertResponseFormatSame('json');
        
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        self::assertArrayHasKey('id', $responseData);
        self::assertArrayHasKey('content', $responseData);
        self::assertArrayHasKey('createdAt', $responseData);
        self::assertArrayHasKey('user', $responseData);
        self::assertArrayHasKey('service', $responseData);
        self::assertSame($payload['content'], $responseData['content']);
        self::assertSame($this->testUser->getId(), $responseData['user']['id']);
        self::assertSame($this->testService->getId(), $responseData['service']['id']);

        self::assertSame(1, $this->messageRepository->count([]));
    }

    public function testShow(): void
    {
        $fixture = new Message();
        $fixture->setContent('A tester.');
        $fixture->setCreatedAt(new \DateTimeImmutable());
        $fixture->setUser($this->testUser);
        $fixture->setService($this->testService);
        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->getAuthenticatedClient()->request(Request::METHOD_GET, sprintf('%s/%s', $this->path, $fixture->getId()));

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        self::assertArrayHasKey('id', $responseData);
        self::assertArrayHasKey('content', $responseData);
        self::assertArrayHasKey('createdAt', $responseData);
        self::assertArrayHasKey('user', $responseData);
        self::assertArrayHasKey('service', $responseData);
        self::assertSame($fixture->getId(), $responseData['id']);
        self::assertSame($fixture->getContent(), $responseData['content']);
        self::assertSame($this->testUser->getId(), $responseData['user']['id']);
        self::assertSame($this->testService->getId(), $responseData['service']['id']);
    }

    public function testEdit(): void
    {
        $fixture = new Message();
        $fixture->setContent('Ancien contenu.');
        $fixture->setCreatedAt(new \DateTimeImmutable());
        $fixture->setUser($this->testUser);
        $fixture->setService($this->testService);
        $this->manager->persist($fixture);
        $this->manager->flush();

        $updatedPayload = [
            'content' => 'Nouveau contenu mis à jour.',
            'user_id' => $this->testUser->getId(), // Inclure si modifiable
            'service_id' => $this->testService->getId(), // Inclure si modifiable
        ];

        $this->getAuthenticatedClient()->request(
            Request::METHOD_PUT,
            sprintf('%s/%s', $this->path, $fixture->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($updatedPayload)
        );

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');

        $updatedMessage = $this->messageRepository->find($fixture->getId());
        self::assertNotNull($updatedMessage);
        self::assertSame($updatedPayload['content'], $updatedMessage->getContent());
    }

    public function testRemove(): void
    {
        $fixture = new Message();
        $fixture->setContent('À supprimer.');
        $fixture->setCreatedAt(new \DateTimeImmutable());
        $fixture->setUser($this->testUser);
        $fixture->setService($this->testService);
        $this->manager->persist($fixture);
        $this->manager->flush();

        $messageId = $fixture->getId();

        $this->getAuthenticatedClient()->request(
            Request::METHOD_DELETE,
            sprintf('%s/%s', $this->path, $messageId)
        );

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        $deletedMessage = $this->messageRepository->find($messageId);
        self::assertNull($deletedMessage, 'Le message doit être null après suppression.');
        self::assertSame(0, $this->messageRepository->count([]), 'Le nombre de messages doit être 0 après suppression.');
    }
}