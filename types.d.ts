export interface Config {
    port: number;
    oauth: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    secret: string;
}

declare module "fastify" {
    interface Session {
        user: {
            id: string;
            username: string;
            discriminator: string;
            avatar: string | null | undefined;
        } | null | undefined;
    }
}