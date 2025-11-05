import React, { useEffect, useRef, useState, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, X, Scan, CheckCircle } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";

const ScanPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [scannedResult, setScannedResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setScanner(reader);

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
            const code = result.getText();
            setScannedResult(code);
            stopScanner();
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
    <div
      className={`flex items-center justify-center min-h-screen w-full overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-white"
      }`}
    >
      <div className="w-full max-w-[95vw] px-4 sm:px-8 lg:px-12 flex flex-col gap-8">
        {/* Full-width Card */}
        <Card
          className={`border-0 overflow-hidden mx-auto w-full ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
            <CardTitle
              className={`flex items-center gap-2 bg-gradient-to-r ${
                isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              <Camera className="h-5 w-5" />
              Camera View
            </CardTitle>
            {isScanning && (
              <span className="flex items-center gap-2 text-sm mt-3 sm:mt-0 font-normal">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-500">Scanning...</span>
              </span>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Video section wider */}
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden shadow-2xl border-2 border-dashed border-gray-700/50">
              <video
                ref={videoRef}
                className="w-full h-full object-cover bg-black"
              />

              {!isScanning && (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm ${
                    isDark ? "bg-black/70" : "bg-gray-900/70"
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-purple-600/20 mb-4">
                    <Camera className="h-10 w-10 text-violet-400" />
                  </div>
                  <p className="text-white text-sm font-medium">Camera Ready</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Click start to begin scanning
                  </p>
                </div>
              )}

              {/* scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-[60%] h-[60%]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-lg" />
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center mt-4">
              {!isScanning ? (
                <Button
                  onClick={startScanner}
                  className={`bg-gradient-to-r ${
                    isDark
                      ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  } shadow-lg px-10 py-5 text-base`}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <Button
                  onClick={stopScanner}
                  className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-lg px-10 py-5 text-base"
                >
                  <X className="h-5 w-5 mr-2" />
                  Stop Scanner
                </Button>
              )}
            </div>

            {/* Scanned Result */}
            {scannedResult && (
              <div
                className={`p-6 rounded-xl border transition-all animate-in fade-in duration-500 ${
                  isDark
                    ? "bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-emerald-700/50"
                    : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-green-600/20">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      Successfully Scanned
                    </p>
                    <p
                      className={`text-2xl font-mono font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {scannedResult}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
