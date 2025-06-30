<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250630142936 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evaluation ADD relation_id INT NOT NULL');
        $this->addSql('ALTER TABLE evaluation ADD CONSTRAINT FK_1323A5753256915B FOREIGN KEY (relation_id) REFERENCES utilisateur (id)');
        $this->addSql('CREATE INDEX IDX_1323A5753256915B ON evaluation (relation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evaluation DROP FOREIGN KEY FK_1323A5753256915B');
        $this->addSql('DROP INDEX IDX_1323A5753256915B ON evaluation');
        $this->addSql('ALTER TABLE evaluation DROP relation_id');
    }
}
