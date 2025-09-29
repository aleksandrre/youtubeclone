import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // ლოგი #1: middleware-ის დაწყება
  console.log('--- [Middleware Start] ---');
  console.log(`მოთხოვნის დრო: ${new Date().toISOString()}`);

  // ვიღებთ მოთხოვნის სრულ მისამართს (მაგ: /products/123)
  const { pathname } = req.nextUrl;
  
  // ლოგი #2: შემოსული მისამართის დაფიქსირება
  console.log(`[Middleware Info] შემოსული pathname: ${pathname}`);
  
  // ლოგი #3: მთლიანი მოთხოვნის ობიექტის ჩვენება (სურვილისამებრ, შეგიძლიათ ჩართოთ)
  // console.log('[Middleware Info] მთლიანი req ობიექტი:', req);


  // ვამოწმებთ, არის თუ არა ეს პროდუქტის გვერდი
  if (pathname.startsWith('/products/')) {
    console.log('[Middleware Flow] მისამართი იწყება /products/-ით. ვიწყებ დამუშავებას.');

    // ამოვიღოთ პროდუქტის ID მისამართიდან (მაგ: "123")
    const productId = pathname.split('/')[2];

    // თუ ID არ არსებობს, არაფერს ვცვლით და ვაგრძელებთ
    if (!productId) {
      console.log('[Middleware Warning] პროდუქტის ID ვერ მოიძებნა. ვასრულებ მუშაობას.');
      return NextResponse.next();
    }
    
    // ლოგი #4: ამოღებული ID-ის ჩვენება
    console.log(`[Middleware Info] ამოღებული productId: ${productId}`);

    try {
      // ლოგი #5: HTML-ის წამოღების დაწყება
      console.log(`[Middleware Action] ვიღებ საწყის HTML-ს მისამართიდან: ${req.nextUrl.origin}`);
      const response = await fetch(req.nextUrl.origin);
      let html = await response.text();
      console.log('[Middleware Success] საწყისი HTML წარმატებით წამოვიღე.');

      // --- სატესტო მონაცემები (სამომავლოდ უნდა წამოვიდეს API-დან) ---
      const productTitle = `დინამიური პროდუქტი ${productId}`;
      const productDescription = `ეს არის პროდუქტის (${productId}) დეტალური აღწერა, რომელიც გენერირდა Vercel Middleware-ით.`;
      const productImageUrl = `https://placehold.co/1200x630/64748B/FFFFFF?text=პროდუქტი+${productId}`;
      const pageUrl = new URL(pathname, req.nextUrl.origin).toString();

      // ლოგი #6: ჩანაცვლებისთვის გამზადებული მონაცემები
      console.log('[Middleware Data] გამზადებული მონაცემები:', { productTitle, productDescription, productImageUrl, pageUrl });
      
      console.log('[Middleware Action] ვიწყებ მეტა თეგების ჩანაცვლებას...');
      // --- თეგების ჩანაცვლება ---
      html = html.replace(/<title>.*?<\/title>/, `<title>${productTitle}</title>`);
      html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${productDescription}" />`);
      html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${productTitle}" />`);
      html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${productDescription}" />`);
      html = html.replace(/<meta property="og:image" content=".*?"\s*\/?>/, `<meta property="og:image" content="${productImageUrl}" />`);
      html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${pageUrl}" />`);
      html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${productTitle}" />`);
      html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${productDescription}" />`);
      html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${productImageUrl}" />`);
      html = html.replace(/<meta property="twitter:url" content=".*?"\s*\/?>/, `<meta property="twitter:url" content="${pageUrl}" />`);

      console.log(`[Middleware Success] მეტა თეგები წარმატებით შეიცვალა ID: ${productId}-სთვის.`);

      // ვაბრუნებთ შეცვლილ HTML-ს
      console.log('--- [Middleware End] ---');
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });

    } catch (e) {
      console.error('[Middleware Error] შეცდომა დაფიქსირდა:', e);
      return NextResponse.next(); 
    }
  }

  // თუ მისამართი არ არის /products/, არაფერს ვცვლით
  console.log('[Middleware Flow] მისამართი არ იწყება /products/-ით. ცვლილებები არ არის.');
  console.log('--- [Middleware End] ---');
  return NextResponse.next();
}

export const config = {
  matcher: '/products/:path*',
};

