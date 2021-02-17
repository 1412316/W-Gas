// Xuất Vỏ Bình - Bước 2
import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import getAllPartnerAPI from "getPartnerAPI";
import getDestinationUserAPI from "getDestinationUserAPI";

import { NAMEDRIVE } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getUserCookies from './../../../helpers/getUserCookies';
import { Select } from "antd";
const Option = Select.Option;

class ExportDriverTypeCylinderPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: [],
            AgencyResults: [],
            GeneralResults: [],
            typeUser: [],
            ListUserSubmit: [],
            ListUserSubmitID: "",
            nameDriver: "",
            idDriver: "",
            listDriver: []
        };
    }

    async addHistory(driver, license_plate, typeExportCylinder, number_array, toArray, cylindersWithoutSerial, cylinders, idDriver, sign) {
        // Call api
        console.log(this.state.ListUserSubmitID);
        this.setState({isLoading: true});
        const user = await createHistoryAPI(
            driver, 
            license_plate, 
            cylinders, 
            Constants.EXPORT_TYPE, 
            this.state.ListUserSubmitID, 
            '', 
            cylindersWithoutSerial, 
            '', 
            toArray, 
            number_array, 
            '', 
            '', 
            '', 
            this.props.typeExportCylinder,
            '',
            idDriver, 
            sign
        );
        this.setState({isLoading: false});
        //console.log('register',user);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) {
                showToast('Xuất hàng thành công!', 3000);
                this.props.handleChangeTypeExportCylinderEmpty()
                const modal = $("#export-driver-type-cylinder");
                modal.modal('hide');
                //this.props.refresh();
                return true;
            } else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình tạo bình ");
            return false;
        }
        this.setState({ListUserSubmit: []});
    }

    handleChangeGeneral = (langValue) => {
        this.setState({
            ListUserSubmit: langValue, 
            ListUserSubmitID: langValue.id
        });
    }

    handleChangeDriver = (value) => {
        this.setState({
          idDriver: value,
        });
    };

    async componentDidMount() {
        let user_cookie = await getUserCookies();
        let token = "Bearer " + user_cookie.token;
        let params = {
          "id": user_cookie.user.id
        }
        await callApi("POST", NAMEDRIVE, params, token).then(res => {
          if (res.data.data <= 0) {
            this.setState({
              listDriver: [{
                name: "Bạn chưa có tài xế",
                id: 'null'
              }]
            })
          }
          else {
            //console.log(user_cookie.user.id+""+res.data.data);
            this.setState({
              listDriver: res.data.data
            }, () => console.log(this.state.listDriver))
          }
        })
    }

    async submit(event) {

        event.preventDefault();
        let { listDriver } = this.state;
        let index = listDriver.findIndex(l => l.id === this.state.idDriver);
        let nameDriver = listDriver[index].name;
        var cylinders = [];
        for (let i = 0; i < this.props.product_parse.length; i++) {
            cylinders.push(this.props.product_parse[i].id);
        }
        let data = this.form.getValues();
        data.idDriver = listDriver[index].id;
        let sign = "Web signature";
        console.log(data);
        let toArray = [];
        let numberArray = [];
        let listUserSubmit = this.state.ListUserSubmit;
        if (listUserSubmit.length === 0) {
            showToast("Hãy chọn nơi cần xuất bình");
            return;
        } 
        else {
            for (let i = 0; i < listUserSubmit.length; i++) {
                toArray.push(listUserSubmit[i].value);
                numberArray.push(data['numberGeneral' + i]);
            }

        }
        await this.addHistory(
            nameDriver,
            data.license_plate, 
            "", 
            numberArray, 
            toArray, 
            data.number_cylinder, 
            cylinders,
            data.idDriver, 
            sign
        );

        return;
    }

    render() {
        // console.log("data expot 1:",this.props.allChildOf);
        // console.log("data expot 2:",this.props.listUserFixer);
        const nameExport = this.props.typeExportCylinder === Constants.RENT ? "Đối tác cho thuê" : this.props.typeExportCylinder === Constants.BUY ? "Đối tác bán đứt/ Công ty - Chi nhánh trực thuộc" : this.props.typeExportCylinder === Constants.RETURN_CYLINDER ? "Xuất trả" : "Sửa chữa";
        return (
            <div className="modal fade" id="export-driver-type-cylinder" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xuất Vỏ Bình - Bước 2 - Thông Tin Tài Xế</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                    onClick={() => this.setState({ListUserSubmit: []})}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form ref={c => {
                                this.form = c
                            }} className="card" onSubmit={(event) => this.submit(event, this.props.typeExportCylinder)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tên tài xế</label>
                                                <Select
                                                    showSearch
                                                    style={{ width: "100%" }}
                                                    placeholder="Chọn tài xế..."
                                                    optionFilterProp="children"
                                                    onChange={this.handleChangeDriver}
                                                    filterOption={(input, option) =>
                                                        option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    >
                                                    {this.state.listDriver.map((l, index) => {
                                                        return <Option key={index} value={l.id}>{l.name}</Option>
                                                    })}
                                                </Select>
                                            </div>


                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Biển số xe </label>
                                                <Input className="form-control" type="text" name="license_plate"
                                                       id="license_plate" validations={[required]}/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{nameExport}</label>
                                                <SelectMulti.Creatable
                                                    multi={true}
                                                    options={this.props.typeExportCylinder !== Constants.TO_FIX ? this.props.listUsersPartner : this.props.allChildOf}
                                                    onChange={this.handleChangeGeneral.bind(this)}
                                                    placeholder="Chọn..."
                                                    value={this.state.ListUserSubmit}
                                                />
                                            </div>
                                        </div>
                                        {this.props.typeExportCylinder !== Constants.TO_FIX ? null :
                                            (
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Số lượng bình không mã</label>
                                                        <Input className="form-control" type="number"
                                                               name="number_cylinder"
                                                               id="number_cylinder"
                                                            //validations={[required]}
                                                        />
                                                    </div>
                                                </div>
                                            )}


                                        <div className="col-md-6">
                                            <table
                                                className="table table-striped table-bordered seednet-table-keep-column-width"
                                                cellSpacing="0">
                                                <tbody className="display-block display-tbody">
                                                {this.state.ListUserSubmit.map((store, index) => {

                                                    return (<tr key={index}>
                                                        <td scope="row" className="text-center">{store.name}</td>
                                                        <td scope="row" className="text-center"><Input
                                                            name={"numberGeneral" + index} placeholder={"Nhập số lượng"}
                                                            validations={[required]} className="form-control"
                                                            type="number"/></td>
                                                    </tr>)


                                                })}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" type="submit">Lưu</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                            onClick={() => this.setState({ListUserSubmit: []})}
                                            style={{marginLeft: "10px"}}>Đóng
                                    </button>
                                </footer>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ExportDriverTypeCylinderPopup;
