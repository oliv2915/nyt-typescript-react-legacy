import React, {ChangeEvent, Component, FormEvent} from "react";
import {IArticle} from "../interfaces/interfaces";
import NYTLogo from "../assets/nytimes-icon.svg"
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

    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case "searchTerm":
                this.setState(
                    {searchTerm: event.target.value}
                )
                break;
            case "startDate":
                if (this.state.startDate !== "") {
                    this.setState(
                        {startDate: event.target.value}
                    )
                }
                break;
            case "endDate":
                if (this.state.endDate !== "") {
                    this.setState(
                        {endDate: event.target.value}
                    )
                }
                break;
        
            default:
                return;
                break;
        }
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
                        imgSrc: document.multimedia.length > 0 ? `http://www.nytimes.com/${document.multimedia[0].url}` : NYTLogo,
                        keywords: document.keywords.map((keyword: any) => keyword.value)
                    };
                    return article;
                });
                this.setState(
                    {articles: articles}
                )
            })
            .catch(console.log)
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
        return (
            <>
                <div className="controls">
                    <form onSubmit={this.handleSubmit}>
                        <p>
                            <label htmlFor="search">Enter a SINGLE search term (required)</label>
                            <input type="text" name="searchTerm" id="search" className="search" required onChange={this.handleInputChange}/>
                        </p>
                        <p>
                            <label htmlFor="start-date">Enter a start date (format: YYYYMMDD)</label>
                            <input type="date" name="startDate" id="start-date" className="start-date" pattern="[0-9]{8}" onChange={this.handleInputChange}/>
                        </p>
                        <p>
                            <label htmlFor="end-date">Enter an end date (format: YYYYMMDD)</label>
                            <input type="date" name="endDate" id="end-date" className="end-date" pattern="[0-9]{8}" onChange={this.handleInputChange}/>
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
                            return <Article key={idx} webURL={article.webURL} headline={article.headline} imgSrc={article.imgSrc} keywords={article.keywords}/>
                        })}
                    </section>
                </div>
            </>
        )
    }
}