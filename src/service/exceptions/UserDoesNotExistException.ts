export function UserDoesNotExistException(message? : string) : Error {
    console.log("Caught UserDoesNotExistException: " + message)
    return new Error(message);
}