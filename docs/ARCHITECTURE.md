My application follows a Layered Architecture Pattern, with clear separation between the frontend and backend components.

Frontend (React + Vite):

The frontend is built using React for the user interface, while Vite is used as the bundler for fast development and optimized builds.

The React components handle the rendering of the user interface, and React Router manages the routing within the app.

State management is handled by React's Context API or Redux to maintain and update the application’s state across components.

Backend (Node.js):

The backend is built using Node.js with the Express framework to handle API requests from the frontend.

The controller layer handles the business logic, such as interacting with the database and processing user requests.

The backend interacts with a database MongoDB to store and retrieve information, ensuring that all data is processed and managed securely.

| **Component Name** | **Purpose in Your System** | **License Type**                  | **Permissive or Copyleft?** |
| ------------------ | -------------------------- | --------------------------------- | --------------------------- |
| React              | Frontend UI framework      | MIT                               | Permissive                  |
| Express            | Backend server framework   | MIT                               | Permissive                  |
| Axios              | HTTP requests library      | MIT                               | Permissive                  |
| Tailwind.css       | Frontend UI components     | MIT                               | Permissive                  |
| MongoDB            | NoSQL database             | Server Side Public License (SSPL) | Copyleft                    |
