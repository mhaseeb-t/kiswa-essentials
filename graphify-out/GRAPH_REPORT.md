# Graph Report - .  (2026-05-11)

## Corpus Check
- Corpus is ~43,188 words - fits in a single context window. You may not need a graph.

## Summary
- 181 nodes · 249 edges · 38 communities (34 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin & Dashboard|Admin & Dashboard]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Product & Cart|Product & Cart]]
- [[_COMMUNITY_Product & Cart|Product & Cart]]
- [[_COMMUNITY_Product & Cart|Product & Cart]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Order & Checkout|Order & Checkout]]
- [[_COMMUNITY_Layout & Navigation|Layout & Navigation]]
- [[_COMMUNITY_Product & Cart|Product & Cart]]
- [[_COMMUNITY_Database|Database]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Database|Database]]

## God Nodes (most connected - your core abstractions)
1. `formatPrice()` - 19 edges
2. `AdminOrderDetail()` - 7 edges
3. `AnalyticsPage()` - 7 edges
4. `CheckoutPage()` - 7 edges
5. `ProductDetailPage()` - 7 edges
6. `OrderDetailPage()` - 6 edges
7. `AdminProducts()` - 5 edges
8. `ProductsPage()` - 5 edges
9. `WishlistPage()` - 5 edges
10. `formatDate()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `register()` --calls--> `generateToken()`  [EXTRACTED]
  frontend/src/api/authApi.js → backend/controllers/authController.js
- `login()` --calls--> `generateToken()`  [EXTRACTED]
  frontend/src/api/authApi.js → backend/controllers/authController.js
- `ProductCard()` --calls--> `formatPrice()`  [INFERRED]
  frontend/src/components/product/ProductCard.jsx → frontend/src/utils/formatPrice.js
- `AdminDashboard()` --calls--> `formatPrice()`  [INFERRED]
  frontend/src/pages/admin/AdminDashboard.jsx → frontend/src/utils/formatPrice.js
- `AdminOrderDetail()` --calls--> `formatPrice()`  [INFERRED]
  frontend/src/pages/admin/AdminOrderDetail.jsx → frontend/src/utils/formatPrice.js

## Communities (38 total, 4 thin omitted)

### Community 0 - "Admin & Dashboard"
Cohesion: 0.1
Nodes (12): AdminAddProduct(), AdminCategories(), AdminDashboard(), AdminEditProduct(), AdminOrderDetail(), AdminOrders(), AdminProducts(), CheckoutPage() (+4 more)

### Community 1 - "Authentication"
Cohesion: 0.11
Nodes (5): WishlistPage(), Navbar(), selectCartItemsCount(), selectWishlistCount(), selectWishlistItems()

### Community 2 - "Product & Cart"
Cohesion: 0.16
Nodes (7): AnalyticsPage(), CartDrawer(), CartPage(), SearchPage(), ProductCard(), selectCartTotal(), formatPrice()

### Community 3 - "Product & Cart"
Cohesion: 0.19
Nodes (5): createProduct(), deleteProduct(), getCategories(), getProduct(), updateProduct()

### Community 4 - "Product & Cart"
Cohesion: 0.22
Nodes (4): ProductsPage(), ProductFilters(), ProductGrid(), selectFilters()

### Community 5 - "Authentication"
Cohesion: 0.31
Nodes (6): getProfile(), login(), register(), updateProfile(), forgotPassword(), generateToken()

### Community 6 - "Order & Checkout"
Cohesion: 0.36
Nodes (4): createOrder(), getMyOrders(), getOrder(), updateOrderStatus()

### Community 8 - "Product & Cart"
Cohesion: 0.53
Nodes (4): ProductDetailPage(), ReviewCard(), ReviewForm(), StarRating()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.