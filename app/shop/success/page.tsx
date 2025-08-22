'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowLeft, Zap, Gift } from 'lucide-react';
import Link from 'next/link';

function ShopSuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams?.get('session_id');
  const orderId = searchParams?.get('order_id');

  useEffect(() => {
    if (sessionId || orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/shop/order-status?${sessionId ? `session_id=${sessionId}` : `order_id=${orderId}`}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading order details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Purchase Successful!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase! Your order has been processed successfully.
            </p>

            {orderDetails && (
              <div className="bg-muted p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Details
                </h3>
                
                <div className="space-y-2 text-sm">
                  {orderDetails.orderId && (
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">{orderDetails.orderId}</span>
                    </div>
                  )}
                  
                  {orderDetails.productName && (
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span>{orderDetails.productName}</span>
                    </div>
                  )}
                  
                  {orderDetails.amount && (
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="flex items-center">
                        {orderDetails.paymentMethod === 'bytes' ? (
                          <>
                            <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                            {orderDetails.amount.toLocaleString()} Bytes
                          </>
                        ) : (
                          `$${orderDetails.amount}`
                        )}
                      </span>
                    </div>
                  )}
                  
                  {orderDetails.email && (
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{orderDetails.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-semibold text-blue-900">What's Next?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {orderDetails?.isDigital 
                      ? "Your digital product will be available in your account within a few minutes. Check your email for download instructions."
                      : "For physical products, you'll receive a shipping confirmation email with tracking information within 24-48 hours."
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/shop" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If you have any questions about your order, please contact our support team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ShopSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    }>
      <ShopSuccessContent />
    </Suspense>
  );
}