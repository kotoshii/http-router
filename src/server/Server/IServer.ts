import { CallbackVoid } from '../../types/CallbackVoid'

export interface IServer {
    listen(port: number | string, callback?: CallbackVoid): void
}
