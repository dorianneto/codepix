import * as chalk from 'chalk';
import { Command, Console } from 'nestjs-console';
import { Connection, getConnection } from 'typeorm';

@Console()
export default class BankFixtureCommand {
  @Command({
    command: 'bank-fixture',
    description: 'Seed bank data in database',
  })
  public async command() {
    const connection = getConnection();

    const bankCode = process.env.BANK_CODE || '001';
    const fixtures = (await import(`./data/bank-${bankCode}`)).default;

    await this.undoMigrations(connection);

    for (const fixture of fixtures) {
      console.log(fixture);
      await this.runSeed(connection, fixture.model, fixture.fields);
    }

    console.info(chalk.green('Data generated'));
  }

  private async undoMigrations(connection: Connection) {
    for (const migration of connection.migrations.reverse()) {
      await connection.undoLastMigration();
    }
  }

  private async runSeed(connection: Connection, model: any, fields: any) {
    const repository = connection.getRepository(model);

    const temp = repository.create(fields);
    await repository.save(temp);
  }
}
