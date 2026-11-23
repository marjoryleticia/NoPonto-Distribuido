
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriarTabelasIniciais1762959999000
  implements MigrationInterface
{
  name = 'CriarTabelasIniciais1762959999000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "Rota" (
        "id" SERIAL PRIMARY KEY,
        "nome" text NOT NULL,
        "descricao" text
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Usuario" (
        "id" SERIAL PRIMARY KEY,
        "nome" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "senha" text NOT NULL,
        "tipo" text NOT NULL DEFAULT 'ALUNO'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Onibus" (
        "id" SERIAL PRIMARY KEY,
        "placa" text NOT NULL UNIQUE,
        "identificacaoRFID" text NOT NULL UNIQUE,
        "modelo" text NOT NULL,
        "status" text NOT NULL DEFAULT 'ATIVO',
        "rotaId" integer,
        CONSTRAINT "Onibus_rotaId_fkey"
          FOREIGN KEY ("rotaId")
          REFERENCES "Rota"("id")
          ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Parada" (
        "id" SERIAL PRIMARY KEY,
        "nome" text NOT NULL,
        "latitude" double precision NOT NULL,
        "longitude" double precision NOT NULL,
        "rotaId" integer,
        CONSTRAINT "Parada_rotaId_fkey"
          FOREIGN KEY ("rotaId")
          REFERENCES "Rota"("id")
          ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Localizacao" (
        "id" SERIAL PRIMARY KEY,
        "latitude" double precision NOT NULL,
        "longitude" double precision NOT NULL,
        "registradaEm" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "onibusId" integer NOT NULL,
        CONSTRAINT "Localizacao_onibusId_fkey"
          FOREIGN KEY ("onibusId")
          REFERENCES "Onibus"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "Localizacao_onibusId_registradaEm_idx"
      ON "Localizacao" ("onibusId", "registradaEm")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Localizacao"`);
    await queryRunner.query(`DROP TABLE "Parada"`);
    await queryRunner.query(`DROP TABLE "Onibus"`);
    await queryRunner.query(`DROP TABLE "Usuario"`);
    await queryRunner.query(`DROP TABLE "Rota"`);
  }
}
