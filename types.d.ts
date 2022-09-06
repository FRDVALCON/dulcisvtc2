export interface Config {
    port: number;
    oauth: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    steam: {
        realm: string,
        returnUrl: string,
        apiKey: string
    };
    secret: string;
}

declare module "fastify" {
    interface Session {
        user?: {
            discord_id: string;
            steam_id?: string;
            username: string;
            discriminator: string;
            avatar: string | null | undefined;
        };
    }
}