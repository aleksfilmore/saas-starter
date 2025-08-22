import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { shopProducts, digitalProductAccess, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { SHOP_PRODUCTS } from '@/lib/shop/constants';

export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'digital' | 'physical'
    const type = searchParams.get('type'); // 'audiobook' | 'mug' | etc.
    
    // Get products from database or use constants
    let products = Object.values(SHOP_PRODUCTS);
    
    // Filter by category if specified
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    // Filter by type if specified
    if (type) {
      products = products.filter(p => p.type === type);
    }
    
    // Get user's current byte balance
    const [userInfo] = await db
      .select({ bytes: users.bytes, tier: users.tier })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    
    const userBytes = userInfo?.bytes || 0;
    const userTier = userInfo?.tier || 'freemium';
    
    // Check which digital products user already owns
    const ownedProducts = await db
      .select({ productId: digitalProductAccess.productId })
      .from(digitalProductAccess)
      .where(and(
        eq(digitalProductAccess.userId, user.id),
        eq(digitalProductAccess.isActive, true)
      ));
    
    const ownedProductIds = new Set(ownedProducts.map(p => p.productId));
    
    // Enhance products with user-specific data
    const enhancedProducts = products.map(product => {
      const isOwned = ownedProductIds.has(product.id);
      const canAffordBytes = product.bytePrice ? userBytes >= product.bytePrice : false;
      
      // Check if product has special unlock conditions
      let isUnlocked = true;
      let unlockCondition = null;
      
      if (product.id === 'workbook_ctrlaltblock') {
        // Workbook unlock conditions
        if (userTier === 'freemium') {
          // TODO: Check if user has been active for 7 days
          unlockCondition = 'Complete 7 days of engagement';
          isUnlocked = false; // For now, implement proper check later
        } else {
          unlockCondition = 'Included with Firewall Mode';
          isUnlocked = true;
        }
      }
      
      return {
        ...product,
        variants: product.variants ? JSON.parse(product.variants as string) : null,
        tags: product.tags || [],
        images: product.images || [],
        userCanAfford: canAffordBytes,
        userOwns: isOwned,
        isUnlocked,
        unlockCondition,
        estimatedDays: product.bytePrice ? Math.ceil(product.bytePrice / 30) : null // Assuming 30 bytes/day avg
      };
    });
    
    return NextResponse.json({
      success: true,
      products: enhancedProducts,
      userInfo: {
        bytes: userBytes,
        tier: userTier
      }
    });
    
  } catch (error) {
    console.error('Shop products error:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}

// POST endpoint to seed products (admin only)
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is admin (simple check for now)
    const dbUser = user as any;
    if (!dbUser.isAdmin && dbUser.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { seedProducts } = await request.json();
    
    if (seedProducts) {
      // Seed the shop products from constants
      const productsToSeed = Object.values(SHOP_PRODUCTS).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        type: product.type,
        bytePrice: product.bytePrice,
        variants: typeof product.variants === 'string' ? product.variants : JSON.stringify(product.variants || null),
        digitalContent: (product as any).digitalContent || null,
        printifyProductId: (product as any).printifyProductId || null,
        isActive: true,
        isDigital: product.isDigital,
        requiresShipping: product.requiresShipping,
        tags: JSON.stringify(product.tags || []),
        images: JSON.stringify(product.images || []),
        sortOrder: 0
      }));
      
      // Insert products (upsert to avoid duplicates)
      for (const product of productsToSeed) {
        await db
          .insert(shopProducts)
          .values(product)
          .onConflictDoUpdate({
            target: shopProducts.id,
            set: {
              name: product.name,
              description: product.description,
              bytePrice: product.bytePrice,
              updatedAt: new Date()
            }
          });
      }
      
      console.log(`✅ Seeded ${productsToSeed.length} shop products`);
      
      return NextResponse.json({
        success: true,
        message: `Seeded ${productsToSeed.length} products`,
        products: productsToSeed.length
      });
    }
    
    return NextResponse.json(
      { error: 'No action specified' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Shop seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed products' },
      { status: 500 }
    );
  }
}
