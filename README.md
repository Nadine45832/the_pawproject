# The Paw Project

## Description
The Paw Project is a web application designed to help furry friends and their owners. It includes features for user authentication, profile management, and managing pet information such as adoption status, age, and breed. This README will guide you through setting up the project and using the various API endpoints.

# Installation
1. Clone the Repository

```bash
git clone https://github.com/Nadine45832/the_pawproject.git
cd the_pawproject
```

2. Install Dependencies
```bash
npm install
```

3. Start the Server

    To start the development server:

```bash
npm run start
```

## Endpoints

### Pets API
1. Get All Pets
    - **Endpoint**: `GET` `/pets`
    - **Description**: Retrieves a list of all pets in the database.
    - **Authentication**: None required.
    - **Response**: Returns an array of pets with details like name, description, breed, adoptionStatus, age, and photoURL.

2. Get Pet by ID
    - **Endpoint**: `GET` `/pets/:id`
    - **Description**: Fetches details of a specific pet by ID.
    - **Authentication**: None required.
    - **Parameters**:
        - `id`: The unique ID of the pet.
    - **Response**: Returns the pet object if found, otherwise an error message.
3. Add a New Pet
    - **Endpoint**: `POST` `/pets/add`
    - **Description**: Adds a new pet to the database.
    - **Authentication**: Admin required.
    - **Request Body**:
        ```json
        {
            "name": "Rocky",
            "description": "A loyal and spirited dog.",
            "breed": "Boxer",
            "adoptionStatus": "Available",
            "age": 2,
            "photoURL": "http://example.com/photo.jpg"
        }
        ```
    - **Response**: Returns the newly created pet object.

4. Update a Pet
    - **Endpoint**: `PUT` `/pets/update/:id`
    - **Description**: Updates details of a specific pet in the database.
    - **Authentication**: Admin required.
    - **Request Body**:
        ```json
        {
            "name": "Bella",
            "description": "An energetic and friendly dog.",
            "breed": "Golden Retriever",
            "adoptionStatus": "Adopted",
            "age": 4,
            "photoURL": "http://example.com/photo2.jpg"
        }
        ```
    - **Response**: Returns the updated pet object.

5. Delete a Pet
    - **Endpoint**: `DELETE` `/pets/delete/:id`
    - **Description**: Deletes a pet from the database by its ID.
    - **Authentication**: Admin required.
    - **Parameters**: `id`: The unique ID of the pet.
    - **Response**: Returns a success message upon deletion.



### User API
1. User Sign Up
    - **Endpoint**: `POST` `/users/signup`
    - **Description**: Registers a new user.
    - **Request** Body:
        ```json
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "johndoe@example.com",
            "password": "P@ssw0rd!",
            "phoneNumber": "123-456-7890"
        }
        ```

    - **Response**: Returns user details and a success message.

2. User Login
    - **Endpoint**: `POST` `/users/login`
    - **Description**: Retrieves the authenticated user's details based on the token.
    - **Response**:
        ```json
        {
            "email": "johndoe@example.com",
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "phoneNumber": "123-456-7890",
            "role": "admin"
        }
        ```

3. Get Current User
    - **Endpoint**: GET /users/get-current-user
    - **Description**: Logs out the currently authenticated user.
    - **Authentication**: Required.

4. Get All Users
    - **Endpoint**: GET /users
    - **Description**: Retrieves a list of all registered users.
    - **Authentication**: None required.

5. Get User Information
    - **Endpoint**: GET /users/:uid
    - **Description**: Fetches details of a specific user by their unique ID.
    - **Authentication**: Required.
    - **Parameters**:
        - `uid`: The unique ID of the user.

6. Update User Information
    - **Endpoint**: PUT /users/:uid
    - **Description**: Updates user profile information.
    - **Authentication**: Required.
    - **Request Body**:
        ```json
        {
            "firstName": "John",
            "lastName": "Doe",
            "phoneNumber": "123-456-7890"
        }
        ```

    - **Response**: Returns the updated user details.

7. Reset User Password
    - **Endpoint**: PUT /users/reset-password/:uid
    - **Description**: Resets a user’s password.
    - **Authentication**: Required.
    - **Request Body**:
        ```json
        {
            "password": "NewP@ssw0rd!"
        }
        ```
    - **Response**: Returns a success message if password reset is successful.

## Error Handling

Errors are returned in JSON format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "error message"
    }
  ]
}
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.