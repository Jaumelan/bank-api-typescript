import { APIResponse, User, UserValidated } from "../models";
import { UserDataValidator } from "../validators";
import { v4 } from "uuid";

class CreateUserService {

    private userDataValidator = UserDataValidator;

    public execute (user: User): APIResponse {

        const userCreated = new this.userDataValidator(user);

        if ( userCreated.errors ) {
            throw new Error(`400: ${userCreated.errors}`);

            /* return {
                status: 400,
                message: [userValidated.errors],
            }; */
        }

        const userId = v4();
       
        const userValidated: UserValidated = {
            id: userId,
            ... userCreated.user,
        };
        

        return {
            status: 200,
            data: userValidated,
            message: [`Usuário ${userId} criado com sucesso.`],
        } as APIResponse;
    }

}

export { CreateUserService };