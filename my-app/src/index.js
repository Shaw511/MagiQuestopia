import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts/font.css'

const Login = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);


    const handleClick = () => {
        setIsOpen(true)
    };

    const handleClose = () => {
        setIsOpen(false);
    }

    const [activeTab, setActivTab] = useState(1);

    const handleTabClick = (login_tab) => {
        setActivTab(login_tab);
    };

    const handleRegistSubmit = (e) =>{
        e.preventDefault();

        //发送POST请求给后端的API接口
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({username, password}),
        })
            .then((response) => response.json())
            .then((data) => {
                //注册成功后处理逻辑
                setLoggedIn(true);
                handleClose();
            })
            .catch((error) =>{
                //处理错误
            });
    }

    const handleLoginSubmit = (e) =>{
        e.preventDefault();

        //发送POST请求给后端的API接口
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({username, password}),
        })
            .then((response) => response.json())
            .then((data) => {
                //登录成功后处理逻辑
                setLoggedIn(true);
                handleClose();
            })
            .catch((error) =>{
                //处理错误
            });
    }

    return (
        <div className="login-container">
            {loggedIn && (
                <div className="account-info">
                    <img className="user_avatar" src={require('./user-avatar.png')}  alt="User Avatar"/>
                    <span className="account-label"> {username} </span>
                </div>
            )}
            {!loggedIn && (
                    <button className="login-btn" onClick={handleClick}>
                        登录 / 注册
                    </button>
                )}
            {isOpen && (
                <div className="login-modal">
                    <div className="login-modal-content">
                        <div className="login-tabs">
                            <div className={`login_tab ${activeTab === 1 ? "active" : ""}`}
                                 onClick={() => handleTabClick(1)} onClick={() => handleTabClick(1)}>注册
                            </div>
                            <div className={`login_tab ${activeTab === 2 ? "active" : ""}`}
                                 onClick={() => handleTabClick(2)} onClick={() => handleTabClick(2)}>登录
                            </div>
                        </div >
                        {activeTab === 1 ? (
                            <div>
                                <form className='login-form' onSubmit={handleRegistSubmit}>
                                    <img className="logo1" src={require('./magi-logo-w.png')}/>
                                    <input type="text" placeholder="  输入注册账号名" onChange={(e) => setUsername(e.target.value)}/>
                                    <input type="password" placeholder="  输入注册密码" onChange={(e)=> setPassword(e.target.value)}/>
                                    <button className="register-btn" type="submit">注册</button>
                                </form>
                                <button className="close-btn" onClick={handleClose}>
                                    关闭
                                </button>
                            </div>
                        ): (
                            <div>
                                <form className='login-form' onSubmit={handleLoginSubmit}>
                                    <img className="logo1" src={require('./magi-logo-w.png')}/>
                                    <input type="text" placeholder="  用户名/手机号" onChange={(e) => setUsername(e.target.value)}/>
                                    <input type="password" placeholder="  密码" onChange={(e)=> setPassword(e.target.value)}/>
                                    <button className="login-btn" type="submit">登录</button>
                                </form>
                                <button className="close-btn" onClick={handleClose}>
                                    关闭
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            )

            }
        </div>
    );
};

function App() {
    const [isMagicCircleVisible, setIsMagicCircleVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setIsMagicCircleVisible(true);
            } else {
                setIsMagicCircleVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className="App">
            <img alt="Logo" className="logo" src={require('./magi-logo-w.png')}/>
            <div className="menu-container">
                <div className="menu">
                    <button className="menu-btn">图书分类</button>
                    <div className="dropdown-content">
                        <a href="#">政治军事</a>
                        <a href="#">人生哲学</a>
                        <a href="#">前沿科技</a>
                    </div>
                </div>
                <div className="menu">
                    <button className="menu-btn">我的书架</button>
                    <div className="dropdown-content">
                        <a href="#">选项1</a>
                        <a href="#">选项2</a>
                        <a href="#">选项3</a>
                    </div>
                </div>
                <div className="menu">
                    <button className="menu-btn">订阅我们</button>
                    <div className="dropdown-content">
                        <a href="#">选项1</a>
                        <a href="#">选项2</a>
                        <a href="#">选项3</a>
                    </div>
                </div>
                <div className="menu">
                    <button className="menu-btn">个人展厅</button>
                    <div className="dropdown-content">
                        <a href="#">选项1</a>
                        <a href="#">选项2</a>
                        <a href="#">选项3</a>
                    </div>
                </div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="输入书籍/知识/类目"/>
                <button>搜索</button>
            </div>
            <h1>Welcome to MagiQuestopia!</h1>
            <p>「 书鬼乌托邦，构建你的个人魔法图书馆 」</p>
            <p1>▽</p1>
            <div className={`magic-circle ${isMagicCircleVisible && 'show'}`}></div>
            <Login/>
            <div className="tabs">
                <div className="tab">
                    <div className="tab-content">
                        <h2>查看分支</h2>
                        <ul className="glass-effect">
                            <li>操作1</li>
                            <li>操作2</li>
                            <li>操作3</li>
                        </ul>
                    </div>
                </div>
                <div className="tab">
                    <div className="tab-content">
                        <h2>添加天赋</h2>
                        <ul className="glass-effect">
                            <li>操作1</li>
                            <li>操作2</li>
                            <li>操作3</li>
                        </ul>
                    </div>
                </div>
                <div className="tab">
                    <div className="tab-content">
                        <h2>评估天赋树</h2>
                        <ul className="glass-effect">
                            <li>操作1</li>
                            <li>操作2</li>
                            <li>操作3</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
)
    ;

}

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
