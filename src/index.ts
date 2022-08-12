import _ from 'lodash'
import { DeleteMessageCommand, GetQueueUrlCommand, ReceiveMessageCommand, ReceiveMessageCommandInput, SendMessageCommand, SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs'
import { fromIni } from '@aws-sdk/credential-provider-ini'
import Env from '@winkgroup/env'

export default class MegaSQS {
    url:string
    sqsClient:SQSClient

    constructor(sqsUrl:string, inputOptions?:SQSClientConfig) {
        const options:SQSClientConfig = _.defaults(inputOptions, {
            credentials: fromIni({ filepath: Env.get('AWS_CREDENTIALS_FILE_PATH', 'awsCredentials') })
        })
        
        this.url = sqsUrl
        this.sqsClient = new SQSClient(options)
    }

    async send(message:string) {
        const params = {
            QueueUrl: this.url,
            MessageBody: message
        }

        return this.sqsClient.send(new SendMessageCommand(params))
    }

    async deleteMessage(ReceiptHandle:string) {
        const deleteParams = {
            QueueUrl: this.url,
            ReceiptHandle: ReceiptHandle,
        }

        return this.sqsClient.send(new DeleteMessageCommand(deleteParams))
    }

    async receive(inputParams?:ReceiveMessageCommandInput) {
        const params = _.defaults(inputParams, {
            QueueUrl: this.url,
            WaitTimeSeconds: 20
        })

        return this.sqsClient.send(new ReceiveMessageCommand(params))
    }

    static async getUrl(name:string, inputOptions?:SQSClientConfig) {
        const options:SQSClientConfig = _.defaults(inputOptions, {
            credentials: fromIni({ filepath: Env.get('AWS_CREDENTIALS_FILE_PATH', 'awsCredentials') })
        })

        const sqsClient = new SQSClient(options)
        const data = await sqsClient.send(new GetQueueUrlCommand({ QueueName: name }))
        return data.QueueUrl
    }
}