<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Entity\Service;
use App\Entity\Categorie;
use App\Entity\Message;
use App\Entity\Evaluation;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $userRepository;
    private EntityRepository $serviceRepository;
    private EntityRepository $categorieRepository;
    private EntityRepository $messageRepository;
    private EntityRepository $evaluationRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private string $path = '/api/user';
    private ?string $authToken = null;
    private ?User $testUser = null;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->manager = static::getContainer()->get('doctrine')->getManager();
        $this->userRepository = $this->manager->getRepository(User::class);
        $this->serviceRepository = $this->manager->getRepository(Service::class);
        $this->categorieRepository = $this->manager->getRepository(Categorie::class);
        $this->messageRepository = $this->manager->getRepository(Message::class);
        $this->evaluationRepository = $this->manager->getRepository(Evaluation::class);
        $this->passwordHasher = static::getContainer()->get('security.user_password_hasher');

        // Nettoyage dans l'ordre pour éviter erreurs de contraintes
        foreach ($this->messageRepository->findAll() as $obj) {
            $this->manager->remove($obj);
        }
        foreach ($this->evaluationRepository->findAll() as $obj) {
            $this->manager->remove($obj);
        }
        foreach ($this->serviceRepository->findAll() as $obj) {
            $this->manager->remove($obj);
        }
        foreach ($this->categorieRepository->findAll() as $obj) {
            $this->manager->remove($obj);
        }
        foreach ($this->userRepository->findAll() as $obj) {
            $this->manager->remove($obj);
        }
        $this->manager->flush();

        // Création d'un utilisateur test avec rôle
        $this->testUser = new User();
        $this->testUser->setEmail('test_user_for_auth' . uniqid() . '@example.com');
        $this->testUser->setPseudo('auth_user');
        $this->testUser->setLocalisation('TestLoc');
        $this->testUser->setDescription('TestDesc');
        $this->testUser->setRoles(['ROLE_USER']); // <- important pour auth JWT
        $this->testUser->setPassword($this->passwordHasher->hashPassword($this->testUser, 'password'));
        $this->manager->persist($this->testUser);
        $this->manager->flush();

        // Récupération du token JWT
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

        self::assertResponseIsSuccessful('Échec de l\'obtention du jeton JWT. ' . ($data['message'] ?? $response->getContent()));
        self::assertArrayHasKey('token', $data, 'Jeton JWT non disponible.');

        return $data['token'] ?? null;
    }

    private function getAuthenticatedClient(): KernelBrowser
    {
        if ($this->authToken) {
            $this->client->setServerParameter('HTTP_AUTHORIZATION', sprintf('Bearer %s', $this->authToken));
        }
        return $this->client;
    }

    public function testIndex(): void
    {
        // Création d'un utilisateur fixture
        $fixture = new User();
        $fixture->setPseudo('test_index_user');
        $fixture->setEmail('test_index_user' . uniqid() . '@example.com');
        $fixture->setLocalisation('TestLoc');
        $fixture->setDescription('TestDesc');
        $fixture->setRoles(['ROLE_USER']);
        $fixture->setPassword($this->passwordHasher->hashPassword($fixture, 'password'));
        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->getAuthenticatedClient()->request(Request::METHOD_GET, $this->path);

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');

        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        self::assertIsArray($responseData);
        // Au moins le user testUser + celui créé
        self::assertGreaterThanOrEqual(2, count($responseData));
    }

    public function testNew(): void
    {
        $payload = [
            'pseudo' => 'new_user',
            'email' => 'new_user' . uniqid() . '@example.com',
            'password' => 'new_password',
            'localisation' => 'NewLoc',
            'description' => 'NewDesc',
            'roles' => ['ROLE_USER'],
        ];

        $this->getAuthenticatedClient()->request(
            Request::METHOD_POST,
            $this->path . '/user_create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
        self::assertResponseFormatSame('json');

        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        self::assertArrayHasKey('id', $responseData);
        self::assertSame($payload['pseudo'], $responseData['pseudo']);

        self::assertGreaterThanOrEqual(2, $this->userRepository->count([]));
    }

    public function testShow(): void
    {
        $fixture = new User();
        $fixture->setPseudo('test_show_user');
        $fixture->setEmail('test_show_user' . uniqid() . '@example.com');
        $fixture->setRoles(['ROLE_USER']);
        $fixture->setPassword($this->passwordHasher->hashPassword($fixture, 'password'));
        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->getAuthenticatedClient()->request(Request::METHOD_GET, sprintf('%s/%s', $this->path, $fixture->getId()));

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');

        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        self::assertArrayHasKey('id', $responseData);
        self::assertSame($fixture->getId(), $responseData['id']);
        self::assertSame($fixture->getPseudo(), $responseData['pseudo']);
    }

    public function testEdit(): void
    {
        $fixture = new User();
        $fixture->setPseudo('test_edit_user');
        $fixture->setEmail('test_edit_user' . uniqid() . '@example.com');
        $fixture->setRoles(['ROLE_USER']);
        $fixture->setPassword($this->passwordHasher->hashPassword($fixture, 'password'));
        $this->manager->persist($fixture);
        $this->manager->flush();

        $updatedPayload = [
            'pseudo' => 'edited_user',
            'localisation' => 'EditedLoc',
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

        $updatedUser = $this->userRepository->find($fixture->getId());
        self::assertNotNull($updatedUser);
        self::assertSame('edited_user', $updatedUser->getPseudo());
        self::assertSame('EditedLoc', $updatedUser->getLocalisation());
    }

    public function testRemove(): void
    {
        $fixture = new User();
        $fixture->setPseudo('test_remove_user');
        $fixture->setEmail('test_remove_user' . uniqid() . '@example.com');
        $fixture->setRoles(['ROLE_USER']);
        $fixture->setPassword($this->passwordHasher->hashPassword($fixture, 'password'));
        $this->manager->persist($fixture);
        $this->manager->flush();

        $userId = $fixture->getId();

        $this->getAuthenticatedClient()->request(
            Request::METHOD_DELETE,
            sprintf('%s/%s', $this->path, $userId)
        );

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        $deletedUser = $this->userRepository->find($userId);
        self::assertNull($deletedUser, 'L\'utilisateur doit être null après suppression.');
        self::assertSame(1, $this->userRepository->count([]), 'Il ne doit rester que l\'utilisateur d\'authentification après suppression.');
    }
}
