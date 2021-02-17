import React from 'react';
import {Link} from 'react-router';
import FormContainer from './FormContainer.js';
import './main.scss';

class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <main className="main-container">
                <div className="row no-gutters min-h-fullscreen bg-white">
                    <div className="col-md-6 col-lg-7 col-xl-8 d-none d-md-block bg-img"
                         style={{backgroundImage: 'url(assets/img/gas-south-logo.png)',backgroundSize: '45%',
                             backgroundPositionY: 'center'}}>

                        <div className="row h-100 pl-50">

                        </div>
                    </div>

                    <div className="col-md-6 col-lg-5 col-xl-4 align-top" style={{position: "relative"}}>
                        <div className="login">
                            <h2 style={{fontWeight: 'bold'}}>Đăng Nhập</h2>
                            <p>
                                <small>Đăng nhập vào hệ thống bằng tài khoản của bạn.</small>
                            </p>

                            <FormContainer />

                            <div className="divider"></div>


                            {/*<p className="text-center text-muted fs-13 mt-20">Bạn chưa có tài khoản? <Link to='/register'><a
        className="text-primary fw-500" >Đăng kí ngay</a></Link></p>*/}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Main;
