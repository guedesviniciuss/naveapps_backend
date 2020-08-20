import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAuthorizationToUser1597931451354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'user_type',
      type: 'integer',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'user_type');
  }
}
