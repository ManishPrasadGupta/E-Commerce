"use client";

import { Input } from "@/components/ui/shippingInputForm/input";
import { Label } from "@/components/ui/shippingInputForm/label";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { IAddress } from "@/models/User.model";
import { useEffect, useState } from "react";

type AddressFormProps = {
  onSuccess?: (data:{address: Omit<IAddress, "_id"> }) => void;
  initialData?: IAddress;
};

const emptyAddress = {
  firstName: "",
  lastName: "",
  mobileNumber: "",
  pincode: "",
  house: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
};

export default function AddressForm({onSuccess, initialData} : AddressFormProps) {
  const [form, setForm] = useState<Omit<IAddress, "_id">>(
    initialData?{
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          mobileNumber: initialData.mobileNumber || "",
          pincode: initialData.pincode || "",
          house: initialData.house || "",
          area: initialData.area || "",
          landmark: initialData.landmark || "",
          city: initialData.city || "",
          state: initialData.state || "",
        }
      : emptyAddress
  );
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        mobileNumber: initialData.mobileNumber || "",
        pincode: initialData.pincode || "",
        house: initialData.house || "",
        area: initialData.area || "",
        landmark: initialData.landmark || "",
        city: initialData.city || "",
        state: initialData.state || "",
      });
    } else {
      setForm(emptyAddress);
    }
  }, [initialData]);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (initialData && initialData._id) {
        // Edit mode
        await apiClient.updateAddress({ ...form, _id: initialData._id });
      } else {
        // Add mode
        await apiClient.saveAddress(form);
      }
      if (onSuccess) onSuccess({ address: form });
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address!");
    }
    setSubmitting(false);
  }



  return (
    <div className="w-full max-w-lg mx-auto"> 
      <form onSubmit={handleSubmit}>
        <div className="mb-2 flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" value={form.firstName} onChange={handleChange} placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input id="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="1234567891" type="number" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" value={form.pincode} onChange={handleChange} placeholder="6 digits [0-9] PIN code" type="number" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="house">Flat, House no., Building, Company, Apartment</Label>
          <Input id="house" value={form.house} onChange={handleChange} type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="area">Area, Street, Sector, Village</Label>
          <Input id="area" value={form.area} onChange={handleChange} type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="landmark">Landmark</Label>
          <Input id="landmark" value={form.landmark} onChange={handleChange} type="text" />
        </LabelInputContainer>
        <div className="mb-2 flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="city">Town/City</Label>
            <Input id="city" value={form.city} onChange={handleChange} type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={form.state} onChange={handleChange} type="text" />
          </LabelInputContainer>
        </div>
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,s0px_-1px_0px_0px_#27272a_inset] mt-2"
          type="submit"
          disabled={submitting}
        >
         {submitting ? "Saving..." : "Save Address"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex w-full flex-col space-y-1", className)}>{children}</div>;
};