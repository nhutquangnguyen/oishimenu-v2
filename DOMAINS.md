# Domain Configuration Guide

## Domain Structure

### 🌐 **Main Landing Page**
- **Primary**: `oishimenu.com` → Landing page for Vietnamese F&B businesses
- **WWW**: `www.oishimenu.com` → Redirects to main domain

### 🏢 **Merchant Portal**
- **Subdomain**: `merchant.oishimenu.com` → Full restaurant management dashboard

## Local Development Testing

### Testing with localhost:

1. **Landing Page**: `http://localhost:3000/` → Auto-redirects to landing
2. **Landing Direct**: `http://localhost:3000/landing` → Landing page
3. **Merchant Portal**: `http://localhost:3000/dashboard` → Dashboard (requires auth)

### Testing with custom hosts (optional):

Add to your `/etc/hosts` file:
```
127.0.0.1 oishimenu.local
127.0.0.1 merchant.oishimenu.local
```

Then access:
- `http://oishimenu.local:3000` → Landing page
- `http://merchant.oishimenu.local:3000` → Merchant dashboard

## Production Deployment Steps

### 1. **Domain Registration**
Register the domain `oishimenu.com` with your preferred registrar.

### 2. **Vercel Deployment**

#### Deploy the project:
```bash
vercel --prod
```

#### Add custom domains in Vercel Dashboard:
1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add these domains:
   - `oishimenu.com`
   - `www.oishimenu.com`
   - `merchant.oishimenu.com`

### 3. **DNS Configuration**

Set up these DNS records with your domain registrar:

#### A Records:
```
oishimenu.com → 76.76.19.19 (Vercel IP)
```

#### CNAME Records:
```
www.oishimenu.com → cname.vercel-dns.com
merchant.oishimenu.com → cname.vercel-dns.com
```

**Note**: Vercel will provide the exact IP addresses and CNAME targets in your dashboard.

### 4. **SSL Certificates**
Vercel automatically provisions SSL certificates for all domains.

## Domain Routing Logic

### Middleware Configuration (`middleware.ts`):
- **Main Domain** (`oishimenu.com`, `www.oishimenu.com`):
  - `/` → Serves landing page
  - All other paths → Redirect to landing page

- **Merchant Subdomain** (`merchant.oishimenu.com`):
  - `/` → Serves dashboard (requires authentication)
  - All dashboard routes accessible
  - Auth pages (login, signup) accessible

### Next.js Rewrites (`next.config.js`):
- Automatic route rewrites based on hostname
- Optimized for SEO and performance

## Features by Domain

### 📱 **oishimenu.com** (Landing Page)
- ✅ Vietnamese language content
- ✅ SME F&B focused features
- ✅ Local pricing (Vietnamese Dong)
- ✅ Integration showcases (OishiDelivery, Shopee Food)
- ✅ Customer testimonials
- ✅ Free trial signup
- ✅ Mobile responsive design

### 🏪 **merchant.oishimenu.com** (Dashboard)
- ✅ Complete restaurant management system
- ✅ POS system with table management
- ✅ Order management across platforms
- ✅ Analytics and reporting
- ✅ Menu management
- ✅ Inventory tracking
- ✅ Staff management
- ✅ Financial reports
- ✅ Marketing tools

## Environment Variables for Production

Update your `.env.production` with:

```env
NEXT_PUBLIC_DOMAIN=oishimenu.com
NEXT_PUBLIC_MERCHANT_DOMAIN=merchant.oishimenu.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## Monitoring & Analytics

### Recommended Setup:
1. **Google Analytics 4** → Track landing page conversions
2. **Vercel Analytics** → Monitor performance
3. **Firebase Analytics** → Track merchant portal usage
4. **Uptime Monitoring** → Monitor domain availability

## SEO Optimization

### Landing Page (`oishimenu.com`):
- ✅ Vietnamese meta tags
- ✅ Local business schema markup
- ✅ Vietnamese keyword optimization
- ✅ Mobile-first indexing ready

### Merchant Portal (`merchant.oishimenu.com`):
- ✅ Private routes (no indexing)
- ✅ Authenticated content only
- ✅ Fast loading dashboard

## Support & Maintenance

### Domain Health Checks:
```bash
# Test main domain
curl -I https://oishimenu.com

# Test merchant subdomain
curl -I https://merchant.oishimenu.com

# Test redirects
curl -I https://www.oishimenu.com
```

### Troubleshooting:
1. **DNS Propagation**: Use `dig` or online DNS checkers
2. **SSL Issues**: Check Vercel dashboard for certificate status
3. **Routing Issues**: Verify middleware and next.config.js
4. **Performance**: Monitor Core Web Vitals in Vercel Analytics