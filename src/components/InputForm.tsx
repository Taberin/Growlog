// src/components/InputForm.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface FormData {
    person: string;
    date: string;
    subject: string;
    totalQuestions: number;
    attemptedQuestions: number;
    correctQuestions: number;
}

export default function InputForm() {
    const [formData, setFormData] = useState<FormData>({
        person: "",
        date: new Date().toISOString().split("T")[0],
        subject: "",
        totalQuestions: 0,
        attemptedQuestions: 0,
        correctQuestions: 0,
    });

    const personList = process.env.NEXT_PUBLIC_PERSON_LIST?.split(",") || [];
    const subjectList = process.env.NEXT_PUBLIC_SUBJECT_LIST?.split(",") || [];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validasi 1: attempted tidak boleh lebih besar daripada totalQuestions
        if (formData.attemptedQuestions > formData.totalQuestions) {
            alert("Jumlah soal yang dikerjakan (attempted) tidak boleh lebih besar daripada total soal.");
            return;
        }

        // Validasi 2: correct tidak boleh lebih besar daripada attempted
        if (formData.correctQuestions > formData.attemptedQuestions) {
            alert("Jumlah soal yang benar (correct) tidak boleh lebih besar daripada jumlah soal yang dikerjakan (attempted).");
            return;
        }

        // Calculate attemptedPercent and correctPercent
        const attemptedPercent = (formData.attemptedQuestions / formData.totalQuestions) * 100;
        const correctPercent = (formData.correctQuestions / formData.totalQuestions) * 100;

        // Calculate scoreLabel based on correctPercent
        let scoreLabel = "";
        if (correctPercent >= 85) scoreLabel = "A";
        else if (correctPercent >= 80) scoreLabel = "A-";
        else if (correctPercent >= 75) scoreLabel = "B+";
        else if (correctPercent >= 70) scoreLabel = "B";
        else if (correctPercent >= 65) scoreLabel = "B-";
        else if (correctPercent >= 50) scoreLabel = "C";
        else if (correctPercent >= 40) scoreLabel = "D";
        else scoreLabel = "E";

        // Prepare the data to save to Firestore
        const dataToSave = {
            person: formData.person,
            date: formData.date,
            subject: formData.subject,
            totalQuestions: formData.totalQuestions,
            attempted: formData.attemptedQuestions, // renamed from attemptedQuestions
            attemptedPercent, // calculated percentage of attempted questions
            correct: formData.correctQuestions, // renamed from correctQuestions
            correctPercent, // calculated percentage of correct answers
            scoreLabel, // calculated score label
            createdAt: serverTimestamp(), // Firestore server time
            token: process.env.NEXT_PUBLIC_FIRESTORE_WRITE_TOKEN,  // Sertakan token untuk validasi
        };

        try {
            await addDoc(collection(db, "progressData"), dataToSave);
            alert("Data berhasil disimpan!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };


    return (
        <div className="box">
            <form onSubmit={handleSubmit}>
                {/* Person */}
                <div className="field">
                    <label className="label">Person</label>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select name="person" value={formData.person} onChange={handleChange} required>
                                <option value="">Pilih Person</option>
                                {personList.map((person, index) => (
                                    <option key={index} value={person}>
                                        {person}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="field">
                    <label className="label">Tanggal</label>
                    <div className="control">
                        <input
                            className="input"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Subject */}
                <div className="field">
                    <label className="label">Mata Pelajaran</label>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select name="subject" value={formData.subject} onChange={handleChange} required>
                                <option value="">Pilih Mata Pelajaran</option>
                                {subjectList.map((subject, index) => (
                                    <option key={index} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Total Questions */}
                <div className="field">
                    <label className="label">Jumlah Total Soal</label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            name="totalQuestions"
                            value={formData.totalQuestions}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Attempted Questions */}
                <div className="field">
                    <label className="label">Jumlah Soal yang Dikerjakan</label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            name="attemptedQuestions"
                            value={formData.attemptedQuestions}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Correct Questions */}
                <div className="field">
                    <label className="label">Jumlah Benar</label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            name="correctQuestions"
                            value={formData.correctQuestions}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="control">
                    <button className="button is-primary" type="submit">
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
