export function UserAlreadyExistsException(message? : string) : Error {
    console.log('Caught UserAlreadyExistsException: ' + message)
    return new Error(message);
}