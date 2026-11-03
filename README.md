# StudioSpace — Client

StudioSpace is a creative workspace rental marketplace where users can discover, book, and manage creative spaces. It connects creators with hosts who want to rent out photography studios, music suites, podcast rooms, workshops, and other creative spaces.

The client application provides a responsive and user-friendly interface for customers and studio hosts.

## Live Website

- **Live URL:** [Add your Vercel deployment URL]
- **Server API:** [Add your Render backend URL]

## Features

- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **User Authentication:** Register and log in using email/password or Google authentication.
- **User Profile:** Update your name, profile picture, and password.
- **Explore Studios:** Browse creative spaces with search, category filters, and sorting.
- **Studio Details:** View studio information, images, pricing, amenities, and host information.
- **Studio Management:** Hosts can add, update, view, and delete their studio listings.
- **Image Upload:** Upload studio and profile images directly from your device.
- **Studio Booking:** Book a workspace by selecting a date, time, and number of guests.
- **My Bookings:** View booking history and manage reservations.
- **Host Booking Management:** Hosts can review customer bookings, confirm reservations, cancel bookings, and mark bookings as completed.
- **Dashboard:** View studio statistics, booking information, and quick actions.
- **Booking Status:** Track Pending, Confirmed, Completed, and Cancelled reservations.
- **Notifications:** Display success and error messages using toast notifications.
- **Custom 404 Page:** Display a branded error page for invalid routes.

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Swiper
- Sonner
- Better Auth
- MongoDB (through the backend API)

## Project Structure

```text
studiospace-client/
├── app/
│   ├── about/
│   ├── add-studio/
│   ├── dashboard/
│   ├── host-bookings/
│   ├── login/
│   ├── my-bookings/
│   ├── my-listings/
│   ├── my-profile/
│   ├── register/
│   ├── studios/
│   ├── layout.tsx
│   ├── page.tsx
│   └── not-found.tsx
├── components/
│   ├── home/
│   ├── layout/
│   ├── studios/
│   └── ui/
├── lib/
├── public/
├── types/
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Kashpia-Tasnova/studiospace-client.git
```

### 2. Navigate to the project folder

```bash
cd studiospace-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use your deployed backend URL for production.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
```

## Authentication

StudioSpace uses Better Auth for user authentication.

Supported authentication methods:

- Email and password
- Google authentication

Authenticated users can access their profile, dashboard, studio management, and booking features.

## Deployment

The client application is deployed using Vercel.

For production deployment:

1. Connect the GitHub client repository to Vercel.
2. Configure the required environment variables.
3. Deploy the project.
4. Ensure the backend API is accessible from the deployed client.

## Author

**StudioSpace Project**

GitHub: [Kashpia-Tasnova](https://github.com/Kashpia-Tasnova)
