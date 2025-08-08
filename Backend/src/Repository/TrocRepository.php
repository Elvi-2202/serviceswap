<?php

namespace App\Repository;

use App\Entity\Troc;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Troc>
 *
 * @method Troc|null find($id, $lockMode = null, $lockVersion = null)
 * @method Troc|null findOneBy(array $criteria, array $orderBy = null)
 * @method Troc[]    findAll()
 * @method Troc[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrocRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Troc::class);
    }

    /**
     * Trouve tous les trocs pour un utilisateur donné, ordonnés par date décroissante
     *
     * @param int $userId
     * @return Troc[]
     */
    public function findByUser(int $userId): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.user = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('t.date', 'DESC')
            ->getQuery()
            ->getResult();
    }

    // Ajoute ici des méthodes personnalisées pour rechercher/filter si nécessaire
}
