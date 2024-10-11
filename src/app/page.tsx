"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import ExpertSystem from "../components/ExpertSystem";

// Register chart.js components as before...
import { Chart as ChartJS, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from "chart.js";
ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

// Data interface
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
  const [filter, setFilter] = useState("7days"); // Default time filter
  const [personFilter, setPersonFilter] = useState("All"); // Default person filter
  const [subjectFilter, setSubjectFilter] = useState<string[]>(["All"]); // Default subject filter to All

  // Fetching from environment and adding "All" option
  const personList = ["All", ...(process.env.NEXT_PUBLIC_PERSON_LIST?.split(",") || [])];
  const subjectList = process.env.NEXT_PUBLIC_SUBJECT_LIST?.split(",") || [];

  // Fetch data based on filters
  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      let startDate = new Date();
  
      // Calculate start date based on the time filter
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
  
      // Convert startDate to YYYY-MM-DD format string
      const formattedStartDate = startDate.toISOString().split("T")[0];
  
      // Create the query with the "date" field instead of "createdAt"
      let conditions: any[] = [where("date", ">=", formattedStartDate)];
  
      // Apply person filter if not "All"
      if (personFilter !== "All") {
        conditions.push(where("person", "==", personFilter));
      }
  
      // Apply subject filter only if specific subjects are selected (excluding "All")
      if (subjectFilter.length > 0 && !subjectFilter.includes("All")) {
        conditions.push(where("subject", "in", subjectFilter));
      }
  
      const q = query(collection(db, "progressData"), ...conditions);
      const querySnapshot = await getDocs(q);
      const progressList = querySnapshot.docs.map((doc) => doc.data() as ProgressData);
      setData(progressList);
    };
  
    fetchData();
  }, [filter, personFilter, subjectFilter]); // Refetch when any filter changes
  

  // Handle time filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // Handle person filter change
  const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPersonFilter(e.target.value);
  };

  // Handle subject filter change (checkbox)
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSubject = e.target.value;
    const isChecked = e.target.checked;

    if (selectedSubject === "All") {
      // If "All" is checked, select all subjects
      setSubjectFilter(isChecked ? ["All", ...subjectList] : []);
    } else {
      setSubjectFilter((prev) => {
        // Remove "All" if a specific subject is unchecked
        const updated = isChecked ? [...prev, selectedSubject] : prev.filter((subj) => subj !== selectedSubject);

        // If all subjects are selected, add "All"
        if (updated.length === subjectList.length) {
          return ["All", ...updated];
        }

        // If any subject is unchecked, remove "All"
        return updated.filter((subj) => subj !== "All");
      });
    }
  };

  // Data for charts (you can keep the charts from before)
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

  const subjects = Array.from(new Set(data.map((item) => item.subject))); // Unique subjects for charts
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

  const pieChartData = {
    labels: subjects,
    datasets: [
      {
        label: "Distribution",
        data: subjects.map((subject) =>
          data.filter((item) => item.subject === subject).reduce((acc, curr) => acc + curr.correct, 0)
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

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

        {/* Person Filter */}
        <div className="field">
          <label className="label">Filter by Person</label>
          <div className="control">
            <div className="select">
              <select value={personFilter} onChange={handlePersonChange}>
                {personList.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="field">
          <label className="label">Filter by Subject</label>
          <div className="control">
            {["All", ...subjectList].map((subject) => (
              <label key={subject} className="checkbox">
                <input
                  type="checkbox"
                  value={subject}
                  checked={subjectFilter.includes(subject)}
                  onChange={handleSubjectChange}
                />
                {subject}
              </label>
            ))}
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

        {/* Expert System */}
        <ExpertSystem filter={filter} personFilter={personFilter} />
      </div>
    </main>
  );
}
