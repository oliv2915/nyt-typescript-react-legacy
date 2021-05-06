export interface IArticles {
    articles: IArticle[];
}

export interface IArticle {
    webURL: string;
    headline: string;
    imgSrc: string;
    keywords: string[];
}