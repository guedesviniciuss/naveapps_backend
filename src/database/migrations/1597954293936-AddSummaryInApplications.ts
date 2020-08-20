import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSummaryInApplications1597954293936 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('applications', new TableColumn({
      name: 'summary',
      type: 'varchar',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('applications', 'summary');
  }
}
