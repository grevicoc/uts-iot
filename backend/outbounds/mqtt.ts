import {connect} from "mqtt"

const PORT = 15393
const HOST = "tcp://0.tcp.ap.ngrok.io:" + PORT

export default function CreateClient(topic: string){
    console.log(HOST);
    const client = connect(HOST);
    client.on('error', (err) => {
        console.log(err);
        client.end();
    });

    client.on('connect', () => {
        console.log(`mqtt client connected`);
    });

    client.subscribe(topic, {qos: 0});

    client.on('message', function (_topic, message) {
        console.log(message.toString());
    });

    client.on('close', () => {
        console.log(`mqtt client disconnected`);
    });

    return client;
}