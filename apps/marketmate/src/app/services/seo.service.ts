import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly defaultTitle = 'MarketMate - Buy & Sell Used Items';
  private readonly defaultDescription =
    'A marketplace built with Spring Boot and Angular.';
  private readonly defaultImage =
    'https://app.marketmatecloud.in/assets/preview.png';
  private readonly defaultUrl = 'https://app.marketmatecloud.in';
  private readonly defaultType = 'website';

  constructor(
    private readonly meta: Meta,
    private readonly title: Title,
  ) {}

  setDefaultSeoTags(): void {
    this.title.setTitle(this.defaultTitle);

    this.meta.updateTag({
      name: 'description',
      content: this.defaultDescription,
    });

    this.meta.updateTag({
      property: 'og:title',
      content: this.defaultTitle,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: this.defaultDescription,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: this.defaultImage,
    });
    this.meta.updateTag({
      property: 'og:url',
      content: this.defaultUrl,
    });
    this.meta.updateTag({
      property: 'og:type',
      content: this.defaultType,
    });
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
  }
}
