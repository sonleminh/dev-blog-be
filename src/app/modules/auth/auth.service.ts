import { Model } from "mongoose";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { UserDocument } from "../user/user.entity";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

export class AuthService {
    constructor(
        private userModel: Model<UserDocument>
    ) {}

    async cc() {
        return console.log('cc')
    }

    async signUp(authCredentialsDto: AuthCredentialsDto)  {
        const {username,password} = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword= await bcrypt.hash(password,salt);
        const user = await this.userModel.create({username,password: hashedPassword});
        try {
            return await  user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            }
            throw new InternalServerErrorException();
        }
    }   
}