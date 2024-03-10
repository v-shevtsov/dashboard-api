import { Controller, Get, Header } from '@nestjs/common';
import { TopPageService } from '../top-page/top-page.service';
import { ConfigService } from '@nestjs/config';
import { subDays, format } from 'date-fns';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constants';

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get('DOMAIN')!;
  }

  @Get('xml')
  @Header('Content-Type', 'application/xml')
  async sitemap() {
    const formatString = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
    let response = [
      {
        loc: `${this.domain}/`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
    ];
    const pages = await this.topPageService.findAll();
    response = response.concat(
      pages.map((page) => {
        return {
          loc: `${this.domain}/${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
          lastmod: format(new Date(page.updatedAt), formatString),
          changefreq: 'weekly',
          priority: '0.7',
        };
      }),
    );
    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' },
    });

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: response,
      },
    });
  }
}
