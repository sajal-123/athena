import axios from 'axios';
import * as cheerio from 'cheerio';

interface Repo {
    name: string;
    desc: string;
    language: string;
}

interface UserInterface {
    name: string;
    username:string,
    link: string;
    bio: string;
    location: string;
    repos: Repo[];
    readme: string;
    contributionCount: String;
}

// Scrape initial user search page
async function scrapeSearchPage(query: string): Promise<{ name: string; link: string; username:string }[]> {
    // console.log('Scraping search page for query:', query);
    if (!query) {
        throw new Error('Query is required');
    }
    const url = `https://github.com/search?q=${encodeURIComponent(query)}&type=users`;
    console.log('Scraping URL:', url);
    const { data } = await axios.get(url);
    // console.log('Scraping URL:', data);
    const html = data as string;
    const $ = cheerio.load(html);
    // const $ =cheerio.fromURL(url);

    const res: { name: string; link: string,username:string }[] = [];

    $('.gZKkEq').children('div').each((_: any, el: any) => {
        const name = $(el).find('.hYFqef').text().trim();

        const username = $(el).find('.prc-Link-Link-85e08').attr('href');
        if (username) {
            res.push({ name, link: `https://github.com/${username}`, username});
        }
    });
    // console.log(res)
    return res;
}

// Scrape individual user page
async function scrapeUserDetails(users: {
     name: string; link: string ; username: string
}[]): Promise<UserInterface[]> {
    const result: UserInterface[] = [];
    // console.log(users)
    for (const itr of users) {
        try {
            const response = await axios.get<string>(itr.link);
            const html = response.data;
            const $ = cheerio.load(html);

            const bio = $('.user-profile-bio').text().trim();
            const readme = $('.markdown-body').text().trim();
            const contribution_count = $('.js-yearly-contributions .position-relative').text().trim();
            const location = $('.vcard-details .p-label').text().trim();

            const repos: Repo[] = [];
            $('.gutter-condensed').children('li').each((_: any, el: any) => {
                const name = $(el).find('.repo').text().trim();
                const desc = $(el).find('.pinned-item-desc').text().trim();
                const language = $(el).find('.d-inline-block span').text().trim();
                repos.push({ name, desc, language });
            });

            result.push({
                name: itr.name,
                username:itr.username,
                link: itr.link,
                bio,
                location,
                repos,
                readme,
                contributionCount: contribution_count,
            });
        } catch (err) {
            console.error(`Error scraping user ${itr.link}: ${err}`);
        }
    }

    // console.log(result)

    return result;
}

export { scrapeSearchPage, scrapeUserDetails, UserInterface };