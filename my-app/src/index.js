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
    return(
        <div className="login-container">
            <button className="login-btn" onClick={handleClick}>
                登录
            </button>
            {isOpen && (
                <div className="login-modal">
                    <div className="login-modal-content">
                        <h2>登录</h2>
                        <form>
                            <input type="text" placeholder="用户名" />
                            <input type="password" placeholder="密码"/>
                            <button type="submit">登录</button>
                        </form>
                        <button className="close-btn" onClick={handleClose}>
                            关闭
                        </button>
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
            if (window.scrollY > 100) {
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
            <h1>Welcome to MagiQuestopia!</h1>
            <p>「 书鬼乌托邦，构建你的个人魔法图书馆 」</p>
            <p1>▽</p1>
            <div className={`magic-circle ${isMagicCircleVisible && 'show'}`}></div>
            <Login/>
        </div>
    );

}

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
