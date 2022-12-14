import { OrderStatus } from "@tickethub-kv/common";
import { Document, model, Model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { TicketDoc } from "./ticket";

// this is a interface that describe
// need to create order
interface IOrder {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
};

// this is the interface that describe
// that are order document has
interface OrderDoc extends Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
};

// a interface that describe the properties
// order model has
interface OrderModel extends Model<OrderDoc> {
    build: (attrs: IOrder) => OrderDoc;
};

const orderSchema = new Schema({
    userId: {
        type: String,
        require: [true, "user Id required"],
    },
    status: {
        type: String,
        require: [true, "status required"],
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

// orderSchema.pre("save", function (done) {
//     this.$where = {
//         version: this.get("version") - 1
//     };

//     done();
// });

orderSchema.statics.build = (attrs: IOrder) => {
    return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };