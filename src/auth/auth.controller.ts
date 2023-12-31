import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    register(@Body() registerUserDto:RegisterUserDto):Promise<User> {
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    @ApiResponse({status: 201, description: 'Login successfully!'})
    @ApiResponse({status: 401, description: 'Login fail!'})
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto:LoginUserDto):Promise<any> {
        
        return this.authService.login(loginUserDto);
    }
}
