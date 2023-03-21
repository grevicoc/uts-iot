import {connect} from "mqtt"
import { data } from "../global/data";

const PORT = 15714
const HOST = "tcp://0.tcp.ap.ngrok.io:" + PORT

export default function CreateClient(topic: string){
    const client = connect(HOST);
    client.on('error', (err) => {
        console.log(err);
        client.end();
    });

    client.on('connect', () => {
        console.log(`mqtt client connected`);
    });

    client.subscribe(topic, {qos: 0});

    client.on('message', function (topic, message) {
        if (topic === 'status'){
            data.push(message.toString());
        }
    });

    client.on('close', () => {
        console.log(`mqtt client disconnected`);
    });

    return client;
}