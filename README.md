## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/the-krafty-koder/user-management.git
    cd user-management
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Firebase:**

    - A firestore database is already configured for the project. The service account key located in src/shared/firebase/serviceAccountKey.json is used to connect to the remote DB. I've intentionally added it to make project setup easier.

4.  **Environment Variables:**

    - A .env file is intentionally included as part of the project, containing environment variables required.
      ```
      FIREBASE_SERVICE_ACCOUNT_KEY=<path-to-account-key>
      WEBHOOK_SECRET_TOKEN=<secret-token>
      ```

5.  **Run the Application:**

    ```bash
    npm run start
    ```

## API Endpoints

### User Management

- **`POST /users`:** Create a new user.

  - Request Body:

    ```json
    {
      "name": "John Doe",
      "email": "john-doe@gmail.com",
      "phone": "+254792291300"
    }
    ```

  - Response:

    ```json
    {
      "id": "uwqcqNvIX4lvMkPvt6bq",
      "name": "John Doe",
      "email": "john-doe@gmail.com",
      "phone": "+1234567890"
    }
    ```

- **`GET /users`:** Get a paginated list of users.

  - Query Parameters:

    - `startAfter`: optional user id used to return users located after the given ID.
    - `limit`: Number of users to return. Defaults to 10

  - Response:

    - Body:

      - `users`: list of users.
      - `nextPageToken`: User id used as startAfter to query next page .

    ```json
    {
      "users": [
        {
          "id": "uwqcqNvIX4lvMkPvt6bq",
          "name": "John Doe",
          "email": "john-doe@gmail.com",
          "phone": "+1234567890"
        }
      ],
      "nextPageToken": "uwqcqNvIX4lvMkPvt6bq"
    }
    ```

- **`GET /users?startAfter=<user-id>&limit=<number>`:** Use query parameters to get a paginated list of users.

  - Query Parameters:

    - `startAfter`: optional user id used to return users located after the given ID.
    - `limit`: Number of users to return. Defaults to 10

  - Response:

    - Body:

      - `users`: list of users.
      - `nextPageToken`: User id used as startAfter to query next page. Wont be returned if next page is empty

  - Example

    `GET /users?startAfter=uwqcqNvIX4lvMkPvt&limit=10`

    - Response

    ```json
    {
      "users": []
    }
    ```

- **`GET /users/:id`:** Get a single user.

  - Example
    `GET /users/uwqcqNvIX4lvMkPvt6bq`

    - Response:

      ```json
      {
        "id": "uwqcqNvIX4lvMkPvt6bq",
        "name": "John Doe",
        "email": "john-doe@gmail.com",
        "phone": "+1234567890"
      }
      ```

- **`PATCH /users/:id`:** Update a user.

  - Example
    `PATCH /users/uwqcqNvIX4lvMkPvt6bq`

    - Request Body:

      ```json
      {
        "phone": "+254792291304"
      }
      ```

    - Response:

      ```json
      {
        "id": "uwqcqNvIX4lvMkPvt6bq",
        "name": "John Doe",
        "email": "john-doe@gmail.com",
        "phone": "+254792291304"
      }
      ```

### WhatsApp Webhook

- **`POST /webhook`:** Simulate WhatsApp message processing.

  - Headers:

    - `Authorization: Bearer <WEBHOOK_SECRET_TOKEN_IN_ENV_FILE>`

  - Request Body:

    ```json
    {
      "message": "Hello, WhatsApp!",
      "phone": "+1234567890"
    }
    ```

  - Response:

    ```json
    {
      "message": "Message processed successfully"
    }
    ```

  - If the message contains "help":

    ```json
    {
      "reply": "Support contact: support@company.com"
    }
    ```

## Design Decisions

**Pagination with Cursors:** Uses Firestore cursors to efficiently load large datasets, making pagination smooth and scalable.
**Rate Limiting:** Controls request flow with a simple in-memory Map to prevent abuse.
**Real-time Updates:** Uses WebSockets and Firestore's onSnapshot() to instantly send message updates to connected clients.
**Validation with DTOs:** Ensures data integrity using Data Transfer Objects (DTOs) and class-validator for input validation.
**Consistent Error Handling:** Global exception filters provide clear, structured error responses.
**Modular Structure:** Organizes code into NestJS modules for better reusability and maintainability.
**Authentication:** Secures the Webhook endpoint with a static token check.

## Testing

- **Unit and Integration Tests:** Run `npm test` to execute unit and integration tests.
- **End-to-End Tests:** Run `npm run test:e2e` to execute end-to-end tests.

## Future Enhancements

- Use Redis or a similar persistent store for rate limiting.
- Implement more advanced message processing logic in the webhook.
