<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType; // Ajouté pour le champ email
use Symfony\Component\Form\Extension\Core\Type\PasswordType; // Ajouté pour le champ mot de passe
use Symfony\Component\Form\Extension\Core\Type\TextareaType; // Ajouté pour le champ description
use Symfony\Component\Form\Extension\Core\Type\TextType; // Ajouté pour les champs texte
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length; // Ajouté pour la validation de longueur
use Symfony\Component\Validator\Constraints\NotBlank; // Ajouté pour la validation de champs non vides

class UserForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('pseudo', TextType::class, [
                'label' => 'Pseudo', // Libellé pour l'interface
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un pseudo.',
                    ]),
                    new Length([
                        'min' => 3,
                        'minMessage' => 'Votre pseudo doit contenir au moins {{ limit }} caractères.',
                        'max' => 255,
                    ]),
                ],
            ])
            ->add('email', EmailType::class, [ // Changement de 'Email' en 'email' et type EmailType
                'label' => 'Adresse e-mail',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer une adresse e-mail.',
                    ]),
                    // Vous pouvez ajouter une contrainte UniqueEntity sur l'entité User pour l'email
                ],
            ])
            ->add('password', PasswordType::class, [ // Ajout du champ mot de passe
                'label' => 'Mot de passe',
                'attr' => ['autocomplete' => 'new-password'], // Pour aider les navigateurs
                'mapped' => true, // Laisser à true, le contrôleur s'occupe du hachage
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un mot de passe.',
                    ]),
                    new Length([
                        'min' => 6, // Longueur minimale recommandée pour un mot de passe
                        'minMessage' => 'Votre mot de passe doit contenir au moins {{ limit }} caractères.',
                        // max: 4096 est la longueur maximale de sécurité pour un mot de passe brut dans Symfony
                        'max' => 4096,
                    ]),
                ],
            ])
            ->add('localisation', TextType::class, [
                'label' => 'Localisation',
                'required' => false, // Rendre ce champ facultatif
            ])
            ->add('description', TextareaType::class, [ // Utilisation de TextareaType pour la description
                'label' => 'Description',
                'required' => false,
            ])
            // Si vous avez d'autres champs dans votre entité User, ajoutez-les ici.
            // Le champ 'roles' n'est généralement pas exposé directement dans le formulaire
            // car il est géré par la logique métier (ex: ROLE_USER par défaut).
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}