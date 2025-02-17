import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

export interface JwtPayload {
    sub: number;
    email: string;
  }
  

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,'jwt'
)
{
    
    constructor(config: ConfigService,private prisma:PrismaService ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
          
          secretOrKey: config.get<string>('JWT_SECRET'), 
        });
      }

      async validate(payload: JwtPayload)
      {
        const user = await this.prisma.user.findUnique({
            where:{ 
                id:payload.sub
            }}
        )
        delete user.password
        console.log(user)
        return user
      }

   
    
   
    
}