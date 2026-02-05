# Authentication Basics (JWT based)

## Authentication vs Authorization

Authentication and Authorization are two fundamental security processes that work together to control access to systems and data.

- **Authentication:** Confirms the user’s identity (proves who the user is).
- **Authorization:** Controls what the verified user is allowed to do (decides what they can access).
- **Order:** Authentication always happens first, and authorization follows afterward.

### Authentication

Authentication is the process of verifying the identity of a user or system. It ensures that the user is legitimate by validating credentials like passwords, OTPs, or biometrics.

#### How it works:

- User enters credentials (password, OTP, biometrics)
- System verifies the credentials
- If valid, the user is successfully authenticated

### Authorization

Authorization determines the access rights and permissions of an authenticated user. It decides what resources the user can access and what actions they are allowed to perform.

#### How it works:

- System checks the user’s roles or permissions
- Grants or denies access to resources
- Ensures the user can perform only allowed actions

**Reference**: [Authentication vs Authorizaiton](https://www.geeksforgeeks.org/computer-networks/difference-between-authentication-and-authorization/)

## Why JWT is used

HTTP is **stateless** .

That means:

- Server does NOT remember users between requests
- Every request is independent

But apps need:

- Login
- Authentication
- Authorization

JWT solves **stateless authentication**

### What JWT gives us

- User logs in once
- Server gives a **token**
- Client sends token with every request
- Server verifies token
- No session storage on server

So JWT is used for:

- Authentication
- Authorization
- Scalability (no session DB)
- Microservices
- APIs (mobile + web)

### How JWT works

In authentication, when the user successfully logs in using their credentials, a JSON Web Token will be returned. Since tokens are credentials, great care must be taken to prevent security issues. In general, you should not keep tokens longer than required.

Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the **Authorization** header using the **Bearer** schema. The content of the header should look like the following:

```
Authorization: Bearer <token>
```

This can be, in certain cases, a stateless authorization mechanism. The server's protected routes will check for a valid JWT in the `Authorization` header, and if it's present, the user will be allowed to access protected resources. If the JWT contains the necessary data, the need to query the database for certain operations may be reduced, though this may not always be the case.

Note that if you send JWT tokens through HTTP headers, you should try to prevent them from getting too big. Some servers don't accept more than 8 KB in headers. If you are trying to embed too much information in a JWT token, like by including all the user's permissions, you may need an alternative solution, like [Auth0 Fine-Grained Authorization](https://fga.dev/).

### JWT structure

JWT has **3 parts**

```
header.payload.signature
```

#### Header

- Token type
- Algorithm

#### Payload

- User info (id, role, email)
- This is **NOT encrypted**
- Just encoded

Never put sensitive data here (passwords)

#### Signature

- Ensures token is not tampered
- Created using secret key

If someone changes payload → signature breaks → token invalid

**Reference**: [JWT Introduction](https://www.jwt.io/introduction)

## Access Token vs Refresh Token

OAuth 2.0 and OpenID Connect (OIDC) use tokens instead of traditional usernames and passwords to grant access to secure resources. This makes the login process easier and more secure.

There are two main types of tokens in OAuth: [**access token**](https://www.geeksforgeeks.org/git/how-to-generate-personal-access-token-in-github/) and [**refresh Token**](https://www.geeksforgeeks.org/node-js/jwt-authentication-with-refresh-tokens/). Access tokens are used to access resources, while refresh tokens are used to get new access tokens when the old ones expire. Both access and refresh tokens often use a format called JSON Web Token(JWT). JWTs are compact, and self-contained, and have become the standard for securely sharing authentication information across different platforms.

### What is an access token?

An access token is like a digital key, often in the form of a JWT, that lets users access resources without needing to log in repeatedly.

- A user wants to access resources through a client app.
- The user gives permission for the app to get an access token from an authorization server.
- The authorization server sends an access token to the app.
- The app checks the token and, if valid, allows the user to access the resources.

Access tokens usually have a very short lifespan: in many cases, they last only a few hours. For example, the access token lifespan in Microsoft's identity platform is between 30-90 minutes by default. These are also variable, assigned randomly to a value in the range.

### What is a Refresh Token?

A refresh token is a special token that extends the life of an access token. When an access token expires, a refresh token can be used to get a new one without making the user log in again. Refresh tokens are usually stored securely on the authorization server.

They work together with access tokens to allow longer sessions, improving user experience and security. Unlike access tokens, refresh tokens last much longer-for example, up to 90 days in some systems. While not always necessary, they make managing sessions easier and more secure.

### When to Use Each Type of Token

- **Access Tokens:** Access tokens are great if you want a passwordless login for your software. They work best when users need to access shared resources, like when someone needs to view or edit files owned by someone else. Access tokens make this process easier and more secure.
- **Refresh Tokens:** When you use access tokens, it's usually a good idea to also use refresh tokens, especially if users are likely to stay logged in for a long time without refresh tokens, users would have log in again frequently, which can be annoying. Refresh Tokens the session going smoothly without compromising security.
- **When to skip Refresh Tokens:** There are times when long-term access isn't necessary. In these cases, you might not need to use refresh tokens at all.

**Reference:** [Access Token vs Refresh Token: A Breakdown](https://www.geeksforgeeks.org/javascript/access-token-vs-refresh-token-a-breakdown/)
