import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const { name = "World" } = event.queryStringParameters || {};

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};