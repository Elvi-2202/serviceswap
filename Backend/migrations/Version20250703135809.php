<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250703135809 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE categorie CHANGE nom name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE evaluation DROP FOREIGN KEY FK_1323A5753256915B');
        $this->addSql('DROP INDEX IDX_1323A5753256915B ON evaluation');
        $this->addSql('ALTER TABLE evaluation ADD user_id INT NOT NULL, ADD score INT NOT NULL, ADD comment LONGTEXT DEFAULT NULL, DROP relation_id, DROP note, DROP commentaire');
        $this->addSql('ALTER TABLE evaluation ADD CONSTRAINT FK_1323A575A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_1323A575A76ED395 ON evaluation (user_id)');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F3256915B');
        $this->addSql('DROP INDEX IDX_B6BD307F3256915B ON message');
        $this->addSql('ALTER TABLE message ADD created_at DATETIME NOT NULL, DROP lu, CHANGE relation_id user_id INT NOT NULL, CHANGE contenu content LONGTEXT NOT NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_B6BD307FA76ED395 ON message (user_id)');
        $this->addSql('ALTER TABLE service DROP FOREIGN KEY FK_E19D9AD23256915B');
        $this->addSql('DROP INDEX IDX_E19D9AD23256915B ON service');
        $this->addSql('ALTER TABLE service DROP catégorie, CHANGE relation_id category_id INT NOT NULL');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD212469DE2 FOREIGN KEY (category_id) REFERENCES categorie (id)');
        $this->addSql('CREATE INDEX IDX_E19D9AD212469DE2 ON service (category_id)');
        $this->addSql('ALTER TABLE user ADD password VARCHAR(255) NOT NULL, ADD roles JSON NOT NULL COMMENT \'(DC2Type:json)\', CHANGE email email VARCHAR(180) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE categorie CHANGE name nom VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE evaluation DROP FOREIGN KEY FK_1323A575A76ED395');
        $this->addSql('DROP INDEX IDX_1323A575A76ED395 ON evaluation');
        $this->addSql('ALTER TABLE evaluation ADD relation_id INT NOT NULL, ADD note INT NOT NULL, ADD commentaire LONGTEXT NOT NULL, DROP user_id, DROP score, DROP comment');
        $this->addSql('ALTER TABLE evaluation ADD CONSTRAINT FK_1323A5753256915B FOREIGN KEY (relation_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_1323A5753256915B ON evaluation (relation_id)');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FA76ED395');
        $this->addSql('DROP INDEX IDX_B6BD307FA76ED395 ON message');
        $this->addSql('ALTER TABLE message ADD lu TINYINT(1) NOT NULL, DROP created_at, CHANGE user_id relation_id INT NOT NULL, CHANGE content contenu LONGTEXT NOT NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F3256915B FOREIGN KEY (relation_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_B6BD307F3256915B ON message (relation_id)');
        $this->addSql('ALTER TABLE service DROP FOREIGN KEY FK_E19D9AD212469DE2');
        $this->addSql('DROP INDEX IDX_E19D9AD212469DE2 ON service');
        $this->addSql('ALTER TABLE service ADD catégorie VARCHAR(255) NOT NULL, CHANGE category_id relation_id INT NOT NULL');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD23256915B FOREIGN KEY (relation_id) REFERENCES categorie (id)');
        $this->addSql('CREATE INDEX IDX_E19D9AD23256915B ON service (relation_id)');
        $this->addSql('DROP INDEX UNIQ_8D93D649E7927C74 ON user');
        $this->addSql('ALTER TABLE user DROP password, DROP roles, CHANGE email email VARCHAR(255) NOT NULL');
    }
}
