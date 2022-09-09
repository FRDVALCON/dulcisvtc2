import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import SteamAuth from "node-steam-openid";
import { createReadStream } from "fs";
import { join } from "path";
import Oauth from "discord-oauth2";
// @ts-ignore
import sitemap from "../sitemap.json";
import { Config } from "../types";
import { logger } from "./handlers/logger";
import axios from "axios";
import { inspect } from "util";
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
            || await axios("https://api.dulcisvtc.com/isdriver/" + req.session.user.discord_id).then((res: any) => !res.data.isdriver)
        )
    ) {
        if (req.session.user) return res.redirect("/");
        return res.redirect("/oauth/discord");
    };
});
const oauth = new Oauth({
    clientId: config.oauth.clientId,
    clientSecret: config.oauth.clientSecret,
    redirectUri: config.oauth.callbackUrl,
});
const steam = new SteamAuth({
    realm: config.steam.realm,
    returnUrl: config.steam.returnUrl,
    apiKey: config.steam.apiKey
});

for (const [path, file] of Object.entries(sitemap.fileroutes)) {
    const ext = file.split(".").pop();
    app.get(path, (req, res) => {
        res.type(`text/${ext?.replace("js", "javascript")}`).send(createReadStream(join(__dirname, "..", "content", file)));
    });
};

app.get("/oauth/discord", async (req, res) => {
    const { code } = req.query as { code?: string };
    if (!code) {
        res.redirect(oauth.generateAuthUrl({
            scope: ["identify"]
        }));
    } else {
        const token = await oauth.tokenRequest({
            code,
            scope: ["identify"],
            grantType: "authorization_code",
        }).catch((e) => { logger.error(inspect(e)); });

        if (!token || !token.access_token) {
            res.redirect("/");
        } else {
            const user = await oauth.getUser(token.access_token).catch((e) => { logger.error(inspect(e)); });
            if (!user) {
                res.redirect("/");
            } else {
                const { data } = await axios("https://api.dulcisvtc.com/users");
                const datauser = data.find((x: { discord_id: string; }) => x.discord_id === user.id);
                req.session.user = {
                    discord_id: user.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    avatar: user.avatar,
                };
                if (datauser) req.session.user.steam_id = datauser.steam_id;
                res.redirect("/hub");
            };
        };
    };
});

app.get("/oauth/steam", async (req, res) => {
    if (
        !req.session.user
        || await axios("https://api.dulcisvtc.com/isdriver/" + req.session.user.discord_id).then((res: any) => !res.data.isdriver)
    ) return res.redirect("/hub");

    try {
        const user = await steam.authenticate(req);
        req.session.user.steam_id = user.steamid;
        await axios({
            url: [
                "https://api.dulcisvtc.com",
                `/setdiscordid?secret=${config.secret}&steam_id=${user.steamid}&discord_id=${req.session.user.discord_id}`
            ].join(""),
            timeout: 10_000
        }).then(() => {
            res.redirect("/hub/stats");
        }).catch((e) => {
            if (e.response.status === 404) return res.redirect("/hub/stats?err=nouser");
            logger.error(inspect(e));
            res.send("something bad hapenned. please write a message in driver-support channel.")
        });
    } catch (e) {
        res.redirect(await steam.getRedirectUrl());
    };
});

app.get("/user", (req, res) => {
    return res.send(req.session.user);
});

app.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

app.listen({ port: config.port, host: "0.0.0.0" }, (_, address) => {
    logger.info(`Server listening on ${address}`);
});