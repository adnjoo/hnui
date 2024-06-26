import { NextRequest, NextResponse } from 'next/server';
import cheerio from 'cheerio';

export const revalidate = 0;

export type Story = {
  id: string;
  title: string;
  link: string;
  points: string;
  comments: string;
  timeAgo: string;
};

async function scrapeHackerNews(page = 1): Promise<Story[]> {
  const url = 'https://news.ycombinator.com/?p=' + page;
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const stories: Story[] = [];

  $('tr.athing').each((index, element) => {
    const id = $(element).attr('id') || '';
    const title = $(element).find('.titleline > a').text();
    const link = $(element).find('.titleline > a').attr('href') || '';
    const points = $(element)
      .next()
      .find('.score')
      .text()
      .replace('points', '');
    let comments = $(element)
      .next()
      .find('a[href^="item"]')
      .last()
      .text()
      .replace('comments', '')
      .replace('comment', '')
      .replace('&nbsp;', '');
    const timeAgo = $(element).next().find('.age').text();

    if (comments === 'discuss') {
      comments = '0';
    }

    if (comments.includes('ago')) {
      comments = '-';
    }

    stories.push({ id, title, link, points, comments, timeAgo });
  });

  return stories;
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const p = Number(req.nextUrl.searchParams.get('p')) || 1;
    const stories = await scrapeHackerNews(p);
    return NextResponse.json({ data: stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Hacker News data' },
      { status: 500 }
    );
  }
}
