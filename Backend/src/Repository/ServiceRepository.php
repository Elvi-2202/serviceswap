<?php

namespace App\Repository;

use App\Entity\Service;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<Service>
 */
class ServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Service::class);
    }

    /**
     * Recherche des services avec filtres dynamiques.
     *
     * @param array $filters Exemples:
     *  [
     *    'categories' => [1,2,3],
     *    'statut' => 'Offered service',
     *    'userId' => 5,
     *    'keyword' => 'plomberie',
     *    'dateFrom' => '2023-08-01',
     *    'dateTo' => '2023-08-31',
     *  ]
     * @return Service[]
     */
    public function findWithFilters(array $filters = []): array
    {
        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.category', 'c')
            ->leftJoin('s.user', 'u')
            ->addSelect('c', 'u');

        if (!empty($filters['categories']) && is_array($filters['categories'])) {
            $qb->andWhere($qb->expr()->in('c.id', ':categories'))
               ->setParameter('categories', $filters['categories']);
        }

        if (!empty($filters['statut'])) {
            $qb->andWhere('s.statut = :statut')
               ->setParameter('statut', $filters['statut']);
        }

        if (!empty($filters['userId'])) {
            $qb->andWhere('u.id = :userId')
               ->setParameter('userId', $filters['userId']);
        }

        if (!empty($filters['keyword'])) {
            $qb->andWhere('s.titre LIKE :keyword OR s.description LIKE :keyword')
               ->setParameter('keyword', '%'.$filters['keyword'].'%');
        }

        if (!empty($filters['dateFrom'])) {
            $qb->andWhere('s.createdAt >= :dateFrom')
               ->setParameter('dateFrom', new \DateTime($filters['dateFrom']));
        }

        if (!empty($filters['dateTo'])) {
            $qb->andWhere('s.createdAt <= :dateTo')
               ->setParameter('dateTo', new \DateTime($filters['dateTo']));
        }

        $qb->orderBy('s.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }
}
