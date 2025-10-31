import { Handler } from "@netlify/functions";

interface User {
  id: number;
  name: string;
  email: string;
}

export const handler: Handler = async (event) => {
  // Simulate database data
  const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  try {
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(users),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};