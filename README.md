To use my project, follow these steps:

1. **Clone the repository**

   ```
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install Backend Dependencies**

   Install Python dependencies:

   ```
   pip install -r rest_react_backend/requirements.txt
   ```

3. **Start the Backend (Django)**

   Navigate to the Django project directory:

   ```
   cd rest_react_backend
   ```

   Apply migrations:

   ```
   python manage.py migrate
   ```

   Start the Django development server:

   ```
   python manage.py runserver
   ```

   The server will start at [http://localhost:8000](http://localhost:8000).

4. **Run the Frontend (Next.js)**

   Navigate to the Next.js project directory:

   ```
   cd ../my-react_frontend
   ```
   Install Dependencies of the Next.js development server:

   ```
   npm install
   ```
   Start the Next.js development server:

   ```
   npm run dev
   ```

   The Next.js application will be accessible at [http://localhost:3000](http://localhost:3000).

**Accessing the Application:**

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to interact with the Next.js frontend connected to the Django backend.

Hope you find this helpful!

Thank you.
