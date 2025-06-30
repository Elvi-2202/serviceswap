<?php

namespace App\Tests\Controller;

use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class ServiceControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $serviceRepository;
    private string $path = '/service/';

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->manager = static::getContainer()->get('doctrine')->getManager();
        $this->serviceRepository = $this->manager->getRepository(Service::class);

        foreach ($this->serviceRepository->findAll() as $object) {
            $this->manager->remove($object);
        }

        $this->manager->flush();
    }

    public function testIndex(): void
    {
        $this->client->followRedirects();
        $crawler = $this->client->request('GET', $this->path);

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('Service index');

        // Use the $crawler to perform additional assertions e.g.
        // self::assertSame('Some text on the page', $crawler->filter('.p')->first());
    }

    public function testNew(): void
    {
        $this->markTestIncomplete();
        $this->client->request('GET', sprintf('%snew', $this->path));

        self::assertResponseStatusCodeSame(200);

        $this->client->submitForm('Save', [
            'service[titre]' => 'Testing',
            'service[description]' => 'Testing',
            'service[catégorie]' => 'Testing',
            'service[statut]' => 'Testing',
        ]);

        self::assertResponseRedirects($this->path);

        self::assertSame(1, $this->serviceRepository->count([]));
    }

    public function testShow(): void
    {
        $this->markTestIncomplete();
        $fixture = new Service();
        $fixture->setTitre('My Title');
        $fixture->setDescription('My Title');
        $fixture->setCatégorie('My Title');
        $fixture->setStatut('My Title');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('Service');

        // Use assertions to check that the properties are properly displayed.
    }

    public function testEdit(): void
    {
        $this->markTestIncomplete();
        $fixture = new Service();
        $fixture->setTitre('Value');
        $fixture->setDescription('Value');
        $fixture->setCatégorie('Value');
        $fixture->setStatut('Value');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

        $this->client->submitForm('Update', [
            'service[titre]' => 'Something New',
            'service[description]' => 'Something New',
            'service[catégorie]' => 'Something New',
            'service[statut]' => 'Something New',
        ]);

        self::assertResponseRedirects('/service/');

        $fixture = $this->serviceRepository->findAll();

        self::assertSame('Something New', $fixture[0]->getTitre());
        self::assertSame('Something New', $fixture[0]->getDescription());
        self::assertSame('Something New', $fixture[0]->getCatégorie());
        self::assertSame('Something New', $fixture[0]->getStatut());
    }

    public function testRemove(): void
    {
        $this->markTestIncomplete();
        $fixture = new Service();
        $fixture->setTitre('Value');
        $fixture->setDescription('Value');
        $fixture->setCatégorie('Value');
        $fixture->setStatut('Value');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
        $this->client->submitForm('Delete');

        self::assertResponseRedirects('/service/');
        self::assertSame(0, $this->serviceRepository->count([]));
    }
}
