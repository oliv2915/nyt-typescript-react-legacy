export interface IArticles {
    articles: IArticle[];
}

export interface IArticle {
    webURL: string;
    headline: string;
    imgURL: string;
    keywords: string[];
}