import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
  X,
  Zap,
} from "lucide-react";

const STATUS_OPTIONS = [
  "ALL",
  "READY_TO_SHIP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "FAILED",
  "CANCELLED",
];

const FALLBACK_SHIPMENTS = [
  {
    id: "SHP-982341",
    orderId: "D2C-84729163",
    customer: "Priyank Raj",
    phone: "9876543210",
    awb: "DLV8472916382",
    carrier: "Delhivery",
    warehouse: "Bengaluru Whitefield",
    status: "IN_TRANSIT",
    origin: "Bengaluru",
    destination: "Bengaluru",
    eta: "Sep 4, 2026",
    updatedAt: "2 min ago",
    items: 2,
    cod: false,
  },
  {
    id: "SHP-982342",
    orderId: "D2C-83917254",
    customer: "Ananya Sharma",
    phone: "9811122233",
    awb: "SHP8391725411",
    carrier: "Shiprocket",
    warehouse: "Mumbai Bhiwandi",
    status: "READY_TO_SHIP",
    origin: "Mumbai",
    destination: "Pune",
    eta: "Sep 5, 2026",
    updatedAt: "18 min ago",
    items: 3,
    cod: true,
  },
  {
    id: "SHP-982343",
    orderId: "D2C-82736195",
    customer: "Rahul Kumar",
    phone: "9898989898",
    awb: "EKO8273619512",
    carrier: "Ekart",
    warehouse: "Delhi NCR",
    status: "OUT_FOR_DELIVERY",
    origin: "Delhi",
    destination: "Noida",
    eta: "Today",
    updatedAt: "6 min ago",
    items: 1,
    cod: false,
  },
  {
    id: "SHP-982344",
    orderId: "D2C-81726354",
    customer: "Meera Singh",
    phone: "9777777777",
    awb: "DEL8172635422",
    carrier: "Delhivery",
    warehouse: "Jaipur Depot",
    status: "DELIVERED",
    origin: "Jaipur",
    destination: "Delhi",
    eta: "Delivered",
    updatedAt: "Yesterday",
    items: 4,
    cod: true,
  },
  {
    id: "SHP-982345",
    orderId: "D2C-80182736",
    customer: "Arjun Patel",
    phone: "9666666666",
    awb: "BLU8018273619",
    carrier: "Blue Dart",
    warehouse: "Mumbai Bhiwandi",
    status: "DELAYED",
    origin: "Mumbai",
    destination: "Ahmedabad",
    eta: "Sep 6, 2026",
    updatedAt: "1 hr ago",
    items: 2,
    cod: false,
  },
];

export default function ShipmentManagementView({
  api,
  onViewOrder,
}) {
  const [shipments, setShipments] =
    useState(FALLBACK_SHIPMENTS);

  const [filters, setFilters] =
    useState({
      search: "",
      status: "ALL",
      carrier: "ALL",
      warehouse: "ALL",
      page: 1,
      limit: 10,
    });

  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [showFilters, setShowFilters] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const [statusToUpdate, setStatusToUpdate] =
    useState("");

  const [carrierToUpdate, setCarrierToUpdate] =
    useState("");

  const [copied, setCopied] =
    useState("");

  const loadShipments = async () => {
    try {
      setLoading(true);

      if (api?.getAdminShipments) {
        const response =
          await api.getAdminShipments(
            filters
          );

        if (
          Array.isArray(
            response?.shipments
          )
        ) {
          setShipments(
            response.shipments
          );
        }
      }
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to load shipments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [
    filters.status,
    filters.carrier,
    filters.warehouse,
    filters.page,
  ]);

  const filteredShipments =
    useMemo(() => {
      const query =
        filters.search
          .trim()
          .toLowerCase();

      let result =
        [...shipments];

      if (query) {
        result =
          result.filter(
            (shipment) =>
              [
                shipment.id,
                shipment.orderId,
                shipment.customer,
                shipment.phone,
                shipment.awb,
                shipment.carrier,
                shipment.warehouse,
              ]
                .filter(Boolean)
                .some((value) =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      query
                    )
                )
          );
      }

      if (
        filters.status !==
        "ALL"
      ) {
        result =
          result.filter(
            (shipment) =>
              shipment.status ===
              filters.status
          );
      }

      if (
        filters.carrier !==
        "ALL"
      ) {
        result =
          result.filter(
            (shipment) =>
              shipment.carrier ===
              filters.carrier
          );
      }

      if (
        filters.warehouse !==
        "ALL"
      ) {
        result =
          result.filter(
            (shipment) =>
              shipment.warehouse ===
              filters.warehouse
          );
      }

      return result;
    }, [
      shipments,
      filters,
    ]);

  const stats = useMemo(
    () => ({
      total: shipments.length,
      ready: shipments.filter(
        (item) =>
          item.status ===
          "READY_TO_SHIP"
      ).length,
      transit: shipments.filter(
        (item) =>
          [
            "PICKED_UP",
            "IN_TRANSIT",
          ].includes(
            item.status
          )
      ).length,
      ofd: shipments.filter(
        (item) =>
          item.status ===
          "OUT_FOR_DELIVERY"
      ).length,
      delivered:
        shipments.filter(
          (item) =>
            item.status ===
            "DELIVERED"
        ).length,
      exceptions:
        shipments.filter(
          (item) =>
            [
              "DELAYED",
              "FAILED",
            ].includes(
              item.status
            )
        ).length,
    }),
    [shipments]
  );

  const carriers =
    [
      "ALL",
      ...new Set(
        shipments
          .map(
            (item) =>
              item.carrier
          )
          .filter(Boolean)
      ),
    ];

  const warehouses =
    [
      "ALL",
      ...new Set(
        shipments
          .map(
            (item) =>
              item.warehouse
          )
          .filter(Boolean)
      ),
    ];

  const refresh = async () => {
    setRefreshing(true);

    try {
      await loadShipments();
      showToast(
        "Shipment data refreshed."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const updateShipment = async () => {
    if (!selectedShipment) {
      return;
    }

    setUpdating(true);

    try {
      if (api?.updateAdminShipment) {
        await api.updateAdminShipment(
          selectedShipment.id,
          {
            status:
              statusToUpdate ||
              selectedShipment.status,
            carrier:
              carrierToUpdate ||
              selectedShipment.carrier,
          }
        );
      }

      setShipments(
        (current) =>
          current.map(
            (shipment) =>
              shipment.id ===
              selectedShipment.id
                ? {
                    ...shipment,
                    status:
                      statusToUpdate ||
                      shipment.status,
                    carrier:
                      carrierToUpdate ||
                      shipment.carrier,
                    updatedAt:
                      "Just now",
                  }
                : shipment
          )
      );

      setSelectedShipment(
        (current) =>
          current
            ? {
                ...current,
                status:
                  statusToUpdate ||
                  current.status,
                carrier:
                  carrierToUpdate ||
                  current.carrier,
                updatedAt:
                  "Just now",
              }
            : current
      );

      showToast(
        "Shipment updated successfully."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to update shipment."
      );
    } finally {
      setUpdating(false);
    }
  };

  const copyValue = async (
    value,
    type
  ) => {
    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopied(type);

      setTimeout(
        () => setCopied(""),
        1600
      );
    } catch {
      return;
    }
  };

  const openShipment = (
    shipment
  ) => {
    setSelectedShipment(
      shipment
    );

    setStatusToUpdate(
      shipment.status
    );

    setCarrierToUpdate(
      shipment.carrier
    );
  };

  const showToast = (
    message
  ) => {
    setToast(message);

    setTimeout(
      () => setToast(""),
      2200
    );
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      carrier: "ALL",
      warehouse: "ALL",
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <div className="max-w-[1450px] mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-orange-500 font-black">
              LOGISTICS CONTROL
            </p>

            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Shipments
            </h1>

            <p className="text-[8px] text-slate-400 mt-2">
              Monitor every package from warehouse dispatch to doorstep.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="h-10 px-4 rounded-xl bg-blue-950 text-white text-[8px] font-black flex items-center justify-center gap-2 w-fit"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />
            REFRESH
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-6">
          <Metric
            label="TOTAL"
            value={stats.total}
            icon={Package}
          />

          <Metric
            label="READY TO SHIP"
            value={stats.ready}
            icon={Package}
          />

          <Metric
            label="IN TRANSIT"
            value={stats.transit}
            icon={Truck}
          />

          <Metric
            label="OUT FOR DELIVERY"
            value={stats.ofd}
            icon={Zap}
          />

          <Metric
            label="DELIVERED"
            value={stats.delivered}
            icon={Check}
            green
          />

          <Metric
            label="EXCEPTIONS"
            value={stats.exceptions}
            icon={MapPin}
            red
          />
        </div>

        <section className="bg-white border border-slate-200 rounded-2xl mt-5 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

              <input
                value={
                  filters.search
                }
                onChange={(event) =>
                  setFilters(
                    (current) => ({
                      ...current,
                      search:
                        event
                          .target
                          .value,
                      page: 1,
                    })
                  )
                }
                placeholder="Search shipment, order, customer, AWB, phone..."
                className="w-full h-10 rounded-xl bg-slate-50 border border-transparent pl-9 pr-3 text-[8px] font-bold outline-none focus:bg-white focus:border-orange-400"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) =>
                    !current
                )
              }
              className={`h-10 px-4 rounded-xl border text-[8px] font-black flex items-center justify-center gap-2 ${
                showFilters
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-slate-200"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              FILTERS
            </button>
          </div>

          {showFilters && (
            <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <FilterSelect
                label="STATUS"
                value={
                  filters.status
                }
                options={
                  STATUS_OPTIONS
                }
                onChange={(value) =>
                  setFilters(
                    (current) => ({
                      ...current,
                      status:
                        value,
                      page: 1,
                    })
                  )
                }
              />

              <FilterSelect
                label="CARRIER"
                value={
                  filters.carrier
                }
                options={
                  carriers
                }
                onChange={(value) =>
                  setFilters(
                    (current) => ({
                      ...current,
                      carrier:
                        value,
                      page: 1,
                    })
                  )
                }
              />

              <FilterSelect
                label="WAREHOUSE"
                value={
                  filters.warehouse
                }
                options={
                  warehouses
                }
                onChange={(value) =>
                  setFilters(
                    (current) => ({
                      ...current,
                      warehouse:
                        value,
                      page: 1,
                    })
                  )
                }
              />

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="self-end h-10 rounded-xl border border-slate-200 bg-white text-[8px] font-black"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <TableHead>
                    SHIPMENT
                  </TableHead>

                  <TableHead>
                    ORDER
                  </TableHead>

                  <TableHead>
                    CUSTOMER
                  </TableHead>

                  <TableHead>
                    AWB
                  </TableHead>

                  <TableHead>
                    WAREHOUSE
                  </TableHead>

                  <TableHead>
                    CARRIER
                  </TableHead>

                  <TableHead>
                    STATUS
                  </TableHead>

                  <TableHead>
                    ETA
                  </TableHead>

                  <TableHead>
                    ACTION
                  </TableHead>
                </tr>
              </thead>

              <tbody>
                {loading &&
                  Array.from(
                    {
                      length: 5,
                    }
                  ).map(
                    (_, index) => (
                      <tr
                        key={
                          index
                        }
                        className="border-b border-slate-100"
                      >
                        {Array.from(
                          {
                            length: 9,
                          }
                        ).map(
                          (
                            __,
                            cell
                          ) => (
                            <td
                              key={
                                cell
                              }
                              className="px-4 py-4"
                            >
                              <div className="h-3 bg-slate-100 rounded animate-pulse" />
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}

                {!loading &&
                  filteredShipments.map(
                    (
                      shipment
                    ) => (
                      <tr
                        key={
                          shipment.id
                        }
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-4">
                          <p className="text-[8px] font-black">
                            {
                              shipment.id
                            }
                          </p>

                          <p className="text-[6px] text-slate-400 mt-1">
                            {
                              shipment.items
                            }{" "}
                            items
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              onViewOrder?.(
                                shipment.orderId
                              )
                            }
                            className="text-[8px] font-black text-orange-600"
                          >
                            {
                              shipment.orderId
                            }
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-[8px] font-black">
                            {
                              shipment.customer
                            }
                          </p>

                          <p className="text-[6px] text-slate-400 mt-1">
                            {
                              shipment.phone
                            }
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              copyValue(
                                shipment.awb,
                                shipment.id
                              )
                            }
                            className="flex items-center gap-2"
                          >
                            <span className="text-[8px] font-black">
                              {
                                shipment.awb
                              }
                            </span>

                            <Copy className="w-2.5 h-2.5 text-slate-400" />
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-orange-500" />

                            <span className="text-[7px] font-bold">
                              {
                                shipment.warehouse
                              }
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-[8px] font-black">
                            {
                              shipment.carrier
                            }
                          </span>

                          {shipment.cod && (
                            <span className="block text-[6px] text-orange-500 font-black mt-1">
                              COD
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <ShipmentStatus
                            status={
                              shipment.status
                            }
                          />
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-[8px] font-black">
                            {
                              shipment.eta
                            }
                          </p>

                          <p className="text-[6px] text-slate-400 mt-1">
                            Updated{" "}
                            {
                              shipment.updatedAt
                            }
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              openShipment(
                                shipment
                              )
                            }
                            className="h-8 px-3 rounded-lg bg-blue-950 text-white text-[7px] font-black inline-flex items-center gap-1"
                          >
                            DETAILS
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>

          {!loading &&
            !filteredShipments.length && (
              <div className="py-16 text-center">
                <Package className="w-8 h-8 mx-auto text-slate-300" />

                <p className="text-sm font-black mt-3">
                  No shipments found
                </p>

                <p className="text-[8px] text-slate-400 mt-2">
                  Try changing your search or filters.
                </p>
              </div>
            )}

          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[7px] text-slate-400">
              Showing{" "}
              {
                filteredShipments.length
              }{" "}
              shipments
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={
                  filters.page <=
                  1
                }
                onClick={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      page: Math.max(
                        current.page -
                          1,
                        1
                      ),
                    })
                  )
                }
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="w-8 h-8 rounded-lg bg-blue-950 text-white flex items-center justify-center text-[8px] font-black">
                {
                  filters.page
                }
              </span>

              <button
                type="button"
                onClick={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      page:
                        current.page +
                        1,
                    })
                  )
                }
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedShipment && (
        <ShipmentDrawer
          shipment={
            selectedShipment
          }
          status={
            statusToUpdate
          }
          setStatus={
            setStatusToUpdate
          }
          carrier={
            carrierToUpdate
          }
          setCarrier={
            setCarrierToUpdate
          }
          updating={
            updating
          }
          copied={
            copied
          }
          onCopy={
            copyValue
          }
          onUpdate={
            updateShipment
          }
          onViewOrder={() =>
            onViewOrder?.(
              selectedShipment.orderId
            )
          }
          onClose={() =>
            setSelectedShipment(
              null
            )
          }
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120]">
          <div className="px-5 py-3 rounded-xl bg-blue-950 text-white shadow-2xl flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-green-400" />

            <span className="text-[8px] font-black">
              {toast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DRAWER
============================================================ */

function ShipmentDrawer({
  shipment,
  status,
  setStatus,
  carrier,
  setCarrier,
  updating,
  copied,
  onCopy,
  onUpdate,
  onViewOrder,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-[7px] uppercase tracking-[0.15em] text-orange-500 font-black">
              SHIPMENT DETAILS
            </p>

            <h2 className="text-lg font-black mt-1">
              {shipment.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <section className="rounded-2xl bg-blue-950 text-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[7px] text-white/40 font-black">
                  CURRENT STATUS
                </p>

                <div className="mt-2">
                  <ShipmentStatus
                    status={
                      shipment.status
                    }
                  />
                </div>
              </div>

              <Truck className="w-6 h-6 text-orange-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <DarkInfo
                label="AWB"
                value={
                  shipment.awb
                }
              />

              <DarkInfo
                label="CARRIER"
                value={
                  shipment.carrier
                }
              />

              <DarkInfo
                label="ORIGIN"
                value={
                  shipment.origin
                }
              />

              <DarkInfo
                label="DESTINATION"
                value={
                  shipment.destination
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black">
                IDENTIFIERS
              </p>

              <button
                type="button"
                onClick={() =>
                  onCopy(
                    shipment.awb,
                    "drawer-awb"
                  )
                }
                className="text-[7px] font-black text-orange-600"
              >
                {copied ===
                "drawer-awb"
                  ? "COPIED"
                  : "COPY AWB"}
              </button>
            </div>

            <DetailRow
              label="Shipment ID"
              value={
                shipment.id
              }
            />

            <DetailRow
              label="Order ID"
              value={
                shipment.orderId
              }
              action={
                <button
                  type="button"
                  onClick={
                    onViewOrder
                  }
                  className="text-orange-600"
                >
                  VIEW
                </button>
              }
            />

            <DetailRow
              label="AWB"
              value={
                shipment.awb
              }
            />
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <p className="text-[8px] font-black">
              CUSTOMER
            </p>

            <div className="mt-4">
              <DetailRow
                label="Name"
                value={
                  shipment.customer
                }
              />

              <DetailRow
                label="Phone"
                value={
                  shipment.phone
                }
              />

              <DetailRow
                label="Destination"
                value={
                  shipment.destination
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <p className="text-[8px] font-black">
              LOGISTICS
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <SelectBox
                label="STATUS"
                value={
                  status
                }
                options={
                  STATUS_OPTIONS.filter(
                    (item) =>
                      item !==
                      "ALL"
                  )
                }
                onChange={
                  setStatus
                }
              />

              <SelectBox
                label="CARRIER"
                value={
                  carrier
                }
                options={[
                  "Delhivery",
                  "Shiprocket",
                  "Ekart",
                  "Blue Dart",
                  "XpressBees",
                ]}
                onChange={
                  setCarrier
                }
              />
            </div>

            <button
              type="button"
              onClick={
                onUpdate
              }
              disabled={
                updating
              }
              className="w-full h-11 rounded-xl bg-orange-500 text-white text-[8px] font-black mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}

              {updating
                ? "UPDATING..."
                : "UPDATE SHIPMENT"}
            </button>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-orange-500" />

              <div>
                <p className="text-[8px] font-black">
                  WAREHOUSE
                </p>

                <p className="text-[9px] font-black mt-1">
                  {
                    shipment.warehouse
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <div>
                <p className="text-[6px] text-slate-400 font-black">
                  EXPECTED DELIVERY
                </p>

                <p className="text-[9px] font-black mt-1">
                  {
                    shipment.eta
                  }
                </p>
              </div>

              <div>
                <p className="text-[6px] text-slate-400 font-black">
                  LAST UPDATE
                </p>

                <p className="text-[9px] font-black mt-1">
                  {
                    shipment.updatedAt
                  }
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="h-10 rounded-xl border border-slate-200 text-[8px] font-black flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              TRACK CARRIER
            </button>

            <button
              type="button"
              onClick={
                onViewOrder
              }
              className="h-10 rounded-xl bg-blue-950 text-white text-[8px] font-black flex items-center justify-center gap-2"
            >
              VIEW ORDER
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function Metric({
  label,
  value,
  icon: Icon,
  green,
  red,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            red
              ? "bg-red-50 text-red-500"
              : green
              ? "bg-green-50 text-green-600"
              : "bg-orange-50 text-orange-500"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>

        <span className="text-xl font-black">
          {value}
        </span>
      </div>

      <p className="text-[6px] text-slate-400 font-black mt-3">
        {label}
      </p>
    </div>
  );
}

function TableHead({
  children,
}) {
  return (
    <th className="px-4 py-3 text-left text-[6px] font-black text-slate-400 whitespace-nowrap">
      {children}
    </th>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div>
      <label className="block text-[6px] font-black text-slate-400 mb-2">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-[8px] font-black outline-none appearance-none"
        >
          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {formatLabel(
                  option
                )}
              </option>
            )
          )}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div>
      <label className="block text-[6px] font-black text-slate-400 mb-2">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full h-10 rounded-xl bg-slate-50 border border-transparent px-3 text-[8px] font-black outline-none appearance-none"
        >
          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {formatLabel(
                  option
                )}
              </option>
            )
          )}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  action,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[7px] text-slate-400">
        {label}
      </span>

      <div className="flex items-center gap-2 text-right">
        <span className="text-[8px] font-black">
          {value}
        </span>

        {action}
      </div>
    </div>
  );
}

function DarkInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="text-[6px] text-white/40 font-black">
        {label}
      </p>

      <p className="text-[8px] font-black mt-1">
        {value}
      </p>
    </div>
  );
}

function ShipmentStatus({
  status,
}) {
  const config = {
    READY_TO_SHIP: [
      "bg-orange-50",
      "text-orange-600",
    ],
    PICKED_UP: [
      "bg-blue-50",
      "text-blue-600",
    ],
    IN_TRANSIT: [
      "bg-blue-50",
      "text-blue-600",
    ],
    OUT_FOR_DELIVERY: [
      "bg-purple-50",
      "text-purple-600",
    ],
    DELIVERED: [
      "bg-green-50",
      "text-green-600",
    ],
    DELAYED: [
      "bg-red-50",
      "text-red-600",
    ],
    FAILED: [
      "bg-red-50",
      "text-red-600",
    ],
    CANCELLED: [
      "bg-slate-100",
      "text-slate-500",
    ],
  };

  const [
    bg,
    text,
  ] =
    config[
      status
    ] || [
      "bg-slate-100",
      "text-slate-500",
    ];

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[6px] font-black ${bg} ${text}`}
    >
      {formatLabel(
        status
      )}
    </span>
  );
}

function formatLabel(
  value
) {
  return String(
    value || ""
  )
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}