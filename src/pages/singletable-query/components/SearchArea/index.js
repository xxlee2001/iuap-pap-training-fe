import React, {Component} from 'react'
import {actions} from "mirrorx";
import {Col, Row, FormControl, Label} from "tinper-bee";
import Form from 'bee-form';
import Select from 'bee-select';
import DatePicker from "bee-datepicker";
import InputNumber from 'bee-input-number';
import {RefIuapDept} from 'components/RefViews';
import SearchPanel from 'components/SearchPanel';
import SelectMonth from 'components/SelectMonth';

import { FormattedMessage} from 'react-intl';
import {deepClone, mergeListObj, delListObj} from "utils";
import zhCN from "rc-calendar/lib/locale/zh_CN";

import 'bee-datepicker/build/DatePicker.css';
// import 'ref-tree/dist/index.css';
import './index.less'

const {FormItem} = Form;
const {Option} = Select;
const format = "YYYY";
const {YearPicker} = DatePicker;


class SearchAreaForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error, values) => {
        // 年份特殊处理
        if (values.year) {
            values.year = values.year.format('YYYY');
        }
        // 参照特殊处理
        const {dept} = values;
        if (dept) {
            const {refpk} = JSON.parse(dept);
            values.dept = refpk;
        }

        let queryParam = deepClone(this.props.queryParam);
        let {pageParams} = queryParam;
        pageParams.pageIndex = 0;

        const arrayNew = this.getSearchPanel(values); //对搜索条件拼接
        // queryParam.whereParams = mergeListObj(whereParams, arrayNew, "key"); //合并对象

        queryParam.whereParams=arrayNew;

        actions.query.updateState({cacheFilter: arrayNew});  //缓存查询条件
        actions.query.loadList(queryParam);
        this.props.clearRowFilter()

    }


    /**
     * 重置 如果无法清空，请手动清空
     */
    reset = () => {
        this.props.form.validateFields((err, values) => {
            let queryParam = deepClone(this.props.queryParam);
            let {whereParams} = queryParam;

            const arrayNew = [];
            for (const field in values) {
                arrayNew.push({key: field});
            }
            queryParam.whereParams = delListObj(whereParams, arrayNew, "key"); //合并对象
            actions.query.updateState({queryParam});  //清空查询条件
        });
    }


    /**
     *
     * @param values search 表单值
     * @returns {Array}
     */

    getSearchPanel = (values) => {
        const list = [];
        for (let key in values) {

            if (values[key] || ((typeof values[key]) === "number")) {
                let condition = "LIKE";
                // 这里通过根据项目自己优化
                const equalArray = ["code", "month"]; // 当前字段查询条件为等于
                const greaterThanArray = ["serviceYearsCompany"]; //  当前字段查询条件为大于等于
                if (equalArray.includes(key)) { // 查询条件为 等于
                    condition = "EQ";
                }
                if (greaterThanArray.includes(key)) { // 查询条件为 大于等于
                    condition = "GTEQ";
                }
                list.push({key, value: values[key], condition}); //前后端约定
            }
        }
        return list;

    }


    render() {
        const _this = this;
        const {form,onCallback, intl} = _this.props;
        const {getFieldProps} = form;
        return (
            <SearchPanel
                intl = {intl}
                form={form}
                reset={this.reset}
                onCallback={onCallback}
                search={this.search}>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.table.query.0002" defaultMessage="员工编号"/>}</Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.search.prompt.0001", defaultMessage:'精确查询'})} {...getFieldProps('code', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.table.query.0003" defaultMessage="员工姓名"/>}</Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.search.prompt.0002", defaultMessage:'模糊查询'})} {...getFieldProps('name', {initialValue: ''})}/>
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.table.query.0005" defaultMessage="部门"/>}</Label>
                            <RefIuapDept {...getFieldProps('dept', {initialValue: ''})} className='ref-walsin-modal'/>
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>{<FormattedMessage id="js.table.query.0008" defaultMessage="司龄"/>}≥</Label>
                            <InputNumber min={0} iconStyle="one"
                                         {...getFieldProps('serviceYearsCompany', {
                                             initialValue: "",
                                         })}
                            />
                        </FormItem>
                    </Col>


                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>{<FormattedMessage id="js.table.query.0009" defaultMessage="年份"/>}</Label>
                            <YearPicker
                                {...getFieldProps('year', {initialValue: ''})}
                                format={format}
                                locale={zhCN}
                                placeholder={this.props.intl.formatMessage({id:"js.search.sel1.0001", defaultMessage:'选择年'})}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.table.query.0010" defaultMessage="月份"/>}</Label>
                            <SelectMonth {...getFieldProps('month', {initialValue: ''})} />
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>{<FormattedMessage id="js.table.query.0014" defaultMessage="是否超标"/>}</Label>
                            <Select {...getFieldProps('exdeeds', {initialValue: ''})}>
                                <Option value="">{<FormattedMessage id="js.search.sel.0001" defaultMessage="请选择"/>}</Option>
                                <Option value="0">{<FormattedMessage id="js.search.sel.0002" defaultMessage="未超标"/>}</Option>
                                <Option value="1">{<FormattedMessage id="js.search.sel.0003" defaultMessage="超标"/>}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(SearchAreaForm)
