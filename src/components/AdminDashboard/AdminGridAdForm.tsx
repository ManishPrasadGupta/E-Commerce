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
    } catch (err: unknown) {
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
      className="max-w-lg mx-auto mt-8 bg-slate-300 rounded-2xl shadow-2xl p-6 md:p-10 space-y-7"
    >
      <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
        Add Grid Ad
      </h2>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Enter ad title"
          className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Short ad description"
          className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          rows={3}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Thumbnail URL</label>
        <input
          type="text"
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          required
          placeholder="https://your-image-url.com"
          className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        {form.thumbnail && (
          <div className="flex justify-center mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.thumbnail}
              alt="Thumbnail Preview"
              className="h-24 w-24 object-cover rounded-lg border mt-2 shadow"
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/96?text=No+Image";
              }}
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white text-lg font-bold py-3 shadow-md transition disabled:bg-gray-400 ${
          loading ? "cursor-not-allowed opacity-80" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Ad"}
      </button>
      {message && (
        <div
          className={`mt-2 text-center text-base font-medium ${
            message.toLowerCase().includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default AdminGridAdForm;