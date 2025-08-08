<?php

namespace App\Tests\Controller;

use App\Entity\Service;
use App\Entity\User;
use App\Entity\Categorie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ServiceControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $entityManager;
    private string $token;
    private User $testUser;
    private Categorie $testCategory;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $container = static::getContainer();
        
        $this->entityManager = $container->get('doctrine')->getManager();
        $passwordHasher = $container->get('security.user_password_hasher');

        // Nettoyer la base de données
        $this->cleanDatabase();

        // Créer un utilisateur de test
        $this->testUser = new User();
        $this->testUser->setEmail('testuser@example.com');
        $this->testUser->setPseudo('testuser');
        $this->testUser->setPassword($passwordHasher->hashPassword($this->testUser, 'password'));
        $this->testUser->setRoles(['ROLE_USER']);
        $this->entityManager->persist($this->testUser);

        // Créer une catégorie de test
        $this->testCategory = new Categorie();
        $this->testCategory->setName('Test Category');
        $this->entityManager->persist($this->testCategory);

        $this->entityManager->flush();

        // Obtenir le token JWT
        $this->token = $this->getJwtToken();
    }

    private function cleanDatabase(): void
    {
        $connection = $this->entityManager->getConnection();
        $platform = $connection->getDatabasePlatform();
        
        // Vérification du type de base de données sans utiliser getName()
        if ($platform instanceof \Doctrine\DBAL\Platforms\MySQLPlatform) {
            $connection->executeQuery('SET FOREIGN_KEY_CHECKS=0');
        }

        $tables = ['service', 'categorie', 'user'];
        foreach ($tables as $table) {
            $connection->executeQuery("DELETE FROM $table");
        }

        if ($platform instanceof \Doctrine\DBAL\Platforms\MySQLPlatform) {
            $connection->executeQuery('SET FOREIGN_KEY_CHECKS=1');
        }
    }

    private function getJwtToken(): string
    {
        $this->client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'testuser@example.com',
                'password' => 'password'
            ])
        );

        $response = $this->client->getResponse();
        $data = json_decode($response->getContent(), true);

        if (!isset($data['token'])) {
            throw new \RuntimeException('Token not received: ' . $response->getContent());
        }

        return $data['token'];
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->entityManager->close();
    }

    public function testIndexApi(): void
    {
        $service = new Service();
        $service->setTitre('Test Service');
        $service->setDescription('Description');
        $service->setStatut('actif');
        $service->setUser($this->testUser);
        $service->setCategory($this->testCategory);
        $this->entityManager->persist($service);
        $this->entityManager->flush();

        $this->client->request(
            'GET',
            '/api/services',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
                'CONTENT_TYPE' => 'application/json'
            ]
        );

        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertNotEmpty($response);
        $this->assertEquals('Test Service', $response[0]['titre']);
    }

    public function testCreateServiceApi(): void
    {
        $this->client->request(
            'POST',
            '/api/services',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
                'CONTENT_TYPE' => 'application/json'
            ],
            json_encode([
                'titre' => 'New Service',
                'description' => 'New Description',
                'statut' => 'actif',
                'category' => $this->testCategory->getId()
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals('Service ajouté avec succès', $response['message']);
    }

    public function testShowApi(): void
    {
        $service = new Service();
        $service->setTitre('Test Show');
        $service->setDescription('Description');
        $service->setStatut('actif');
        $service->setUser($this->testUser);
        $service->setCategory($this->testCategory);
        $this->entityManager->persist($service);
        $this->entityManager->flush();

        $this->client->request(
            'GET',
            '/api/services/'.$service->getId(),
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
                'CONTENT_TYPE' => 'application/json'
            ]
        );

        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals('Test Show', $response['titre']);
    }

    public function testEditApi(): void
    {
        $service = new Service();
        $service->setTitre('Before Edit');
        $service->setDescription('Description');
        $service->setStatut('actif');
        $service->setUser($this->testUser);
        $service->setCategory($this->testCategory);
        $this->entityManager->persist($service);
        $this->entityManager->flush();
        $serviceId = $service->getId();

        $this->entityManager->clear(); // Important pour éviter l'erreur "Entity is not managed"

        $this->client->request(
            'PUT',
            '/api/services/'.$serviceId,
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
                'CONTENT_TYPE' => 'application/json'
            ],
            json_encode([
                'titre' => 'After Edit',
                'description' => 'Updated Description',
                'statut' => 'inactif'
            ])
        );

        $this->assertResponseIsSuccessful();
        
        // Recharger l'entité depuis la base
        $updatedService = $this->entityManager->getRepository(Service::class)->find($serviceId);
        $this->assertEquals('After Edit', $updatedService->getTitre());
        $this->assertEquals('Updated Description', $updatedService->getDescription());
        $this->assertEquals('inactif', $updatedService->getStatut());
    }

    public function testRemoveApi(): void
    {
        $service = new Service();
        $service->setTitre('To Delete');
        $service->setDescription('Description');
        $service->setStatut('actif');
        $service->setUser($this->testUser);
        $service->setCategory($this->testCategory);
        $this->entityManager->persist($service);
        $this->entityManager->flush();
        $id = $service->getId();

        $this->client->request(
            'DELETE',
            '/api/services/'.$id,
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
                'CONTENT_TYPE' => 'application/json'
            ]
        );

        $this->assertResponseIsSuccessful();
        $this->assertNull($this->entityManager->getRepository(Service::class)->find($id));
    }
}