const allowedOrigins = process.env.ALLOWED_DOMAINS?.split(',') || [];

export async function GET(request) {
  const origin = request.headers.get("origin");
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  if (allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const tmdbId = searchParams.get('id');

    // Get IMDb ID from TMDB data
    const imdbResp = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=f6e840332142f77746185ab4e67be858`
    );
    const imdbData = await imdbResp.json();
    const imdbId = imdbData.imdb_id;

    if (!imdbId) {
      return new Response(JSON.stringify({ message: "IMDb ID not found" }), {
        status: 400,
        headers,
      });
    }

    // Get base domain 
    const domainResp = await fetch('https://route7ind.com/player.js');
    const baseText = await domainResp.text();
    const domainMatch = baseText.match(/https:\/\/[^\s'"]+/);
    const domain = domainMatch?.[0];

    console.log("Base domain:", domain);

    if (!domain) {
      return new Response(JSON.stringify({ message: "Base domain not found" }), {
        status: 400,
        headers,
      });
    }

    const url = `${domain}/play/${imdbId}`;
    const playResp = await fetch(url, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'referer': 'https://allmovieland.watch/',
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'iframe',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-storage-access': 'active',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
      }
    });
    const playData = await playResp.text();

    const fileMatch = playData.match(/"file"\s*:\s*"(.*?)"/);
    const keyMatch = playData.match(/"key"\s*:\s*"(.*?)"/);

    if (!fileMatch || !keyMatch) {
      return new Response(JSON.stringify({ message: "Could not extract file or key" }), {
        status: 400,
        headers,
      });
    }

    const file = fileMatch[1];
    const key = keyMatch[1];

    // First POST to get encrypted file list
    const encryptedResp = await fetch(file, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-csrf-token": key,
        "Referer": `${domain}/play/f${imdbId}`,
      },
      body: ''
    });

    const jsondata = await encryptedResp.json();

    if (!Array.isArray(jsondata)) {
      return new Response(JSON.stringify({ message: "Invalid stream data" }), {
        status: 500,
        headers,
      });
    }

    // Resolve all files
    const finalStreams = await Promise.all(
      jsondata.map(async (entry) => {
        const finalResp = await fetch(`${domain}/playlist/${entry.file}.txt`, {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'x-csrf-token': key,
            'origin': domain,
            'referer': `${domain}/play/${imdbId}`
          },
          body: ''
        });

        const streamText = await finalResp.text();
        return {
          ...entry,
          file: typeof streamText === 'string' ? streamText : entry.file
        };
      })
    );
    
    return new Response(JSON.stringify(finalStreams), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers,
    });
  }
}