"use client";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { Card } from "./ui/card";
import customFetch from "@/utils/customFetch";

const RealmeForm = ({ product }) => {
  const totalPrice = product?.price;
  const productName = product?.name;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.image || "/placeholder.svg"
  );

  // Applicant state
  const [applicantData, setApplicantData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    grandfathersName: "",
    contactNumber: "",
    occupation: "",
    vdc: "",
    ward: "",
    city: "",
    state: "",
  });
  const [applicantDocs, setApplicantDocs] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    passportPhoto: null,
  });

  // Guarantor state
  const [guarantorData, setGuarantorData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    grandfathersName: "",
    contactNumber: "",
    occupation: "",
    vdc: "",
    ward: "",
    city: "",
    state: "",
  });
  const [guarantorDocs, setGuarantorDocs] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    passportPhoto: null,
  });

  // EMI & Downpayment state
  const [downpaymentPercentage, setDownpaymentPercentage] = useState(40); // default 40%
  const [downpayment, setDownpayment] = useState(0);
  const [emiDuration, setEmiDuration] = useState(6); // 6 months default
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);

  // Calculate downpayment and monthly installment when dependencies change
  useEffect(() => {
    const dp = (downpaymentPercentage / 100) * totalPrice;
    setDownpayment(dp);
    setMonthlyInstallment((totalPrice - dp) / emiDuration);
  }, [downpaymentPercentage, totalPrice, emiDuration]);

  // Handlers for applicant data
  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setApplicantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplicantFileChange = (e) => {
    const { name, files } = e.target;
    setApplicantDocs((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Handlers for guarantor data
  const handleGuarantorChange = (e) => {
    const { name, value } = e.target;
    setGuarantorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuarantorFileChange = (e) => {
    const { name, files } = e.target;
    setGuarantorDocs((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Handlers for EMI/downpayment
  const handleDownpaymentChange = (e) => {
    let value = e.target.value;
    let numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setDownpaymentPercentage("");
    } else {
      if (numericValue < 40) {
        numericValue = 40;
      }
      setDownpaymentPercentage(numericValue);
    }
  };

  const handleEmiDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    setEmiDuration(duration);
  };

  // Navigation
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Final form submission: combine all data into a FormData instance
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Applicant data
    for (const key in applicantData) {
      formData.append(`applicant_${key}`, applicantData[key]);
    }
    for (const key in applicantDocs) {
      if (applicantDocs[key])
        formData.append(`applicant_${key}`, applicantDocs[key]);
    }

    // Guarantor data
    for (const key in guarantorData) {
      formData.append(`guarantor_${key}`, guarantorData[key]);
    }
    for (const key in guarantorDocs) {
      if (guarantorDocs[key])
        formData.append(`guarantor_${key}`, guarantorDocs[key]);
    }

    // EMI & Downpayment
    formData.append("downpaymentPercentage", downpaymentPercentage);
    formData.append("downpaymentAmount", downpayment.toFixed(2));
    formData.append("emiDuration", emiDuration);
    formData.append("monthlyInstallment", monthlyInstallment.toFixed(2));
    formData.append("product", product.product_id);
    formData.append("brand", product.brand);

    try {
      const response = await customFetch("shop/api/emi/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        // Optionally add further actions (e.g. redirect, success message)
      } else {
        console.error("Form submission error");
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3"
    >
      <div className="text-center mb-3 text-white font-semibold text-xl">
        {productName} EMI Form - Step {currentStep} of 3
      </div>
      <div className="grid grid-cols-8 gap-4">
      <div className="space-y-4 col-span-3">
        <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-800 bg-black/50 backdrop-blur-sm">
          <Image
            src={selectedImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img, i) => (
            <div
              key={i}
              className={`relative aspect-square rounded-lg overflow-hidden border ${
                selectedImage === img.image
                  ? "border-pink-500"
                  : "border-gray-800"
              } bg-black/50 backdrop-blur-sm hover:border-pink-500 cursor-pointer transition-colors`}
              onMouseEnter={() => setSelectedImage(img.image)}
            >
              <Image
                src={img.image || "/placeholder.svg"}
                alt={`${product.name} - Image ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Applicant Details */}
      {currentStep === 1 && (
        <Card className="bg-inherit col-span-5 text-white border border-white p-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Applicant Details
          </h2>
          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <Input
                  type="text"
                  name="firstName"
                  value={applicantData.firstName}
                  onChange={handleApplicantChange}
                  required
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Middle Name (Optional)
                </label>
                <Input
                  type="text"
                  name="middleName"
                  value={applicantData.middleName}
                  onChange={handleApplicantChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  value={applicantData.lastName}
                  onChange={handleApplicantChange}
                  required
                  className="bg-inherit"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Grandfather's Name
                </label>
                <Input
                  type="text"
                  name="grandfathersName"
                  value={applicantData.grandfathersName}
                  onChange={handleApplicantChange}
                  required
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  type="tel"
                  name="contactNumber"
                  value={applicantData.contactNumber}
                  onChange={handleApplicantChange}
                  required
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Occupation</label>
                <Input
                  type="text"
                  name="occupation"
                  value={applicantData.occupation}
                  onChange={handleApplicantChange}
                  required
                  className="bg-inherit"
                />
              </div>
            </div>
          </div>

          {/* Present Address */}
          <fieldset className="border p-4 rounded mt-4">
            <legend className="font-semibold px-2">Present Address</legend>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  VDC/Municipality
                </label>
                <Input
                  type="text"
                  name="vdc"
                  value={applicantData.vdc}
                  onChange={handleApplicantChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ward No</label>
                <Input
                  type="text"
                  name="ward"
                  value={applicantData.ward}
                  onChange={handleApplicantChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <Input
                  type="text"
                  name="city"
                  value={applicantData.city}
                  onChange={handleApplicantChange}
                  className="bg-inherit"
                />
              </div>
            </div>
          </fieldset>

          {/* Applicant Documents */}
          <fieldset className="border p-4 rounded mt-4">
            <legend className="font-semibold px-2">Applicant Documents (The legal age requirement is above 24 years old)</legend>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Citizenship Front
                </label>
                <input
                  type="file"
                  name="citizenshipFront"
                  accept="image/*"
                  onChange={handleApplicantFileChange}
                  required
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Citizenship Back
                </label>
                <input
                  type="file"
                  name="citizenshipBack"
                  accept="image/*"
                  onChange={handleApplicantFileChange}
                  required
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Passport Size Photo
                </label>
                <input
                  type="file"
                  name="passportPhoto"
                  accept="image/*"
                  onChange={handleApplicantFileChange}
                  required
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-300">
              Note: Maximum file size for each document is 2MB.
            </p>
          </fieldset>

          <div className="w-full mt-4">
            <Button
              type="button"
              onClick={nextStep}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              Next
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Guarantor Details */}
      {currentStep === 2 && (
        <Card className="col-span-5 bg-inherit text-white border border-white p-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Guarantor Details
          </h2>
          {/* Guarantor Personal Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <Input
                  type="text"
                  name="firstName"
                  value={guarantorData.firstName}
                  onChange={handleGuarantorChange}
                  required
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Middle Name</label>
                <Input
                  type="text"
                  name="middleName"
                  value={guarantorData.middleName}
                  onChange={handleGuarantorChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  value={guarantorData.lastName}
                  onChange={handleGuarantorChange}
                  required
                  className="bg-inherit"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium">
                  Grandfather's Name
                </label>
                <Input
                  type="text"
                  name="grandfathersName"
                  value={guarantorData.grandfathersName}
                  onChange={handleGuarantorChange}
                  required
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  type="tel"
                  name="contactNumber"
                  value={guarantorData.contactNumber}
                  onChange={handleGuarantorChange}
                  required
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Occupation</label>
                <Input
                  type="text"
                  name="occupation"
                  value={guarantorData.occupation}
                  onChange={handleGuarantorChange}
                  required
                  className="bg-inherit"
                />
              </div>
            </div>
          </div>

          {/* Guarantor Address */}
          <fieldset className="border p-4 rounded mt-4">
            <legend className="font-semibold px-2">Address</legend>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  VDC/Municipality
                </label>
                <Input
                  type="text"
                  name="vdc"
                  value={guarantorData.vdc}
                  onChange={handleGuarantorChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ward No</label>
                <Input
                  type="text"
                  name="ward"
                  value={guarantorData.ward}
                  onChange={handleGuarantorChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <Input
                  type="text"
                  name="city"
                  value={guarantorData.city}
                  onChange={handleGuarantorChange}
                  className="bg-inherit"
                />
              </div>
            </div>
          </fieldset>

          {/* Guarantor Documents */}
          <fieldset className="border p-4 rounded mt-4">
            <legend className="font-semibold px-2">Documents (The legal age requirement is above 24 years old)</legend>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Citizenship Front
                </label>
                <input
                  type="file"
                  name="citizenshipFront"
                  accept="image/*"
                  onChange={handleGuarantorFileChange}
                  required
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Citizenship Back
                </label>
                <input
                  type="file"
                  name="citizenshipBack"
                  accept="image/*"
                  onChange={handleGuarantorFileChange}
                  required
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Passport Size Photo
                </label>
                <input
                  type="file"
                  name="passportPhoto"
                  accept="image/*"
                  onChange={handleGuarantorFileChange}
                  required
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-300">
              Note: Maximum file size for each document is 2MB.
            </p>
          </fieldset>

          <div className="flex gap-2 justify-between mt-4">
            <Button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-500 hover:bg-gray-600"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              Next
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: EMI & Downpayment Details */}
      {currentStep === 3 && (
        <Card className="col-span-5 bg-inherit text-white border border-white p-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            EMI & Downpayment Details
          </h2>
          <fieldset className="border p-4 rounded mt-4">
            <legend className="font-semibold px-2">Downpayment & EMI</legend>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Downpayment Percentage (Minimum 40%)
                </label>
                <Input
                  type="number"
                  name="downpaymentPercentage"
                  value={downpaymentPercentage}
                  min="40"
                  max="100"
                  onChange={handleDownpaymentChange}
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Downpayment Amount
                </label>
                <Input
                  type="text"
                  name="downpaymentAmount"
                  value={`RS. ${downpayment.toFixed(2)}`}
                  readOnly
                  className="bg-inherit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  EMI Duration (Months)
                </label>
                <select
                  name="emiDuration"
                  value={emiDuration}
                  onChange={handleEmiDurationChange}
                  className="bg-inherit p-2 border rounded"
                >
                  <option className="text-black" value="6">
                    6 Months
                  </option>
                  <option className="text-black" value="12">
                    12 Months
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Monthly Installment
                </label>
                <Input
                  type="text"
                  name="monthlyInstallment"
                  value={`RS. ${monthlyInstallment.toFixed(2)}`}
                  readOnly
                  className="bg-inherit"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-500 hover:bg-gray-600"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Submit
            </Button>
          </div>
        </Card>
      )}
      </div>
    </form>
  );
};

export default RealmeForm;
