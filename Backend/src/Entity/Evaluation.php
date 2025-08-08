<?php
// src/Entity/Evaluation.php

namespace App\Entity;

use App\Repository\EvaluationRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EvaluationRepository::class)]
class Evaluation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['evaluation:read', 'service:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['evaluation:read', 'evaluation:write'])]
    private ?int $score = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['evaluation:read', 'evaluation:write'])]
    private ?string $comment = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'evaluations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['evaluation:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Service::class, inversedBy: 'evaluations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['evaluation:read'])]
    private ?Service $service = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;
        return $this;
    }
}
