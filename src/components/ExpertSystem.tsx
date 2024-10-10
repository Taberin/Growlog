"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface ProgressData {
  person: string;
  date: string;
  subject: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  createdAt: Timestamp;
}

interface Conclusion {
  overallPerformance: string;
  bestSubject: string;
  worstSubject: string;
  trend: string;
  recommendation: string;
}

export default function ExpertSystem({ filter }: { filter: string }) {
  const [data, setData] = useState<ProgressData[]>([]);
  const [conclusion, setConclusion] = useState<Conclusion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      let startDate = new Date();

      // Calculate start date based on filter
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
  }, [filter]);

  useEffect(() => {
    if (data.length > 0) {
      generateConclusion();
    }
  }, [data]);

  // Function to generate expert system conclusions
  const generateConclusion = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;
    let subjectPerformance: { [key: string]: number } = {};

    data.forEach((item) => {
      totalCorrect += item.correct;
      totalQuestions += item.totalQuestions;
      if (subjectPerformance[item.subject]) {
        subjectPerformance[item.subject] += item.correct;
      } else {
        subjectPerformance[item.subject] = item.correct;
      }
    });

    // Overall performance
    const overallPerformance = totalCorrect / totalQuestions > 0.8 ? "Good" : totalCorrect / totalQuestions > 0.5 ? "Average" : "Needs Improvement";

    // Best and worst subject
    const subjects = Object.keys(subjectPerformance);
    const bestSubject = subjects.reduce((a, b) => (subjectPerformance[a] > subjectPerformance[b] ? a : b), subjects[0]);
    const worstSubject = subjects.reduce((a, b) => (subjectPerformance[a] < subjectPerformance[b] ? a : b), subjects[0]);

    // Performance trend (comparing first and last entries)
    const firstEntry = data[0];
    const lastEntry = data[data.length - 1];
    const trend = lastEntry.correct > firstEntry.correct ? "Improving" : lastEntry.correct < firstEntry.correct ? "Declining" : "Stable";

    // Recommendation based on performance
    const recommendation = overallPerformance === "Needs Improvement" ? "Focus on reviewing the materials and try more exercises." : 
      overallPerformance === "Average" ? "Keep practicing and improve on weak areas." : 
      "Great job! Keep up the good work!";

    setConclusion({
      overallPerformance,
      bestSubject,
      worstSubject,
      trend,
      recommendation,
    });
  };

  return (
    <div className="box">
      <h2 className="subtitle">Expert System Conclusion</h2>
      {conclusion ? (
        <div>
          <p><strong>Overall Performance:</strong> {conclusion.overallPerformance}</p>
          <p><strong>Best Subject:</strong> {conclusion.bestSubject}</p>
          <p><strong>Worst Subject:</strong> {conclusion.worstSubject}</p>
          <p><strong>Performance Trend:</strong> {conclusion.trend}</p>
          <p><strong>Recommendation:</strong> {conclusion.recommendation}</p>
        </div>
      ) : (
        <p>Loading expert analysis...</p>
      )}
    </div>
  );
}
