import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts/font.css'

const Login = () => {
    const [isOpen, setIsOpen] = useState(false)

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


    return(
        <div className="login-container">
            <button className="login-btn" onClick={handleClick}>
                登录 / 注册
            </button>
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
                        </div>
                        {activeTab === 1 ? (
                            <div>
                                <h2>注册</h2>
                                <form>
                                    <input type="text" placeholder="输入注册账号名"/>
                                    <input type="password" placeholder="输入注册密码"/>
                                    <button type="submit">注册</button>
                                </form>
                                <button className="close-btn" onClick={handleClose}>
                                    关闭
                                </button>
                            </div>
                        ): (
                            <div>
                                <h2>登录</h2>
                                <form>
                                    <input type="text" placeholder="用户名/手机号"/>
                                    <input type="password" placeholder="密码"/>
                                    <button type="submit">登录</button>
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
