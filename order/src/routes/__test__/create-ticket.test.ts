import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("retuen an error if ticket is not found", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId })
        .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "content",
        price: 10
    });
    await ticket.save();
    const order = Order.build({
        ticket,
        userId: "jdifjdjfdjf",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it("reserve a ticket", async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "content",
        price: 10
    });
    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it("emit the order created event", async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "content",
        price: 10
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});