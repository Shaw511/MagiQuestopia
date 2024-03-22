import React from 'react';
import './sub_politics.css';
import logo from './magi-logo-w.png'; // 假设你的logo图片在同一目录下

const books = [
    { id: 1, title: "毛泽东传", author: "罗斯·特里尔", cover: "cover1.png" },
    { id: 2, title: "资本论（全三卷）", author: "马克思", cover: "cover2.png" },
    { id: 3, title: "中国共产党简史", author: "《中国共产党简史》编写组", cover: "cover3.png" },
    { id: 4, title: "资本论（全三卷）", author: "马克思", cover: "cover3.png" },
    { id: 5, title: "资本论（全三卷）", author: "马克思", cover: "cover3.png" },
    { id: 6, title: "资本论（全三卷）", author: "马克思", cover: "cover3.png" },
    { id: 7, title: "资本论（全三卷）", author: "马克思", cover: "cover3.png" },
    { id: 8, title: "资本论（全三卷）", author: "马克思", cover: "cover3.png" },
    // 假设有8本书，继续添加到这个数组中
];

const SubPolitics = () => {
    return (
        <div className="bookshelf">
            <div className="header">
                <img src={logo} alt="logo" className="logo"/>
                <h_sub>政治军事</h_sub>
            </div>
            <div className="books">
                {books.map(book => (
                    <div key={book.id} className="book">
                        <img src={require(`./${book.cover}`)} alt={book.title} className="cover"/>
                        <div className="info">
                            <h_sub_booktitle>{book.title}</h_sub_booktitle>
                            <p_sub_booktitle>{book.author}</p_sub_booktitle>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SubPolitics;
