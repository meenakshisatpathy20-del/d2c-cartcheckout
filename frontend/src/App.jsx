import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, CheckCircle, Truck, Tag, Clock, AlertCircle, 
  RefreshCw, Package, LayoutDashboard, Store, Plus, Minus, X 
} from "lucide-react";

export default function App() {
  const [viewMode, setViewMode] = useState("store");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [step, setStep] = useState("cart");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const [adminOrders, setAdminOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    if (viewMode === "admin") fetchAdminOrders();
  }, [viewMode]);

  useEffect(() => {
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMsg("Reservation expired. Held stock was returned to catalog.");
          setStep("cart");
          fetchProducts();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {}
  };

  const fetchAdminOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/orders");
      const data = await res.json();
      setAdminOrders(data);
    } catch (e) {}
  };

  const addToCart = (product) => {
    setErrorMsg("");
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        if (exists.qty >= product.stock) {
          setErrorMsg(`Only ${product.stock} items remaining in warehouse.`);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const prod = products.find(p => p.id === id);
        const newQty = item.qty + delta;
        if (newQty > prod.stock) {
          setErrorMsg(`Only ${prod.stock} items in stock.`);
          return item;
        }
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const checkPincode = async () => {
    if (pincode.length !== 6) return;
    try {
      const res = await fetch("http://localhost:5000/api/shiprocket/check-pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode })
      });
      const data = await res.json();
      setDeliveryInfo(data);
    } catch (e) {
      setErrorMsg("Failed to connect to logistics partner.");
    }
  };

  const applyCoupon = async () => {
    setErrorMsg("");
    const sub = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    try {
      const res = await fetch("http://localhost:5000/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: sub })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppliedCoupon({ code: couponCode.toUpperCase(), discountAmount: data.discountAmount });
      setCouponCode("");
    } catch (e) {
      setErrorMsg(e.message);
      setAppliedCoupon(null);
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const initRes = await fetch("http://localhost:5000/api/checkout/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ skuId: item.id, qty: item.qty })),
          customer: { name: "Meenakshi", pincode, city: "Ranchi" },
          discountAmount: appliedCoupon ? appliedCoupon.discountAmount : 0,
          shippingFee: deliveryInfo?.shippingFee || 50
        })
      });

      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.error);

      setTimeLeft(initData.expiresInSeconds || 600);

      const options = {
        key: initData.keyId,
        amount: initData.amount,
        currency: initData.currency,
        name: "D2C MALL",
        description: "Multi-Brand Direct Checkout",
        order_id: initData.razorpayOrderId,
        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:5000/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reservationId: initData.reservationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error);

          setConfirmedOrder(verifyData);
          setStep("success");
          setCart([]);
          setTimeLeft(0);
          fetchProducts();
        },
        prefill: { name: "Meenakshi", email: "customer@d2csale.com", contact: "9876543210" },
        theme: { color: "#0038A8" },
        modal: { ondismiss: () => setLoading(false) }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const verifyRes = await fetch("http://localhost:5000/api/checkout/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: initData.reservationId,
            razorpay_order_id: initData.razorpayOrderId,
            razorpay_payment_id: "pay_simulated_" + Date.now()
          })
        });
        const verifyData = await verifyRes.json();
        setConfirmedOrder(verifyData);
        setStep("success");
        setCart([]);
        setTimeLeft(0);
        fetchProducts();
      }
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (skuId, newStock) => {
    try {
      await fetch("http://localhost:5000/api/admin/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skuId, newStock })
      });
      fetchProducts();
    } catch (e) {}
  };

  const handleShipmentStatusChange = async (orderId, shipmentId, newStatus) => {
    try {
      await fetch("http://localhost:5000/api/admin/shipment/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, shipmentId, newStatus })
      });
      fetchAdminOrders();
    } catch (e) {}
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = deliveryInfo ? deliveryInfo.shippingFee : (subtotal > 0 ? 50 : 0);
  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + shipping - discountVal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-d2c-orange">D2C</span>
            <span className="text-2xl font-black tracking-tight text-d2c-blue">MALL</span>
            <span className="text-xs bg-emerald-100 text-d2c-green px-2 py-0.5 rounded font-semibold ml-2 border border-emerald-300">
              MULTI-BRAND
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-1 rounded-lg flex space-x-1 text-xs font-semibold">
              <button 
                onClick={() => setViewMode("store")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  viewMode === "store" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>
              <button 
                onClick={() => setViewMode("admin")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  viewMode === "admin" ? "bg-white text-d2c-blue shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Warehouse Hub</span>
              </button>
            </div>

            {viewMode === "store" && (
              <>
                {timeLeft > 0 && (
                  <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                )}
                <button onClick={() => setStep("cart")} className="relative p-2 text-slate-600 hover:text-slate-900">
                  <ShoppingBag className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-d2c-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cart.reduce((a, b) => a + b.qty, 0)}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {viewMode === "store" && (
          <>
            {step === "cart" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <span>Brand Channels Catalog</span>
                    <span className="ml-3 text-xs bg-blue-50 text-d2c-blue px-2.5 py-1 rounded-full font-medium border border-blue-200">
                      Live Stock Guard
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="h-36 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded" style={{ backgroundColor: p.brandColor }}>
                            {p.brand}
                          </span>
                          <h3 className="font-semibold text-sm mt-2 line-clamp-1">{p.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Warehouse: {p.warehouseCity}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900">₹{p.price}</span>
                            <span className="text-xs text-slate-400 line-through ml-1.5">₹{p.mrp}</span>
                            <p className={`text-xs mt-0.5 ${p.stock <= 2 ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
                              {p.stock} units left
                            </p>
                          </div>
                          <button 
                            onClick={() => addToCart(p)}
                            disabled={p.stock === 0}
                            className="bg-d2c-blue hover:bg-blue-800 disabled:bg-slate-300 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                          >
                            {p.stock > 0 ? "Add +" : "Sold Out"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-fit">
                  <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
                    Basket Summary ({cart.length} items)
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      Your basket is empty.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                          <div>
                            <p className="font-medium text-slate-800 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.brand}</p>
                            <span className="font-semibold text-slate-900">₹{item.price * item.qty}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                            <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded">-</button>
                            <span className="text-xs font-bold px-1">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded">+</button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2">
                        <label className="text-xs font-semibold text-slate-600">Shiprocket Delivery Verification</label>
                        <div className="flex space-x-2 mt-1">
                          <input 
                            type="text" 
                            maxLength="6"
                            placeholder="e.g. 835215"
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex-1 focus:outline-d2c-blue"
                          />
                          <button onClick={checkPincode} className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                            Check
                          </button>
                        </div>
                        {deliveryInfo && (
                          <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
                            <Truck className="w-3.5 h-3.5 mr-1" /> {deliveryInfo.courierPartner} (Est. {deliveryInfo.estimatedDays} days)
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="text-xs font-semibold text-slate-600">Promo Code</label>
                        {appliedCoupon ? (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex justify-between items-center text-xs mt-1">
                            <div>
                              <span className="font-bold text-orange-600">{appliedCoupon.code}</span>
                              <span className="text-orange-700 ml-2">Saved ₹{appliedCoupon.discountAmount}</span>
                            </div>
                            <button onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-slate-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 mt-1">
                            <input 
                              type="text" 
                              placeholder="D2C100, FESTIVE20"
                              value={couponCode}
                              onChange={e => setCouponCode(e.target.value)}
                              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex-1 uppercase focus:outline-d2c-orange"
                            />
                            <button onClick={applyCoupon} className="bg-d2c-orange text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                              Apply
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal</span>
                          <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Shipping</span>
                          <span>₹{shipping}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-emerald-600 font-medium">
                            <span>Discount ({appliedCoupon.code})</span>
                            <span>-₹{appliedCoupon.discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                          <span>Payable</span>
                          <span className="text-d2c-blue">₹{grandTotal}</span>
                        </div>
                      </div>

                      <button 
                        onClick={initiatePayment}
                        disabled={loading || !deliveryInfo?.deliverable}
                        className="w-full bg-d2c-green hover:bg-emerald-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-sm"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Pay with Razorpay</span>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === "success" && confirmedOrder && (
              <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-d2c-green mx-auto mb-2" />
                  <h2 className="text-2xl font-black text-slate-900">Order Confirmed!</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Order ID: <span className="font-mono font-bold text-slate-800">{confirmedOrder.orderId}</span>
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {confirmedOrder.fulfillments.map((f, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{f.brand}</span>
                        <p className="text-slate-500 mt-0.5">{f.item} (Qty: {f.qty})</p>
                        <p className="text-slate-400 mt-1">Origin Hub: {f.pickupWarehouse}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-50 text-d2c-blue px-2 py-1 rounded font-mono font-semibold border border-blue-200 block">
                          {f.awb}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">{f.courier}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { setStep("cart"); setDeliveryInfo(null); setAppliedCoupon(null); }}
                  className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-slate-800"
                >
                  Return to Store
                </button>
              </div>
            )}
          </>
        )}

        {viewMode === "admin" && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-d2c-orange" /> Warehouse Inventory Allocations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{p.brand}</p>
                    <p className="font-semibold text-sm text-slate-800 mt-1 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-slate-500 mb-3">{p.warehouseCity}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs text-slate-600 font-medium">Available Stock:</span>
                      <input 
                        type="number"
                        defaultValue={p.stock}
                        key={p.stock}
                        onBlur={(e) => handleStockUpdate(p.id, e.target.value)}
                        className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-d2c-blue" />
                  <span>Shiprocket Multi-Brand Shipments</span>
                </div>
                <button onClick={fetchAdminOrders} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                </button>
              </h2>

              {adminOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No orders placed yet. Place an order on the Storefront tab to see real-time warehouse splitting.
                </div>
              ) : (
                <div className="space-y-6">
                  {adminOrders.map((order) => (
                    <div key={order.orderId} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                        <div>
                          <span className="font-mono font-bold text-sm text-slate-900 mr-3">{order.orderId}</span>
                          <span className="text-slate-500">Customer: {order.customer.name} ({order.customer.pincode})</span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                          {order.paymentStatus} (₹{order.summary.totalPaid})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.fulfillments.map((f) => (
                          <div key={f.shipmentId} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-slate-800">{f.brand}</span>
                                <p className="text-slate-600 mt-0.5">{f.item} (x{f.qty})</p>
                              </div>
                              <span className="font-mono font-bold bg-white text-d2c-blue px-2 py-0.5 rounded border border-blue-100">
                                {f.awb}
                              </span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                              <span className="text-[11px] text-slate-500">{f.courier}</span>
                              <select 
                                value={f.status}
                                onChange={(e) => handleShipmentStatusChange(order.orderId, f.shipmentId, e.target.value)}
                                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                              >
                                <option value="READY_TO_SHIP">READY TO SHIP</option>
                                <option value="IN_TRANSIT">IN TRANSIT</option>
                                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                                <option value="DELIVERED">DELIVERED</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}