# Request Lifecycle in Node.js (Express)

This document explains how an HTTP request is processed inside a Node.js backend application using Express.js.

---

## 1. Client Sends Request

A client (browser, mobile app, Postman, frontend) sends an HTTP request to the server.

The request contains:

- HTTP method (GET, POST, PUT, DELETE)
- URL (path + query params)
- Headers
- Body (optional)

Example:

```
GET /users/123
```

---

## 2. Node.js HTTP Server Receives the Request

Node.js receives the request using its built-in HTTP module.

Node creates two objects:

- `req` → represents the incoming request
- `res` → represents the outgoing response

Express.js sits on top of Node’s HTTP module and manages the request flow.

---

## 3. Middleware Execution

Middleware are functions that execute **before the request reaches the controller**.

They run **in the order they are registered**.

Common middleware responsibilities:

- Logging
- Authentication & Authorization
- Parsing JSON (`express.json()`)
- Validation
- Error handling

Each middleware must either:

- Call `next()` → pass control to the next middleware
- Send a response → end the request lifecycle

If `next()` is not called, the request stops there.

---

## 4. Route Matching

After middleware execution, Express tries to match:

- HTTP method
- Request path

If a matching route is found:

- The corresponding controller function is executed

If no route matches:

- Express returns a `404 Not Found` response

---

## 5. Controller Layer

The controller is responsible for:

- Extracting data from `req`
- Calling business logic (service layer)
- Sending a response using `res`

Controllers should be:

- Thin
- Focused
- Free from complex business logic

Controllers act as a bridge between HTTP and application logic.

---

## 6. Service / Business Logic Layer

The service layer contains:

- Business rules
- Core application logic
- Data processing

Responsibilities include:

- Validating business conditions
- Calling databases
- Communicating with external APIs

This layer is independent of HTTP and is easier to test and reuse.

---

## 7. Database / External Operations

Database queries and external API calls are asynchronous.

Node.js uses:

- Event loop
- Non-blocking I/O

This allows Node to handle multiple requests efficiently while waiting for I/O operations to complete.

---

## 8. Sending the Response

Once processing is complete, the controller sends a response:

- Status code
- Response body (JSON, text, etc.)

Example:

```
res.status(200).json(data);

```

After the response is sent:

- The request lifecycle ends
- The connection may be reused (keep-alive)

---

## 9. Error Handling Flow

Errors can occur at any stage.

Express uses special **error-handling middleware**:

- Receives `(err, req, res, next)`
- Centralizes error responses
- Prevents application crashes

When an error occurs:

- Normal middleware is skipped
- Control jumps directly to error middleware

---

## 10. Summary

The request lifecycle in a Node.js backend follows this flow:

```
Client → Middleware → Route → Controller → Service → Database → Response

```

Understanding this lifecycle helps in:

- Writing clean backend code
- Debugging issues effectively
- Designing scalable applications