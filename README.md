# GrowLog

**GrowLog** is an application designed to track children's learning progress with features for data input, data visualization, and conclusion generation based on performance analysis. This app allows you to monitor and analyze the performance of children across various subjects.

## Key Features

- **Progress Input**: Input learning progress data, including subjects, the number of questions attempted, and correct answers.
- **Data Visualization**: Displays the child's performance development through **Line Chart**, **Bar Chart**, **Pie Chart**, and **Scatter Plot**.
- **Expert System**: Provides automatic conclusions based on the child’s performance analysis, including overall performance, best subject, trends, and recommendations.
- **Filters**: Allows filtering data based on time periods (7 days, 2 weeks, 1 month, 3 months).

## Tech Stack

This project is built with the following technologies:

- [**Next.js**](https://nextjs.org/): React framework for building modern web applications.
- [**React.js**](https://reactjs.org/): JavaScript library for building interactive user interfaces.
- [**Firebase Firestore**](https://firebase.google.com/docs/firestore): NoSQL database for storing progress data.
- [**Bulma**](https://bulma.io/): CSS framework used for responsive and modern design.
- [**Chart.js**](https://www.chartjs.org/): Powerful data visualization library for charts.
- [**react-chartjs-2**](https://react-chartjs-2.js.org/): Chart.js wrapper for React, used to create various interactive charts.
- [**Vercel**](https://vercel.com/): Hosting platform for deploying Next.js applications.

## How to Run the Project

### 1\. Clone the Repository

```bash
git clone https://github.com/username/growlog.git
cd growlog
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Set Up Environment Variables

Create a `.env.local` file and add the environment variables for Firebase and other configurations:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
NEXT_PUBLIC_SUBJECT_LIST=Math,Science,English,History
NEXT_PUBLIC_PERSON_LIST=Ali,Budi,Citra,Dewi
NEXT_PUBLIC_FIRESTORE_WRITE_TOKEN=YOUR_FIRESTORE_WRITE_TOKEN
```

### 4\. Run the Application

```bash
npm run dev
```

Open your browser and navigate to <http://localhost:3000>.

## Deploy to Vercel

You can easily deploy this application to Vercel by clicking the button below:

## Feedback and Feature Requests

I’m open to feedback and feature requests! If you have any suggestions, questions, or would like to contribute new features to this app, feel free to open an **issue** or submit a **pull request** in this repository.

You can also reach out to me via [email](mailto:your-email@example.com).

---

Thank you for using GrowLog! Together, let’s enhance the learning experience for children.