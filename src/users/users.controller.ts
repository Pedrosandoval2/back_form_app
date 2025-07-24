import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";

@UseGuards(AuthGuard)
@Controller("v1/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("")
  findAll(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    console.log("🚀 ~ UsersController ~ user:", query)
    return this.usersService.findAll(query, page, limit);
  }

  @Get("/:id")
  findOne(
    @Param("id") id: string,
  ): Promise<Omit<User, "password" | "refresh_token">> {
    return this.usersService.findOne(id);
  }

  @Patch("/:id")
  updateUser(
    @Param("id") id: string,
    @Body() userUpdate: UpdateUserDto,
  ): Promise<Pick<User, "firstName" | "email">> {
    return this.usersService.updateUser(id, userUpdate);
  }

  @Put("/:id")
  deleteUser(@Param("id") id: string) {
    return this.usersService.deleteUser(id);
  }
}
