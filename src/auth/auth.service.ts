import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}


  async signup(dto: AuthDto){
    const hashPass =  await bcrypt.hash(dto.password,12)
    try{
       
    const user =  await this.prisma.user.create({
            data:{
                name:dto.name,
                email:dto.email,
                password:hashPass
            },
    })
    delete user.password
    return user
}
catch(error)
{
    if(error instanceof PrismaClientKnownRequestError)
    {
        if(error.code ==='P2002')
        {
            throw new ForbiddenException('Credentials already taken');

        }
    }

}
}

async signin(dto:AuthDto){
    const user = await this.prisma.user.findUnique(
       {
        where:{
            email:dto.email, 
          
        }
       }
    )

    if(!user) throw new ForbiddenException('Credentials incorrect - no user found');
    
    const matchPass =  await bcrypt.compare(dto.password, user.password)

    if(!matchPass) throw new ForbiddenException('Credentials incorrect - incorrect password');

    delete user.password
    return {
        userId: user.id,
        token: this.signToken(user.id, user.email),
      };
       


}

async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string} > {
    const payload = {
      sub: userId,
      email
    };
  
    const secret = this.config.get('JWT_SECRET');
  
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m', 
      secret
    });
    return {
        access_token:token
    }
  }


}