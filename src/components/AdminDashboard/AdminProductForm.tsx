"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { apiClient, ProductFormData } from "@/lib/api-client";
import Image from "next/image";
import { useNotification } from "../Notification";
import FileUpload from "../FileUpload";

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    watch,
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: [],
      variants: [
        {
          type: "",
          price: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const getFullImageUrl = (filename: string) => {
    if (filename.startsWith("http")) return filename;
    return `https://ik.imagekit.io/manish0201/${filename}`;
  };

  const handleUploadSuccess = (response: IKUploadResponse) => {
    const currentImages = getValues("imageUrl") || [];
    const filename = response.url.split("/").pop() || "";
    setValue("imageUrl", [...currentImages, filename]);
    showNotification("Image uploaded successfully!", "success");
  };

  const handleRemoveImage = (idx: number) => {
    const images = getValues("imageUrl") || [];
    setValue(
      "imageUrl",
      images.filter((_: string, i: number) => i !== idx)
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");
      setValue("name", "");
      setValue("description", "");
      setValue("imageUrl", []);
      setValue("variants", [
        {
          type: "",
          price: 0,
        },
      ]);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-slate-400 rounded-xl shadow-lg p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-2">Add New Product</h2>
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">Product Name</label>
        <input
          type="text"
          className={`input input-bordered w-full bg-white text-black border placeholder-gray-400 ${errors.name ? "input-error" : ""}`}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <span className="text-error text-xs mt-1 block">{errors.name.message}</span>
        )}
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          className={`textarea textarea-bordered w-full min-h-[96px] bg-white text-black border placeholder-gray-400 ${errors.description ? "textarea-error" : ""}`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-xs mt-1 block">{errors.description.message}</span>
        )}
      </div>
      {/* Images */}
      <div>
        <label className="block text-sm font-semibold mb-2">Product Images</label>
        <FileUpload onSuccess={handleUploadSuccess} />
        {watch("imageUrl")?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {watch("imageUrl").map((url, idx) => (
              <div key={idx} className="relative group">
                <Image
                  src={getFullImageUrl(url)}
                  alt="Uploaded"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-md object-cover border border-gray-200 shadow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Top Product */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isTopProduct"
          className="checkbox"
          {...register("isTopProduct")}
        />
        <label htmlFor="isTopProduct" className="text-sm font-medium">
          Mark as Top Product
        </label>
      </div>

      {/* Variants */}
      <div>
        <div className="flex  justify-between items-center mb-2">
          <span className="font-semibold text-base">Variants</span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => append({ type: "", price: 0 })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Variant
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className="bg-sky-200 p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Color/Type</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.variants?.[idx]?.type ? "input-error" : ""}`}
                  {...register(`variants.${idx}.type`, { required: "Type is required" })}
                  placeholder="e.g. Black, 64GB, Large"
                />
                {errors.variants?.[idx]?.type && (
                  <span className="text-error text-xs mt-1 block">
                    {errors.variants[idx]?.type?.toString()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`input  input-bordered w-full ${errors.variants?.[idx]?.price ? "input-error" : ""}`}
                  {...register(`variants.${idx}.price`, {
                    valueAsNumber: true,
                    required: "Price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" },
                  })}
                  placeholder="0.00"
                />
                {errors.variants?.[idx]?.price && (
                  <span className="text-error text-xs mt-1 block">
                    {errors.variants[idx]?.price?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-error btn-sm self-center"
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
                title="Remove variant"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary w-full bg-blue-800 text-white text-base font-bold py-2 mt-4"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
}