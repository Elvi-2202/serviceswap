<?php

namespace App\Entity;

use App\Repository\ServiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ServiceRepository::class)]
class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    // Supprimé car la catégorie est gérée par la relation ManyToOne ci-dessous
    // #[ORM\Column(length: 255)]
    // private ?string $catégorie = null;

    #[ORM\Column(length: 255)]
    private ?string $statut = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'services')] // Mappé par la propriété 'services' dans User
    private Collection $users;

    // Renommé 'relation' en 'category' pour plus de clarté
    #[ORM\ManyToOne(inversedBy: 'services')] // 'services' est le nom de la collection dans l'entité Categorie
    #[ORM\JoinColumn(nullable: false)]
    private ?Categorie $category = null;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    // Le getter/setter pour 'catégorie' est retiré si la relation ManyToOne est utilisée
    // public function getCatégorie(): ?string
    // {
    //     return $this->catégorie;
    // }

    // public function setCatégorie(string $catégorie): static
    // {
    //     $this->catégorie = $catégorie;
    //     return $this;
    // }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addService($this); // Correction : Appel à addService() sur l'objet User
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeService($this); // Correction : Appel à removeService() sur l'objet User
        }

        return $this;
    }

    public function getCategory(): ?Categorie // Getters/Setters pour la relation Categorie
    {
        return $this->category;
    }

    public function setCategory(?Categorie $category): static
    {
        $this->category = $category;

        return $this;
    }
}