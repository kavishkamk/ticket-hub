import nats from "node-nats-streaming";

import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222"
});

stan.on("connect", () => {
    console.log("connected to the nats");

    const publisher = new TicketCreatedPublisher(stan);
    publisher.publish({
        id: "123",
        title: "title",
        price: "10"
    });

});

