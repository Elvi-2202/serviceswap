<?php
// src/Entity/Evaluation.php

namespace App\Entity;

use App\Repository\EvaluationRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: EvaluationRepository::class)]
class Evaluation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $score = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comment = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'evaluations')] // Relation ManyToOne vers User
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null; // Propriété 'user' pour stocker l'objet User lié

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

    public function getUser(): ?User // Getter pour la relation User
    {
        return $this->user;
    }

    public function setUser(?User $user): static // Setter pour la relation User
    {
        $this->user = $user;

        return $this;
    }
}