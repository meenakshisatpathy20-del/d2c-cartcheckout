import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Truck
} from "lucide-react";
import api from "../../services/api";

function DeliveryChecker({
  product,
  compact = false
}) {
  const [pincode, setPincode] =
    useState("");
  const [result, setResult] =
    useState(null);
  const [loading, setLoading] =
    useState(false);

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({
        success: false,
        message:
          "Enter a valid 6-digit pincode"
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response =
        await api.checkDelivery(
          pincode,
          product?.sku ||
            product?.id
        );

      setResult({
        success:
          response?.available !== false,
        ...response,
        message:
          response?.message ||
          "Delivery is available at this location"
      });
    } catch (error) {
      setResult({
        success: false,
        message:
          error?.message ||
          "Unable to check delivery"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white ${
        compact
          ? "p-3"
          : "p-5"
      }`}
    >
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-orange-500" />

        <div>
          <h3 className="font-bold text-slate-900">
            Check Delivery
          </h3>

          {!compact && (
            <p className="text-sm text-slate-500">
              Enter your pincode to check delivery availability
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={pincode}
          onChange={(event) =>
            setPincode(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter"
            ) {
              checkDelivery();
            }
          }}
          placeholder="Enter pincode"
          inputMode="numeric"
          maxLength={6}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        <button
          type="button"
          onClick={
            checkDelivery
          }
          disabled={loading}
          className="flex min-w-[95px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Check"
          )}
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 rounded-xl p-4 ${
            result.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-700"
          }`}
        >
          {result.success ? (
            <div>
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                <div>
                  <p className="font-bold">
                    {result.message}
                  </p>

                  {result.eta && (
                    <p className="mt-1 text-sm">
                      Estimated delivery:{" "}
                      <strong>
                        {result.eta}
                      </strong>
                    </p>
                  )}
                </div>
              </div>

              {(result.courier ||
                result.carrier ||
                result.shippingFee !==
                  undefined) && (
                <div className="mt-3 grid gap-2 border-t border-green-200 pt-3 text-sm sm:grid-cols-3">
                  {(result.courier ||
                    result.carrier) && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {result.courier ||
                        result.carrier}
                    </div>
                  )}

                  {result.shippingFee !==
                    undefined && (
                    <div>
                      Shipping:{" "}
                      <strong>
                        {Number(
                          result.shippingFee
                        ) === 0
                          ? "FREE"
                          : `₹${result.shippingFee}`}
                      </strong>
                    </div>
                  )}

                  {result.cod !==
                    undefined && (
                    <div>
                      COD:{" "}
                      <strong>
                        {result.cod
                          ? "Available"
                          : "Unavailable"}
                      </strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm font-semibold">
              {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DeliveryChecker;