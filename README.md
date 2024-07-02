# CS50 WEB PROGRAMMING FINAL PROJECT: RESULT INSIGHT

## Result Insight: Result Analytics Website

[![Project Video](https://img.youtube.com/vi/8DYJvP8mj5k/0.jpg)](https://youtu.be/8DYJvP8mj5k)

Result Insight is a web application built with Django and Next.js that empowers the CSE Department, students, and faculty with valuable insights into academic performance, trends, and opportunities for improvement. It goes beyond typical student information systems by providing interactive features and data visualizations.

## Key Features:

- **Personalized Student Profiles:** Students can access detailed report cards, simulate grade recalculations, and follow other students to track their progress.
- **Session-wise Ranking:** Compare student performance across different academic sessions, identifying trends and evaluating departmental effectiveness.
- **Advanced Data Visualization:** Interactive charts and graphs present complex academic data in a user-friendly and insightful manner, allowing for easy analysis of trends.
- **Data-Driven Decisions:** Provides data-backed insights to inform curriculum development, student support, and faculty evaluation.

## Distinctiveness and Complexity:

Result Insight stands out from other CS50 Web Programming projects by:

This project stands out because it combines complex data visualization and analysis without being a typical social media or e-commerce platform. Built using Django and Next.js, it features session-wise analysis, ranking, and personalized student profiles. The integration between frontend and backend includes advanced functionalities like user authentication, follow/unfollow capabilities, and data scraping from the university's public domain.

## A Glimpse Inside:

### Frontend:

- **Home Page:** Introduces Result Insight's capabilities and navigates to key features.
- **Subjects Page:** Analyzes individual subjects across semesters, revealing performance trends.
- **Session Page:** Browses rankings for specific academic sessions.
- **Ranking Page:** Displays session-specific rankings, allowing comparisons.
- **Student Profile:** Accesses detailed report cards, grade simulations, and following functionality.
- **Following Page:** View the profiles of followed students.
- **User Profile:** Manages user settings, including default session preferences.

### Backend:

- **Django REST Framework API:** Provides a robust API for data access and manipulation.
- **Authentication & Authorization:** Securely manages user logins and permissions using Simple JWT.
- **Data Scraping:** Retrieves academic data from the university's public domain, overcoming dynamic website layouts and data inconsistencies.
- **Database Management:** Manages user information, student records, subjects, and grades using Django models.

### Folder Structure

#### ResultInsight_Frontend (Next.js Version: Next.js 14.2.4)

```
├── app
│   ├── components
│   │   ├── axiosInstance.js
│   │   ├── Navigation.js
│   │   ├── ResultSheet.js
│   │   └── StudentCard.js
│   ├── context
│   │   └── AuthContext.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── login
│   │   └── page.js
│   ├── page.js
│   ├── ranking
│   │   └── [session]
│   │       └── page.js
│   ├── register
│   │   └── page.js
│   ├── session
│   │   └── page.js
│   ├── student
│   │   └── [reg_no]
│   │       └── page.js
│   ├── styles
│   ├── subjects
│   │   └── page.js
│   └── user
│       ├── following
│       │   └── page.js
│       └── profile
│           └── page.js
├── jsconfig.json
├── middleware.js
├── next.config.mjs
└── utils
    ├── auth.js
    ├── fetch.js
    ├── post.js
    └── subject_management.js
```

#### ResultInsight_Backend (Django Version: Django 5.0.6)

```
├── api
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── db.sqlite3
├── manage.py
├── ResultInsight_Backend
│   ├── settings.py
│   ├── urls.py
├── scripts
│   ├── script_1_import_subject_and_subjectGrade.py
│   └── script_2_import_student.py
└── utility
    ├── files
    │   ├── 2018-2019.csv
    │   ├── 2019-2020.csv
    │   ├── 2020-2021.csv
    │   ├── 2021-2022.csv
    │   ├── 2022-2023.csv
    │   └── Subject_info.csv
    └── webscraper.py
```

## How to Run Result Insight:

### Prerequisites:

- Python 3.8+
- Node.js (LTS version)
- npm

### Setting up the Frontend (Next.js):

1. Navigate to the `ResultInsight_Frontend` folder.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev` (access at `localhost:3000`)

### Setting up the Backend (Django):

1. Navigate to the `ResultInsight_Backend` folder.
2. Create a virtual environment: `python -m venv .venv`
3. Activate the virtual environment: `.venv/Scripts/activate` (Windows) or `.venv/bin/activate` (Linux/macOS)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the Django server: `python manage.py runserver` (access at `localhost:8000`)

## Files Information:

#### Backend (Django)

- **models.py:** Defines models for User, Student, Subject, and SubjectGrade.
- **serializers.py:** Serializes data for JSON parsing.
- **views.py:** Contains views for user actions and data handling.
- **admin.py:** Registers models for the Django admin panel.
- **urls.py:** Maps URLs to views.

#### Frontend (Next.js)

- **axiosInstance.js:** Configures Axios for API requests.
- **Navigation.js:** Navigation component.
- **ResultSheet.js:** Displays student result sheet.
- **StudentCard.js:** Displays student information.
- **AuthContext.js:** Manages authentication state.
- **globals.css:** Global CSS styles.
- **page.js:** Main home page.
- **login/page.js:** Login page.
- **register/page.js:** Registration page.
- **ranking/[session]/page.js:** Session-specific ranking page.
- **session/page.js:** Session browsing page.
- **student/[reg_no]/page.js:** Student profile page.
- **user/following/page.js:** Followed students page.
- **user/profile/page.js:** User profile page.
- **utils:** Utility functions for authentication, data fetching, posting, and subject management.


## Acknowledgments:

- CS50 Web Programming with Python and JavaScript course
- Django and Next.js communities
- University data sources
