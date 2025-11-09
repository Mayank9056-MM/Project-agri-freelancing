import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // for production, use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password, not normal Gmail password
  },
});

/**
 * Sends an email to admin when a product’s stock is low or critical.
 * @param {Object} product - Product object
 */
export const sendLowStockEmail = async (product) => {
  const mailOptions = {
    from: `"Inventory Alert" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.EMAIL_USER,
    subject: `⚠️ Low Stock Alert: ${product.name}`,
    html: `
      <h2 style="color: #e11d48;">Low Stock Alert</h2>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>SKU:</strong> ${product.sku}</p>
      <p><strong>Current Stock:</strong> ${product.stock}</p>
      <p><strong>Low Stock Threshold:</strong> ${product.low_stock_threshold}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Unit:</strong> ${product.unit}</p>
      <p>Please restock this item soon to avoid shortages.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Low stock alert sent for ${product.name}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};
