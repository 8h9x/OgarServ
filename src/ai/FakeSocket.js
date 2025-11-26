// A fake socket for bot players
class FakeSocket {
    #server;

    constructor(gameServer) {
        this.#server = gameServer;
    };

    sendPacket(_packet) {
        // Fakes sending a packet
        return;
    };

    close(_error) {
        this.isCloseRequest = true;
    };
};

module.exports = FakeSocket;
