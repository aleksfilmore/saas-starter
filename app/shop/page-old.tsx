'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Zap, Clock, Star, Gift, Sparkles, Loader2, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ShippingForm from '@/components/shop/ShippingForm';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'physical';
  type: string;
  bytePrice: number | null;
  cashPrice: number | null;
  isDigital: boolean;
  requiresShipping: boolean;
  discount?: number;
  isPopular?: boolean;
  isLimited?: boolean;
  stockCount?: number;
  rating?: number;
  imageUrl?: string;
  features?: string[];
  userCanAfford?: boolean;
}

export default function ShopPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [userBytes, setUserBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState<'bytes' | 'cash'>('bytes');
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
    if (user) {
      loadUserBytes();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/shop/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBytes = async () => {
    try {
      const response = await fetch('/api/bytes/balance');
      const data = await response.json();
      setUserBytes(data.balance || 0);
    } catch (error) {
      console.error('Error loading user bytes:', error);
    }
  };

  const handlePurchase = async (product: Product) => {
    if (!user) {
      console.log('Please sign in to make a purchase');
      return;
    }
    
    // For physical products with cash payment, show shipping form first
    if (paymentMethod === 'cash' && product.requiresShipping) {
      setSelectedProduct(product);
      setShowShippingForm(true);
      return;
    }
    
    setPurchasing(product.id);
    
    try {
      if (paymentMethod === 'bytes') {
        if (!product.bytePrice) {
          console.log('Error: This product is not available for Byte purchase');
          return;
        }

        const response = await fetch('/api/shop/purchase/bytes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Purchase Successful!', result.message);
          setUserBytes(result.newBalance);
          await loadProducts();
          
          // For audiobook, redirect to audiobook page
          if (product.id === 'audiobook_worst_boyfriends') {
            window.location.href = '/audiobook';
          }
        } else {
          console.log('Purchase Failed:', result.message || result.error);
        }
      } else {
        // Cash purchase for digital products (no shipping needed)
        if (!product.cashPrice) {
          console.log('Error: This product is not available for cash purchase');
          return;
        }

        const response = await fetch('/api/shop/paylink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });

        const result = await response.json();

        if (response.ok && result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          console.log('Payment Error:', result.message || 'Failed to create payment link');
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      console.log('An error occurred during purchase. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleShippingSubmit = async (shippingAddress: any) => {
    if (!selectedProduct) return;
    
    setPurchasing(selectedProduct.id);
    
    try {
      const response = await fetch('/api/shop/paylink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: selectedProduct.id,
          shippingAddress 
        })
      });

      const result = await response.json();

      if (response.ok && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        console.log('Payment Error:', result.message || 'Failed to create payment link');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      console.log('An error occurred during purchase. Please try again.');
    } finally {
      setPurchasing(null);
      setShowShippingForm(false);
      setSelectedProduct(null);
    }
  };

  const handleShippingCancel = () => {
    setShowShippingForm(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'digital') return product.category === 'digital';
    if (activeTab === 'physical') return product.category === 'physical';
    if (activeTab === 'affordable') return product.userCanAfford;
    return true;
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access the CTRL+ALT+BLOCK shop and earn Bytes through your healing journey.
            </p>
            <Button asChild>
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading shop...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showShippingForm ? (
        <ShippingForm
          onSubmit={handleShippingSubmit}
          onCancel={handleShippingCancel}
          loading={purchasing !== null}
          initialData={{ email: user?.email }}
        />
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <Sparkles className="inline h-8 w-8 mr-2 text-yellow-500" />
              CTRL+ALT+BLOCK Shop
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Spend your hard-earned Bytes on rewards that support your healing journey
            </p>
            
            <Card className="max-w-sm mx-auto">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold">{userBytes.toLocaleString()} Bytes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex bg-muted p-1 rounded-lg">
              <Button
                variant={paymentMethod === 'bytes' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPaymentMethod('bytes')}
                className="flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Pay with Bytes</span>
              </Button>
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPaymentMethod('cash')}
                className="flex items-center space-x-2"
              >
                <span>💳</span>
                <span>Pay with Card</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="affordable">Affordable</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'affordable' 
                      ? "Keep earning Bytes to unlock more affordable options!"
                      : "Check back soon for new products!"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="relative overflow-hidden">
                      {product.isPopular && (
                        <Badge className="absolute top-2 right-2 z-10" variant="destructive">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      
                      {product.isLimited && (
                        <Badge className="absolute top-2 left-2 z-10" variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Limited
                        </Badge>
                      )}

                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{product.name}</span>
                          {product.discount && (
                            <Badge variant="outline">-{product.discount}%</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        {/* Product Image */}
                        {product.imageUrl && (
                          <div className="mb-4">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-md"
                            />
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground mb-4">
                          {product.description}
                        </p>

                        {product.features && (
                          <ul className="text-sm space-y-1 mb-4">
                            {product.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            {paymentMethod === 'bytes' && product.bytePrice && (
                              <div className="flex items-center space-x-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold">{product.bytePrice.toLocaleString()} Bytes</span>
                              </div>
                            )}
                            {paymentMethod === 'cash' && product.cashPrice && (
                              <div className="flex items-center space-x-1">
                                <span className="font-semibold">${(product.cashPrice / 100).toFixed(2)}</span>
                                {product.requiresShipping && (
                                  <Package className="h-3 w-3 text-muted-foreground ml-1" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {product.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handlePurchase(product)}
                          disabled={
                            purchasing === product.id ||
                            (paymentMethod === 'bytes' && (!product.bytePrice || userBytes < product.bytePrice)) ||
                            (paymentMethod === 'cash' && !product.cashPrice)
                          }
                          className="w-full"
                        >
                          {purchasing === product.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {paymentMethod === 'bytes' && product.bytePrice && userBytes < product.bytePrice
                                ? `Need ${(product.bytePrice - userBytes).toLocaleString()} more Bytes`
                                : `Purchase${paymentMethod === 'bytes' && product.bytePrice ? ` for ${product.bytePrice.toLocaleString()} Bytes` : paymentMethod === 'cash' && product.cashPrice ? ` for $${(product.cashPrice / 100).toFixed(2)}` : ''}`
                              }
                            </>
                          )}
                        </Button>

                        {product.stockCount && product.stockCount < 10 && (
                          <p className="text-xs text-orange-600 mt-2 text-center">
                            Only {product.stockCount} left in stock!
                          </p>
                        )}

                        {product.requiresShipping && paymentMethod === 'cash' && (
                          <p className="text-xs text-green-600 mt-2 text-center">
                            ✅ Free worldwide shipping included
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
