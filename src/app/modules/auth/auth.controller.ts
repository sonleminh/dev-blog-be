import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "../user/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('/cc')
    cc() {
        return this.authService.cc()
    }
    
    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authService.signUp(authCredentialsDto)
    }
}