<?php

namespace App\Entity;

use App\Repository\TrocRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TrocRepository::class)]
#[ORM\Table(name: 'troc')]
class Troc
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['troc:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['troc:read'])]
    private ?string $serviceGiven = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['troc:read'])]
    private ?string $serviceReceived = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['troc:read'])]
    private ?string $partner = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['troc:read'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['troc:read'])]
    private ?string $status = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'trocs')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    // -------- Getters et Setters --------

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getServiceGiven(): ?string
    {
        return $this->serviceGiven;
    }

    public function setServiceGiven(string $serviceGiven): self
    {
        $this->serviceGiven = $serviceGiven;

        return $this;
    }

    public function getServiceReceived(): ?string
    {
        return $this->serviceReceived;
    }

    public function setServiceReceived(string $serviceReceived): self
    {
        $this->serviceReceived = $serviceReceived;

        return $this;
    }

    public function getPartner(): ?string
    {
        return $this->partner;
    }

    public function setPartner(string $partner): self
    {
        $this->partner = $partner;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
