import { Model, model, Schema, Document } from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// this is a interface that describe the properties
// that are required to create ticket
interface ITicket {
    title: string;
    price: number;
    userId: string;
};

// this interface describe the properties
// that ticket model has
interface TicketModel extends Model<TicketDoc> {
    build: (attrs: ITicket) => TicketDoc;
};

// this is a interface that are describe the properties
// that are ticket document have
interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    createdAt: Date;
    version: number;
    orderId?: string;
};

const ticketSchema = new Schema({
    title: { type: String, require: [true, "title required"] },
    price: { type: Number, min: [0, "Price should be grater than 0"], require: [true, "Price required"] },
    userId: { type: String, require: [true, "user Id required"] },
    orderId: { type: String }
}, {
    timestamps: true
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// method for create tickets
ticketSchema.statics.build = (attrs: ITicket) => {
    return new Ticket(attrs);
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };