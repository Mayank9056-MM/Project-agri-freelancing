import React, { useState, useContext, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  ArrowRight,
  Package,
  Loader2,
  X,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeContext } from "@/context/ThemeContext";
import Papa from "papaparse";

const BulkUpload = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateRow = (row, index) => {
    const errors = [];
    
    if (!row.name || row.name.trim() === "") {
      errors.push(`Row ${index + 2}: Product name is required`);
    }
    if (!row.sku || row.sku.trim() === "") {
      errors.push(`Row ${index + 2}: SKU is required`);
    }
    if (!row.category || row.category.trim() === "") {
      errors.push(`Row ${index + 2}: Category is required`);
    }
    if (!row.price || isNaN(row.price) || parseFloat(row.price) <= 0) {
      errors.push(`Row ${index + 2}: Valid price is required`);
    }
    if (row.stock === undefined || isNaN(row.stock) || parseInt(row.stock) < 0) {
      errors.push(`Row ${index + 2}: Valid stock quantity is required`);
    }
    if (row.reorderLevel === undefined || isNaN(row.reorderLevel) || parseInt(row.reorderLevel) < 0) {
      errors.push(`Row ${index + 2}: Valid reorder level is required`);
    }

    return errors;
  };

  const handleFile = (uploadedFile) => {
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      setErrors(['Please upload a valid CSV file']);
      return;
    }

    setFile(uploadedFile);
    setUploading(true);
    setUploadComplete(false);
    setErrors([]);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const allErrors = [];
        const validRows = [];

        results.data.forEach((row, index) => {
          const rowErrors = validateRow(row, index);
          if (rowErrors.length > 0) {
            allErrors.push(...rowErrors);
          } else {
            validRows.push(row);
          }
        });

        setParsedData(validRows);
        setErrors(allErrors);
        setStats({
          total: results.data.length,
          valid: validRows.length,
          invalid: allErrors.length,
        });

        setTimeout(() => {
          setUploading(false);
          setUploadComplete(true);
        }, 1500);
      },
      error: (error) => {
        setErrors([`Failed to parse CSV: ${error.message}`]);
        setUploading(false);
      },
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setStats({ total: 0, valid: 0, invalid: 0 });
    setUploadComplete(false);
    setUploading(false);
  };

  const handleImport = () => {
    // Here you would send the data to your backend
    console.log("Importing products:", parsedData);
    alert(`Successfully imported ${parsedData.length} products!`);
    handleReset();
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Laptop",
        sku: "LAP-001",
        category: "Electronics",
        price: 1299.99,
        stock: 50,
        reorderLevel: 10,
        image: "💻",
        description: "High-performance laptop",
      },
      {
        name: "Wireless Mouse",
        sku: "MOU-001",
        category: "Accessories",
        price: 29.99,
        stock: 150,
        reorderLevel: 30,
        image: "🖱️",
        description: "Ergonomic wireless mouse",
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Bulk Upload
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Package className="h-4 w-4" />
            Import multiple products at once using CSV
          </p>
        </div>
        <Button
          onClick={downloadTemplate}
          className={`${
            isDark
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          }`}
        >
          <Download className="h-4 w-4 mr-2" />
          Template
        </Button>
      </div>

      {/* Info Card */}
      <Card
        className={`border-0 overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-blue-900/20 to-cyan-900/20 shadow-2xl"
            : "bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark
                  ? "bg-blue-500/20"
                  : "bg-blue-500/10"
              }`}
            >
              <Info className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                How to use bulk upload
              </h3>
              <ul
                className={`space-y-1 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <li>• Download the CSV template to see the required format</li>
                <li>• Fill in your product data (name, SKU, category, price, stock, reorder level)</li>
                <li>• Upload the completed CSV file below</li>
                <li>• Review the validation results and import your products</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card
        className={`border-0 overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
            : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
        }`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 bg-gradient-to-r ${
              isDark
                ? "from-white to-gray-400"
                : "from-gray-900 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            <Upload className="h-5 w-5 text-violet-500" />
            Upload CSV File
          </CardTitle>
          <CardDescription>
            Drag and drop your CSV file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!file ? (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
                dragActive
                  ? isDark
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-violet-400 bg-violet-400/10"
                  : isDark
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                    isDark
                      ? "bg-violet-500/20"
                      : "bg-violet-500/10"
                  }`}
                >
                  <FileSpreadsheet className="h-10 w-10 text-violet-500" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Drop your CSV file here
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  or click to browse from your computer
                </p>
                <Button
                  className={`bg-gradient-to-r ${
                    isDark
                      ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  } shadow-lg`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div
                className={`p-6 rounded-xl border ${
                  isDark
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        uploadComplete
                          ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20"
                          : "bg-gradient-to-br from-violet-500/20 to-purple-600/20"
                      }`}
                    >
                      {uploading ? (
                        <Loader2 className="h-7 w-7 text-violet-500 animate-spin" />
                      ) : uploadComplete ? (
                        <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                      ) : (
                        <FileSpreadsheet className="h-7 w-7 text-violet-500" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {file.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="icon"
                    className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {uploading && (
                  <div className="mt-4">
                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse w-full" />
                    </div>
                    <p
                      className={`text-sm mt-2 text-center ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Processing your file...
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              {uploadComplete && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card
                    className={`border-0 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-800 to-gray-700"
                        : "bg-gradient-to-br from-gray-50 to-white"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Total Rows
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {stats.total}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border-0 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-800 to-gray-700"
                        : "bg-gradient-to-br from-gray-50 to-white"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Valid
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {stats.valid}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`border-0 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-800 to-gray-700"
                        : "bg-gradient-to-br from-gray-50 to-white"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Errors
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {stats.invalid}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Errors */}
              {uploadComplete && errors.length > 0 && (
                <Card
                  className={`border-0 ${
                    isDark
                      ? "bg-gradient-to-br from-rose-900/20 to-red-900/20"
                      : "bg-gradient-to-br from-rose-50 to-red-50"
                  }`}
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 text-rose-500`}
                    >
                      <AlertCircle className="h-5 w-5" />
                      Validation Errors
                    </CardTitle>
                    <CardDescription>
                      Please fix these errors before importing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {errors.map((error, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg text-sm ${
                            isDark
                              ? "bg-gray-800/50 text-gray-300"
                              : "bg-white text-gray-700"
                          }`}
                        >
                          {error}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview */}
              {uploadComplete && parsedData.length > 0 && (
                <Card
                  className={`border-0 ${
                    isDark
                      ? "bg-gradient-to-br from-gray-800 to-gray-700"
                      : "bg-gradient-to-br from-gray-50 to-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Package className="h-5 w-5 text-violet-500" />
                      Preview Valid Products
                    </CardTitle>
                    <CardDescription>
                      Showing first 5 products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {parsedData.slice(0, 5).map((product, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border ${
                            isDark
                              ? "bg-gray-900/50 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{product.image || "📦"}</div>
                              <div>
                                <p
                                  className={`font-semibold ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {product.name}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {product.sku} • {product.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  isDark ? "text-emerald-400" : "text-emerald-600"
                                }`}
                              >
                                ${product.price}
                              </p>
                              <p
                                className={`text-sm ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Stock: {product.stock}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {parsedData.length > 5 && (
                        <p
                          className={`text-sm text-center ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          + {parsedData.length - 5} more products
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {uploadComplete && (
                <div className="flex items-center justify-end gap-3">
                  <Button
                    onClick={handleReset}
                    className={`${
                      isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={parsedData.length === 0}
                    className={`bg-gradient-to-r ${
                      isDark
                        ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                        : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    } shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Import {parsedData.length} Products
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUpload;