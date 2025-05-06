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
    getValues ,
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
    // If it's already a full URL, return as is
    if (filename.startsWith('http')) return filename;
    
    // Otherwise, reconstruct the full URL for display
    return `https://ik.imagekit.io/manish0201/${filename}`;
};

  const handleUploadSuccess = (response: IKUploadResponse) => {
    const currentImages = getValues("imageUrl") || []; // Ensure it's an array
    
    
    const filename = response.url.split('/').pop() || '';
    
    
    setValue("imageUrl", [...currentImages, filename]); 
    showNotification("Image uploaded successfully!", "success");
};


  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");

      // Reset form after successful submission
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <div className="form-control">
        <label className="label">Product Name</label>
        <input
          type="text"
          className={`input input-bordered text-black ${errors.name ? "input-error" : ""}`}
          {...register("name", { required: "Name is required" })}
        />
          
        {errors.name && (
          <span className="text-error text-sm mt-1">{errors.name.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea text-black textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Product Image</label>
        <FileUpload onSuccess={handleUploadSuccess} />
        {watch("imageUrl")?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {watch("imageUrl").map((url, index) => (
            <Image 
              key={index} 
              src={getFullImageUrl(url)} 
              alt="Uploaded" 
              width={80} 
              height={80} 
              priority
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
      )}

      </div>

      <div className="form-control">
        <label className="label">Top Product</label>
        <input type="checkbox" {...register("isTopProduct")} />
      </div>

      <div className="divider">Variants</div>
      
      {fields.map((field, index) => (
        <div key={field.id} className=" card bg-base-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
              <label className="label">Color Type</label>
              <input
                type="text"
                className="input text-black input-bordered"
                {...register(`variants.${index}.type`, { required: "Type is required" })}
              />
              {errors.variants?.[index]?.type && (
                <span className="text-error text-sm mt-1">{errors.variants[index]?.type?.toString()}</span>
              )}
            </div>


            <div className="form-control">
              <label className="label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="input text-black input-bordered"
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
              />
              {errors.variants?.[index]?.price && (
                <span className="text-error text-sm mt-1">
                  {errors.variants[index]?.price?.message}
                </span>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={() => append({ type: "", price: 0 })}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Variant
      </button>
      
      <br/>

      <button
        type="submit"
        className="btn btn-primary bg-blue-800 btn-block"
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