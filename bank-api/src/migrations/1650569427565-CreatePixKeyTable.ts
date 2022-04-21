import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

const bankAccountIdForeignKey = new TableForeignKey({
  name: 'pix_keys_bank_account_id_foreign_key',
  columnNames: ['bank_account_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'bank_accounts',
});

export class CreatePixKeyTable1650569427565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pix_keys',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'kind',
            type: 'varchar',
          },
          {
            name: 'key',
            type: 'varchar',
          },
          {
            name: 'bank_account_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('pix_keys', bankAccountIdForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('pix_keys', bankAccountIdForeignKey);
    await queryRunner.dropTable('pix_keys');
  }
}
