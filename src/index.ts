import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { createReadStream } from "fs";
import { join } from "path";
import Oauth from "discord-oauth2";
// @ts-ignore
import sitemap from "../sitemap.json";
import { Config } from "../types";
import { logger } from "./handlers/logger";
import axios from "axios";
const config = require("../config") as Config;

const app = fastify();
app.register(fastifyCookie);
app.register(fastifySession, {
    secret: config.secret,
    cookie: {
        secure: false
    }
});
app.addHook("preHandler", async (req, res) => {
    if (
        req.url.includes("/hub")
        && (
            !req.session.user
            || await axios("https://api.dulcisvtc.com/isdriver/" + req.session.user.id).then((res: any) => !res.data.isdriver)
        )
    ) {
        if (req.session.user) return res.redirect("/");
        return res.redirect("/login");
    };
});
const oauth = new Oauth({
    clientId: config.oauth.clientId,
    clientSecret: config.oauth.clientSecret,
    redirectUri: config.oauth.callbackUrl,
});

for (const [path, file] of Object.entries(sitemap.fileroutes)) {
    const ext = file.split(".").pop();
    app.get(path, (req, res) => {
        res.type(`text/${ext?.replace("js", "javascript")}`).send(createReadStream(join(__dirname, "..", "content", file)));
    });
};

app.get("/login", async (req, res) => {
    const code = (req.query as { code: string | undefined }).code;
    if (!code) {
        res.redirect(oauth.generateAuthUrl({
            scope: ["identify"]
        }));
    } else {
        const token = await oauth.tokenRequest({
            code,
            scope: ["identify"],
            grantType: "authorization_code",
        }).catch(() => null);

        if (!token || !token.access_token) {
            res.redirect("/");
        } else {
            const user = await oauth.getUser(token.access_token).catch(() => null);
            if (!user) {
                res.redirect("/");
            } else {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    avatar: user.avatar,
                };
                res.redirect("/hub");
            };
        };
    };
});
app.get("/logout", async (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

app.listen({ port: config.port, host: "0.0.0.0" }, (_, address) => {
    logger.info(`Server listening on ${address}`);
});