"use client";
import React, { useState } from "react";
import { createAds } from "@/lib/api-client";

const AdminGridAdForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createAds(form);
      setMessage("Ad added successfully!");
      setForm({
        title: "",
        description: "",
        thumbnail: "",
      });
    }catch (err: unknown) {
      if (err instanceof Error) {
       setMessage(err.message);
      } else {
        setMessage("Failed to add ad.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded max-w-md mx-auto bg-slate-400"
    >
      <h2 className="flex text-2xl font-bold text-blue-900 mb-2">Add Ads</h2>
      <div>
        <label className="block font-semibold mb-1">Title:</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          rows={2}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Thumbnail URL:</label>
        <input
          type="text"
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Ad"}
      </button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
};

export default AdminGridAdForm;