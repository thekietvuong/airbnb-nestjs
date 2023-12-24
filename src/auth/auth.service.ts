import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user-dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const isUserExist = await this.userRepository.find({
            where: {
                email: registerUserDto.email
            },
        });
        if(isUserExist.length > 0){
            throw new ConflictException('This email already exists');
        }
        const hashPassword = await this.hashPassword(registerUserDto.pass_word);
        return await this.userRepository.save({ ...registerUserDto, pass_word: hashPassword });
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {

        const user = await this.userRepository.findOne(
            {
                where: { email: loginUserDto.email }
            }
        )

        if (!user) {
            throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED);
        }

        const checkPass = bcrypt.compareSync(loginUserDto.pass_word, user.pass_word);
        if (!checkPass) {
            throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED);
        }
        //generate access token
        const payload = { id: user.id, email: user.email, role: user.role };

        return this.generateToken(payload);
    }

    private async generateToken(payload: { id: number, email: string, role: string }) {
        const access_token = await this.jwtService.signAsync(payload);

        return access_token
    }
}
