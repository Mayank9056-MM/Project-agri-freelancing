// controllers/barcodeController.js
import bwipjs from "bwip-js";

// Generate barcode image from number
export const generateBarcode = async (req, res) => {
  try {
    const { code } = req.query; // e.g. /api/barcode?code=123456789012
    if (!code) return res.status(400).send("Barcode code required");

    const png = await bwipjs.toBuffer({
      bcid: "ean13",        // Barcode type (EAN-13, Code128, etc.)
      text: code,           // The actual code text
      scale: 3,             // 3x scale
      height: 10,           // height in mm
      includetext: true,    // show text below barcode
      textxalign: "center", // center align text
    });

    // Send image as response
    res.type("image/png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating barcode");
  }
};
