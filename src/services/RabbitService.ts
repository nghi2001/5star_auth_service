import amqp, {Channel, Connection} from 'amqplib';


class RabbitService {
    RABBIT_HOST:string;
    RABBIT_PORT:string;
    RABBIT_USERNAME:string;
    RABBIT_PASS:string
    constructor() {
        this.RABBIT_HOST = process.env.RABBIT_HOST || 'localhost';
        this.RABBIT_PORT = process.env.RABBIT_PORT || '5672';
        this.RABBIT_USERNAME = process.env.RABBIT_USERNAME || 'guest';
        this.RABBIT_PASS = process.env.RABBIT_PASSWORD || 'guest'
    }

    async connect() {
        let connect:Connection = await amqp.connect(`amqp://${this.RABBIT_USERNAME}:${this.RABBIT_PASS}@${this.RABBIT_HOST}:${this.RABBIT_PORT}`)
        return connect
    }

    async sendMessage(queue='send_mail', content:string) {
        
        let conn = await this.connect();
        let chanel:Channel = await conn.createChannel()
        chanel.assertQueue(queue);

        chanel.sendToQueue(queue, Buffer.from(content));
    }
}

export default new RabbitService()