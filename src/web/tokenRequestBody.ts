import { Token } from "../domain/user-authentication";

export interface TokenRequestBody {
    emailAddress: string;
    token: Token;
}