"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { apiClient, ProductFormData } from "@/lib/api-client";
import Image from "next/image";
import FileUpload from "../FileUpload";
import { useToast } from "@/hooks/use-toast";

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    toast({
      title: "Success",
      description: "Image uploaded successfully!",
    });
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
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-slate-300 rounded-2xl shadow-2xl px-4 py-8 md:p-10 space-y-8 mt-6"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
        Add New Product
      </h2>
      {/* Product Name */}
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Product Name</label>
        <input
          type="text"
          className={`w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.name ? "border-red-400" : ""}`}
          {...register("name", { required: "Name is required" })}
          placeholder="Enter product name"
        />
        {errors.name && (
          <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
        )}
      </div>
      {/* Description */}
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Description</label>
        <textarea
          className={`w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-3 min-h-[96px] text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.description ? "border-red-400" : ""}`}
          {...register("description", { required: "Description is required" })}
          placeholder="Enter product description"
        />
        {errors.description && (
          <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>
        )}
      </div>
      {/* Images */}
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Product Images</label>
        <FileUpload onSuccess={handleUploadSuccess} />
        {watch("imageUrl")?.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-3">
            {watch("imageUrl").map((url, idx) => (
              <div key={idx} className="relative group">
                <Image
                  src={getFullImageUrl(url)}
                  alt="Uploaded"
                  width={90}
                  height={90}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
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
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          {...register("isTopProduct")}
        />
        <label htmlFor="isTopProduct" className="text-base font-medium text-gray-700">
          Mark as Top Product
        </label>
      </div>

      {/* Variants */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
          <span className="font-semibold text-lg text-gray-700">Variants</span>
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 border-blue-200 text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => append({ type: "", price: 0 })}
          >
            <Plus className="w-4 h-4" /> Add Variant
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 flex flex-col md:flex-row gap-4 items-end shadow">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1 text-gray-700">Color/Type</label>
                <input
                  type="text"
                  className={`w-full rounded-lg border-2 border-gray-200 bg-white p-2 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.variants?.[idx]?.type ? "border-red-400" : ""}`}
                  {...register(`variants.${idx}.type`, { required: "Type is required" })}
                  placeholder="e.g. Black, 64GB, Large"
                />
                {errors.variants?.[idx]?.type && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.variants[idx]?.type?.toString()}
                  </span>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1 text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`w-full rounded-lg border-2 border-gray-200 bg-white p-2 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.variants?.[idx]?.price ? "border-red-400" : ""}`}
                  {...register(`variants.${idx}.price`, {
                    valueAsNumber: true,
                    required: "Price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" },
                  })}
                  placeholder="0.00"
                />
                {errors.variants?.[idx]?.price && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.variants[idx]?.price?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-error btn-sm self-center mt-2 md:mt-0 bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition disabled:bg-gray-300"
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
        className="w-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white text-lg font-bold py-3 mt-4 shadow-md transition disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? (
          <span className="flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Product...
          </span>
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
}