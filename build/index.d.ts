import { ReceiveMessageCommandInput, SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
export default class MegaSQS {
    url: string;
    sqsClient: SQSClient;
    constructor(sqsUrl: string, inputOptions?: SQSClientConfig);
    send(message: string): Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
    deleteMessage(ReceiptHandle: string): Promise<import("@aws-sdk/client-sqs").DeleteMessageCommandOutput>;
    receive(inputParams?: ReceiveMessageCommandInput): Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
    static getUrl(name: string, inputOptions?: SQSClientConfig): Promise<string | undefined>;
}
