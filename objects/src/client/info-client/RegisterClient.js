import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../common/Nav';
import Validator from '../others/Validator';
import Footer from '../common/Footer';

const RegisterClient = ({ socket }) => {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState([])
    const [userID, setUserID] = useState('')
    const [usernameRegister, setUsernameRegister] = useState('')
    const [passwordRegister, setPasswordRegister] = useState('')
    const [fullNameRegister, setFullNameRegister] = useState('')
    const [emailRegister, setEmailRegister] = useState('')
    const [phoneRegister, setPhoneRegister] = useState('')
    const [addressRegister, setAddressRegister] = useState('')
    const [statusLogin, setStatusLogin] = useState('')

    useEffect(() => {
        const fetchProducts = () => {
            fetch("http://localhost:4000/api").then(res => res.json()).then(data => {
                setUsers(data.users)
            })
        }
        fetchProducts()
    }, [])

    const navigate = useNavigate();

    const Validator = (options) => {
        var seletorRules = {};
        const validate = (inputElement, rule) => {
            var errorElement = inputElement.parentElement.querySelector(options.error);
            var errorMessage;
            var rules = seletorRules[rule.selector];
            for (var i = 0; i < rules.length; i++) {
                errorMessage = rules[i](inputElement.value);
                if (errorMessage)
                    break;
            }

            if (errorMessage) {
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid')
            }
            else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid')
            }
        }

        var formElement = document.querySelector(options.form);
        if (formElement) {
            formElement.onsubmit = (e) => {
                e.preventDefault();
                options.rules.forEach(rule => {
                    var inputElement = document.querySelector(rule.selector)
                    validate(inputElement, rule)
                })
            }

            options.rules.forEach(rule => {
                var inputElement = document.querySelector(rule.selector)

                if (Array.isArray(seletorRules[rule.selector])) {
                    seletorRules[rule.selector].push(rule.test)
                }
                else {
                    seletorRules[rule.selector] = [rule.test];
                }

                if (inputElement) {
                    inputElement.onblur = () => {
                        validate(inputElement, rule)
                    }

                    inputElement.oninput = () => {
                        var errorElement = inputElement.parentElement.querySelector(options.error);
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid')
                    }

                }
            })
        }
    }
    Validator.isRequired = (selector) => {
        return {
            selector: selector,
            test: (value) => {
                return value.trim() ? undefined : 'Vui lòng nhập trường này'
            }
        }
    }
    Validator.isEmail = (selector) => {
        return {
            selector: selector,
            test: (value) => {
                var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(value) ? undefined : `Vui lòng nhập đúng địa chỉ email`
            }
        }
    }
    Validator.isMinLength = (selector, min) => {
        return {
            selector: selector,
            test: (value) => {
                return (value.trim().length >= min) ? undefined : `Vui lòng tối thiểu ${min} ký tự trở lên`
            }
        }
    }
    Validator.isMaxLength = (selector, max) => {
        return {
            selector: selector,
            test: (value) => {
                return (value.trim().length <= max) ? undefined : `Vui lòng nhập tối đa ${max} ký tự`
            }
        }
    }
    Validator.isConfirmed = (selector, getConfirmValue) => {
        return {
            selector: selector,
            test: (value) => {
                return value.trim() == getConfirmValue() ? undefined : `Mật khẩu không đồng nhất`
            }
        }
    }

    window.onload = () => {
        Validator({
            form: '#form-1',
            error: '.form-message',
            rules: [
                Validator.isRequired('#username'),
                Validator.isMinLength('#username', 5),

                Validator.isRequired('#password'),
                Validator.isMinLength('#password', 6),

                Validator.isRequired('#password_confirmation'),
                Validator.isConfirmed('#password_confirmation', () => {
                    return document.getElementById('password').value;
                }),

                Validator.isRequired('#fullname'),
                Validator.isMinLength('#fullname', 5),

                Validator.isRequired('#email'),
                Validator.isEmail('#email'),

                Validator.isRequired('#phone'),
                Validator.isMinLength('#phone', 10),
                Validator.isMaxLength('#phone', 10),

                Validator.isRequired('#address'),
                Validator.isMinLength('#address', 5),
            ]
        });
    }

    useEffect(() => {

        // Khởi tạo thông tin cho người dùng đăng ký mới
        users.map((user, index) => {
            if (index = users.length) {
                setUserID(`G00${index + 1}`);
                setStatusLogin("Chưa đăng nhập");
            }
            index = index + 1;
        })
    })

    const handleSubmit = (e) => {
        if (window.confirm('Bạn chắc chắn những thông tin bạn nhập vào là chính xác!') == true) {
            socket.emit("registerClient", {
                userID,
                username: usernameRegister,
                password: passwordRegister,
                email: emailRegister,
                phone: phoneRegister,
                address: addressRegister,
                statusLogin
            });
            window.alert('Đăng ký thành công! Đang quay trở lại trang đăng nhập')
            navigate('/login');
        }
    }
    return (
        <div>
            <Nav socket={socket} />
            <div className='container'>
                <div className="grid wide">
                    <div className="login-client__box">
                        <div className="login-client__col-2">
                            <div className="login-client__container">
                                <form action="" method="POST" className="form" id="form-1" onSubmit={handleSubmit}>
                                    <label className="login-client__label-login">ĐĂNG KÝ TÀI KHOẢN MỚI</label>

                                    <div className="spacer"></div>

                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="VD: customer01 ..."
                                            onChange={(e) => setUsernameRegister(e.target.value)}
                                            value={usernameRegister}
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <div className="form-group form-group-2-col" style={{ paddingRight: "4px" }}>
                                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            onChange={(e) => setPasswordRegister(e.target.value)}
                                            value={passwordRegister}
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <div className="form-group form-group-2-col" style={{ paddingLeft: "4px" }}>
                                        <label htmlFor="password_confirmation" className="form-label">Nhập lại mật khẩu</label>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            placeholder="Nhập lại mật khẩu"
                                            type="password"
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="fullname" className="form-label">Họ tên đầy đủ</label>
                                        <input
                                            id="fullname"
                                            name="fullname"
                                            type="text"
                                            placeholder="VD: Lê Ninh ..."
                                            onChange={(e) => setFullNameRegister(e.target.value)}
                                            value={fullNameRegister}
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <div className="form-group form-group-2-col" style={{ paddingRight: "4px" }}>
                                        <label htmlFor="email" className="form-label">Địa chỉ email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            placeholder="VD: email@domain.com"
                                            onChange={(e) => setEmailRegister(e.target.value)}
                                            value={emailRegister}
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <div className="form-group form-group-2-col" style={{ paddingLeft: "4px" }}>
                                        <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="number"
                                            maxLength="10"
                                            placeholder="VD: 0983281932 ..."
                                            onChange={(e) => setPhoneRegister(e.target.value)}
                                            value={phoneRegister}
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address" className="form-label">Địa chỉ liên hệ</label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            placeholder="VD: Hàm Nghi, TPHCM"
                                            onChange={(e) => setAddressRegister(e.target.value)}
                                            value={addressRegister}
                                            className="form-control">
                                        </input>
                                        <span className="form-message"></span>
                                    </div>

                                    <button className="login-client__btn">ĐĂNG KÝ NGAY</button>
                                </form>
                                <div className="login-client__direct">
                                    <div>
                                        <label className="login-client__question">Bạn đã là thành viên của ShopTech?</label>
                                        <a
                                            className="login-client__register"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/login');
                                            }}>
                                            Quay lại trang đăng nhập</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="login-client__col-1">
                            <div className="login-client__panel">
                                <div className="login-client__panel-img"></div>
                                <label className="login-client__panel-title">Trở thành thành viên</label>
                                <p className="login-client__panel-desb">Tận hưởng trải nghiệm và ưu đãi tuyệt vời khi trở thành thành viên của gia đình ShopTECH!!!</p>
                            </div>
                            <div className="login-client__panel-controll">
                                <button className="login-client__panel-btn"></button>
                                <button className="login-client__panel-btn"></button>
                                <button className="login-client__panel-btn"></button>
                                <button className="login-client__panel-btn"></button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <Footer />
            <p className='app-copyright'>©️ Bản quyền thuộc nhóm 7 -  Chuyên đề thực tế 2 - CN20A - năm 2023 <br />
                Địa chỉ: 70 Tô Ký, phường Tân Chánh Hiệp. Quận 12, Thành phố Hồ Chí Minh.</p>


        </div>
    );

};

export default RegisterClient;