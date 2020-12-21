import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddGalleryInApplication1608512774152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('applications', new TableColumn({
      name: 'gallery',
      type: 'varchar',
      isNullable: false,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('applications', 'gallery');
  }
}
