const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order");
const Product = require("../models/product");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.user.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.seller.toString() === buyerId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot buy your own product" });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: product.price * 100,
            currency: "INR",
            receipt: `ord_${productId.slice(-8)}_${Date.now().toString().slice(-8)}`,
        });

        const order = await Order.create({
            buyer: buyerId,
            seller: product.seller,
            product: productId,
            amount: product.price,
            razorpayOrderId: razorpayOrder.id,
        });

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderDbId: order._id,
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Payment (frontend se aayega)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Order update karo
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Payment verified!", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook Handler (Razorpay directly call karega)
exports.webhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSign = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body) // raw body
      .digest("hex");

    if (expectedSign !== signature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body);

    if (event.event === "payment.captured") {
      const razorpayOrderId = event.payload.payment.entity.order_id;

      await Order.findOneAndUpdate(
        { razorpayOrderId },
        { status: "paid" }
      );
    }
    if (event.event === "payment.failed") {
      const razorpayOrderId = event.payload.payment.entity.order_id;

      await Order.findOneAndUpdate(
        { razorpayOrderId },
        { status: "failed" }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Orders (buyer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.userId })
      .populate("product", "productName price images") 
      .populate("seller", "firstName lastName email")   
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};