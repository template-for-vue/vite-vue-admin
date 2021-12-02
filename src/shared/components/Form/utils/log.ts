export function warn(message: string) {
    console.warn(`[useForm warn]:${message}`);
}

export function error(message: string) {
    throw new Error(`[useForm error]:${message}`)
}