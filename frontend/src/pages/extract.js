import ExtractionInput from "@/components/ui/ExtractionInput";
import ExtractionResult from "@/components/ui/ExtractionResult";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";

export default function ExtractPage() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <ExtractionInput onExtractFinished={setResult} />

        {result && (
          <div className="mt-6">
            <ExtractionResult data={result} />
          </div>
        )}
      </div>
    </div>
  );
}
