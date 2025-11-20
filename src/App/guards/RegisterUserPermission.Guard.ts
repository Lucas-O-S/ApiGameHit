import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../classes/User/User.Service";
import { RegisterService } from "../classes/Registers/Register.Service";

@Injectable()
export class RegisterUserPermissionGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly registerService: RegisterService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;
        if (!authHeader)
            throw new ForbiddenException("Token não enviado.");

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = this.jwtService.verify(token);
        } catch (err) {
            throw new ForbiddenException("Token inválido ou expirado.");
        }

        const userIdFromToken = decoded.sub;

        const registerId = Number(request.params.id);

        if (isNaN(registerId))
            throw new ForbiddenException("ID inválido na rota.");

        const register = await this.registerService.get(registerId);

        if (!register)
            throw new ForbiddenException("Registro não encontrado.");

        const ownerId = register.userId;

        const isAdm = await this.userService.verifyAdm(userIdFromToken);

        if (userIdFromToken !== ownerId && !isAdm) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso."
            );
        }

        return true;
    }
}
