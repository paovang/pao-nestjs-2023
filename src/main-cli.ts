import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.argv.indexOf('subscribe-bcel-one') !== -1) {
    await CommandFactory.runWithoutClosing(AppModule, {
      errorHandler: (err) => {
        console.log(err.message);
        process.exit();
      }
    });
  } else {
    await CommandFactory.run(AppModule);
  }
}

bootstrap();