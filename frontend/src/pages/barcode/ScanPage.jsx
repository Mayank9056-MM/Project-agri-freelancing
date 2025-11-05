import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

const ScanPage = () => {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [scannedResult, setScannedResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setScanner(reader);

    // ✅ Proper cleanup: stop video stream if active
    return () => {
      try {
        reader.stopContinuousDecode?.();
        const stream = videoRef.current?.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.warn("Cleanup error:", err);
      }
    };
  }, []);

  const startScanner = async () => {
    setIsScanning(true);
    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (devices.length === 0) {
        alert("No camera found");
        setIsScanning(false);
        return;
      }

      const selectedDeviceId = devices[0].deviceId;

      await scanner.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            setScannedResult(result.getText());
            stopScanner(); // stop immediately after successful scan
          }
        }
      );
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not start camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    try {
      scanner?.stopContinuousDecode?.();
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.warn("Stop scanner error:", err);
    }
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
        Barcode Scanner
      </h1>

      <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-gray-700">
        <video ref={videoRef} className="w-full h-full object-cover" />
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
            <Camera className="h-10 w-10 mb-3 text-violet-400" />
            <p className="text-sm">Click below to start scanning</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!isScanning ? (
          <Button
            onClick={startScanner}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Start Scanning
          </Button>
        ) : (
          <Button
            onClick={stopScanner}
            variant="destructive"
            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
          >
            <X className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}
      </div>

      {scannedResult && (
        <div className="p-4 rounded-xl bg-gray-800 text-white w-full max-w-md mt-6">
          <p className="text-sm text-gray-400 mb-1">Scanned Code:</p>
          <p className="text-lg font-mono text-emerald-400">{scannedResult}</p>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
