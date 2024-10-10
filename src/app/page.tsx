"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import ExpertSystem from "../components/ExpertSystem";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

// Data interface for Firestore documents
interface ProgressData {
  person: string;
  date: string;
  subject: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  createdAt: Timestamp; // Firestore Timestamp
}

export default function HomePage() {
  const [data, setData] = useState<ProgressData[]>([]);
  const [filter, setFilter] = useState("7days"); // Default filter

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      let startDate = new Date();

      // Calculate the start date based on the filter
      switch (filter) {
        case "7days":
          startDate.setDate(today.getDate() - 7);
          break;
        case "2weeks":
          startDate.setDate(today.getDate() - 14);
          break;
        case "1month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        case "3months":
          startDate.setMonth(today.getMonth() - 3);
          break;
        default:
          startDate.setDate(today.getDate() - 7);
      }

      const q = query(
        collection(db, "progressData"),
        where("createdAt", ">=", Timestamp.fromDate(startDate))
      );
      const querySnapshot = await getDocs(q);
      const progressList = querySnapshot.docs.map((doc) => doc.data() as ProgressData);
      setData(progressList);
    };

    fetchData();
  }, [filter]); // Fetch data when the filter changes

  // Filter change handler
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // Data for Line Chart (Correct Answers Over Time)
  const lineChartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Correct Answers",
        data: data.map((item) => item.correct),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Data for Bar Chart (Performance by Subject)
  const subjects = [...new Set(data.map((item) => item.subject))]; // Unique subjects
  const barChartData = {
    labels: subjects,
    datasets: [
      {
        label: "Correct Answers",
        data: subjects.map((subject) =>
          data.filter((item) => item.subject === subject).reduce((acc, curr) => acc + curr.correct, 0)
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Pie Chart (Distribution by Subject)
  const pieChartData = {
    labels: subjects,
    datasets: [
      {
        label: "Distribution",
        data: subjects.map((subject) =>
          data.filter((item) => item.subject === subject).reduce((acc, curr) => acc + curr.correct, 0)
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // Data for Scatter Plot (Attempted vs Correct)
  const scatterData = {
    datasets: [
      {
        label: "Attempted vs Correct",
        data: data.map((item) => ({
          x: item.attempted,
          y: item.correct,
        })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <main className="section">
      <div className="container">
        <h1 className="title">Data Visualization</h1>

        <ExpertSystem filter={filter} />

        {/* Filter for time range */}
        <div className="field">
          <label className="label">Filter by time range</label>
          <div className="control">
            <div className="select">
              <select value={filter} onChange={handleFilterChange}>
                <option value="7days">7 Days</option>
                <option value="2weeks">2 Weeks</option>
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="box">
          <h2 className="subtitle">Correct Answers Over Time (Line Chart)</h2>
          <Line data={lineChartData} />
        </div>

        {/* Bar Chart */}
        <div className="box">
          <h2 className="subtitle">Performance by Subject (Bar Chart)</h2>
          <Bar data={barChartData} />
        </div>

        {/* Pie Chart */}
        <div className="box">
          <h2 className="subtitle">Distribution by Subject (Pie Chart)</h2>
          <Pie data={pieChartData} />
        </div>

        {/* Scatter Plot */}
        <div className="box">
          <h2 className="subtitle">Attempted vs Correct (Scatter Plot)</h2>
          <Scatter data={scatterData} />
        </div>
      </div>
    </main>
  );
}
