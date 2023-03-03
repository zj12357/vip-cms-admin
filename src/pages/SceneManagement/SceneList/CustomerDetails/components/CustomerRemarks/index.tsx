import React, { FC, useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    Popover,
    Typography,
    Tag,
    Input,
    Radio,
    message,
} from 'antd';
import type { InputRef } from 'antd';
import { useHttp } from '@/hooks';
import moment from 'moment';
import { remarkList, remarkCreate } from '@/api/scene';
import { RemarkListParams, RemarkCreateParams } from '@/types/api/scene';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import RecordListData from '@/pages/AdmissionManagement/components/RecordListTable';
import '../../index.scoped.scss';
const { TextArea } = Input;
type CustomerRemarksProps = {
    round: string;
};
interface Data {
    content: string;
    created_by: string;
    created_at: number;
}

const CustomerRemarks: FC<CustomerRemarksProps> = (props) => {
    const { round } = props;
    const [content, setContent] = useState('');
    const [data, setData] = useState<Data[]>([]);
    const { fetchData: fetchRemarkList } = useHttp<RemarkListParams, any>(
        remarkList,
    );
    const { fetchData: fetchRemarkCreate } = useHttp<RemarkCreateParams, any>(
        remarkCreate,
    );
    useEffect(() => {
        getRemarkList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getRemarkList = async () => {
        const res = await fetchRemarkList({ round });
        if (res.code === 10000) {
            setData(res.data);
        }
    };
    // 新增备注
    const addRemark = async () => {
        if (!content.trim()) {
            message.error('备注不能为空');
            return;
        }
        const res = await fetchRemarkCreate({
            round,
            content,
        });
        if (res.code === 10000) {
            getRemarkList();
            setContent('');
            message.success(res.msg);
        }
    };
    return (
        <div className="s-remark">
            <div className="s-remark-title">客户备注</div>
            <div className="s-remark-content">
                {data &&
                    data.map((item, index) => {
                        return (
                            <div key={index} className="s-remark-item">
                                <p className="s-remark-date">
                                    {moment(item.created_at * 1000).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </p>
                                <div className="s-remark-detail">
                                    <span>{item.created_by}：</span>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <TextArea
                rows={4}
                showCount
                maxLength={100}
                placeholder="请输入几个字"
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                }}
            />
            <div className="s-remark-add">
                <Button type="primary" onClick={addRemark}>
                    增加备注
                </Button>
            </div>
        </div>
    );
};

export default CustomerRemarks;
