"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Timestamp } from "firebase/firestore";

interface ProgressData {
  person: string;
  date: string;
  subject: string;
  totalQuestions: number;
  attempted: number;
  attemptedPercent: number;
  correct: number;
  correctPercent: number;
  scoreLabel: string;
  createdAt: Timestamp; // Firestore Timestamp
}

export default function DataPage() {
  const [data, setData] = useState<ProgressData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "progressData"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const progressList = querySnapshot.docs.map((doc) => doc.data() as ProgressData);
      setData(progressList);
    };

    fetchData();
  }, []);

  // Function to get the appropriate class based on the scoreLabel
  const getTagClass = (scoreLabel: string) => {
    if (scoreLabel.includes("A")) {
      return "tag is-primary"; // For "A" and "A-"
    } else if (scoreLabel.includes("B")) {
      return "tag is-info"; // For "B", "B+", "B-"
    } else if (scoreLabel === "C") {
      return "tag is-warning"; // For "C"
    } else {
      return "tag is-danger"; // For "D" and "E"
    }
  };

  return (
    <div>
      <h1 className="title">GrowLog Data Progress</h1>
      <p className="subtitle">Data progress belajar.</p>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Person</th>
            <th>Mata Pelajaran</th>
            <th>Soal Dikerjakan</th>
            <th>Soal Benar</th>
            <th>Score Label</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.person}</td>
              <td>{item.subject}</td>
              <td>{item.attempted} / {item.totalQuestions} ({item.attemptedPercent.toFixed(2)}%)</td>
              <td>{item.correct} / {item.totalQuestions} ({item.correctPercent.toFixed(2)}%)</td>
              {/* Apply class based on scoreLabel */}
              <td><span className={getTagClass(item.scoreLabel)}>{item.scoreLabel}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
