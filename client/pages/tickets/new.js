import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const newTicket = () => {

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const { sendRequest, errors } = useRequest();

    const onSubmit = event => {
        event.preventDefault();

        sendRequest({
            url: '/api/tickets',
            method: 'post',
            body: {
                title,
                price,
            },
            onSuccess: (ticket) => Router.push("/"),
        });
    };

    const onBlur = () => {
        const value = parseFloat(price);

        if (isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    return (
        <div>
            <h1>Create a ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input value={price} onBlur={onBlur} onChange={e => setPrice(e.target.value)} className="form-control" />
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default newTicket;