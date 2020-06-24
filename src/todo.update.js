class Handler {
  constructor({dynamoSVC}){
    this.dynamo = dynamoSVC,
    this.dynamoTable = process.env.DYNAMODB_TABLE

  }

  formatUpdatedPayload(payload){
    const parsedPayload = JSON.parse(payload)
    return {
      TableName:this.dynamoTable,
      Key:{
        id:parsedPayload.id,
        working:parsedPayload.working
      },
      UpdateExpression: "set doing = :d",
      ExpressionAttributeValues:{
          ":d":true,
      },
      ReturnValues:"UPDATED_NEW"
    }
  }

  doneWorkingDynamo(payload){
    return this.dynamo.update(payload).promise()
  }


  handlerSuccessMsg(){
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Working is done",
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
      console.log("Iniciando...")
      const payload = event.body
      console.log("Pegando Payload...")
      const formattedPayload = this.formatUpdatedPayload(payload)
      console.log("Formatando Payload...")
      await this.doneWorkingDynamo(formattedPayload)
      console.log("Atualizando no Dynamo...")
      return this.handlerSuccessMsg()
    }catch(err){
      console.log("Error:", err)
      return this.handlerErrorMsg()
    }
  } 
}


const AWS = require("aws-sdk")
const DynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({
  dynamoSVC:DynamoDB,
})


module.exports = handler.main.bind(handler)
