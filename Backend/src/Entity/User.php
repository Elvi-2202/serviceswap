<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\LegacyPasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'service:read', 'evaluation:read', 'message:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $pseudo = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $localisation = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['user:read', 'user:write'])]
    private array $roles = [];

    /**
     * @var Collection<int, Service>
     */
    #[ORM\OneToMany(targetEntity: Service::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $services;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $messages;

    /**
     * @var Collection<int, Evaluation>
     */
    #[ORM\OneToMany(targetEntity: Evaluation::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $evaluations;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $notifications;

    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->evaluations = new ArrayCollection();
        $this->notifications = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getPseudo(): ?string { return $this->pseudo; }
    public function setPseudo(string $pseudo): static { $this->pseudo = $pseudo; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getLocalisation(): ?string { return $this->localisation; }
    public function setLocalisation(?string $localisation): static { $this->localisation = $localisation; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getPassword(): ?string { return $this->password; }
    public function setPassword(string $password): static { $this->password = $password; return $this; }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }
    public function setRoles(array $roles): static { $this->roles = $roles; return $this; }

    public function getSalt(): ?string { return null; }

    #[\Deprecated(since: '7.3', message: 'The method "%s" is deprecated.')]
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /** @return Collection<int, Service> */
    public function getServices(): Collection { return $this->services; }
    public function addService(Service $service): static
    {
        if (!$this->services->contains($service)) {
            $this->services->add($service);
            $service->setUser($this);
        }
        return $this;
    }
    public function removeService(Service $service): static
    {
        if ($this->services->removeElement($service) && $service->getUser() === $this) {
            $service->setUser(null);
        }
        return $this;
    }

    /** @return Collection<int, Message> */
    public function getMessages(): Collection { return $this->messages; }
    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setUser($this);
        }
        return $this;
    }
    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message) && $message->getUser() === $this) {
            $message->setUser(null);
        }
        return $this;
    }

    /** @return Collection<int, Evaluation> */
    public function getEvaluations(): Collection { return $this->evaluations; }
    public function addEvaluation(Evaluation $evaluation): static
    {
        if (!$this->evaluations->contains($evaluation)) {
            $this->evaluations->add($evaluation);
            $evaluation->setUser($this);
        }
        return $this;
    }
    public function removeEvaluation(Evaluation $evaluation): static
    {
        if ($this->evaluations->removeElement($evaluation) && $evaluation->getUser() === $this) {
            $evaluation->setUser(null);
        }
        return $this;
    }

    /** @return Collection<int, Notification> */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }
        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification) && $notification->getUser() === $this) {
            // set the owning side to null (unless already changed)
            $notification->setUser(null);
        }
        return $this;
    }
}
