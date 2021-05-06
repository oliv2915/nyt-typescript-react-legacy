import React, {ChangeEvent, Component, FormEvent} from "react";
import {IArticle} from "../interfaces/interfaces";
import Article from "./Article";

interface IState {
    searchTerm: string;
    startDate?: string;
    endDate?: string;
    pageNumber: number
    articles: IArticle[];
}

export default class Articles extends Component<{}, IState> {
    constructor(props: any) {
        super(props)
        this.state = ({
            searchTerm: "",
            startDate: "",
            endDate: "",
            pageNumber: 0,
            articles: []
        })
    }

    setSearchTerm = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {searchTerm: event.target.value}
        )
    }

    setStartDate = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {startDate: event.target.value}
        )
    }

    setEndDate = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {endDate: event.target.value}
        )
    }

    handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // each time the submit button is pressed, reset page number to 0
        // this means a new search is being done
        this.setState(
            {pageNumber: 0},
            () => this.fetchArticles()
        );
    }
    
    fetchArticles = () => {
        let url = `${process.env.REACT_APP_NYT_BASE_URL}?api-key=${process.env.REACT_APP_NYT_API_KEY}&page=${this.state.pageNumber}&q=${this.state.searchTerm}`;

        if (this.state.startDate !== "") url += `&begin_date=${this.state.startDate}`;

        if (this.state.endDate !== "") url += `&end_date=${this.state.endDate}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const articles = data.response.docs.map((document: any) => {
                    const article = {
                        webURL: document.web_url,
                        headline: document.headline.main,
                        imgURL: `http://www.nytimes.com/${document.multimedia[0].url}`,
                        keywords: document.keywords.map((keyword: any) => keyword.value)
                    };
                    return article;
                });
                this.setState(
                    {articles: articles}
                )
            })
    }
    
    nextTen = () => {
        this.setState(
            {pageNumber: this.state.pageNumber + 1},
            () => this.fetchArticles()
        )
    }

    prevTen = () => {
        if (this.state.pageNumber > 0) {
            this.setState(
                {pageNumber: this.state.pageNumber - 1},
                () => this.fetchArticles()
            )
        }
    }

    render() {
        // console.log(this.state.articles.length < 10)
        return (
            <>
                <div className="controls">
                    <form onSubmit={this.handleSubmit}>
                        <p>
                            <label htmlFor="search">Enter a SINGLE search term (required)</label>
                            <input type="text" id="search" className="search" required onChange={this.setSearchTerm}/>
                        </p>
                        <p>
                            <label htmlFor="start-date">Enter a start date (format: YYYYMMDD)</label>
                            <input type="date" id="start-date" className="start-date" pattern="[0-9]{8}" onChange={this.setStartDate}/>
                        </p>
                        <p>
                            <label htmlFor="end-date">Enter an end date (format: YYYYMMDD)</label>
                            <input type="date" id="end-date" className="end-date" pattern="[0-9]{8}" onChange={this.setEndDate}/>
                        </p>
                        <p>
                            <button type="submit" className="submit">Submit Search</button>
                        </p>
                    </form>
                </div>

                <div className="results">
                    <nav>
                        {this.state.pageNumber !== 0 ? <button type="button" className="prev" onClick={this.prevTen}>Previous 10</button> : null}
                        {this.state.articles.length === 10 ? <button type="button" className="next" onClick={this.nextTen}>Next 10</button> : null}
                    </nav>
                    <section>
                        {this.state.articles.map((article, idx) => {
                            return <Article key={idx} webURL={article.webURL} headline={article.headline} imgURL={article.imgURL} keywords={article.keywords}/>
                        })}
                    </section>
                </div>
            </>
        )
    }
}