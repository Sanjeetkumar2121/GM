# GM App - Opportunities Hub

A comprehensive platform for discovering and applying to opportunities, managing tasks, and tracking submissions.

## Features

- **User Authentication**: Sign up and log in to access personalized content
- **Opportunities Discovery**: Browse and apply to available opportunities
- **Task Management**: View assigned tasks and track completion status
- **Submissions**: Submit task completions with file/link uploads
- **Dashboard**: Personalized overview of your activities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API
- **Routing**: Next.js App Router

## Project Structure

```
/app                      # Next.js app directory
  /dashboard             # Dashboard page
  /login                 # Login page
  /signup                # Sign up page
  /opportunities         # Opportunities listing and detail pages
  /tasks                 # Tasks listing and detail pages
  /submissions           # Submissions management page
  layout.jsx             # Root layout
  page.jsx               # Home page
  globals.css            # Global styles

/components              # Reusable React components
  Navbar.jsx             # Navigation bar
  Toast.jsx              # Toast notifications
  OpportunityCard.jsx    # Opportunity card component
  TaskCard.jsx           # Task card component
  LoadingSpinner.jsx     # Loading indicator

/contexts                # React Context providers
  AuthContext.jsx        # Authentication state
  ToastContext.jsx       # Toast notification state

/hooks                   # Custom React hooks
  useFetch.js            # Data fetching hook

/lib                     # Utility functions and services
  apiService.js          # API service with axios
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sanjeetkumar2121/GM.git
cd GM
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API configuration:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application expects the following API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/opportunities` - List all opportunities
- `GET /api/opportunities/:id` - Get opportunity details
- `POST /api/opportunities/:id/apply` - Apply to an opportunity
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/submissions` - Create a submission
- `GET /api/submissions` - List user submissions
- `DELETE /api/submissions/:id` - Delete a submission

## Features in Detail

### Authentication
- User registration with form validation
- Login with email and password
- Session management using local storage
- Protected routes for authenticated users

### Opportunities
- Browse all available opportunities
- View detailed opportunity information
- Apply to opportunities with confirmation
- Track application status on dashboard

### Tasks
- View assigned tasks with descriptions
- Track task completion status
- Submit task completions with files or links
- View submission feedback from administrators

### Submissions
- View all submitted tasks
- Check submission status (pending, approved, rejected)
- View feedback from reviewers
- Delete draft submissions

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For support, email support@gmapp.com or open an issue on GitHub.
