import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import YAML from 'yaml'

export async function generateCypher(prompt: string) {
  const credentialFile = fs.readFileSync("./openai.credential", "utf-8")
  const credential = YAML.parse(credentialFile)

  const configuration = new Configuration({
    apiKey: credential.openai.key,
  });

  const openai = new OpenAIApi(configuration, credential.openai.endpoint);

  const fullmessage = [
    {
      "role": ChatCompletionRequestMessageRoleEnum.System, 
      "content":"You are Cypher master, converting natural language request into Cypher queries. Just return the query, without explanation"
    },
    {
      "role": ChatCompletionRequestMessageRoleEnum.User,
      "content": "query all the ASSETS that has ATTACHMENT pointing to it"
    }
  ]
  return "some message"
  // let response = await openai.createChatCompletion({
  //   model: 'gpt-35', 
  //   messages: fullmessage,
  //   temperature: 0,
  //   max_tokens: 100,
  //   top_p: 0.95,
  //   frequency_penalty: 0,
  //   presence_penalty: 0 
  // })

  // return response.data.choices[0].message?.content
}
