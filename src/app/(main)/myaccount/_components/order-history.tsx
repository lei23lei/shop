import React from "react";
import { useGetUserOrdersQuery } from "@/services/endpoints/account-endpoints";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function OrderHistory() {
  const { data: ordersData, isLoading, error } = useGetUserOrdersQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Order History</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Order History</h2>
        <div className="text-red-500">
          Failed to load orders. Please try again later.
        </div>
      </div>
    );
  }

  if (!ordersData?.orders.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Order History</h2>
        <div className="text-gray-500">No orders found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order History</h2>
      <div className="space-y-4">
        {ordersData.orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Order #{order.id}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    order.status === "completed" ? "default" : "secondary"
                  }
                >
                  {order.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {format(new Date(order.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Shipping Address</p>
                    <p>{order.shipping_address}</p>
                    <p>
                      {order.city}, {order.zip_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p>
                      {order.first_name} {order.last_name}
                    </p>
                    <p>{order.shipping_phone}</p>
                    <p>{order.shipping_email}</p>
                  </div>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="items">
                    <AccordionTrigger className="text-sm font-medium">
                      View Items ({order.items.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            {item.primary_image && (
                              <div className="relative h-16 w-16">
                                <Image
                                  src={item.primary_image}
                                  alt={item.item_name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.item_name}</p>
                              <p className="text-sm text-gray-500">
                                Size: {item.size} | Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">${item.price_at_time}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex justify-end">
                  <p className="text-lg font-semibold">
                    Total: ${order.total_price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
