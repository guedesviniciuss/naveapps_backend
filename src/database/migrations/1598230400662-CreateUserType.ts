import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';

export default class CreateUserType1598230400662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'profiles',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
        },
        {
          name: 'description',
          type: 'varchar',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    await queryRunner.createForeignKey('users', new TableForeignKey({
      name: 'UserProfile',
      columnNames: ['user_profile'],
      referencedTableName: 'profiles',
      referencedColumnNames: ['id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'UserProfile');
    await queryRunner.dropTable('profiles');
  }
}
