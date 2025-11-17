import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { UserService } from "../classes/User/User.Service";

@Injectable()
export class UserIdguard implements CanActivate{

    constructor (
        private readonly jwtService : JwtService,
        private readonly  UserService : UserService  
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if(!authHeader)
            throw new ForbiddenException('Token não enviado.');
        
        const token = authHeader.split(' ')[1];

        let decoded;

        try {
            decoded = this.jwtService.verify(token);
        }
         catch (err) {
            throw new ForbiddenException('Token inválido ou expirado.');
        }
        const userIdFromToken = decoded.sub;

        const userIdParam = Number(request.params.id);

            
        if (isNaN(userIdParam))
            throw new ForbiddenException('ID inválido na rota.');

        if(!(await this.UserService.get(userIdParam)))
            throw new ForbiddenException('User da rota não existe');
            

        const isAdm = await this.UserService.verifyAdm(userIdFromToken);

        if (userIdFromToken !== userIdParam && !isAdm)
            throw new ForbiddenException(
                'Você não tem permissão para acessar este recurso.',
        );

        return true;
    

    }

}