class Handler {
  constructor({dynamoSVC,uuid}){
    this.dynamo = dynamoSVC
    this.uuid = uuid
    this.dynamoTable = process.env.DYNAMODB_TABLE

  }

  formatPayload(payload){
    const parsedPayload = JSON.parse(payload)
    return {
      TableName:this.dynamoTable,
      Item:{
        id:this.uuid.v1(),
        ...parsedPayload,
        createdAt:new Date().toISOString()
      }
    }
  }

  insertDatabase(payload){
    return this.dynamo.put(payload).promise()
  }

  handlerSuccessMsg(){
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Insert sucessfull",
        },
        null,
        2
      ),
    }
  }

  handlerErrorMsg(){
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Internal Error!!",
        },
        null,
        2
      ),
    };
  }

  async main(event){
    try{
      console.log("Iniciando ...")
      const payload = event.body
      console.log("Pegando Payload ...")
      const formattedPayload = this.formatPayload(payload)
      console.log("Formatando Payload ...")
      await this.insertDatabase(formattedPayload)
      console.log("Inserindo no Dynamo Payload ...")
      return this.handlerSuccessMsg()
    }catch(err){
      console.log("Error:", err)
      return this.handlerErrorMsg()
    }
  } 
}


const AWS = require("aws-sdk")
const uuid = require("uuid")
const DynamoDB = new AWS.DynamoDB.DocumentClient()

const handler = new Handler({
  dynamoSVC:DynamoDB,
  uuid: uuid
})


module.exports = handler.main.bind(handler)
