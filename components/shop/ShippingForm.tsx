'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, User, Mail, MapPin } from 'lucide-react';

interface ShippingAddress {
  name: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<ShippingAddress>;
}

export default function ShippingForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  initialData = {} 
}: ShippingFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: initialData.name || '',
    email: initialData.email || '',
    address1: initialData.address1 || '',
    address2: initialData.address2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zip: initialData.zip || '',
    country: initialData.country || 'US'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!address.name.trim()) newErrors.name = 'Name is required';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    if (!address.address1.trim()) newErrors.address1 = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State/Province is required';
    if (!address.zip.trim()) newErrors.zip = 'ZIP/Postal code is required';
    if (!address.country.trim()) newErrors.country = 'Country is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (address.email && !emailRegex.test(address.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(address);
    }
  };

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5" />
          <span>Shipping Information</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Contact Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={address.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={address.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Shipping Address</span>
            </h3>
            
            <div>
              <Label htmlFor="address1">Street Address *</Label>
              <Input
                id="address1"
                value={address.address1}
                onChange={(e) => updateField('address1', e.target.value)}
                className={errors.address1 ? 'border-red-500' : ''}
                placeholder="123 Main Street"
              />
              {errors.address1 && (
                <p className="text-sm text-red-600 mt-1">{errors.address1}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
              <Input
                id="address2"
                value={address.address2}
                onChange={(e) => updateField('address2', e.target.value)}
                placeholder="Apt 4B"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                  placeholder="NY"
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="zip">ZIP/Postal Code *</Label>
                <Input
                  id="zip"
                  value={address.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  className={errors.zip ? 'border-red-500' : ''}
                  placeholder="10001"
                />
                {errors.zip && (
                  <p className="text-sm text-red-600 mt-1">{errors.zip}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">Country *</Label>
              <select
                id="country"
                value={address.country}
                onChange={(e) => updateField('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="NL">Netherlands</option>
                <option value="SE">Sweden</option>
                <option value="DK">Denmark</option>
                <option value="NO">Norway</option>
                <option value="FI">Finland</option>
              </select>
              {errors.country && (
                <p className="text-sm text-red-600 mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Shipping Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📦 <strong>Free worldwide shipping included!</strong> Your signed book will be shipped within 3-5 business days.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
