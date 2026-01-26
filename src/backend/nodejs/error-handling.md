# Error handling in Express JS and Middleware

## **What is Middleware**

Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.



***Middleware*** functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named `next`.

example ->
```tsx
const mw1 = (req: Request, res: Response, next: NextFunction) => {
    req.name = "Sajib Hasan";
    res.name = "Good";
    console.log("Middleware 1 passed and seted name property in req object.");
    next()
}
const handler = (req: Request, res: Response) => {
    res.status(200).json({message: "Hello World"});
};
app.use(mw1);

app.get("/", handler);
```

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.

Reference: [Middleware](https://expressjs.com/en/guide/using-middleware.html)

## **What is Middleware Chaining?**

Middleware Chaining is the concept where multiple middleware functions are applied in sequential order till they reach the final route handler. Here, each of the middleware functions performs certain tasks like data processing, logging, authentication, etc. Each of the middleware functions can able to modify the request or response objects, terminate the request-response cycle, or pass control to the next middleware using the **next()** function.

example →

```javascript
// middleware 1
const middleware1 = (req, res, next) => {
  // tasks
  next();
};
// middleware 2
const middleware2 = (req, res, next) => {
  // tasks
  next();
};
const controller = (req, res) => {
  // handle route tasks
  res.json({message: "Hello World"});
};

app.get("/my-route", middleware1, middleware2, controller);
```

middleware can be reused across multiple places.

Reference: [Middleware Chaining](https://www.geeksforgeeks.org/node-js/what-is-middleware-chaining-in-express-js-and-how-is-it-useful/)

## **Centralized error-handling Middleware**

this is a special middleware with 4 parameter `(err, req, res, next)`.

Express treat this 4 parameter middleware as error handling middleware.

```typescript
// crash handler
const crashMW = (req: Request, res: Response, next: NextFunction) => {
  next(new Error("Something went wrong!"));
};

app.get("/crash", crashMW, (req: Request, res: Response) => {
  res.status(200).json({ message: "everything ok" });
});
app.get("/test", (req: Request, res: Response) => {
  throw new Error("Testing error");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({ message: err.message });
});
```

## **Sync Error vs Async Error**

### Sync Error
Sync error are those which happends immediately. Express can catch sync error automatically.

example ->
```TS
app.get("/sync-err", (req: Request, res: Response) => {
    throw new Error("Something broke(this is a sync error)");
})
```

### Async Error
Async error are those which happends later. Like Promise, DB operation, API calls etc.

example ->
```TS
app.get("/async-err", async (req: Request, res: Response) => {
    // here this is not any valid endpoint, so it will bounce back an error and this is an async error which will be handled by error middleware(centrally)
    let response = await fetch("this is not any endpoint");
    let data = await response.json();

    res.json(data);
})
```

## **Why try/catch is not enough alone**

### Step 1: What `try/catch` REALLY does (only this)

`try/catch` is **pure JavaScript**.

It means:

> “If an error happens inside this function, catch it.”
> 

Example (normal JS):

```tsx
try {
thrownewError("Boom");
}catch (err) {
console.log("I caught it");
}

```

✔️ Works

✔️ Error is caught

✔️ JavaScript is happy

**But** JavaScript stopping an error ≠ Express knowing what to do.

---

### Step 2: What Express actually cares about

Express does **NOT** care that:

- You caught the error
- You logged the error

Express only cares about **one thing**:

> “Should I continue normal flow or send an error response?”
> 

Express decides this using:

- `next()` → normal flow
- `next(err)` → error flow

---

### Step 3: The BIG mistake beginners make

Look at this Express route:

```tsx
app.get("/user",async (req, res) => {
try {
thrownewError("DB failed");
  }catch (err) {
console.log(err);
  }
});
```

### What YOU think happens:

- Error caught
- But Express does not send error response

### What ACTUALLY happens:

- Error caught
- Express hears **nothing**
- Request **never ends**
- Client keeps waiting
- Backend looks “stuck”

Why?

Because:

> You caught the error
> 
> 
> but you **never told Express**
> 

---

### Step 4: How do you “tell” Express?

You tell Express using **`next(err)`**.

That’s it. No magic.

```tsx
app.get("/user",async (req, res, next) => {
try {
thrownewError("DB failed");
  }catch (err) {
next(err);
  }
});
```

Now Express thinks:

> “Ah, error happened. I know what to do.”
> 

And Express jumps to:

```tsx
app.use((err, req, res, next) => {
  res.status(500).json({message: err.message });
});

```

---

### Step 5: The ONE sentence you must remember

> try/catch catches the error, but next(err) tells Express.
> 

Say this sentence out loud once. That’s enough.

---

## Tiny mental picture (very important)

```
try/catch  → stops JavaScript crash
next(err)  → tells Expressto senderror response

```

They do **different jobs**.

---

## Why this matters for YOU (not theory)

Without `next(err)`:

- Your server doesn’t crash
- BUT your client hangs
- AND error middleware never runs

With `next(err)`:

- Client gets response
- Server stays alive
- Code stays clean