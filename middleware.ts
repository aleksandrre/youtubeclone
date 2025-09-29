import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // ვიღებთ მოთხოვნის სრულ მისამართს (მაგ: /products/123)
  const { pathname } = req.nextUrl;

  // ვამოწმებთ, არის თუ არა ეს პროდუქტის გვერდი
  if (pathname.startsWith('/products/')) {
    // ამოვიღოთ პროდუქტის ID მისამართიდან (მაგ: "123")
    const productId = pathname.split('/')[2];

    // თუ ID არ არსებობს, არაფერს ვცვლით და ვაგრძელებთ
    if (!productId) {
      return NextResponse.next();
    }
    
    console.log(`[Middleware] იმუშავა მისამართზე: ${pathname}`);

    try {
      // ვიღებთ საწყის HTML გვერდს (index.html)
      // req.nextUrl.origin გვაძლევს საიტის მთავარ მისამართს (მაგ: https://your-site.vercel.app)
      const response = await fetch(req.nextUrl.origin);
      let html = await response.text();

      // --- სატესტო მონაცემები (სამომავლოდ უნდა წამოვიდეს API-დან) ---
      const productTitle = `დინამიური პროდუქტი ${productId}`;
      const productDescription = `ეს არის პროდუქტის (${productId}) დეტალური აღწერა, რომელიც გენერირდა Vercel Middleware-ით.`;
      // WhatsApp-ისთვის კრიტიკულად მნიშვნელოვანია სურათის სრული და აბსოლუტური მისამართი!
      const productImageUrl = `https://placehold.co/1200x630/64748B/FFFFFF?text=პროდუქტი+${productId}`;
      // გვერდის სრული მისამართი
      const pageUrl = new URL(pathname, req.nextUrl.origin).toString();

      // --- თეგების ჩანაცვლება ---
      // ჩანაცვლებისას ვიყენებთ რეგულარულ გამოსახულებებს, რომ ნებისმიერი შიგთავსი ჩანაცვლდეს
      html = html.replace(/<title>.*?<\/title>/, `<title>${productTitle}</title>`);
      html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${productDescription}" />`);

      // Open Graph თეგები (WhatsApp, Facebook, etc.)
      html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${productTitle}" />`);
      html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/, `<meta property="og:description" content="${productDescription}" />`);
      html = html.replace(/<meta property="og:image" content=".*?"\s*\/?>/, `<meta property="og:image" content="${productImageUrl}" />`);
      html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${pageUrl}" />`);
      
      // Twitter თეგები
      html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${productTitle}" />`);
      html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${productDescription}" />`);
      html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${productImageUrl}" />`);
      html = html.replace(/<meta property="twitter:url" content=".*?"\s*\/?>/, `<meta property="twitter:url" content="${pageUrl}" />`);

      console.log(`[Middleware] მეტა თეგები წარმატებით შეიცვალა ID: ${productId}-სთვის.`);

      // ვაბრუნებთ შეცვლილ HTML-ს
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });

    } catch (e) {
      console.error('[Middleware] შეცდომა დაფიქსირდა:', e);
      // შეცდომის შემთხვევაში, უბრალოდ ვაგრძელებთ, რომ საიტი არ "გაითიშოს"
      return NextResponse.next(); 
    }
  }

  // თუ მისამართი არ არის /products/, არაფერს ვცვლით
  return NextResponse.next();
}

// `config` ობიექტი განსაზღვრავს, რომელ მისამართებზე უნდა იმუშაოს ამ middleware-მა
export const config = {
  matcher: '/products/:path*',
};

