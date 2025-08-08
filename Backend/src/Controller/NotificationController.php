<?php

// src/Controller/NotificationController.php
namespace App\Controller;

use App\Entity\Notification;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/notifications')]
class NotificationController extends AbstractController
{
    #[Route('', name: 'notifications_list', methods: ['GET'])]
    public function list(NotificationRepository $repository): JsonResponse
    {
        $user = $this->getUser();
        $notifications = $repository->findBy(['user' => $user], ['createdAt' => 'DESC']);
        return $this->json($notifications, 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/{id}', name: 'notifications_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em, NotificationRepository $repository): JsonResponse
    {
        $user = $this->getUser();
        $notif = $repository->find($id);
        if (!$notif || $notif->getUser() !== $user) {
            return $this->json(['error' => 'Not found or access denied'], 404);
        }
        $em->remove($notif);
        $em->flush();

        return $this->json(null, 204);
    }

    #[Route('/{id}/read', name: 'notifications_mark_read', methods: ['PUT'])]
    public function markRead(int $id, EntityManagerInterface $em, NotificationRepository $repository, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $notif = $repository->find($id);
        if (!$notif || $notif->getUser() !== $user) {
            return $this->json(['error' => 'Not found or access denied'], 404);
        }

        $notif->setIsRead(true);
        $em->flush();

        return $this->json($notif, 200, [], ['groups' => 'notification:read']);
    }
}
