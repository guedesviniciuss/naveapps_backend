import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddVideoInApplication1608831570990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('applications', new TableColumn({
      name: 'video',
      type: 'varchar',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('applications', 'video');
  }
}
