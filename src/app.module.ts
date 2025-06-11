import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { EventsModule } from "./events/events.module";
import { CustomersModule } from "./customers/customers.module";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3309,
    username: 'root',
    password: '12345',
    database: 'back_form_app',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), UsersModule, AuthModule, EventsModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
