import React, { FunctionComponent } from "react"
import {IArticle} from "../interfaces/interfaces";


const Article: FunctionComponent<IArticle> = (props) => {
    // console.log(props)
    return (
        <article>
            <h2>
                <a target="_blank" href={props.webURL}>{props.headline}</a>
            </h2>
            <img src={props.imgURL} alt={props.headline} />
            <p>{props.keywords.map((keyword, idx) => {
                return <span key={idx}>{keyword}</span>
            })}</p>
            <div className="clearfix" />
        </article>
    )
}

export default Article;