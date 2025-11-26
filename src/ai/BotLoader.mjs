import FakeSocket from "./FakeSocket.js";
import PacketHandler from "../PacketHandler.js";
import BotPlayer from "./BotPlayer.js";
import MinionPlayer from "./MinionPlayer.js";
import { existsSync, accessSync, constants, readFileSync } from "node:fs";

class BotLoader {
    static names = BotLoader.fetchNames();
    static fetchNames() {
        try {
            accessSync("./botnames.txt", constants.R_OK);
            return readFileSync("./botnames.txt", "utf8").split("\n").filter(n => !!n.trim());
        } catch (err) {
            return [];
        };
    };
    static *nameGenerator() {
        let i = 0;
        while (i < Infinity) {
            i++;
            const name = BotLoader.names.length >= i ? BotLoader.names[i - 1] : `Bot ${i}`;
            yield `[BOT] ${name}`;
        };
    };

    #names = BotLoader.nameGenerator();
    #server;

    constructor(gameServer) {
        this.#server = gameServer;
    };

    addBot() {
        const s = new FakeSocket(this.#server);
        s.playerTracker = new BotPlayer(this.#server, s);
        s.packetHandler = new PacketHandler(this.#server, s);

        // Add to client list
        this.#server.clients.push(s);

        // Add to world
        s.packetHandler.setNickname('<bot>' + this.#names.next().value);
    }

    addMinion() {
        const s = new FakeSocket(this.#server);
        s.playerTracker = new MinionPlayer(this.#server, s, owner);
        s.packetHandler = new PacketHandler(this.#server, s);
        s.playerTracker.owner = owner;
        s.playerTracker.setColor(owner.color);

        if (owner._skin != '') s.playerTracker.setSkin(owner._skin);

        // Add to client list
        this.#server.clients.push(s);

        // Add to world & set name
        if (typeof name == "undefined" || name == "") {
            name = this.#server.config.defaultName;
        }
        s.packetHandler.setNickname(name);
    }

    loadNames() {
        this.randomNames = [];

        if (existsSync("./botnames.txt")) {
            // Read and parse the names - filter out whitespace-only names
            this.randomNames = fs.readFileSync("./botnames.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
                return x != ''; // filter empty names
            });
        }
        this.nameIndex = 0;
    }
};

// function BotLoader(gameServer) {
//     this.gameServer = gameServer;
//     this.loadNames();
// }

// module.exports = BotLoader;
export default BotLoader;

// BotLoader.prototype.getName = function () {
//     var name = "";

//     // Picks a random name for the bot
//     if (this.randomNames.length > 0) {
//         var index = (this.randomNames.length * Math.random()) >>> 0;
//         name = '[BOT] ' + this.randomNames[index];
//     } else {
//         name = '[BOT] Bot' + ++this.nameIndex;
//     }

//     return name;
// };

// BotLoader.prototype.loadNames = function () {
//     this.randomNames = [];

//     if (existsSync("./botnames.txt")) {
//         // Read and parse the names - filter out whitespace-only names
//         this.randomNames = fs.readFileSync("./botnames.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
//             return x != ''; // filter empty names
//         });
//     }
//     this.nameIndex = 0;
// };

// BotLoader.prototype.addBot = function () {
//     var s = new FakeSocket(this.gameServer);
//     s.playerTracker = new BotPlayer(this.gameServer, s);
//     s.packetHandler = new PacketHandler(this.gameServer, s);

//     // Add to client list
//     this.gameServer.clients.push(s);

//     // Add to world
//     s.packetHandler.setNickname('<bot>' + this.getName());
// };

// BotLoader.prototype.addMinion = function (owner, name) {
//     var s = new FakeSocket(this.gameServer);
//     s.playerTracker = new MinionPlayer(this.gameServer, s, owner);
//     s.packetHandler = new PacketHandler(this.gameServer, s);
//     s.playerTracker.owner = owner;
//     s.playerTracker.setColor(owner.color);

//     if (owner._skin != '') s.playerTracker.setSkin(owner._skin);

//     // Add to client list
//     this.gameServer.clients.push(s);

//     // Add to world & set name
//     if (typeof name == "undefined" || name == "") {
//         name = this.gameServer.config.defaultName;
//     }
//     s.packetHandler.setNickname(name);
// };
