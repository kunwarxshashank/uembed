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
    const seasonId = searchParams.get('season');
    const episodeId = searchParams.get('episode');
    const token = searchParams.get('token');

    // Token validation
    // const configRes = await fetch('https://raw.githubusercontent.com/rogplay/public/refs/heads/main/oldconfig.json');
    // const config = await configRes.json();

    // if (!token || token !== config.versionname) {
    //   const promo = [
    //     {
    //       file: 'https://raw.githubusercontent.com/kunwarxshashank/rogplay_addons/refs/heads/main/assets/stream/master.m3u8',
    //       title: "Server 1",
    //       id: 199
    //     }
    //   ];
    //   return new Response(JSON.stringify(promo), { status: 200, headers });
    // }

    // Get IMDb ID
    const imdbRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=f6e840332142f77746185ab4e67be858`);
    const imdbData = await imdbRes.json();
    const imdbId = imdbData.imdb_id;



    if (!imdbId) {
      return new Response(JSON.stringify({ message: "IMDb ID not found" }), { status: 400, headers });
    }

    // Get domain
    const baseRes = await fetch('https://route7ind.com/player.js');
    const baseText = await baseRes.text();
    const domain = baseText.match(/https:\/\/[^\s'"]+/)?.[0];

    if (!domain) {
      return new Response(JSON.stringify({ message: "Domain not found" }), { status: 400, headers });
    }

    const url = `${domain}/play/${imdbId}?d=allmovielandapp.app`;
    const dataRes = await fetch(url, {
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
    const dataText = await dataRes.text();
    const file = dataText.match(/"file"\s*:\s*"(.*?)"/)?.[1];
    const key = dataText.match(/"key"\s*:\s*"(.*?)"/)?.[1];

    if (!file || !key) {
      return new Response(JSON.stringify({ message: "Could not extract file or key" }), { status: 400, headers });
    }

    // Get folder structure (seasons & episodes)
    const postResp = await fetch(`${domain}/${file}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-csrf-token': key,
        'referer': `${domain}/`,
        'origin': domain,
      },
      body: ''
    });

    const folderData = await postResp.json();

    function getEpisodeFolder(seasonId, episodeId, jsonData) {
      const season = jsonData.find(season => season.id === seasonId);
      if (season) {
        const episode = season.folder.find(ep => ep.id === `${seasonId}-${episodeId}`);
        return episode?.folder || null;
      }
      return null;
    }

    const episodedata = getEpisodeFolder(seasonId, episodeId, folderData);

    if (!episodedata) {
      return new Response(JSON.stringify({ message: 'Episode data not found' }), { status: 404, headers });
    }

    // Resolve playlist files
    const episodeStreams = await Promise.all(
      episodedata.map(async (ep) => {
        const epRes = await fetch(`${domain}/playlist/${ep.file}.txt`, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-csrf-token': key,
            'origin': domain,
            'referer': `${domain}/play/${imdbId}`,
          },
          body: ''
        });

        const epFile = await epRes.text();

        return {
          title: ep.title,
          file: epFile
        };
      })
    );

    return new Response(JSON.stringify(episodeStreams), { status: 200, headers });

  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers });
  }
}
