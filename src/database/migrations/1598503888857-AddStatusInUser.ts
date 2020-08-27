import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddStatusInUser1598503888857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'status',
      type: 'boolean',
      default: false,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'status');
  }
}
