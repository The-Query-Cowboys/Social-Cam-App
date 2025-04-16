import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenService {

    constructor(private prisma: PrismaService) { }

    //converts to format yyyymmddhhmmss
    getExpiryTime() {
        let expiryTime = new Date()
        expiryTime.setHours(expiryTime.getHours() + 24)
        const expiryTimeString = `${expiryTime.getFullYear()}${(expiryTime.getMonth()+1).toString().padStart(2, "0")}${expiryTime.getDate().toString().padStart(2, "0")}${expiryTime.getHours()}${expiryTime.getMinutes()}${expiryTime.getSeconds()}`
        return expiryTimeString
    }

    async getUserById(userId): Promise<Object> {
        const user = await this.prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User_id ${userId} was not found`);

        }
        //return a token
        else {
            const token = user.username + '|' + this.getExpiryTime()
            return { "token": token}
        }
    }

}