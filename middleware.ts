import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // ლოგი #1: middleware-ის დაწყება
  console.log('--- [Middleware Start] ---');
  console.log(`მოთხოვნის დრო: ${new Date().toISOString()}`);

  // ვიღებთ მოთხოვნის სრულ მისამართს (მაგ: /products/123)
  const { pathname } = req.nextUrl;
  
  // ლოგი #2: შემოსული მისამართის დაფიქსირება
  console.log(`[Middleware Info] შემოსული pathname: ${pathname}`);

  try {
    // შესწორება: პირდაპირ ვითხოვთ index.html ფაილს
    const response = await fetch(new URL('/index.html', req.url));
    let html = await response.text();

    let productTitle, productDescription, productImageUrl, pageUrl;

    if (pathname.startsWith('/products/')) {
      console.log('[Middleware Flow] მისამართი იწყება /products/-ით. ვიწყებ დამუშავებას.');
      const productId = pathname.split('/')[2];

      if (!productId) {
        console.log('[Middleware Warning] პროდუქტის ID ვერ მოიძებნა. ვასრულებ მუშაობას.');
        return NextResponse.next();
      }
      
      console.log(`[Middleware Info] ამოღებული productId: ${productId}`);

      // --- დინამიური მონაცემები პროდუქტისთვის ---
      productTitle = `დინამიური პროდუქტი ${productId}`;
      productDescription = `ეს არის პროდუქტის (${productId}) დეტალური აღწერა, რომელიც გენერირდა Vercel Middleware-ით.`;
      productImageUrl = `https://placehold.co/1200x630/64748B/FFFFFF?text=პროდუქტი+${productId}`;
      pageUrl = new URL(pathname, req.nextUrl.origin).toString();

    } else if (pathname === '/') {
      console.log('[Middleware Flow] მთავარი გვერდია (/), ვიყენებ სტანდარტულ თეგებს.');
      
      // --- სტანდარტული მონაცემები მთავარი გვერდისთვის ---
      productTitle = 'ჩემი ვებგვერდის სათაური';
      productDescription = 'ეს არის ჩემი ვებგვერდის მთავარი გვერდის აღწერა.';
      productImageUrl = 'https://placehold.co/1200x630/000000/FFFFFF?text=ჩემი+საიტი'; // შეცვალეთ თქვენი ლოგოს მისამართით
      pageUrl = req.nextUrl.origin;
    }

    // თუ არცერთი პირობა არ შესრულდა, არაფერს ვცვლით
    if (!productTitle) {
      console.log('[Middleware Flow] ამ მისამართისთვის ცვლილებები არ არის გათვალისწინებული.');
      return NextResponse.next();
    }
    
    // ლოგი #6: ჩანაცვლებისთვის გამზადებული მონაცემები
    console.log('[Middleware Data] გამზადებული მონაცემები:', { productTitle, productDescription, productImageUrl, pageUrl });
    
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

    console.log(`[Middleware Success] მეტა თეგები წარმატებით შეიცვალა.`);

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

// `config` ობიექტი განსაზღვრავს, რომელ მისამართებზე უნდა იმუშაოს ამ middleware-მა
export const config = {
  // middleware-ი იმუშავებს მთავარ გვერდზე (/) და ყველა მისამართზე /products/ შემდეგ
  matcher: ['/', '/products/:path*'],
};

