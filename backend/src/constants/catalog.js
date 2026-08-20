let inventory = [
  {
    id: "sku-lux-01",
    brand: "Luxura Sciences",
    brandColor: "#00A859",
    warehouseCity: "Mumbai Hub",
    name: "Vitamin C Face Serum (30ml)",
    price: 499,
    mrp: 899,
    stock: 5,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"
  },
  {
    id: "sku-sn-02",
    brand: "Shiv-Naresh",
    brandColor: "#0038A8",
    warehouseCity: "Delhi Hub",
    name: "Performance Dry-Fit Track Pant",
    price: 1199,
    mrp: 1899,
    stock: 3,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"
  },
  {
    id: "sku-swarg-03",
    brand: "Swarg Homes",
    brandColor: "#FF6B00",
    warehouseCity: "Jaipur Hub",
    name: "Ceramic Handcrafted Dinner Set",
    price: 2499,
    mrp: 3999,
    stock: 2,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80"
  }
];

let activeReservations = {};
let completedOrders = [];

module.exports = { inventory, activeReservations, completedOrders };