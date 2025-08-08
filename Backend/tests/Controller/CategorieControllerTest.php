<?php

namespace App\Tests\Controller;

use App\Entity\Categorie;
use App\Entity\User;
use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class CategorieControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $categorieRepository;
    private EntityRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private string $path = '/api/categorie';
    private ?string $authToken = null;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->manager = static::getContainer()->get('doctrine')->getManager();
        $this->categorieRepository = $this->manager->getRepository(Categorie::class);
        $this->userRepository = $this->manager->getRepository(User::class);
        $this->passwordHasher = static::getContainer()->get('security.user_password_hasher');

        // Nettoyage de la base de données : L'ORDRE EST CRUCIAL pour les contraintes de clé étrangère
        foreach ($this->manager->getRepository(Service::class)->findAll() as $service) {
            $this->manager->remove($service);
        }
        $this->manager->flush();

        foreach ($this->categorieRepository->findAll() as $object) {
            $this->manager->remove($object);
        }
        $this->manager->flush();

        foreach ($this->userRepository->findAll() as $user) {
            $this->manager->remove($user);
        }
        $this->manager->flush();

        $user = new User();
        $user->setEmail('auth_user_' . uniqid() . '@example.com');
        $user->setPseudo('auth_pseudo_' . uniqid());
        $user->setLocalisation('AuthLoc');
        $user->setDescription('AuthDesc');
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'password');
        $user->setPassword($hashedPassword);
        $this->manager->persist($user);
        $this->manager->flush();

        $this->authToken = $this->getJwtToken($this->client, $user->getEmail(), 'password');
    }

    private function getAuthenticatedClient(): KernelBrowser
    {
        if ($this->authToken) {
            $this->client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $this->authToken));
        }
        return $this->client;
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

        return $data['token'];
    }

    public function testIndex(): void
    {
        $authenticatedClient = $this->getAuthenticatedClient();
        $authenticatedClient->request('GET', $this->path);

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');
        $responseData = json_decode($authenticatedClient->getResponse()->getContent(), true);
        self::assertIsArray($responseData);
        self::assertEmpty($responseData);
    }

    public function testNew(): void
    {
        $payload = [
            'name' => 'Testing Category ' . uniqid(),
        ];

        $authenticatedClient = $this->getAuthenticatedClient();
        $authenticatedClient->request(
            Request::METHOD_POST,
            sprintf('%s/new', $this->path),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        self::assertResponseStatusCodeSame(201);
        self::assertResponseFormatSame('json');

        $responseData = json_decode($authenticatedClient->getResponse()->getContent(), true);
        self::assertArrayHasKey('id', $responseData);
        self::assertSame($payload['name'], $responseData['name']);

        self::assertSame(1, $this->categorieRepository->count([]));
        $createdCategory = $this->categorieRepository->findOneBy(['name' => $payload['name']]);
        self::assertNotNull($createdCategory);
        self::assertSame($payload['name'], $createdCategory->getName());
    }

    public function testShow(): void
    {
        $fixture = new Categorie();
        $fixture->setName('My Title');
        $this->manager->persist($fixture);
        $this->manager->flush();

        $authenticatedClient = $this->getAuthenticatedClient();
        $authenticatedClient->request('GET', sprintf('%s/%s', $this->path, $fixture->getId()));

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');

        $responseData = json_decode($authenticatedClient->getResponse()->getContent(), true);
        self::assertArrayHasKey('id', $responseData);
        self::assertSame($fixture->getId(), $responseData['id']);
        self::assertSame($fixture->getName(), $responseData['name']);
    }

    public function testEdit(): void
    {
        $fixture = new Categorie();
        $fixture->setName('Value');
        $this->manager->persist($fixture);
        $this->manager->flush();

        $updatedPayload = [
            'name' => 'Something New',
        ];

        $authenticatedClient = $this->getAuthenticatedClient();
        $authenticatedClient->request(
            Request::METHOD_PUT,
            sprintf('%s/%s/edit', $this->path, $fixture->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($updatedPayload)
        );

        self::assertResponseIsSuccessful();
        self::assertResponseFormatSame('json');

        // Correction : Recharger l'entité depuis la base de données au lieu de rafraîchir une entité potentiellement détachée
        $updatedCategory = $this->categorieRepository->find($fixture->getId());
        self::assertNotNull($updatedCategory, 'La catégorie mise à jour doit exister.');
        
        self::assertSame($updatedPayload['name'], $updatedCategory->getName());
    }

    public function testRemove(): void
    {
        $fixture = new Categorie();
        $fixture->setName('Value');
        $this->manager->persist($fixture);
        $this->manager->flush();

        $categoryId = $fixture->getId();

        $authenticatedClient = $this->getAuthenticatedClient();
        $authenticatedClient->request(
            Request::METHOD_DELETE,
            sprintf('%s/%s', $this->path, $categoryId)
        );

        // Correction : S'attendre à un code 200 OK avec un message, au lieu de 204 No Content
        self::assertResponseStatusCodeSame(200);
        self::assertResponseFormatSame('json');
        $responseData = json_decode($authenticatedClient->getResponse()->getContent(), true);
        self::assertArrayHasKey('message', $responseData);
        self::assertSame('Catégorie supprimée.', $responseData['message']);

        $deletedCategory = $this->categorieRepository->find($categoryId);
        self::assertNull($deletedCategory, 'La catégorie doit être null après suppression.');
        self::assertSame(0, $this->categorieRepository->count([]));
    }
}
